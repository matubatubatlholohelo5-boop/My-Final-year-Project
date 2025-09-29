# routers/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

# Import your utility functions with an absolute import
from app.auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import get_db
from app.models import User # Assuming User model has a 'role' field
from app.schemas import Token, UserCreate # Assuming Token schema needs an update

router = APIRouter()
# routers/auth_routes.py

# ... imports ...

@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user and returns an access token, explicitly using the role 
    provided in the request body.
    """
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    # === CRITICAL FIX HERE: Include the role from the incoming data ===
    # The role is now explicitly set by the input data (which defaults to 'client'
    # if not provided, thanks to schemas.py)
    new_user = User(
        username=user_data.username, 
        hashed_password=hashed_password,
        role=user_data.role # <--- NOW USES THE INPUT ROLE ('admin' or 'client')
    )
    # =================================================================
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username, "role": new_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}

# ... rest of the file (login_for_access_token) ...


@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Handles user login and returns an access token, including the user's role.
    """
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        # This is where the 401 response comes from if credentials are bad
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # >>> CHANGE 3: Include the 'role' in the JWT payload
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, # <--- INCLUDE ROLE HERE
        expires_delta=access_token_expires
    )
    
    # >>> CHANGE 4: Return the 'role' to the frontend
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}
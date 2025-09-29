# app/main.py

from typing import List, Optional
from fastapi import Depends, HTTPException, status, Response, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import asc, desc
from datetime import date
from . import models, schemas, auth, crud
from .database import engine, get_db
from routers import auth_routes as auth_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    models.Base.metadata.create_all(bind=engine)

# Include the authentication router. The endpoints are now at /auth/login and /auth/register
app.include_router(auth_router.router, prefix="/auth", tags=["auth"])

# Driver Endpoints
@app.post("/drivers/", response_model=schemas.Driver, status_code=status.HTTP_201_CREATED)
def create_driver(
    driver: schemas.DriverCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    try:
        existing_driver = db.query(models.Driver).filter(models.Driver.license_number == driver.license_number).first()
        if existing_driver:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A driver with this license number already exists."
            )

        db_driver = models.Driver(**driver.dict())
        db.add(db_driver)
        db.commit()
        db.refresh(db_driver)
        return db_driver
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A driver with this license number already exists."
        )

@app.get("/drivers/", response_model=List[schemas.Driver])
def get_drivers(
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = 'name',
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    query = db.query(models.Driver)
    if search:
        query = query.filter(
            models.Driver.name.ilike(f"%{search}%") | 
            models.Driver.license_number.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(models.Driver.status == status)
    if sort_by:
        sort_column = getattr(models.Driver, sort_by, None)
        if sort_column:
            query = query.order_by(sort_column)

    drivers = query.all()
    return drivers

@app.get("/drivers/{driver_id}", response_model=schemas.Driver)
def get_driver_by_id(
    driver_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    driver = db.query(models.Driver).options(joinedload(models.Driver.performances)).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@app.put("/drivers/{driver_id}", response_model=schemas.Driver)
def update_driver(
    driver_id: int, 
    driver_update: schemas.DriverUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    db_driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not db_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    if driver_update.license_number:
        existing_driver_with_license = db.query(models.Driver).filter(
            models.Driver.license_number == driver_update.license_number,
            models.Driver.id != driver_id
        ).first()
        if existing_driver_with_license:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This license number is already assigned to another driver."
            )
    for field, value in driver_update.dict(exclude_unset=True).items():
        setattr(db_driver, field, value)
    db.commit()
    db.refresh(db_driver)
    return db_driver

@app.delete("/drivers/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_driver(
    driver_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    db_driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    db.query(models.DriverPerformance).filter(models.DriverPerformance.driver_id == driver_id).delete()
    db.delete(db_driver)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.post("/drivers/{driver_id}/history/", response_model=schemas.DriverPerformance, status_code=status.HTTP_201_CREATED)
def add_driver_performance(
    driver_id: int,
    perf: schemas.DriverPerformanceCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    db_perf = crud.add_performance_record(db, perf=perf, driver_id=driver_id)
    return db_perf

@app.get("/drivers/{driver_id}/history/", response_model=List[schemas.DriverPerformance])
def get_driver_history(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver.performances

@app.put("/performances/{performance_id}", response_model=schemas.DriverPerformance)
def update_performance_record(
    performance_id: int,
    performance: schemas.DriverPerformanceCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    db_performance = crud.get_performance_record(db, performance_id=performance_id)
    if not db_performance:
        raise HTTPException(status_code=404, detail="Performance record not found")
    return crud.update_performance_record(db, performance_id=performance_id, performance=performance)

@app.delete("/performances/{performance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_performance_record(
    performance_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user_from_token)
):
    db_performance = crud.get_performance_record(db, performance_id=performance_id)
    if not db_performance:
        raise HTTPException(status_code=404, detail="Performance record not found")
    crud.delete_performance_record(db, performance_id=performance_id)
    return {"ok": True}
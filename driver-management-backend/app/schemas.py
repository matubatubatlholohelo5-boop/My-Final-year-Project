# app/schemas.py

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field

# --- User and Auth Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str
    # Required for RBAC
    role: str 

class TokenData(BaseModel):
    username: Optional[str] = None
    # Required for RBAC
    role: Optional[str] = None 

class User(BaseModel):
    username: str
    role: str 
    is_active: Optional[bool] = True

    class Config:
        # Pydantic V2: Use from_attributes instead of orm_mode
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = 'client' 


# --- Driver Schemas ---

class DriverPerformanceCreate(BaseModel):
    date: date
    rating: int
    notes: Optional[str] = None

class DriverPerformance(DriverPerformanceCreate):
    id: int
    driver_id: int
    class Config:
        from_attributes = True 

# --- Driver Base Schema (Restored necessary fields) ---
class DriverBase(BaseModel):
    name: str
    license_number: str
    # RESTORED: Fields necessary for your application's data structure
    phone_number: str                 
    car_model: str                    
    hire_date: date                   
    status: str = "Active"
    
    # Optional new field if added to the DB model
    email: Optional[str] = None       

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_number: Optional[str] = None
    phone_number: Optional[str] = None
    car_model: Optional[str] = None 
    status: Optional[str] = None
    email: Optional[str] = None

class Driver(DriverBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Include the list of performances, crucial for ClientDriversView
    performances: List[DriverPerformance] = []

    class Config:
        from_attributes = True
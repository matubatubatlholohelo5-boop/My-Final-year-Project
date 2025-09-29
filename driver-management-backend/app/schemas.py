# app/schemas.py

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field

# --- User and Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    is_active: Optional[bool] = True

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str

# --- Driver Schemas ---
class DriverPerformanceCreate(BaseModel):
    date: date
    rating: int
    notes: Optional[str] = None

class DriverPerformance(DriverPerformanceCreate):
    id: int
    driver_id: int
    class Config:
        orm_mode = True

class DriverBase(BaseModel):
    name: str
    license_number: str
    phone_number: str
    car_model: str 
    hire_date: date
    status: str = "Active"

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_number: Optional[str] = None
    phone_number: Optional[str] = None
    car_model: Optional[str] = None 
    status: Optional[str] = None

class Driver(DriverBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Include the list of performances
    performances: List[DriverPerformance] = []

    class Config:
        orm_mode = True
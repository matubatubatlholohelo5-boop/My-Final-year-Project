# app/schemas.py

from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import date

# --- User Schemas for Authentication ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Driver Performance Schemas (NEW) ---
class DriverPerformanceBase(BaseModel):
    # Change 'performance_date' to 'date' to match the frontend
    date: date
    rating: int
    notes: Optional[str] = None

class DriverPerformanceCreate(DriverPerformanceBase):
    pass

class DriverPerformance(DriverPerformanceBase):
    id: int
    driver_id: int
    class Config:
        from_attributes = True

# --- Driver Schemas ---
class DriverBase(BaseModel):
    name: str
    age: int
    status: str
    car_model: str
    license_number: Optional[str] = None
    
    @validator('age', pre=True)
    def age_to_int(cls, v):
        if isinstance(v, str):
            try:
                return int(v)
            except ValueError:
                raise ValueError('Age must be a valid integer')
        return v

class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    pass

# Update the Driver schema to include the performance history
class Driver(DriverBase):
    id: int
    performances: List[DriverPerformance] = []
    class Config:
        from_attributes = True
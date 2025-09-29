# app/models.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Existing User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    
    # === ADDED FOR ROLE-BASED ACCESS CONTROL (RBAC) ===
    # This field will store 'admin' or 'client'
    role = Column(String(50), default="client") 
    # ==================================================

#  Driver model
class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    
    
    license_number = Column(String(255), unique=True, index=True)
    phone_number = Column(String(50))
    car_model = Column(String(100)) 
    hire_date = Column(Date)
    
    status = Column(String(50), default="Active")

    # Timestamp columns for tracking creation and updates
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    
    performances = relationship("DriverPerformance", back_populates="driver")

    def __repr__(self):
        return f"<Driver(id={self.id}, name='{self.name}')>"

# DriverPerformance model
class DriverPerformance(Base):
    __tablename__ = "driver_performances"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    date = Column(Date)
    rating = Column(Integer)  
    notes = Column(String(255))

    
    driver = relationship("Driver", back_populates="performances")

    def __repr__(self):
        return f"<DriverPerformance(id={self.id}, driver_id={self.driver_id}, rating={self.rating})>"
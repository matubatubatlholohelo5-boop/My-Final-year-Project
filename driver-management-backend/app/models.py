# app/models.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

# Existing User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))

# Update the Driver model
class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    age = Column(Integer)
    status = Column(String(50))
    car_model = Column(String(255))
    license_number = Column(String, unique=True, index=True)

    # Add this line to create a relationship to the new DriverPerformance model
    performances = relationship("DriverPerformance", back_populates="driver")

# Add this new DriverPerformance model
class DriverPerformance(Base):
    __tablename__ = "driver_performances"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    date = Column(Date)
    rating = Column(Integer) # e.g., on a scale of 1 to 5
    notes = Column(String)

    # Add this line to create a relationship back to the Driver model
    driver = relationship("Driver", back_populates="performances")
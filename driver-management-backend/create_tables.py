import sys
import os

# Add the parent directory to the Python path to allow importing from the 'app' package
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import Base, engine
from app import models  # Import models to ensure the User class is registered with Base

print("Attempting to create database tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
except Exception as e:
    print(f"An error occurred: {e}")
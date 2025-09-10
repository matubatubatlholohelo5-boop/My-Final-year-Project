from app.database import Base, engine
from app.models import User

print("Attempting to create tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
except Exception as e:
    print(f"An error occurred: {e}")
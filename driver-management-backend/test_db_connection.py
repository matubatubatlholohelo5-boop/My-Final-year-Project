from app.database import engine
from sqlalchemy import text
from sqlalchemy.orm import Session

print("Testing database connection with a query...")
try:
    with Session(engine) as session:
        session.execute(text("SELECT 1"))
        print("Connection successful! You can now create tables.")
except Exception as e:
    print(f"Connection failed: {e}")
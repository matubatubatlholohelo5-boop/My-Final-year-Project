from sqlalchemy.orm import Session
from . import models, schemas

def get_drivers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Driver).offset(skip).limit(limit).all()

def get_driver(db: Session, driver_id: int):
    return db.query(models.Driver).filter(models.Driver.id == driver_id).first()

def create_driver(db: Session, driver: schemas.DriverCreate):
    db_driver = models.Driver(**driver.model_dump())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def delete_driver(db: Session, driver_id: int):
    db_driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if db_driver:
        db.delete(db_driver)
        db.commit()
        return True
    return False

def update_driver(db: Session, driver_id: int, driver: schemas.DriverUpdate):
    db_driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if db_driver:
        for key, value in driver.model_dump(exclude_unset=True).items():
            setattr(db_driver, key, value)
        db.commit()
        db.refresh(db_driver)
        return db_driver
    return None

# --- NEW Driver Performance CRUD functions ---

def add_performance_record(db: Session, perf: schemas.DriverPerformanceCreate, driver_id: int):
    db_performance = models.DriverPerformance(
        **perf.model_dump(),
        driver_id=driver_id
    )
    db.add(db_performance)
    db.commit()
    db.refresh(db_performance)
    return db_performance

def get_performance_record(db: Session, performance_id: int):
    return db.query(models.DriverPerformance).filter(models.DriverPerformance.id == performance_id).first()

def update_performance_record(db: Session, performance_id: int, performance: schemas.DriverPerformanceCreate):
    db_performance = get_performance_record(db, performance_id=performance_id)
    if db_performance:
        for key, value in performance.model_dump(exclude_unset=True).items():
            setattr(db_performance, key, value)
        db.commit()
        db.refresh(db_performance)
    return db_performance

def delete_performance_record(db: Session, performance_id: int):
    db_performance = get_performance_record(db, performance_id=performance_id)
    if db_performance:
        db.delete(db_performance)
        db.commit()
        return {"message": "Performance record deleted successfully"}
    return None
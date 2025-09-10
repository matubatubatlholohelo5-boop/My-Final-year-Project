#!/usr/bin/env python3
import subprocess
import sys
import os

def run_command(command, cwd=None):
    """Run a command and handle errors"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, capture_output=True, text=True)
        print(f"✓ {command}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"✗ {command}")
        print(f"Error: {e.stderr}")
        return None

def setup_project():
    """Setup the entire project"""
    project_root = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(project_root, "driver-management-backend")
    
    print("🚀 Setting up Driver Management App...")
    
    # Create virtual environment and install dependencies
    print("\n📦 Setting up virtual environment...")
    run_command("python3 -m venv venv", cwd=backend_dir)
    run_command("venv/bin/pip install -r requirements.txt", cwd=backend_dir)
    
    # Initialize database
    print("\n🗄️ Initializing database...")
    run_command("venv/bin/python init_database.py", cwd=backend_dir)
    
    # Create tables
    print("\n📋 Creating database tables...")
    run_command("venv/bin/python create_tables.py", cwd=backend_dir)
    
    # Test database connection
    print("\n🔍 Testing database connection...")
    run_command("venv/bin/python test_db_connection.py", cwd=backend_dir)
    
    # Install frontend dependencies
    print("\n📦 Installing frontend dependencies...")
    run_command("npm install", cwd=project_root)
    
    print("\n✅ Setup complete!")
    print("\nTo start the application:")
    print("1. Backend: cd driver-management-backend && venv/bin/python start_server.py")
    print("2. Frontend: npm run dev")

if __name__ == "__main__":
    setup_project()
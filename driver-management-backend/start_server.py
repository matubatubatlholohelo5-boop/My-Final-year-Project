import subprocess
import sys
import os

def run_server():
    """Start the FastAPI server"""
    try:
        # Change to the backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Run the server
        # Use virtual environment if it exists
        python_cmd = "venv/bin/python" if os.path.exists("venv/bin/python") else "python3"
        subprocess.run([
            python_cmd, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "127.0.0.1", 
            "--port", "8001", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\nServer stopped")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    run_server()
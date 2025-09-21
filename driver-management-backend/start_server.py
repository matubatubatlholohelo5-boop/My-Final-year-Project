import subprocess
import sys
import os
import platform

def run_server():
    """Start the FastAPI server"""
    try:
        # Change to the backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))

        # Determine platform-specific path to virtual environment python
        if platform.system() == "Windows":
            python_cmd = "venv\\Scripts\\python.exe"
        else:
            python_cmd = "venv/bin/python"

        if not os.path.exists(python_cmd):
            raise FileNotFoundError(f"Could not find Python at {python_cmd}")

        # Run the server
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

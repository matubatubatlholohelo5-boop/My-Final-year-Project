# Driver Management App Setup Guide

## Prerequisites

1. **XAMPP** - Make sure XAMPP is installed and MySQL is running
2. **Python 3.8+** - For the backend
3. **Node.js 16+** - For the frontend

## Quick Setup

1. **Start XAMPP MySQL**:
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Run the setup script**:
   ```bash
   python setup.py
   ```

## Manual Setup (Alternative)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd driver-management-backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize database:
   ```bash
   python init_database.py
   ```

4. Create tables:
   ```bash
   python create_tables.py
   ```

5. Test database connection:
   ```bash
   python test_db_connection.py
   ```

6. Start the backend server:
   ```bash
   python start_server.py
   ```
   Or manually:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8001
- **API Documentation**: http://127.0.0.1:8001/docs

## Database Configuration

The application connects to MySQL using these default settings:
- Host: localhost
- Port: 3306
- Database: driver_db
- Username: root
- Password: (empty - XAMPP default)

To modify these settings, edit the `.env` file in the backend directory.

## Troubleshooting

1. **MySQL Connection Issues**:
   - Ensure XAMPP MySQL is running
   - Check if port 3306 is available
   - Verify database credentials in `.env` file

2. **CORS Issues**:
   - Backend is configured to allow requests from localhost:5173
   - If using different ports, update CORS settings in `app/main.py`

3. **Port Conflicts**:
   - Backend runs on port 8001
   - Frontend runs on port 5173
   - Change ports if needed in respective configuration files
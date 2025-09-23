# Driver Management App

A full-stack web application for tracking driver performance and history, built with React + TypeScript frontend and FastAPI + MySQL backend.

## Features

- User registration and authentication
- Driver performance tracking
- MySQL database integration
- Modern React frontend with TypeScript
- FastAPI backend with SQLAlchemy ORM
- Responsive design with Tailwind CSS

## Quick Start

1. **Prerequisites**:
   - XAMPP (for MySQL)
   - Python 3.8+
   - Node.js 16+

2. **Setup**:
   ```bash
   # Start XAMPP MySQL service first
   python setup.py
   ```

3. **Run the application**:
   ```bash
   # Terminal 1 - Backend
   cd driver-management-backend
   python start_server.py
   #USE THIS FOR BACK-END
   uvicorn app.main:app --reload --port 8000
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Access**:
   - Frontend: http://localhost:5173
   - Backend API: http://127.0.0.1:8001
   - API Docs: http://127.0.0.1:8001/docs

## Validation

Run the validation script to test your setup:
```bash
python validate_setup.py
```

For detailed setup instructions, see [SETUP.md](SETUP.md).

## Tech Stack

**Frontend**:
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios

**Backend**:
- FastAPI
- SQLAlchemy ORM
- MySQL (via XAMPP)
- Pydantic
- Passlib (password hashing)

## Project Structure

```
driver-management-app/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   └── services/          # API services
├── driver-management-backend/  # FastAPI backend
│   └── app/               # Application code
├── setup.py               # Project setup script
├── validate_setup.py      # Setup validation
└── SETUP.md              # Detailed setup guide
```
#git add .
#git commit -m ""
#git push
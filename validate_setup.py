#!/usr/bin/env python3
import requests
import json
import time
import subprocess
import sys
import os

def check_mysql_connection():
    """Check if MySQL is accessible"""
    try:
        import mysql.connector
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='driver_db'
        )
        if connection.is_connected():
            print("✓ MySQL connection successful")
            connection.close()
            return True
    except Exception as e:
        print(f"✗ MySQL connection failed: {e}")
        return False

def check_backend_api():
    """Check if backend API is running"""
    try:
        response = requests.get("http://127.0.0.1:8001/", timeout=5)
        if response.status_code == 200:
            print("✓ Backend API is running")
            return True
    except Exception as e:
        print(f"✗ Backend API check failed: {e}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    try:
        test_user = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = requests.post("http://127.0.0.1:8001/register/", 
                               json=test_user, timeout=5)
        if response.status_code in [200, 400]:  # 400 if user already exists
            print("✓ User registration endpoint working")
            return True
    except Exception as e:
        print(f"✗ User registration test failed: {e}")
        return False

def test_user_login():
    """Test user login endpoint"""
    try:
        test_user = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = requests.post("http://127.0.0.1:8001/login/", 
                               json=test_user, timeout=5)
        if response.status_code in [200, 401]:  # 401 if wrong credentials
            print("✓ User login endpoint working")
            return True
    except Exception as e:
        print(f"✗ User login test failed: {e}")
        return False

def main():
    """Run all validation tests"""
    print("🔍 Validating Driver Management App Setup...\n")
    
    tests = [
        ("MySQL Connection", check_mysql_connection),
        ("Backend API", check_backend_api),
        ("User Registration", test_user_registration),
        ("User Login", test_user_login)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"Testing {test_name}...")
        if test_func():
            passed += 1
        print()
    
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your setup is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the setup instructions.")
        
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
// src/services/authService.ts

// 1. IMPORT CHANGE: Use the centralized 'api' instance that handles baseURL/interceptors.
import api from './api'; 
import { isAxiosError } from 'axios';
import qs from 'qs'; 
// IMPORT NEW: Bring in the new role and token utility functions
import { removeToken, removeRole } from '../utils/auth';

// --- Registration Service ---
export const registerUser = async (username: string, password: string) => {
  try {
    // Use 'api' instance
    const response = await api.post('/auth/register', { 
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      // TypeScript adjustment for proper error throwing
      throw (error as import('axios').AxiosError).response?.data; 
    }
    throw error;
  }
};

// --- Login Service ---
export const loginUser = async (username: string, password: string) => {
  // Correctly format the data for FastAPI's OAuth2PasswordRequestForm
  const loginData = {
    username: username,
    password: password,
  };
  
  try {
    // Use 'api' instance
    const response = await api.post('/auth/login', qs.stringify(loginData), {
      // NOTE: This header is necessary for FastAPI's form data login
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // IMPORTANT: Assuming the backend response is { access_token: "...", token_type: "bearer", role: "admin" }
    return response.data; 
  } catch (error) {
    if (isAxiosError(error)) {
      throw (error as import('axios').AxiosError).response?.data;
    }
    throw error;
  }
};

// --- Logout Service ---
// 2. UPDATED LOGOUT: Clears both the token and the role data.
export function logoutUser() {
  removeToken(); 
  removeRole();
}
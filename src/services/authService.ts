// src/services/authService.ts

import axios from './axiosConfig';
import { isAxiosError } from 'axios';
import qs from 'qs'; // Import the qs library

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('/auth/register', { // Corrected path
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw (error as import('axios').AxiosError).response?.data;
    }
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  // Correctly format the data for OAuth2PasswordRequestForm
  const loginData = {
    username: username,
    password: password,
  };
  
  try {
    const response = await axios.post('/auth/login', qs.stringify(loginData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw (error as import('axios').AxiosError).response?.data;
    }
    throw error;
  }
};

export function logoutUser() {
  localStorage.removeItem('authToken');
}
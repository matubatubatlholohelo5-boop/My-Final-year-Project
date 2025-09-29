// src/services/axiosConfig.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Your backend URL
  timeout: 5000, // Timeout after 5 seconds
});

// Request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
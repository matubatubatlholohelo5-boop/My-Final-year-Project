// src/services/axiosConfig.ts (Example structure)
import axios from 'axios';
import { getToken } from '../utils/auth'; // Import the function to get the token

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get the token from local storage
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If the server says Unauthorized, force a logout
            // You'll need to import your removeToken/removeRole function here
            // removeToken(); 
            // window.location.href = '/login'; // Force redirect to login page
        }
        return Promise.reject(error);
    }
);


export default api;
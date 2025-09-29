// src/services/api.ts
import axios from 'axios';
import { getToken, removeToken, removeRole } from '../utils/auth'; // Import token/role utilities

const api = axios.create({
  baseURL: 'http://localhost:8000', // Your base backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Log out the user if the token is rejected
            console.error("401 Unauthorized: Invalid or expired token. Logging out.");
            removeToken();
            removeRole();
            // Optional: You could force a redirect here, e.g., window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
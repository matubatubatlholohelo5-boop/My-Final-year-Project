import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Use your backend port

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// Returns only the access_token string
export const loginUser = async (username: string, password: string): Promise<string> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(`${API_URL}/login/`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export function logoutUser() {
  // Implement logout logic here, e.g., remove tokens from storage
  localStorage.removeItem('authToken');
}
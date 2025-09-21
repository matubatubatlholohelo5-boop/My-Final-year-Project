// Utility functions for token handling

// Save token to localStorage
export function setToken(token: string) {
  localStorage.setItem('token', token);
}

// Get token from localStorage
export function getToken(): string {
  return localStorage.getItem('token') ?? '';
}

// Remove token from localStorage (on logout)
export function removeToken() {
  localStorage.removeItem('token');
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}
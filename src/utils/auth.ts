// src/utils/auth.ts

const TOKEN_KEY = 'driver_auth_token';
const ROLE_KEY = 'driver_user_role'; // <-- New key for role

// --- Token Functions (Existing) ---

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// --- Role Functions (New) ---

export const getRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};

export const setRole = (role: string): void => {
  localStorage.setItem(ROLE_KEY, role);
};

// --- Combined Removal Function ---

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY); // <-- Remove role upon logout
};

// Note: You can remove the separate removeToken and create a single removeAuth function if you prefer.
// For now, removing both in a function named removeToken is simple and effective.
export const removeRole = (): void => {
  localStorage.removeItem(ROLE_KEY);
};
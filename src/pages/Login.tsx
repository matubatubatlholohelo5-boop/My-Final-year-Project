// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
// Make sure the path is correct and the file exists
// Update the import path if your AuthContext file is located elsewhere, for example:
import { useAuth } from '../context/AuthContext';
// Or, if the file is named differently, update accordingly:
// import { useAuth } from '../contexts/auth-context';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // NEW: Get the login function from context

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      login(response); // Use the context's login function
      setError('');
      navigate('/drivers');
    } catch (err: any) {
      if (err && typeof err === 'object' && 'detail' in err) {
        setError((err as { detail?: string }).detail || 'An error occurred during login.');
      } else {
        setError('An error occurred during login.');
      }
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
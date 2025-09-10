import React, { useState } from 'react';
import { registerUser } from '../services/authService';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await registerUser(username, password);
      console.log('Registration successful!', response);
      setSuccess('Registration successful! You can now log in.');
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.detail || 'An error occurred during registration.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join DriverTrack</h2>
          <p className="text-gray-600 mt-2">Create your account today</p>
        </div>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors p-3 text-gray-900"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors p-3 text-gray-900"
              placeholder="Create a secure password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use the AuthContext
import { removeToken } from '../utils/auth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); // Get state from the context

  const handleLogout = () => {
    // The AuthContext's logout function will handle removing the token
    removeToken();
    navigate('/login');
  };

  if (loading) {
    // Optionally show nothing or a minimal header while loading
    return null;
  }

  return (
    <header className="bg-gray-900 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">🚗</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">DriverTrack</h1>
        </Link>
        <nav className="space-x-2 md:space-x-6 flex items-center">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="py-2 px-3 md:px-4 rounded-lg text-gray-300 font-medium hover:bg-gray-700/60 hover:text-white transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link 
                to="/drivers" 
                className="py-2 px-3 md:px-4 rounded-lg text-gray-300 font-medium hover:bg-gray-700/60 hover:text-white transition-colors duration-300"
              >
                Drivers
              </Link>
              <button 
                onClick={handleLogout} 
                className="py-2 px-3 md:px-4 rounded-lg text-gray-300 font-medium hover:bg-gray-700/60 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="py-2 px-3 md:px-4 rounded-lg text-gray-300 font-medium hover:bg-gray-700/60 hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="py-2.5 px-6 bg-purple-600 text-white rounded-lg shadow-md font-bold uppercase tracking-wide hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
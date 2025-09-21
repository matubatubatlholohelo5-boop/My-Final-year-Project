import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 md:space-x-6">
      <Link 
        to="/" 
        className="text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/60"
      >
        Home
      </Link>
      <Link 
        to="/login" 
        className="text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-700/60"
      >
        Login
      </Link>
      <Link 
        to="/register" 
        className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300 font-bold px-4 py-2 rounded-lg shadow-lg transform hover:scale-105"
      >
        Register
      </Link>
    </nav>
  );
};

export default Navbar;
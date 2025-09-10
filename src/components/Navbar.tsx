import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center space-x-6">
      <Link 
        to="/" 
        className="text-white hover:text-teal-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/10"
      >
        Home
      </Link>
      <Link 
        to="/login" 
        className="text-white hover:text-teal-200 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/10"
      >
        Login
      </Link>
      <Link 
        to="/register" 
        className="bg-white text-teal-600 hover:bg-teal-50 transition-colors duration-200 font-medium px-4 py-2 rounded-md shadow-sm"
      >
        Register
      </Link>
    </nav>
  );
};

export default Navbar;
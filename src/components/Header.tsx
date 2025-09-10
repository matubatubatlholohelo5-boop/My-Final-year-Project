import React from 'react';
import Navbar from './Navbar';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-600 font-bold text-xl">🚗</span>
          </div>
          <h1 className="text-2xl font-bold text-white">DriverTrack</h1>
        </div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
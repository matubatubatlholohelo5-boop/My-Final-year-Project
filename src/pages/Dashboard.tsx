// src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DriverTrack</h1>
        <p className="text-lg text-gray-600 mb-6">
          You have successfully logged in! This is your secure dashboard.
        </p>
        
        {/* Add the navigation link */}
        <Link 
          to="/drivers" 
          className="inline-block py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Go to Driver Management
        </Link>
        
      </div>
    </div>
  );
};

export default Dashboard;
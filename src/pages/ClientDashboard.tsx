// src/pages/ClientDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center py-6 bg-white rounded-xl shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-green-700">Client Portal Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Access your assigned records and reports.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <Link 
            to="/client/drivers" 
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-500 hover:border-green-600"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mr-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 6h12a1 1 0 011 1v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 011-1zm2 3a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-green-700">
                View Driver Records
              </h3>
            </div>
            <p className="mt-2 text-gray-500">
              Check the status and details of all operational drivers (View Only).
            </p>
          </Link>
          
          {/* Placeholder Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800">Assigned Reports</h3>
            <p className="mt-2 text-gray-500">Access monthly performance and activity reports.</p>
          </div>
          
          {/* Placeholder Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800">Support Center</h3>
            <p className="mt-2 text-gray-500">Open a ticket or view our FAQs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
// src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header Section */}
      <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
            DriverTrack Dashboard
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Your hub for driver management.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in-down">
            Welcome to My Dashboard!
          </h2>
          <p className="text-lg text-gray-600">
            This is your secure, personalized dashboard. Navigate through the sections below to manage your fleet efficiently.
          </p>
        </div>

        {/* Dashboard Grid - All Sections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Main Call to Action - Go to Driver Management */}
          <Link
            to="/drivers"
            className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200 hover:border-blue-500"
          >
            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75l.341.341A2 2 0 0015 9.172V12h2V9.172a4 4 0 00-1.172-2.828L14 5.5V5a3 3 0 00-3-3h-1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              Go to Driver Management
            </h3>
            <p className="text-gray-500 group-hover:text-gray-600">
              View, add, edit, or remove driver profiles and vehicle information. This is where you manage your fleet.
            </p>
          </Link>

          {/* Card 2: About Us Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-600 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 11-2 0v2H7a1 1 0 110-2h2V7a1 1 0 012 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H7a1 1 0 110-2h2V7a1 1 0 012 0v1h1a1 1 0 110 2h-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              About DriverTrack
            </h3>
            <p className="text-gray-500">
              DriverTrack is a powerful platform designed to streamline fleet management. Our mission is to provide an intuitive and secure way to track driver information, ensuring compliance and operational efficiency.
            </p>
          </div>

          {/* Card 3: Contact Us Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-600 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.147 18 3 13.853 3 8V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Contact Us
            </h3>
            <p className="text-gray-500 mb-4">
              Have questions or need support? Reach out to our team.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Lesotho.support@drivertrack.com
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2c-5.523 0-10-4.477-10-10V3z" />
                </svg>
                (+266) 1234-5678
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} DriverTrack. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
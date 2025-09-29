// src/components/Header.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Header: React.FC = () => {
    const { userRole, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
    };

    // Define navigation links based on role
    const getNavLinks = () => {
        if (userRole === 'admin') {
            return (
                <>
                    <Link to="/admin/dashboard" className="text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-md font-medium">
                        Admin Dashboard
                    </Link>
                    <Link to="/drivers" className="text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-md font-medium">
                        Driver Management
                    </Link>
                </>
            );
        } else if (userRole === 'client') {
            return (
                <>
                    <Link to="/client/dashboard" className="text-white hover:text-green-200 transition-colors px-3 py-2 rounded-md font-medium">
                        Client Dashboard
                    </Link>
                    <Link to="/client/drivers" className="text-white hover:text-green-200 transition-colors px-3 py-2 rounded-md font-medium">
                        View Records
                    </Link>
                </>
            );
        }
        return null;
    };

    // Don't render the header if the user is not authenticated (e.g., on the login/register page)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <header className="bg-gray-800 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/App Title */}
                    <div className="flex-shrink-0">
                        <Link to={userRole === 'admin' ? '/admin/dashboard' : '/client/dashboard'} className="text-2xl font-bold text-white tracking-wider">
                            DriverTrack
                            <span className={`ml-2 text-sm font-normal px-2 py-0.5 rounded-full ${userRole === 'admin' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                {userRole}
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-4">
                        {getNavLinks()}
                    </div>

                    {/* Action Button (Logout) */}
                    <div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
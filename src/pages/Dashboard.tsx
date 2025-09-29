// src/pages/Dashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

// IMPORTANT: You need to create this service function in a new file, e.g.,
// src/services/dashboardService.ts, to fetch metrics from your backend.
// Example: import { getAdminMetrics } from '../services/dashboardService';

// Define the expected structure of the metrics data from the API
interface AdminMetrics {
    totalDrivers: number;
    driversOnDuty: number;
    pendingMaintenance: number;
    newHires: number;
}

// Placeholder service function (REPLACE THIS WITH YOUR ACTUAL API CALL)
const getAdminMetrics = async (): Promise<AdminMetrics> => {
    // In a real app, this would be an API call like:
    // const response = await axios.get(`${API_BASE_URL}/admin/metrics`, { headers: { Authorization: ... } });
    // return response.data;
    
    // Using a delay to simulate loading time and return hardcoded data for now
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                totalDrivers: 42,
                driversOnDuty: 35,
                pendingMaintenance: 3,
                newHires: 2,
            });
        }, 500);
    });
};


const Dashboard: React.FC = () => {
    const { userRole } = useAuth();
    const isAdmin = userRole === 'admin';
    
    const [metrics, setMetrics] = useState<AdminMetrics>({
        totalDrivers: 0,
        driversOnDuty: 0,
        pendingMaintenance: 0,
        newHires: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching Logic ---
    const fetchMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminMetrics();
            setMetrics(data);
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.detail || 'Failed to load dashboard metrics.');
            } else {
                setError('An unknown error occurred while fetching metrics.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchMetrics();
        }
    }, [isAdmin, fetchMetrics]);


    // --- Render Logic for Loading/Error States ---
    if (loading && isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading dashboard data...</div>
            </div>
        );
    }

    if (error && isAdmin) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold text-red-600">Dashboard Error</h2>
                <p className="text-gray-500 mt-2">{error}</p>
                <button onClick={fetchMetrics} className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Reload Metrics
                </button>
            </div>
        );
    }
    
    // Fallback if not an admin (should be caught by AdminRoute, but good practice)
    if (!isAdmin) {
        return <div className="text-center p-10">Access Denied. Redirecting...</div>;
    }


    // --- Main Dashboard Render ---
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            
            <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                        DriverTrack Admin Hub
                    </h1>
                    <p className="text-sm text-gray-500 hidden md:block">
                        Full Management Access
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome, Administrator! 
                    </h2>
                    <p className="text-lg text-gray-600">
                        This is your secure, personalized dashboard. Click on the metrics below to view filtered driver lists.
                    </p>
                </div>

                {/* --- 1. Quick Statistics Section (NOW CLICKABLE LINKS) --- */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Overview</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    
                    {/* Stat Card 1: Total Drivers */}
                    <Link to="/drivers?filter=all" className="group block p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-blue-700 transition">Total Drivers</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{metrics.totalDrivers}</p>
                    </Link>
                    
                    {/* Stat Card 2: On-Duty */}
                    <Link to="/drivers?filter=on-duty" className="group block p-5 bg-white rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-green-700 transition">Drivers On-Duty</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{metrics.driversOnDuty}</p>
                    </Link>
                    
                    {/* Stat Card 3: Pending Maintenance */}
                    <Link to="/drivers?filter=maintenance" className="group block p-5 bg-white rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-200">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-yellow-700 transition">Pending Maintenance</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{metrics.pendingMaintenance}</p>
                    </Link>
                    
                    {/* Stat Card 4: New Hires (Last 30 Days) */}
                    <Link to="/drivers?filter=new-hires" className="group block p-5 bg-white rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-xl transition-all duration-200">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-purple-700 transition">New Hires (30 Days)</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{metrics.newHires}</p>
                    </Link>
                </div>
                
                {/* --- 2. Dashboard Grid - Management Tools --- */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Management Tools</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    
                    {/* Card 1: Main Call to Action - Go to Driver Management */}
                    <Link
                        to="/drivers" // Base link for full management
                        className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200 hover:border-blue-500"
                    >
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75l.341.341A2 2 0 0015 9.172V12h2V9.172a4 4 0 00-1.172-2.828L14 5.5V5a3 3 0 00-3-3h-1z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                            Driver Management
                        </h3>
                        <p className="text-gray-500 group-hover:text-gray-600">
                            View, add, edit, or remove driver profiles and vehicle information. Full Read/Write access.
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
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.147 18 3 13.853 3 8V5z" />
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
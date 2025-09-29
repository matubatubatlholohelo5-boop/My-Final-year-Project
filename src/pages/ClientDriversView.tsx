// src/pages/ClientDriversView.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { getDrivers } from '../services/driversService'; // Import the service function
import { isAxiosError } from 'axios';

// --- INTERFACES ---
// Define the expected shape of the Driver Performance data
interface DriverPerformance {
    id: number;
    rating: number; // e.g., 1 to 5
    notes: string;
    date: string; // Or Date object
}

// Define the expected shape of the Driver data
interface Driver {
    id: number;
    name: string;
    // Note: 'age' was in your previous definition, removed it as it's not in your backend model.
    status: string;
    car_model: string;
    license_number: string;
    // CRITICAL: Include the nested performance data
    performances: DriverPerformance[];
}

// --- HELPER FUNCTIONS ---
const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'on-duty': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// Helper function to calculate average rating
const getAverageRating = (performances: DriverPerformance[]): string => {
    if (!performances || performances.length === 0) {
        return 'N/A';
    }
    const totalRating = performances.reduce((sum, p) => sum + p.rating, 0);
    // Format to one decimal place and append a star symbol
    return (totalRating / performances.length).toFixed(1) + ' ★';
};


const ClientDriversView: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the service function to fetch data (assumes getDrivers fetches all data)
            const data = await getDrivers();
            setDrivers(data); 
        } catch (err) {
            if (isAxiosError(err)) {
                // This might trigger if the client tries to access the endpoint 
                // but the backend hasn't correctly authorized them.
                setError(err.response?.data?.detail || 'Failed to load driver data.');
            } else {
                setError('An unknown error occurred.');
            }
            console.error('Failed to fetch drivers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);


    // --- Render Logic ---

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading driver records...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-8 bg-white rounded-xl shadow-2xl text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-red-600">Error Loading Drivers</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <button onClick={fetchDrivers} className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    // Main Content
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg">
                <div className="bg-blue-600 text-white p-6 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Driver Records (Client View)</h1>
                        <p className="mt-1 opacity-90">View current driver statuses, vehicle information, and performance. (Read-Only Access)</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto p-6">
                    {drivers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No active driver records found.
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rating</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {drivers.map(driver => (
                                    <tr key={driver.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColors(driver.status)}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.car_model}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.license_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                            {getAverageRating(driver.performances)} 
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDriversView;
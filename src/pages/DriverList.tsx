// src/pages/DriverList.tsx

import React, { useState, useEffect } from 'react';
import { getDrivers, deleteDriver } from '../services/driversService';
import { Link } from 'react-router-dom';

// Define the type for a Driver object
type Driver = {
    id: number;
    name: string;
    age: number;
    status: string;
    car_model: string;
    license_number: string;
};

const DriverList: React.FC = () => {
    // State to hold the list of drivers
    const [drivers, setDrivers] = useState<Driver[]>([]);
    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State to track which driver is being deleted
    const [deleting, setDeleting] = useState<number | null>(null);

    // New state for search, filter, and sort
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('name');

    // useEffect hook to fetch data from the API
    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                // Pass search, filter, and sort parameters to the service function
                const data = await getDrivers();
                setDrivers(data);
            } catch (err) {
                console.error("Failed to fetch drivers:", err);
                setError("Failed to load drivers.");
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, [searchTerm, filterStatus, sortOption]); // Re-fetch data whenever these states change

    // Handler for deleting a driver
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            setDeleting(id);
            try {
                await deleteDriver(id);
                setDrivers(drivers.filter(driver => driver.id !== id));
            } catch (err) {
                console.error("Failed to delete driver:", err);
            } finally {
                setDeleting(null);
            }
        }
    };

    // Conditional rendering based on loading and error state
    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    // The main component render
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
                    <Link
                        to="/drivers/add"
                        className="py-2 px-5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Add New Driver
                    </Link>
                </div>
                
                {/* Search, Filter, and Sort UI */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by name or license..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>

                    {/* Filter Dropdown */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="sm:w-auto w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sm:w-auto w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="age">Sort by Age</option>
                        <option value="status">Sort by Status</option>
                        <option value="car_model">Sort by Car Model</option>
                    </select>
                </div>
                
                {drivers.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {drivers.map(driver => (
                                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.car_model}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.license_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">
                                            <Link to={`/drivers/${driver.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">View</Link>
                                            <Link to={`/drivers/edit/${driver.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors">Edit</Link>
                                            <button
                                                onClick={() => handleDelete(driver.id)}
                                                disabled={deleting === driver.id}
                                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                            >
                                                {deleting === driver.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-8">No drivers found.</p>
                )}
            </div>
        </div>
    );
};

export default DriverList;
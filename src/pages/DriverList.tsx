// src/pages/DriversList.tsx

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
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('name');

    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
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
    }, []); 

    // Handler for deleting a driver
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            setDeleting(id);
            try {
                await deleteDriver(id);
                setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== id));
            } catch (err) {
                console.error("Failed to delete driver:", err);
            } finally {
                setDeleting(null);
            }
        }
    };

    // Filter and sort drivers locally
    const filteredAndSortedDrivers = drivers
        .filter(driver => {
            const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  driver.license_number.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === '' || driver.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOption === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortOption === 'age') {
                return a.age - b.age;
            }
            if (sortOption === 'status') {
                return a.status.localeCompare(b.status);
            }
            if (sortOption === 'car_model') {
                return a.car_model.localeCompare(b.car_model);
            }
            return 0;
        });

    if (loading) return <div className="text-center mt-10 text-gray-700">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans antialiased">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-8">
                
                {/* Header and Add Driver Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">Drivers</h1>
                    <Link
                        to="/drivers/add"
                        className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Add New Driver
                    </Link>
                </div>

                {/* Search, Filter, and Sort Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by name or license..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>

                    {/* Filter Dropdown */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="age">Sort by Age</option>
                        <option value="status">Sort by Status</option>
                        <option value="car_model">Sort by Car Model</option>
                    </select>
                </div>
                
                {/* Driver Cards Grid */}
                {filteredAndSortedDrivers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedDrivers.map(driver => (
                            <div key={driver.id} className="bg-white p-6 rounded-2xl shadow-md transition-shadow hover:shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white text-xl font-bold">
                                            {driver.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-semibold text-gray-900">{driver.name}</h3>
                                            <p className="text-sm text-gray-500">License: {driver.license_number}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p><strong>Car:</strong> {driver.car_model}</p>
                                        <p><strong>Age:</strong> {driver.age}</p>
                                        <p>
                                            <strong>Status:</strong> 
                                            <span 
                                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium 
                                                ${driver.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                                  driver.status === 'Inactive' ? 'bg-red-100 text-red-700' : 
                                                  'bg-yellow-100 text-yellow-700'}`}>
                                                {driver.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between space-x-2">
                                    <Link 
                                        to={`/drivers/${driver.id}`} 
                                        className="flex-grow text-center py-2 px-4 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(driver.id)}
                                        disabled={deleting === driver.id}
                                        className="flex-grow py-2 px-4 border border-red-600 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {deleting === driver.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No drivers found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverList;
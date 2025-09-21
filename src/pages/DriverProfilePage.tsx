// src/pages/DriverProfilePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDriverById,
    getDriverHistory,
    addDriverPerformance,
    updateDriverPerformance,
    deleteDriverPerformance
} from '../services/driversService';
import { format } from 'date-fns';
import Modal from '../components/Modal';

// Define the data types
type Driver = {
    id: number;
    name: string;
    age: number;
    status: string;
    car_model: string;
    license_number: string;
};

type Performance = {
    id: number;
    driver_id: number;
    date: string;
    rating: number;
    notes: string;
};

// Define a type for the form data, for better type safety
type PerformanceFormData = Omit<Performance, 'id' | 'driver_id'>;

const DriverProfilePage: React.FC = () => {
    const { driverId } = useParams<{ driverId: string }>();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the single modal
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [performanceFormData, setPerformanceFormData] = useState<PerformanceFormData>({
        date: format(new Date(), 'yyyy-MM-dd'),
        rating: 5,
        notes: '',
    });
    const [currentPerformanceId, setCurrentPerformanceId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Function to fetch all driver-related data
    const fetchDriverData = useCallback(async () => {
        if (!driverId) {
            setError("No driver ID provided.");
            setLoading(false);
            return;
        }

        const id = parseInt(driverId, 10);
        if (isNaN(id)) {
            setError("Invalid driver ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const driverData = await getDriverById(id);
            setDriver(driverData);

            const historyData = await getDriverHistory(id);
            if (Array.isArray(historyData)) {
                setPerformances(historyData);
            } else {
                setPerformances([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch driver data:", err);
            const errorMessage = err.response?.data?.detail || 'Failed to load driver data.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [driverId]);

    // UseEffect to trigger data fetching on component load and driverId change
    useEffect(() => {
        fetchDriverData();
    }, [fetchDriverData]);

    // Functions for modal management
    const openAddModal = () => {
        setIsEditing(false);
        setPerformanceFormData({ date: format(new Date(), 'yyyy-MM-dd'), rating: 5, notes: '' });
        setShowModal(true);
    };

    const openEditModal = (performance: Performance) => {
        setIsEditing(true);
        setPerformanceFormData({ ...performance, date: format(new Date(performance.date), 'yyyy-MM-dd') });
        setCurrentPerformanceId(performance.id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setPerformanceFormData({ date: format(new Date(), 'yyyy-MM-dd'), rating: 5, notes: '' });
        setCurrentPerformanceId(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPerformanceFormData(prev => ({ ...prev, [name]: value }));
    };

   const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;
        setSubmitting(true);
        try {
            const performanceData = {
                ...performanceFormData,
                rating: parseInt(performanceFormData.rating.toString(), 10),
            };

            if (isEditing && currentPerformanceId) {
                await updateDriverPerformance(currentPerformanceId, performanceData);
            } else {
                await addDriverPerformance(driver.id, performanceData);
            }
            
            // This is the key part to update the UI
            fetchDriverData(); 
            closeModal();
            
        } catch (err) {
            console.error("Failed to save performance record", err);
            // Optional: You can set an error state here to show a message in the modal
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePerformance = async (performanceId: number) => {
        if (window.confirm("Are you sure you want to delete this performance record?")) {
            setDeleting(true);
            try {
                await deleteDriverPerformance(performanceId);
                setPerformances(prev => prev.filter(p => p.id !== performanceId));
            } catch (err) {
                console.error("Failed to delete performance record", err);
            } finally {
                setDeleting(false);
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    if (!driver) return <div className="text-center mt-10">Driver not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-3xl font-bold">
                        {driver.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{driver.name}</h1>
                        <p className="text-lg text-gray-500">{driver.car_model}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
                        <p className="text-gray-600"><strong>Age:</strong> {driver.age}</p>
                        <p className="text-gray-600"><strong>License:</strong> {driver.license_number}</p>
                        <p className="text-gray-600"><strong>Status:</strong> <span className={`font-medium px-2 py-1 rounded-full text-sm ${driver.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{driver.status}</span></p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Performance History</h2>
                            <button
                                onClick={openAddModal}
                                className="py-1.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                            >
                                + Add
                            </button>
                        </div>
                        {performances.length > 0 ? (
                            <ul className="space-y-4">
                                {performances.map(perf => (
                                    <li key={perf.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-700 font-medium">Rating: {perf.rating}/5</p>
                                            <p className="text-gray-500 text-sm">{perf.notes}</p>
                                            <p className="text-gray-400 text-xs mt-1">Date: {format(new Date(perf.date), 'MM/dd/yyyy')}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(perf)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                                title="Edit Performance"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeletePerformance(perf.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                title="Delete Performance"
                                                disabled={deleting}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center">No performance history available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* A single Modal component for both adding and editing */}
            <Modal
                show={showModal}
                onClose={closeModal}
                title={isEditing ? "Edit Performance Record" : "Add New Performance Record"}
            >
                <form onSubmit={handleFormSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={performanceFormData.date}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <select
                                name="rating"
                                value={performanceFormData.rating}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                            >
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <option key={rating} value={rating}>{rating} Star{rating > 1 && 's'}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={performanceFormData.notes}
                                onChange={handleFormChange}
                                placeholder="e.g., Excellent punctuality and customer service."
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {submitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Record')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DriverProfilePage;
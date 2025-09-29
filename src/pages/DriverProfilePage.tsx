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

// A component for the interactive star rating input
const RatingInput = ({ rating, onChange }: { rating: number; onChange: (newRating: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <svg
                    key={starValue}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onChange(starValue)}
                    className={`cursor-pointer h-8 w-8 transition-colors duration-200 
                               ${(starValue <= (hoverRating || rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// A small component to display a star rating
const StarRating = ({ rating }: { rating: number }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
        <svg
            key={index}
            className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    ));
    return <div className="flex items-center space-x-0.5">{stars}</div>;
};

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

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPerformanceFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (newRating: number) => {
        setPerformanceFormData(prev => ({ ...prev, rating: newRating }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;
        setSubmitting(true);
        try {
            const performanceData = {
                ...performanceFormData,
                rating: performanceFormData.rating
            };

            if (isEditing && currentPerformanceId) {
                await updateDriverPerformance(currentPerformanceId, performanceData);
            } else {
                await addDriverPerformance(driver.id, performanceData);
            }
            
            fetchDriverData(); 
            closeModal();
            
        } catch (err) {
            console.error("Failed to save performance record", err);
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

    // Calculate the average rating for the driver
    const averageRating = performances.length > 0
        ? (performances.reduce((sum, perf) => sum + perf.rating, 0) / performances.length).toFixed(1)
        : null;

    if (loading) return <div className="text-center mt-10 text-gray-700">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    if (!driver) return <div className="text-center mt-10 text-gray-700">Driver not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans antialiased">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-8">

                {/* Driver Profile Header Section */}
                <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0 bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center text-white text-5xl font-bold border-4 border-blue-400">
                        {driver.name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">{driver.name}</h1>
                        <p className="text-lg text-gray-500 mt-1">{driver.car_model}</p>
                    </div>
                    {averageRating && (
                        <div className="flex-grow flex justify-center md:justify-end items-center space-x-2">
                            <span className="text-4xl font-bold text-gray-800">{averageRating}</span>
                            <StarRating rating={Math.round(parseFloat(averageRating))} />
                            <span className="text-gray-500 text-sm">({performances.length} reviews)</span>
                        </div>
                    )}
                </div>

                {/* Main Content: Details and Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Details Section */}
                    <div className="bg-gray-100 p-8 rounded-2xl shadow-inner col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Driver Details</h2>
                        <div className="space-y-3">
                            <p className="text-gray-600"><strong>Age:</strong> {driver.age}</p>
                            <p className="text-gray-600"><strong>License:</strong> {driver.license_number}</p>
                            <p className="text-gray-600"><strong>Status:</strong> <span className={`font-semibold px-3 py-1 rounded-full text-sm ${driver.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{driver.status}</span></p>
                        </div>
                    </div>

                    {/* Performance History Section */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Performance History</h2>
                            <button
                                onClick={openAddModal}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                            >
                                + Add Record
                            </button>
                        </div>
                        {performances.length > 0 ? (
                            <ul className="space-y-4">
                                {performances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(perf => (
                                    <li key={perf.id} className="bg-white p-6 rounded-2xl shadow-md transition-shadow hover:shadow-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <StarRating rating={perf.rating} />
                                                    <p className="text-lg font-medium text-gray-800">{perf.rating} / 5</p>
                                                </div>
                                                <p className="text-sm text-gray-400">Date: {format(new Date(perf.date), 'MMMM d, yyyy')}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(perf)}
                                                    className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                                    title="Edit Performance"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePerformance(perf.id)}
                                                    className="p-1.5 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                    title="Delete Performance"
                                                    disabled={deleting}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-2">{perf.notes}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
                                <p>No performance history available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for adding/editing performance records */}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <RatingInput 
                                rating={performanceFormData.rating} 
                                onChange={handleRatingChange} 
                            />
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
                            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
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
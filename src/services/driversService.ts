// src/services/driversService.ts
// We now import the centralized, configured API instance instead of raw axios
import api from './api'; 
// Note: We remove the import { getToken } from '../utils/auth'; and the authHeaders helper.

// The API_URL is no longer needed here as the 'api' instance handles the baseURL.

// export const createDriver = async (driverData: any) => { // Using 'any' is fine for quick demo
export const createDriver = async (driverData: any) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.post(`/drivers/`, driverData);
  return response.data;
};

export const deleteDriver = async (driverId: number) => {
  // Use 'api' and remove the authHeaders argument
  await api.delete(`/drivers/${driverId}`);
};

// Updated function to accept and pass query parameters
export const getDrivers = async (params?: { search?: string, status?: string, sort_by?: string }) => {
  // Pass query parameters in the 'params' property of the configuration object
  const response = await api.get(`/drivers/`, { 
    params: params 
  });
  return response.data;
};

export const updateDriver = async (driverId: number, driverData: any) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.put(`/drivers/${driverId}`, driverData);
  return response.data;
};

// Function to fetch a single driver by ID
export const getDriverById = async (driverId: number) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.get(`/drivers/${driverId}`);
  return response.data;
};

// Function to get a driver's performance history
export const getDriverHistory = async (driverId: number) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.get(`/drivers/${driverId}/history/`);
  return response.data;
};

// function to add a performance record
export const addDriverPerformance = async (driverId: number, performanceData: any) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.post(`/drivers/${driverId}/history/`, performanceData);
  return response.data;
};

// function to update a performance record
export const updateDriverPerformance = async (performanceId: number, performanceData: any) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.put(`/performances/${performanceId}`, performanceData);
  return response.data;
};

// Function to delete a performance record
export const deleteDriverPerformance = async (performanceId: number) => {
  // Use 'api' and remove the authHeaders argument
  const response = await api.delete(`/performances/${performanceId}`);
  return response.data;
};
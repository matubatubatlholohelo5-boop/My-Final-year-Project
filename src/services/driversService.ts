// src/services/driversService.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = "http://localhost:8000";

// Helper to add Authorization header
const authHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createDriver = async (driverData: any) => {
  const response = await axios.post(`${API_URL}/drivers/`, driverData, authHeaders());
  return response.data;
};

export const deleteDriver = async (driverId: number) => {
  await axios.delete(`${API_URL}/drivers/${driverId}`, authHeaders());
};

// Updated function to accept and pass query parameters
export const getDrivers = async (params?: { search?: string, status?: string, sort_by?: string }) => {
  const response = await axios.get(`${API_URL}/drivers/`, { 
    ...authHeaders(),
    params: params 
  });
  return response.data;
};

export const updateDriver = async (driverId: number, driverData: any) => {
  const response = await axios.put(`${API_URL}/drivers/${driverId}`, driverData, authHeaders());
  return response.data;
};

// Function to fetch a single driver by ID
export const getDriverById = async (driverId: number) => {
  const response = await axios.get(`${API_URL}/drivers/${driverId}`, authHeaders());
  return response.data;
};

// Function to get a driver's performance history
export const getDriverHistory = async (driverId: number) => {
  const response = await axios.get(`${API_URL}/drivers/${driverId}/history/`, authHeaders());
  return response.data;
};

// function to add a performance record
export const addDriverPerformance = async (driverId: number, performanceData: any) => {
    const response = await axios.post(`${API_URL}/drivers/${driverId}/history/`, performanceData, authHeaders());
    return response.data;
};

// function to update a performance record
export const updateDriverPerformance = async (performanceId: number, performanceData: any) => {
    const response = await axios.put(`${API_URL}/performances/${performanceId}`, performanceData, authHeaders());
    return response.data;
};

// Function to delete a performance record
export const deleteDriverPerformance = async (performanceId: number) => {
    const response = await axios.delete(`${API_URL}/performances/${performanceId}`, authHeaders());
    return response.data;
};
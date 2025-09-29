// src/App.tsx (FINAL, COMPLETE RBAC ROUTING)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 

// --- Import all components ---
import Layout from './components/Layout'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages (Full Management)
import Dashboard from './pages/Dashboard';           
import DriversPage from './pages/DriversPage';      
import DriverProfilePage from './pages/DriverProfilePage'; 

// Client Pages (Read Only)
import ClientDashboard from './pages/ClientDashboard';
import ClientDriversView from './pages/ClientDriversView'; 


// --- 1. RoleBasedRedirect: Determines the landing page after login ---
const RoleBasedRedirect: React.FC = () => {
    const { userRole, isAuthenticated, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>; // Show a loader while checking auth

    // If not authenticated, force them to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Authenticated: redirect based on role
    if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === 'client') {
        return <Navigate to="/client/dashboard" replace />;
    }
    
    // Default fallback (should ideally not be reached)
    return <Navigate to="/login" replace />; 
};

// --- 2. AdminRoute: Protects Admin-specific content ---
const AdminRoute: React.FC = () => {
    const { userRole, isAuthenticated, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // Key Check: Deny access if not 'admin'
    if (userRole !== 'admin') {
        // Redirect unauthorized users (clients) to their dashboard
        return <Navigate to="/client/dashboard" replace />;
    }
    
    // If Admin, grant access
    return <Outlet />; 
};

// --- 3. ClientRoute: Protects Client-specific content ---
const ClientRoute: React.FC = () => {
    const { userRole, isAuthenticated, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // Key Check: Deny access if not 'client'
    if (userRole !== 'client') {
        // Redirect unauthorized users (admins) to their dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    // If Client, grant access
    return <Outlet />; 
};


// --- Main App Component ---
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* The Layout component wraps the entire routing structure */}
                <Layout> 
                    <Routes>
                        {/* PUBLIC ROUTES */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* ROOT/LANDING REDIRECT (e.g., /app after successful login) */}
                        <Route path="/app" element={<RoleBasedRedirect />} />


                        {/* ADMIN PROTECTED ROUTES (Read/Write) */}
                        <Route element={<AdminRoute />}>
                            {/* Nested Admin Routes */}
                            <Route path="/admin/dashboard" element={<Dashboard />} /> 
                            <Route path="/drivers" element={<DriversPage />} />
                            <Route path="/drivers/:driverId" element={<DriverProfilePage />} />
                        </Route>


                        {/* CLIENT PROTECTED ROUTES (Read Only) */}
                        <Route element={<ClientRoute />}>
                            {/* Nested Client Routes */}
                            <Route path="/client/dashboard" element={<ClientDashboard />} />
                            <Route path="/client/drivers" element={<ClientDriversView />} />
                        </Route>

                        {/* FALLBACK: Redirect any unknown path to the main redirect logic */}
                        <Route path="*" element={<Navigate to="/app" replace />} /> 
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
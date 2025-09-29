// src/pages/Login.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { isAxiosError } from 'axios';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // State for the new role selection dropdown
    const [selectedRole, setSelectedRole] = useState<UserRole>('admin'); 
    
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // 1. CALL THE REAL API LOGIN FUNCTION
            const response = await loginUser(username, password);

            // 2. EXTRACT DATA: Get the token and the role verified by the server
            const token = response.access_token;
            // Ensure serverRole is a string for comparison
            const serverRole = String(response.role); 
            const selectedRoleStr = String(selectedRole); 
            
            // ==========================================================
            // === CRITICAL FIX: FORCE EXIT ON ROLE MISMATCH ===
            if (selectedRoleStr !== serverRole) {
                
                const errorMessage = `Login failed: Your credentials are for a '${serverRole}' account, but you selected '${selectedRoleStr}'.`;
                
                // Set error state and use 'throw' to immediately jump to the 'catch' block, 
                // bypassing the successful login logic below.
                setError(errorMessage);
                throw new Error("Role mismatch detected."); 
            }
            // ==========================================================
            
            if (token && serverRole) {
                // 3. COMPLETE AUTH: This block is only reached if the roles matched.
                login(token, serverRole as UserRole); 
                navigate('/app'); 
            } else {
                setError('Login succeeded, but token or role was missing from server response.');
            }
        } catch (err) {
            // This catch block handles both the API error (401) and our custom mismatch error.
            
            // Check for the custom mismatch error first
            if (err instanceof Error && err.message === "Role mismatch detected.") {
                // The error message was already set by setError() above, so do nothing more.
            }
            // Handle API error (e.g., Incorrect username or password)
            else {
                let errorMessage = 'An unexpected error occurred. Please try again.';
                if (isAxiosError(err) && err.response) {
                    errorMessage = err.response.data.detail || 'Incorrect username or password.'; 
                }
                setError(errorMessage); 
            }
            
        } finally {
            // The finally block runs regardless of success or failure.
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-10 bg-white rounded-xl shadow-2xl w-full max-w-sm">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                
                {/* Error display */}
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username (or Email)</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required 
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                           disabled={isSubmitting} />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                           disabled={isSubmitting} />
                </div>
                
                {/* === ROLE DROPDOWN === */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Select Role (For Testing)</label>
                    <select 
                        value={selectedRole || 'admin'} 
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                        disabled={isSubmitting}
                    >
                        <option value="admin">Admin</option>
                        <option value="client">Client</option>
                    </select>
                </div>
                {/* ======================= */}
                
                <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
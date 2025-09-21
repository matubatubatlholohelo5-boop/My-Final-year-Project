// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import your page and component files
import ProtectedRoute from './components/ProtectedRoute'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DriversPage from './pages/DriversPage';
import DriverProfilePage from './pages/DriverProfilePage'; 

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/drivers"
            element={
              <ProtectedRoute>
                <DriversPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/drivers/:driverId" element={<DriverProfilePage />} />
          
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
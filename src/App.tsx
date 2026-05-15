/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { GCSProvider } from './contexts/GCSContext';

const API_URL = "https://precision-wildlife-dronegcs-production.up.railway.app";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <GCSProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </GCSProvider>
    </Router>
  );
}

// Export API_URL for use in other components
export { API_URL };
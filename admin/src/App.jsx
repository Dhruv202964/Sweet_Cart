import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Components
import Sidebar from './components/Sidebar';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManagerHome from './pages/ManagerHome'; // Your new safe landing page
import Products from './pages/Products';
import Orders from './pages/Orders';
import Staff from './pages/Staff';
import Messages from './pages/Messages';

// Placeholder for Riders
const Riders = () => (
  <div className="p-8 bg-orange-50 min-h-screen flex items-center justify-center">
    <div className="text-center bg-white p-12 rounded-3xl shadow-xl border-b-8 border-brand-red">
      <h2 className="text-5xl mb-4">🛵</h2>
      <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Rider Management</h2>
      <p className="text-gray-500 mt-2 max-w-xs mx-auto">This module is under construction for the Surat Logistics Phase.</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  const userRole = localStorage.getItem('role'); // Get role to determine landing page

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex bg-orange-50 min-h-screen">
                <Sidebar />
                
                {/* ml-56 matches our slimmer sidebar width */}
                <div className="flex-1 ml-56 p-4 transition-all duration-300">
                  <Routes>
                    {/* 👇 SENSITIVE DATA LOGIC 👇 */}
                    <Route 
                      path="/dashboard" 
                      element={userRole === 'admin' ? <Dashboard /> : <ManagerHome />} 
                    />
                    
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/riders" element={<Riders />} />
                    
                    {/* Administration Routes */}
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/messages" element={<Messages />} />
                    
                    {/* Catch-all: Send unknown links to the safe home */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
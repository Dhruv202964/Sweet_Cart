import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Layout from './components/Layout'; // Import layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        
        {/* Placeholder for future routes */}
        <Route path="/orders" element={<Layout><div className="text-2xl">🚧 Orders Coming Soon</div></Layout>} />
        <Route path="/riders" element={<Layout><div className="text-2xl">🚧 Riders Coming Soon</div></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
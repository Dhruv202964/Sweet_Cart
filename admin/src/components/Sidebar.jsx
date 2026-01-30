import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Destroy the ID Card
    localStorage.removeItem('user');
    navigate('/'); // Send back to Login
  };

  return (
    <div className="bg-brand-red text-white w-64 min-h-screen flex flex-col shadow-2xl">
      {/* Logo Area */}
      <div className="p-6 border-b border-red-800">
        <h1 className="text-2xl font-bold tracking-wider">🍬 Sweet_Cart</h1>
        <p className="text-xs text-red-200 mt-1">Admin Portal</p>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="block px-4 py-3 rounded hover:bg-red-800 transition flex items-center gap-3">
          📊 Dashboard
        </Link>
        <Link to="/products" className="block px-4 py-3 rounded hover:bg-red-800 transition flex items-center gap-3">
          📦 Products
        </Link>
        <Link to="/orders" className="block px-4 py-3 rounded hover:bg-red-800 transition flex items-center gap-3">
          🚚 Orders
        </Link>
        <Link to="/riders" className="block px-4 py-3 rounded hover:bg-red-800 transition flex items-center gap-3">
          🛵 Riders
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-red-800">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-900 py-2 rounded hover:bg-brand-orange transition text-sm font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
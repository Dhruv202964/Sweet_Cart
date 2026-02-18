import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook

const ManagerHome = () => {
  const navigate = useNavigate(); // Initialize navigation
  const userName = "Rahul Chulbula";

  return (
    <div className="p-8 bg-orange-50 min-h-screen flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl border-t-8 border-brand-red max-w-lg">
        <h1 className="text-4xl mb-4">👋</h1>
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h2>
        <p className="text-gray-500 mt-4 text-lg">
          You are logged in to the <strong>Operational Control Center</strong>. 
          Use the shortcuts below to get started.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* 👇 CLICKABLE ORDERS BUTTON 👇 */}
          <div 
            onClick={() => navigate('/orders')}
            className="p-6 bg-red-50 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100 hover:shadow-md transition transform hover:-translate-y-1 active:scale-95"
          >
            <p className="text-brand-red font-bold text-3xl mb-2">📦</p>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-tight">Check Orders</p>
          </div>

          {/* 👇 CLICKABLE STOCK BUTTON 👇 */}
          <div 
            onClick={() => navigate('/products')}
            className="p-6 bg-orange-50 rounded-xl border border-orange-100 cursor-pointer hover:bg-orange-100 hover:shadow-md transition transform hover:-translate-y-1 active:scale-95"
          >
            <p className="text-orange-600 font-bold text-3xl mb-2">🍬</p>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-tight">Update Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
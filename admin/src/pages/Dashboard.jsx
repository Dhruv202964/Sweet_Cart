import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-brand-cream p-6">
      <h1 className="text-3xl font-bold text-brand-red">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to the control center.</p>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-orange">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-red">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">₹ 5,400</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Deliveries</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
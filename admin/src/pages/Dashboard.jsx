import React, { useEffect, useState } from 'react';
import SalesChart from '../components/SalesChart'; // <--- Import the Graph

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    pending_deliveries: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-red mb-2">Admin Dashboard</h2>
      <p className="text-gray-500 mb-8">Welcome to the control center.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-orange">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_orders}</p>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-red">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹ {stats.total_revenue}</p>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Deliveries</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending_deliveries}</p>
        </div>

      </div>

      {/* NEW: Sales Graph Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <SalesChart />
      </div>

    </div>
  );
};

export default Dashboard;
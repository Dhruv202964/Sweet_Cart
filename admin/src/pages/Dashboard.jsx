import React, { useEffect, useState } from 'react';
import SalesChart from '../components/SalesChart'; 
// ^ Make sure SalesChart.jsx exists in your components folder!

const Dashboard = () => {
  // 1. Initialize State with 0 (Not null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalOrders: 0
  });

  const [loading, setLoading] = useState(true);

  // 2. Fetch Data from Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // A. Fetch Stats (Revenue & Pending)
        const statsRes = await fetch('http://localhost:5000/api/orders/stats');
        const statsData = await statsRes.json();
        
        console.log("📊 API Stats Received:", statsData); // Check Console (F12)!

        // B. Fetch All Orders (To count Total Orders)
        const ordersRes = await fetch('http://localhost:5000/api/orders');
        const ordersData = await ordersRes.json();

        // C. Update State Safely (Convert Strings to Numbers)
        setStats({
          totalRevenue: Number(statsData.totalRevenue) || 0,
          pendingOrders: Number(statsData.pendingOrders) || 0,
          totalOrders: ordersData.length || 0 
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading dashboard:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50">
        <div className="text-xl font-bold text-brand-red animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome to the control center.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-brand-red">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Orders</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            {stats.totalOrders}
          </p>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            {/* Format as Indian Rupee */}
            {stats.totalRevenue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR'
            })}
          </p>
        </div>

        {/* Card 3: Pending Deliveries */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Deliveries</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      {/* Sales Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-700">Sales Performance by City</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">LIVE DATA</span>
        </div>
        
        <div className="h-80 w-full">
           <SalesChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
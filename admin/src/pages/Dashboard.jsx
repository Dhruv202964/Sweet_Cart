import React, { useState, useEffect } from 'react';
import SalesChart from '../components/SalesChart'; // Make sure this path is correct!

const Dashboard = () => {
  // 1. Setup State for Live Data
  const [stats, setStats] = useState({
    total_revenue: 0,
    pending_orders: 0
  });

  // 2. Fetch Live Stats from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back to the Sweet_Cart control center.</p>
      </div>

      {/* 📊 LIVE TOP CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Total Revenue Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-saffron opacity-10 rounded-bl-full"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Total Revenue
          </span>
          <div className="text-4xl font-black text-brand-saffron">
            {/* Format number with commas (e.g., ₹8,000) */}
            ₹{Number(stats.total_revenue).toLocaleString()}
          </div>
        </div>

        {/* Pending Deliveries Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-brand-red flex flex-col justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Pending Deliveries
          </span>
          <div className="text-4xl font-black text-gray-800">
            {stats.pending_orders}
          </div>
        </div>

      </div>

      {/* 📈 SALES CHART SECTION */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mt-8 relative">
        {/* Live Data Badge */}
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <span className="text-[10px] font-bold text-brand-red bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Live Data
          </span>
        </div>
        
        <SalesChart />
      </div>

    </div>
  );
};

export default Dashboard;
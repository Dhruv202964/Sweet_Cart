import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ total_revenue: 0, monthly_revenue: 0, today_revenue: 0, today_delivered: 0, pending_orders: 0, cancelled_orders: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedChartCity, setSelectedChartCity] = useState('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      try {
        const statsRes = await fetch('http://localhost:5000/api/orders/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (e) { console.error("Stats API failed:", e); }

      try {
        const analyticsRes = await fetch('http://localhost:5000/api/orders/analytics');
        if (analyticsRes.ok) setChartData(await analyticsRes.json());
      } catch (e) { console.error("Analytics API failed:", e); }

      try {
        const ordersRes = await fetch('http://localhost:5000/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.slice(0, 5)); 
        }
      } catch (e) { console.error("Orders API failed:", e); }
    } finally {
      setLoading(false);
    }
  };

  // 🧠 DATA CALCULATION
  let chartLabels = [];
  let chartValues = [];
  
  if (selectedChartCity === 'All') {
    const cityMap = {};
    chartData.forEach(item => { cityMap[item.city] = (cityMap[item.city] || 0) + parseFloat(item.revenue); });
    chartLabels = Object.keys(cityMap);
    chartValues = Object.values(cityMap);
  } else {
    const filtered = chartData.filter(item => item.city === selectedChartCity);
    chartLabels = filtered.map(item => item.area);
    chartValues = filtered.map(item => item.revenue);
  }

  // 🎨 DYNAMIC CITY COLOR THEMES
  const cityThemes = {
    'Mumbai': { main: 'rgba(239, 68, 68, 0.8)', shades: ['rgba(239, 68, 68, 0.9)', 'rgba(248, 113, 113, 0.7)', 'rgba(153, 27, 27, 0.8)'] }, 
    'Surat': { main: 'rgba(59, 130, 246, 0.8)', shades: ['rgba(37, 99, 235, 0.9)', 'rgba(96, 165, 250, 0.7)', 'rgba(30, 64, 175, 0.8)'] }, 
    'Ahmedabad': { main: 'rgba(16, 185, 129, 0.8)', shades: ['rgba(5, 150, 105, 0.9)', 'rgba(52, 211, 153, 0.7)', 'rgba(6, 78, 59, 0.8)'] }, 
    'Vadodara': { main: 'rgba(245, 158, 11, 0.8)', shades: ['rgba(217, 119, 6, 0.9)', 'rgba(251, 191, 36, 0.7)', 'rgba(146, 64, 14, 0.8)'] } 
  };
  const defaultShades = ['rgba(139, 92, 246, 0.8)', 'rgba(167, 139, 250, 0.7)', 'rgba(196, 181, 253, 0.6)'];

  let bgColors = [];
  if (selectedChartCity === 'All') {
    bgColors = chartLabels.map(city => cityThemes[city] ? cityThemes[city].main : defaultShades[0]);
  } else {
    const shades = cityThemes[selectedChartCity] ? cityThemes[selectedChartCity].shades : defaultShades;
    bgColors = chartLabels.map((area, index) => shades[index % shades.length]);
  }

  const barChartConfig = {
    labels: chartLabels,
    datasets: [{
      label: 'Revenue (₹)',
      data: chartValues,
      backgroundColor: bgColors,
      borderRadius: 6,
    }],
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const availableCities = ['All', ...new Set(chartData.map(item => item.city))];

  if (loading) return <div className="p-6 text-center text-gray-500 font-bold mt-10">Loading Dashboard Metrics...</div>;

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>
        <p className="text-sm text-gray-500">Real-time logistics and revenue tracking.</p>
      </div>

      {/* 💳 ULTRA-COMPACT SMART GRID (6 CARDS IN A ROW) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-800 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">All-Time Rev</p>
          <h3 className="text-xl font-black text-gray-800">₹{(stats.total_revenue || 0).toLocaleString()}</h3>
          <IndianRupee className="absolute right-[-10px] bottom-[-10px] text-gray-100 opacity-50" size={64} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Month Profit</p>
          <h3 className="text-xl font-black text-gray-800">₹{(stats.monthly_revenue || 0).toLocaleString()}</h3>
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-purple-100 opacity-50" size={64} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Today's Profit</p>
          <h3 className="text-xl font-black text-gray-800">₹{(stats.today_revenue || 0).toLocaleString()}</h3>
          <IndianRupee className="absolute right-[-10px] bottom-[-10px] text-green-100 opacity-50" size={64} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Delivered Today</p>
          <h3 className="text-xl font-black text-gray-800">{stats.today_delivered || 0}</h3>
          <ShoppingBag className="absolute right-[-10px] bottom-[-10px] text-blue-100 opacity-50" size={64} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Pending Drops</p>
          <h3 className="text-xl font-black text-gray-800">{stats.pending_orders || 0}</h3>
          <Clock className="absolute right-[-10px] bottom-[-10px] text-yellow-100 opacity-50" size={64} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cancellations</p>
          <h3 className="text-xl font-black text-gray-800">{stats.cancelled_orders || 0}</h3>
          <XCircle className="absolute right-[-10px] bottom-[-10px] text-red-100 opacity-50" size={64} />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={20} className="text-brand-red" /> Revenue Analysis</h3>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
              {availableCities.map(city => (
                <button 
                  key={city} 
                  onClick={() => setSelectedChartCity(city)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${selectedChartCity === city ? 'bg-white shadow text-brand-red' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          {/* TALLER CHART HEIGHT */}
          <div className="h-80 relative w-full">
             {chartLabels.length > 0 ? (
               <Bar data={barChartConfig} options={chartOptions} />
             ) : (
               <p className="text-sm text-gray-400 font-medium text-center mt-20">No revenue data available.</p>
             )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">No recent orders.</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.order_id} className="flex justify-between items-center p-3 hover:bg-red-50 rounded-lg transition border border-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-800">#{order.order_id} {order.customer_name}</p>
                    <p className="text-[10px] text-gray-500">{order.city}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-sm font-bold text-brand-red">₹{order.total_amount}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
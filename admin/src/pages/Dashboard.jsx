import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, XCircle, Clock, TrendingUp, CalendarDays, Calculator } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ⏳ THE TIME MACHINE STATES
  const [dateFilter, setDateFilter] = useState('Today'); 
  const [customDate, setCustomDate] = useState('');
  
  const [selectedChartCity, setSelectedChartCity] = useState('All');
  const [recentView, setRecentView] = useState('Filtered'); 

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      if (res.ok) {
        const data = await res.json();
        setAllOrders(data);
        setFilteredOrders(data);
      }
    } catch (e) { 
      console.error("Orders API failed:", e); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allOrders.length) return;
    
    let result = allOrders;
    const today = new Date();

    if (dateFilter === 'Today') {
      result = allOrders.filter(o => new Date(o.created_at).toDateString() === today.toDateString());
    } else if (dateFilter === 'This Week') {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      result = allOrders.filter(o => new Date(o.created_at) >= lastWeek);
    } else if (dateFilter === 'This Month') {
      result = allOrders.filter(o => new Date(o.created_at).getMonth() === today.getMonth() && new Date(o.created_at).getFullYear() === today.getFullYear());
    } else if (dateFilter === 'Custom' && customDate) {
      const targetDate = new Date(customDate);
      result = allOrders.filter(o => new Date(o.created_at).toDateString() === targetDate.toDateString());
    }

    setFilteredOrders(result);
  }, [dateFilter, customDate, allOrders]);

  // 📊 DYNAMIC STATS CALCULATION
  let totalRev = 0, delivered = 0, periodCancelled = 0;
  
  // These respect the Time Machine
  filteredOrders.forEach(o => {
    if (o.status !== 'Cancelled') totalRev += parseFloat(o.total_amount || 0);
    if (o.status === 'Delivered') delivered++;
    if (o.status === 'Cancelled') periodCancelled++; // Secret variable for AOV math!
  });

  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount - periodCancelled > 0 ? (totalRev / (totalOrdersCount - periodCancelled)) : 0;

  // 🔥 THE FIX: Pending and Cancelled NEVER respect the Time Machine! 
  // It searches ALL orders to find the true Database totals.
  let pending = 0, totalCancelled = 0;
  allOrders.forEach(o => {
    if (o.status === 'Pending' || o.status === 'Packed' || o.status === 'Out for Delivery') pending++;
    if (o.status === 'Cancelled') totalCancelled++;
  });

  // 📈 CHART DATA CALCULATION
  let chartLabels = [];
  let chartValues = [];
  
  if (selectedChartCity === 'All') {
    const cityMap = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Cancelled') {
        const city = o.city || 'Surat';
        cityMap[city] = (cityMap[city] || 0) + parseFloat(o.total_amount || 0);
      }
    });
    chartLabels = Object.keys(cityMap);
    chartValues = Object.values(cityMap);
  } else {
    const areaMap = {};
    filteredOrders.forEach(o => {
      if (o.status !== 'Cancelled' && (o.city || 'Surat') === selectedChartCity) {
        const area = o.delivery_area || 'Main City';
        areaMap[area] = (areaMap[area] || 0) + parseFloat(o.total_amount || 0);
      }
    });
    chartLabels = Object.keys(areaMap);
    chartValues = Object.values(areaMap);
  }

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
    datasets: [{ label: 'Revenue (₹)', data: chartValues, backgroundColor: bgColors, borderRadius: 6 }],
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const availableCities = ['All', ...new Set(allOrders.map(item => item.city || 'Surat'))];

  const displayedRecentOrders = recentView === 'All' ? allOrders : filteredOrders;

  if (loading) return <div className="p-6 text-center text-gray-500 font-bold mt-10">Loading Dashboard Metrics...</div>;

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>
          <p className="text-sm text-gray-500">Real-time logistics and revenue tracking.</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-wrap items-center gap-3 w-full">
        <div className="flex items-center gap-2 text-brand-red font-bold px-3 border-r border-gray-100">
          <CalendarDays size={20} />
          <span>Timeline:</span>
          {dateFilter === 'Today' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 animate-pulse">LIVE NOW</span>}
        </div>
        
        <div className="flex gap-2 items-center">
          {dateFilter !== 'Today' && (
            <button 
              onClick={() => { setDateFilter('Today'); setCustomDate(''); }}
              className="animate-in fade-in zoom-in slide-in-from-left-4 duration-300 px-4 py-2 rounded-xl text-sm font-black shadow-md bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all flex items-center gap-1"
            >
              <Clock size={16} /> Back to Today
            </button>
          )}

          {['All Time', 'This Week', 'This Month'].map(filter => (
            <button 
              key={filter}
              onClick={() => { setDateFilter(filter); setCustomDate(''); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                dateFilter === filter ? 'bg-brand-red text-white scale-105' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-brand-red'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 bg-gray-50 py-1.5 px-3 rounded-xl border border-gray-200">
          <span className="text-sm font-bold text-gray-500">Specific Date:</span>
          <input 
            type="date" 
            value={customDate}
            onChange={(e) => { 
              setCustomDate(e.target.value); 
              setDateFilter('Custom'); 
            }}
            className="bg-white border border-gray-300 rounded-lg p-1.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-800 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{dateFilter} Rev</p>
          <h3 className="text-xl font-black text-gray-800">₹{totalRev.toLocaleString()}</h3>
          <IndianRupee className="absolute right-[-10px] bottom-[-10px] text-gray-100 opacity-50" size={64} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
          <h3 className="text-xl font-black text-gray-800">{totalOrdersCount}</h3>
          <ShoppingBag className="absolute right-[-10px] bottom-[-10px] text-purple-100 opacity-50" size={64} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Avg Order Value</p>
          <h3 className="text-xl font-black text-gray-800">₹{Math.round(avgOrderValue).toLocaleString()}</h3>
          <Calculator className="absolute right-[-10px] bottom-[-10px] text-green-100 opacity-50" size={64} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Delivered</p>
          <h3 className="text-xl font-black text-gray-800">{delivered}</h3>
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-blue-100 opacity-50" size={64} />
        </div>
        
        {/* 🔥 PENDING DROPS: ALWAYS SHOWS TRUE DATABASE TOTAL */}
        <div className="bg-brand-red p-4 rounded-xl shadow-sm border-l-4 border-red-900 flex flex-col justify-center relative overflow-hidden text-white">
          <p className="text-[10px] text-red-100 font-bold uppercase tracking-wider mb-1">Active Pending Drops</p>
          <h3 className="text-xl font-black">{pending}</h3>
          <Clock className="absolute right-[-10px] bottom-[-10px] text-red-900 opacity-50" size={64} />
        </div>

        {/* 🔥 TOTAL CANCELLATIONS: ALWAYS SHOWS TRUE DATABASE TOTAL */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Cancellations</p>
          <h3 className="text-xl font-black text-gray-800">{totalCancelled}</h3>
          <XCircle className="absolute right-[-10px] bottom-[-10px] text-red-100 opacity-50" size={64} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-red" /> 
              {dateFilter} Revenue Analysis
            </h3>
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
          <div className="h-80 relative w-full">
             {chartLabels.length > 0 ? (
               <Bar data={barChartConfig} options={chartOptions} />
             ) : (
               <p className="text-sm text-gray-400 font-medium text-center mt-20">No revenue data available for this date.</p>
             )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setRecentView('Filtered')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${recentView === 'Filtered' ? 'bg-white shadow text-brand-red' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {dateFilter === 'Today' ? "Today's" : "Filtered"}
              </button>
              <button 
                onClick={() => setRecentView('All')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${recentView === 'All' ? 'bg-white shadow text-brand-red' : 'text-gray-500 hover:text-gray-800'}`}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {displayedRecentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No orders found.</p>
            ) : (
              displayedRecentOrders.slice(0, 10).map(order => (
                <div key={order.order_id} className="flex justify-between items-center p-3 hover:bg-red-50 rounded-lg transition border border-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-800">#{order.order_id} {order.customer_name}</p>
                    <p className="text-[10px] text-gray-500">{order.city} • {new Date(order.created_at).toLocaleDateString()}</p>
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
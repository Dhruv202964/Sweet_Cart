import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';

const ManageCustomers = () => {
  const [data, setData] = useState({
    registeredList: [],
    guestList: [],
    registeredCount: 0,
    guestCount: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true); // Only true on the VERY first load
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    // 1. Initial fetch when component mounts
    fetchCustomerData();

    // 2. 🚀 THE SILENT LIVE ENGINE (Polls every 10 seconds)
    const intervalId = setInterval(() => {
      fetchCustomerData(true); // Passing true means it's a "silent" background fetch
    }, 10000);

    // Clean up if admin leaves the page
    return () => clearInterval(intervalId);
  }, []);

  const fetchCustomerData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const token = localStorage.getItem('token'); 
      
      // 🔥 THE CACHE-BUSTING FIX: Adding a live timestamp so the browser never ignores the radar!
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:5000/api/admin/customers?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate' // Forcing browser to fetch fresh
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching CRM data:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  const displayList = activeTab === 'registered' ? data.registeredList : data.guestList;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 📊 Header & Total Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Users className="text-amber-500" size={32} />
            Customer Analytics
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Track registered accounts and guest checkouts in real-time.</p>
        </div>
        
        <div className="bg-amber-100 px-6 py-3 rounded-xl border border-amber-200 shadow-sm flex items-center gap-3 relative overflow-hidden group">
          {/* Subtle pulse animation to show it's "Live" */}
          <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          
          <div className="bg-amber-500 text-white p-2 rounded-lg relative z-10">
            <Users size={20} />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live Reach
            </p>
            <p className="text-2xl font-black text-amber-900">{data.totalCustomers} <span className="text-sm font-medium text-amber-700">Customers</span></p>
          </div>
        </div>
      </div>

      {/* 🗂️ Clickable Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('registered')}
          className={`pb-4 px-4 font-bold text-lg flex items-center gap-2 transition-colors relative ${activeTab === 'registered' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <UserCheck size={20} />
          Registered Users
          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full ml-1 transition-all">{data.registeredCount}</span>
          {activeTab === 'registered' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-amber-500 rounded-t-md"></span>}
        </button>

        <button 
          onClick={() => setActiveTab('guest')}
          className={`pb-4 px-4 font-bold text-lg flex items-center gap-2 transition-colors relative ${activeTab === 'guest' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <UserX size={20} />
          Guest Customers
          <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full ml-1 transition-all">{data.guestCount}</span>
          {activeTab === 'guest' && <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-amber-500 rounded-t-md"></span>}
        </button>
      </div>

      {/* 📋 Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Customer Name</th>
                <th className="p-4 font-bold">Contact Info</th>
                <th className="p-4 font-bold">Joined / Ordered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayList.length > 0 ? (
                displayList.map((customer, index) => (
                  <tr key={customer.id || index} className="hover:bg-amber-50/50 transition-colors animate-in fade-in duration-300">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{customer.name}</p>
                      {activeTab === 'guest' && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded border border-gray-200 mt-1 inline-block font-bold">GUEST CHECKOUT</span>}
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Mail size={14} className="text-amber-500" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Phone size={14} className="text-amber-500" />
                        {customer.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(customer.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400 font-medium">
                    No {activeTab === 'registered' ? 'registered users' : 'guest customers'} found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
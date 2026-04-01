import React, { useEffect, useState, useRef } from 'react';
import { Eye, Trash2, BellRing, Map, PackageOpen, CheckCircle, XCircle, CalendarDays, X, AlertTriangle } from 'lucide-react'; 
import OrderDetailsModal from '../components/OrderDetailsModal';
import toast from 'react-hot-toast'; 

const locationData = {
  'Gujarat': ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur'],
  'Delhi': ['New Delhi', 'Dwarka']
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Active');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  
  const [orderToDelete, setOrderToDelete] = useState(null);
  const previousOrders = useRef([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        const currentOrders = await res.json();

        if (previousOrders.current.length > 0) {
          currentOrders.forEach(newOrder => {
            const oldOrder = previousOrders.current.find(o => o.order_id === newOrder.order_id);

            if (oldOrder && oldOrder.status !== 'Cancelled by User' && newOrder.status === 'Cancelled by User') {
              toast.error(
                `🚨 ALERT: Order #${newOrder.order_id} CANCELLED BY USER!`, 
                { 
                  duration: 8000, 
                  position: 'top-right',
                  style: { border: '2px solid #ef4444', backgroundColor: '#7f1d1d', color: '#fff', padding: '16px', fontWeight: '900', fontSize: '1.1rem' }
                }
              );
            }
            else if (oldOrder && oldOrder.payment_status === 'Pending Payment' && newOrder.payment_status === 'Paid') {
               toast.success(
                 `🛎️ NEW ORDER PAID: #${newOrder.order_id} IS READY FOR PACKING!`, 
                 {
                   duration: 6000,
                   position: 'top-right',
                   style: { border: '2px solid #10b981', backgroundColor: '#064e3b', color: '#fff', padding: '16px', fontWeight: '900', fontSize: '1.1rem' }
                 }
               );
            }
          });
        }

        previousOrders.current = currentOrders;
        setOrders(currentOrders);
      } catch (err) {
        console.error("Error loading live orders:", err);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.order_id === id ? { ...o, status: newStatus } : o));
        
        if (newStatus === 'Delivered') {
          toast.success(`Order #${id} Moved to Delivered! 🎉`, { style: { border: '2px solid #10b981', backgroundColor: '#1f2937', color: '#fff' }});
        } else if (newStatus.includes('Cancel')) {
          toast.error(`Order #${id} Cancelled by Admin.`, { style: { border: '2px solid #ef4444', backgroundColor: '#1f2937', color: '#fff' }});
        } else {
          toast.success(`Order #${id} marked as ${newStatus}! 🚚`, { style: { border: '2px solid #3b82f6', backgroundColor: '#1f2937', color: '#fff' }});
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const executeDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderToDelete}`, { method: 'DELETE' });
      
      if (res.ok) {
        setOrders(orders.filter(o => o.order_id !== orderToDelete));
        toast.success(`Order #${orderToDelete} Deleted Permanently 🗑️`, { style: { border: '2px solid #ef4444', backgroundColor: '#1f2937', color: '#fff' }});
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(`Failed to delete. Backend says: ${errorData.error || 'Check server constraints!'}`, { duration: 4000 });
      }
    } catch (err) { 
      console.error(err); 
      toast.error("Network Error: Could not reach the backend.");
    } finally {
      setOrderToDelete(null);
    }
  };

  // 🚀 FIX: THE NEW COLOR THEMES FOR BADGES!
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200 shadow-sm';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm';
      case 'Packed': return 'bg-purple-100 text-purple-700 border-purple-300 shadow-sm'; // ✨ NEW PURPLE!
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-300 shadow-sm'; // ✨ NEW ORANGE!
      case 'Cancelled by User': return 'bg-red-50 text-red-800 border-red-300 font-black shadow-sm';
      case 'Cancelled': 
      case 'Cancelled by Admin': return 'bg-red-100 text-red-900 border-red-400 font-black shadow-sm';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const isCancelledStatus = ['Cancelled', 'Cancelled by User', 'Cancelled by Admin'].includes(order.status);
    
    const isActiveTab = activeTab === 'Active' && !isCancelledStatus && order.status !== 'Delivered' && order.payment_status === 'Paid';
    const isDeliveredTab = activeTab === 'Delivered' && order.status === 'Delivered';
    const isCancelledTab = activeTab === 'Cancelled' && isCancelledStatus;
    
    if (!isActiveTab && !isDeliveredTab && !isCancelledTab) return false;

    if (selectedState !== 'All') {
      const orderCity = order.city || 'Surat'; 
      const belongsToState = locationData[selectedState]?.includes(orderCity);
      if (!belongsToState) return false;
      
      if (selectedCity !== 'All' && orderCity.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
    }

    if (selectedDate) {
      const orderDate = new Date(order.created_at).toDateString();
      const filterDate = new Date(selectedDate).toDateString();
      if (orderDate !== filterDate) return false;
    }
    
    return true;
  });

  const simulateNewOrder = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex border-l-8 border-green-500`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <span className="text-3xl animate-bounce inline-block">🛎️</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-lg font-black text-gray-900 uppercase tracking-wide">New Order Paid!</p>
              <p className="mt-1 text-sm text-gray-500 font-bold">Action Required: Prepare for Dispatch</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-brand-red hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-brand-red">
            Dismiss
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-right' });
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen relative">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500">Track and manage customer shipments across regions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={simulateNewOrder}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <BellRing size={18} className="animate-pulse" /> Demo Notification
          </button>
          
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
            <CalendarDays size={18} className="text-gray-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none cursor-pointer"
            />
            {selectedDate && (
              <button onClick={() => setSelectedDate('')} className="p-1 hover:bg-red-50 text-red-500 rounded-full transition">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-gray-500 font-bold text-sm">Showing {activeTab}:</span>
            <span className="text-2xl font-bold text-brand-red ml-2">{filteredOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab('Active')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${activeTab === 'Active' ? 'bg-white text-brand-red border-t-4 border-brand-red shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}
        >
          <PackageOpen size={20} /> Active Queue
        </button>
        <button 
          onClick={() => setActiveTab('Delivered')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${activeTab === 'Delivered' ? 'bg-white text-green-600 border-t-4 border-green-500 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}
        >
          <CheckCircle size={20} /> Delivered History
        </button>
        <button 
          onClick={() => setActiveTab('Cancelled')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${activeTab === 'Cancelled' ? 'bg-white text-red-600 border-t-4 border-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}
        >
          <XCircle size={20} /> Cancelled
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 text-brand-red font-bold px-3 border-r border-gray-100">
          <Map size={20} />
          <span>Region:</span>
        </div>
        {['All', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi'].map(state => (
          <button
            key={state}
            onClick={() => { setSelectedState(state); setSelectedCity('All'); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
              selectedState === state ? 'bg-brand-red text-white scale-105' : 'bg-gray-50 text-gray-600 border border-transparent hover:border-red-300 hover:text-brand-red'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {selectedState !== 'All' && (
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300 pl-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by City:</span>
          <button
            onClick={() => setSelectedCity('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCity === 'All' ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
          >
            All of {selectedState}
          </button>
          {locationData[selectedState].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCity === city ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-50 text-brand-red uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-5">Order ID</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Location</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status / Date</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6" className="p-12 text-center text-gray-400 font-medium">
                {selectedDate ? `No ${activeTab} orders found on ${new Date(selectedDate).toLocaleDateString()}.` : `No ${activeTab} orders found for ${selectedCity !== 'All' ? selectedCity : selectedState}.`}
              </td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-red-50 transition">
                  <td className="p-5 font-bold text-gray-400">#{order.order_id}</td>
                  <td className="p-5">
                    <p className="font-bold text-gray-800">{order.customer_name || "Guest User"}</p>
                    <p className="text-xs text-gray-500">{order.item_count || 1} Items</p>
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider 
                      ${(order.city || 'Surat').toLowerCase() === 'surat' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
                      {order.city || 'Surat'}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">{Object.keys(locationData).find(key => locationData[key].includes(order.city || 'Surat'))}</p>
                  </td>
                  
                  <td className="p-5 font-black text-gray-800">
                    ₹{order.total_amount}
                  </td>
                  
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {activeTab === 'Active' ? (
                        <select 
                          value={order.status} 
                          onChange={(e) => updateStatus(order.order_id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-black border outline-none cursor-pointer appearance-none shadow-sm ${getStatusBadge(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Packed">Packed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Mark Delivered</option>
                          <option value="Cancelled by Admin">Cancel Order (Admin)</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-black border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg font-black text-xs shadow-md tracking-wide transform hover:scale-105 transition-transform whitespace-nowrap">
                        <CalendarDays size={14} className="text-orange-400" />
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </td>

                  <td className="p-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" 
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    
                    <button 
                      onClick={() => setOrderToDelete(order.order_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                      title="Delete Permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle size={32} className="text-brand-red animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Delete Order #{orderToDelete}?</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Are you absolutely sure? This action cannot be undone and will permanently wipe this record from the database.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition flex justify-center items-center gap-2"
                >
                  <Trash2 size={18} /> Delete It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default Orders;
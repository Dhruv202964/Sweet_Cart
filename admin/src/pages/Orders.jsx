import React, { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import OrderDetailsModal from '../components/OrderDetailsModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const filterOptions = ['All', 'Surat', 'Ahmedabad', 'Mumbai', 'Vadodara', 'Cancelled'];

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error loading orders:", err));
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(orders.filter(o => o.order_id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Packed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = selectedCity === 'All' 
    ? orders 
    : selectedCity === 'Cancelled'
      ? orders.filter(order => order.status === 'Cancelled')
      : orders.filter(order => (order.city || 'Surat').toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500">Track and manage customer shipments.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
          <span className="text-gray-500 font-bold text-sm">Total Orders:</span>
          <span className="text-2xl font-bold text-brand-red ml-2">{orders.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {filterOptions.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
              selectedCity === city
                ? 'bg-red-800 text-white border-2 border-red-800 scale-105' 
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-50 text-brand-red uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-5">Order ID</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Location (City)</th>
              <th className="p-5">Items</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-400">No orders found for {selectedCity}.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-red-50 transition">
                  
                  <td className="p-5 font-bold text-gray-400">#{order.order_id}</td>
                  
                  <td className="p-5">
                    <p className="font-bold text-gray-800">{order.customer_name || "Guest User"}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>

                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider 
                      ${(order.city || 'Surat').toLowerCase() === 'surat' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
                      {order.city || 'Surat'} 🚀
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{order.delivery_address || '395006'}</p>
                  </td>

                  <td className="p-5 font-medium text-gray-600">
                    {order.item_count || 1} Items
                  </td>

                  <td className="p-5 font-bold text-gray-800">
                    ₹{order.total_amount}
                  </td>

                  <td className="p-5">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order.order_id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none ${getStatusBadge(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
                      onClick={() => handleDelete(order.order_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                      title="Delete Order"
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

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default Orders;
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders from Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  if (loading) return <div className="text-center mt-20">Loading Orders...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-red mb-6">Order Management</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-brand-red text-white uppercase text-sm font-bold">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Address</th>
              <th className="p-4">Total (₹)</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rider</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold">#{order.order_id}</td>
                <td className="p-4">{order.customer_name}</td>
                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{order.delivery_address}</td>
                <td className="p-4 font-bold text-brand-orange">₹ {order.total_amount}</td>
                
                {/* Status Badge */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {order.rider_id ? `Rider #${order.rider_id}` : 'Unassigned'}
                </td>

                <td className="p-4">
                  <button className="bg-brand-dark text-white px-3 py-1 rounded text-sm hover:bg-black transition">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-6 text-center text-gray-400">No active orders found.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
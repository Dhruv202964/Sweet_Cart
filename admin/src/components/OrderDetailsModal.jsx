import React, { useEffect, useState } from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the specific sweets for this order
  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${order.order_id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching items:", err));
  }, [order.order_id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in border-t-4 border-brand-orange">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand-red font-bold text-2xl transition"
        >
          &times;
        </button>

        {/* Header Section */}
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-brand-red flex items-center gap-2">
            🧾 Order #{order.order_id}
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p><strong>Deliver To:</strong> {order.delivery_address}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="min-h-[150px]">
          {loading ? (
            <div className="flex justify-center items-center h-32 text-brand-orange font-bold">
              Loading Sweets...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-brand-cream text-brand-dark uppercase text-xs font-bold">
                <tr>
                  <th className="p-3 rounded-l-lg">Item Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3 rounded-r-lg">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="p-3 text-gray-500">₹{item.price}</td>
                    <td className="p-3 font-bold">x {item.quantity}</td>
                    <td className="p-3 font-bold text-brand-orange">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer: Totals & Status */}
        <div className="mt-6 border-t border-gray-100 pt-4 flex justify-between items-end">
          <div>
            <span className="text-xs text-gray-400 uppercase font-bold">Status</span>
            <div className={`mt-1 px-3 py-1 rounded-full text-sm font-bold inline-block
              ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {order.status.toUpperCase()}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-gray-500">Grand Total</span>
            <div className="text-3xl font-bold text-brand-red">₹ {order.total_amount}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
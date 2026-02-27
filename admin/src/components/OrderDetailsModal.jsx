import React, { useEffect, useState } from 'react';
import { X, MapPin, Phone, Mail, User } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${order.order_id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading items:", err);
        setLoading(false);
      });
  }, [order.order_id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <h2 className="text-2xl font-bold text-brand-red">Order #{order.order_id}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* 🚚 SUPER DETAILED CUSTOMER & SHIPPING INFO */}
        <div className="p-6 border-b border-gray-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Contact */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Customer Details</p>
            <div className="space-y-2">
              <p className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <User size={16} className="text-gray-400" /> {order.customer_name || "Guest User"}
              </p>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <Mail size={16} className="text-gray-400" /> {order.email}
              </p>
              {order.phone && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> +91 {order.phone}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Address */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Shipping Address</p>
            <div className="flex gap-2">
              <MapPin size={18} className="text-brand-red shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-gray-800">{order.flat_house}</p>
                {order.landmark && <p className="text-gray-500">Landmark: {order.landmark}</p>}
                <p>{order.delivery_area || order.delivery_address}</p>
                <p>{order.city}, {order.state} - <span className="font-bold text-gray-900">{order.pincode}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-400 font-bold py-8">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 font-bold py-8">No items found for this order.</p>
          ) : (
            <div className="bg-orange-50 rounded-xl overflow-hidden border border-orange-100">
              <table className="w-full text-left">
                <thead className="bg-orange-100 text-gray-800 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 bg-white">
                  {items.map((item, index) => {
                    const price = parseFloat(item.price_at_time) || 0;
                    const qty = parseInt(item.quantity) || 1;
                    const subtotal = price * qty;
                    return (
                      <tr key={index} className="hover:bg-orange-50/50 transition">
                        <td className="p-4 font-bold text-gray-800">
                          {item.product_name}
                          <span className="text-xs text-gray-400 block font-normal">{item.unit || 'kg'}</span>
                        </td>
                        <td className="p-4 text-gray-600">₹{price.toFixed(2)}</td>
                        <td className="p-4 font-bold text-gray-800">x {qty}</td>
                        <td className="p-4 text-right font-bold text-brand-red">₹{subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer & Totals */}
        <div className="p-6 bg-gray-50 flex justify-between items-end border-t border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-3">Status</span>
            <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider
              ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                'bg-blue-100 text-blue-700'}`}>
              {order.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Grand Total</p>
            <h3 className="text-3xl font-black text-brand-red">₹{parseFloat(order.total_amount).toFixed(2)}</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
import React, { useState } from 'react';
import { Search, MapPin, Truck, PackageCheck, AlertCircle, RefreshCcw, ShoppingBag } from 'lucide-react';

const TrackOrder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrders(null);
    setError('');
    
    const isEmail = searchValue.includes('@');
    const url = isEmail 
      ? `http://localhost:5000/api/orders/track?email=${searchValue}`
      : `http://localhost:5000/api/orders/track?order_id=${searchValue}`;

    setTimeout(async () => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          
          if(res.ok) {
              setOrders(data); 
          } else {
              setError(data.msg || "Order not found. Please verify your details.");
          }
        } catch (err) {
          console.error(err);
          setError("Server connection failed. Try again later.");
        } finally {
          setLoading(false);
        }
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans flex flex-col items-center justify-center p-6 py-12">
      <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-100 max-w-2xl w-full">
        
        {/* 🌟 HIDE FORM IF ORDERS ARE FOUND */}
        {!orders && !loading && (
          <>
            <div className="flex justify-center mb-8">
                <div className="bg-amber-100 text-amber-600 p-6 rounded-full shadow-inner">
                  <MapPin size={48} />
                </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-3 tracking-tighter text-center">Track Order</h2>
            <p className="text-lg text-gray-600 mb-10 text-center leading-relaxed font-medium">
              Enter your <span className="font-bold text-gray-900 bg-amber-100 px-2 py-0.5 rounded">Order ID</span> OR your <span className="font-bold text-gray-900 bg-amber-100 px-2 py-0.5 rounded">Email</span> to find your delivery.
            </p>
            
            <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <input required type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="e.g. 10001 or name@example.com" className="w-full p-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 bg-gray-50 focus:bg-white transition-colors font-medium text-center" />
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-5 rounded-2xl font-black text-white text-2xl bg-red-800 hover:bg-red-900 transition shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:scale-100">
                    <Search size={28}/> Find My Order
                </button>
            </form>
          </>
        )}

        {/* 🚚 ANIMATION */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-6">
             <Truck className="text-amber-500 w-24 h-24 animate-bounce drop-shadow-lg" />
             <p className="text-amber-900 font-black text-2xl animate-pulse tracking-wide">Fetching Delivery Details...</p>
          </div>
        )}

        {/* ❌ ERROR */}
        {error && !loading && (
            <div className="mt-8 bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex items-center gap-4 font-bold text-lg shadow-sm">
                <AlertCircle className="w-8 h-8 shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {/* ✅ THE DIGITAL RECEIPT VIEW */}
        {orders && !loading && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                  <h3 className="font-black text-3xl text-gray-800 tracking-tighter">Your Orders</h3>
                  <button onClick={() => setOrders(null)} className="flex items-center gap-2 text-amber-600 font-bold hover:bg-amber-50 px-4 py-2 rounded-xl transition-colors">
                    <RefreshCcw size={18} /> Search Again
                  </button>
                </div>

                {orders.map((order) => (
                    <div key={order.order_id} className="bg-white rounded-3xl p-8 border-2 border-amber-100 shadow-xl relative overflow-hidden">
                        <PackageCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-amber-500 opacity-5" />
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Order Number</p>
                              <p className="text-gray-900 font-black text-4xl tracking-tight">#{order.order_id}</p>
                            </div>
                            <span className={`inline-block px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm ${order.status === 'Pending' ? 'bg-amber-400 text-amber-950' : order.status === 'Delivered' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Items List */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
                          <h4 className="font-bold flex items-center gap-2 text-gray-800 mb-4 border-b border-gray-200 pb-2"><ShoppingBag size={18}/> Items Ordered</h4>
                          <div className="space-y-3">
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm font-medium text-gray-700">
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-300 font-black text-lg text-red-800">
                            <span>Total Amount</span>
                            <span>₹{order.total_amount}</span>
                          </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="text-sm text-gray-700 font-medium space-y-2 bg-amber-50 p-5 rounded-2xl border border-amber-100">
                            <p className="text-amber-900 font-black uppercase tracking-widest text-xs mb-3">Delivery Information</p>
                            <p><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                            <p><span className="text-gray-500">Phone:</span> +91 {order.phone}</p>
                            <p><span className="text-gray-500">Address:</span> {order.flat_house}, {order.delivery_address}, {order.landmark}</p>
                            <p><span className="text-gray-500">Location:</span> {order.delivery_city}, {order.state} - {order.pincode}</p>
                            <p className="pt-2 mt-2 border-t border-amber-200/50 text-amber-800 font-bold">
                              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
import React, { useState } from 'react';
import { Search, MapPin, Truck, PackageCheck, AlertCircle, RefreshCcw, ShoppingBag, Ban, XCircle, AlertTriangle, CheckCircle, Store, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🔥 NEW: Category Tab State
  const [activeTab, setActiveTab] = useState('active');
  
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const formatDate = (dateString) => {
    const safeDate = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const d = new Date(safeDate);
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase(); 
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrders(null);
    setError('');
    setActiveTab('active'); // Reset to active tab on new search
    
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

  const executeCancel = async () => {
    if (!orderToCancel) return;
    setCancelLoading(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderToCancel}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled by User' }) 
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o.order_id === orderToCancel ? { ...o, status: 'Cancelled by User' } : o));
        setSuccessModal(orderToCancel);
      } else {
        toast.error("Failed to cancel order. Please call support.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not cancel order.");
    } finally {
      setCancelLoading(false);
      setOrderToCancel(null); 
    }
  };

  // 🔥 NEW: Smart Order Sorting Engine
  const activeOrders = orders?.filter(o => o.status === 'Pending') || [];
  const completedOrders = orders?.filter(o => o.status === 'Delivered' || o.status === 'Out for Delivery') || [];
  const cancelledOrders = orders?.filter(o => o.status.includes('Cancel')) || [];

  const displayOrders = activeTab === 'active' ? activeOrders 
                      : activeTab === 'completed' ? completedOrders 
                      : cancelledOrders;

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans flex flex-col items-center justify-center p-6 py-12 relative">
      <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-100 max-w-2xl w-full relative z-10">
        
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

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-6">
             <Truck className="text-amber-500 w-24 h-24 animate-bounce drop-shadow-lg" />
             <p className="text-amber-900 font-black text-2xl animate-pulse tracking-wide">Fetching Delivery Details...</p>
          </div>
        )}

        {error && !loading && (
            <div className="mt-8 bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex items-center gap-4 font-bold text-lg shadow-sm">
                <AlertCircle className="w-8 h-8 shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {orders && !loading && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="font-black text-3xl text-gray-800 tracking-tighter">Your Orders</h3>
                  <button onClick={() => setOrders(null)} className="flex items-center gap-2 text-amber-600 font-bold hover:bg-amber-50 px-4 py-2 rounded-xl transition-colors">
                    <RefreshCcw size={18} /> Search Again
                  </button>
                </div>

                {/* 🔥 THE NEW CATEGORY TABS 🔥 */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto shadow-inner">
                  <button 
                    onClick={() => setActiveTab('active')} 
                    className={`flex-1 min-w-[100px] py-3 px-2 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'active' ? 'bg-white text-amber-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Clock size={16} /> Active <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{activeOrders.length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')} 
                    className={`flex-1 min-w-[120px] py-3 px-2 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'completed' ? 'bg-white text-green-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Truck size={16} /> Transit/Delivered <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">{completedOrders.length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('cancelled')} 
                    className={`flex-1 min-w-[100px] py-3 px-2 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'cancelled' ? 'bg-white text-red-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Ban size={16} /> Cancelled <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">{cancelledOrders.length}</span>
                  </button>
                </div>

                {/* 🔥 EMPTY STATE HANDLER 🔥 */}
                {displayOrders.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold text-lg">No {activeTab} orders found.</p>
                  </div>
                )}

                {/* THE MAPPED ORDERS LIST */}
                <div className="space-y-8">
                  {displayOrders.map((order) => (
                      <div key={order.order_id} className="bg-white rounded-3xl p-8 border-2 border-amber-100 shadow-xl relative overflow-hidden">
                          <PackageCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-amber-500 opacity-5" />
                          
                          <div className="flex justify-between items-start mb-6 relative z-10">
                              <div>
                                <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Order Number</p>
                                <p className="text-gray-900 font-black text-4xl tracking-tight">#{order.order_id}</p>
                              </div>
                              <span className={`inline-block px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm 
                                ${order.status === 'Pending' ? 'bg-amber-400 text-amber-950' : 
                                  order.status === 'Delivered' ? 'bg-green-600 text-white' : 
                                  order.status.includes('Cancel') ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-600 text-white'}`}>
                                  {order.status === 'Cancelled by User' ? 'Cancelled' : order.status}
                              </span>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 relative z-10">
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

                          <div className="text-sm text-gray-700 font-medium space-y-2 bg-amber-50 p-5 rounded-2xl border border-amber-100 relative z-10 mb-6">
                              <p className="text-amber-900 font-black uppercase tracking-widest text-xs mb-3">Delivery Information</p>
                              <p><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                              <p><span className="text-gray-500">Phone:</span> +91 {order.phone}</p>
                              <p><span className="text-gray-500">Address:</span> {order.flat_house}, {order.delivery_address}, {order.landmark}</p>
                              <p><span className="text-gray-500">Location:</span> {order.delivery_city}, {order.state} - {order.pincode}</p>
                              
                              <p className="pt-2 mt-2 border-t border-amber-200/50 text-amber-800 font-bold">Placed on {formatDate(order.created_at)}</p>
                          </div>

                          <div className="relative z-10 border-t border-gray-100 pt-6 mt-2">
                            {order.status === 'Cancelled by User' ? (
                              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-red-100 shadow-sm">
                                  <span className="flex items-center gap-2 font-black text-lg"><XCircle size={20} /> You Cancelled This Order</span>
                                  <span className="text-sm font-medium">You successfully cancelled this order. It will not be delivered.</span>
                              </div>
                            ) : order.status === 'Cancelled' || order.status === 'Cancelled by Admin' ? (
                              <div className="bg-gray-100 text-gray-700 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-gray-200 shadow-sm">
                                  <span className="flex items-center gap-2 font-black text-lg"><Store size={20} /> Cancelled by Shop</span>
                                  <span className="text-sm font-medium">The shop had to cancel this order. Please contact support.</span>
                              </div>
                            ) : order.status === 'Delivered' ? (
                              <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-green-100 shadow-sm">
                                  <span className="flex items-center gap-2 font-black text-lg"><PackageCheck size={20} /> Delivered Successfully</span>
                              </div>
                            ) : order.status === 'Out for Delivery' ? (
                              <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-orange-200 shadow-sm">
                                  <span className="flex items-center gap-2 font-black text-lg"><Truck size={22} className="animate-bounce" /> Cannot Cancel</span>
                                  <span className="text-sm font-bold">Your order is out for delivery! 🏡</span>
                              </div>
                            ) : (
                              <button onClick={() => setOrderToCancel(order.order_id)} className="w-full bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 p-4 rounded-2xl flex justify-center gap-2 font-black text-lg shadow-sm">
                                  <Ban size={20} /> Cancel My Order
                              </button>
                            )}
                          </div>
                      </div>
                  ))}
                </div>
            </div>
        )}
      </div>

      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center border border-gray-100">
              <div className="mx-auto flex justify-center items-center h-20 w-20 rounded-full bg-red-50 mb-6 border-4 border-red-100">
                <AlertTriangle size={36} className="text-red-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-500 mb-8 font-medium">Are you sure you want to cancel order #{orderToCancel}?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setOrderToCancel(null)} className="flex-1 px-4 py-4 bg-gray-100 text-gray-800 font-bold rounded-xl">Nevermind</button>
                <button 
                  onClick={executeCancel} 
                  disabled={cancelLoading} 
                  className="flex-1 px-4 py-4 bg-white text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 font-bold rounded-xl shadow-sm hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {cancelLoading ? 'Cancelling...' : <><Ban size={18} /> Yes, Cancel</>}
                </button>
              </div>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center border border-gray-100">
              <div className="mx-auto flex justify-center items-center h-24 w-24 rounded-full bg-green-50 mb-6 border-[6px] border-green-100">
                <CheckCircle size={48} className="text-green-500 animate-in zoom-in" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Successfully Cancelled</h3>
              <p className="text-gray-500 font-medium mb-8">Your order #{successModal} has been securely cancelled.</p>
              <button onClick={() => setSuccessModal(null)} className="w-full px-4 py-4 bg-gray-900 text-white font-black rounded-xl shadow-xl transition-transform hover:-translate-y-1">Okay, Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
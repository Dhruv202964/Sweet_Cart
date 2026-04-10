import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, QrCode, Loader2, AlertTriangle, Zap, Timer, AlertOctagon, Utensils, Truck, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const Payment = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(300); // 💣 5 Minutes
  
  // 🌟 NEW: UI State for Payment Tabs
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  const isPolling = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/track?order_id=${order_id}`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setOrder(data[0]);
          if (data[0].payment_status === 'Paid') setPaymentSuccess(true);
        } else {
          setError("Order not found or has been removed.");
        }
      } catch (err) { setError("Failed to fetch order details."); } 
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [order_id]);

  // 💣 TIMER ENGINE
  useEffect(() => {
    if (paymentSuccess || paymentFailed || !order) return;
    if (timeLeft <= 0) {
      handleAutoCancel(); 
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, paymentSuccess, paymentFailed, order]);

  // 💣 PAGE REFRESH INTERCEPTOR
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!paymentSuccess && !paymentFailed && order) {
        navigator.sendBeacon(`http://localhost:5000/api/orders/${order_id}/cancel-unpaid`);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [paymentSuccess, paymentFailed, order, order_id]);

  // 🚀 SAFE POLLING
  useEffect(() => {
    let pollInterval;
    if (order && !paymentSuccess && !paymentFailed) {
      pollInterval = setInterval(async () => {
        if (isPolling.current) return; 
        isPolling.current = true;
        try {
          const res = await fetch(`http://localhost:5000/api/orders/${order_id}/payment-status`);
          const data = await res.json();
          if (res.ok && data.payment_status === 'Paid') {
            setPaymentSuccess(true);
          } else if (res.status === 404) {
             setPaymentFailed(true);
          }
        } catch (err) { console.error(err); } 
        finally { isPolling.current = false; }
      }, 5000); 
    }
    return () => clearInterval(pollInterval); 
  }, [order, paymentSuccess, paymentFailed, order_id]);

  // 💣 DELETE FUNCTION
  const handleAutoCancel = async () => {
    setPaymentFailed(true);
    try {
      await fetch(`http://localhost:5000/api/orders/${order_id}/cancel-unpaid`, { method: 'POST' });
    } catch (err) { console.error("Cancel failed", err); }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="min-h-screen bg-[#FFFDF8] flex justify-center items-center"><Loader2 size={64} className="text-amber-500 animate-spin" /></div>;
  if (error) return <div className="min-h-screen bg-[#FFFDF8] flex justify-center items-center text-red-600 font-black text-2xl flex-col gap-4"><AlertTriangle size={64} className="animate-bounce" />{error}</div>;

  // 🚨 THE CANCELLED SCREEN
  if (paymentFailed) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 py-12">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-100 max-w-md w-full text-center animate-in zoom-in duration-300">
          <AlertOctagon className="text-red-500 w-24 h-24 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-2">Order Removed</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your session expired or was interrupted. Your ghost order has been safely removed from our system!
          </p>
          <button onClick={() => navigate('/menu')} className="w-full py-4 rounded-xl font-black text-white bg-gray-900 hover:bg-black transition-all">
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  // 🎉 THE GRAND SUCCESS SCREEN
  if (paymentSuccess) {
    const isSuratLocal = order?.delivery_city?.toLowerCase() === 'surat';

    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-green-50 max-w-xl w-full text-center animate-in zoom-in-95 duration-500 relative z-10">
          <CheckCircle className="text-green-500 w-28 h-28 mx-auto mb-6 drop-shadow-md animate-in zoom-in duration-700 delay-150" />
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Payment Successful!</h2>
          <p className="text-lg text-gray-500 mb-6 font-medium">Your transaction was securely verified.</p>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 mb-6 border border-green-100/50 shadow-inner">
            <p className="text-green-800 font-bold mb-1 uppercase text-xs tracking-widest opacity-80">Order Confirmed</p>
            <p className="text-green-950 font-black text-5xl tracking-tighter">#{order?.order_id}</p>
          </div>

          <div className="bg-[#F8FAFC] border border-blue-100 rounded-2xl p-5 mb-8 flex items-center gap-4 text-left shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Estimated Delivery Time</p>
              {isSuratLocal ? (
                 <p className="text-blue-700 font-black text-sm">⚡ Special 24-Hour Delivery (Surat)</p>
              ) : (
                 <p className="text-blue-700 font-black text-sm">📅 1 to 3 Business Days</p>
              )}
            </div>
          </div>
          
          <button onClick={() => navigate('/menu')} className="w-full py-5 rounded-2xl font-black text-white text-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/30 hover:-translate-y-1 flex items-center justify-center gap-3 mb-4">
            <Utensils size={24} /> Still hungry? Grab some more!
          </button>

          <button onClick={() => navigate('/track-order')} className="w-full py-4 rounded-2xl font-black text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all shadow-sm">
            Track My Order 🚚
          </button>
        </div>
      </div>
    );
  }

  // 💳 THE FINTECH PAYMENT GATEWAY UI
  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans flex flex-col items-center justify-center p-6 py-8 relative overflow-hidden">
      
      {/* 🚨 STRICT WARNING BANNER */}
      <div className="bg-red-600 text-white px-6 py-4 rounded-2xl flex items-center gap-4 mb-8 shadow-xl shadow-red-600/20 w-full max-w-md animate-in slide-in-from-top-4 duration-500">
        <AlertTriangle size={28} className="shrink-0 animate-pulse" />
        <div className="text-left">
          <p className="text-sm font-black tracking-wide uppercase">Do not refresh or close!</p>
          <p className="font-medium text-xs text-red-100 mt-0.5">Doing so will instantly remove your order.</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-gray-100 max-w-md w-full text-center relative z-10">
        
        {/* 💣 THE TIMER */}
        <div className="flex justify-center items-center gap-2 text-red-600 mb-6 bg-red-50 w-max mx-auto px-5 py-2 rounded-full border border-red-100 shadow-sm">
          <Timer size={18} strokeWidth={2.5} className={timeLeft < 60 ? "animate-ping" : ""} />
          <span className="text-lg font-black tracking-widest font-mono">
            {formatTime(timeLeft)}
          </span>
        </div>
        
        {/* 🌟 NEW: Payment Method Tabs */}
        <div className="flex gap-2 mb-6">
            <button onClick={() => setPaymentMethod('upi')} className={`flex-1 py-3 px-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-amber-100 text-amber-700 border border-amber-500' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'}`}>
                <QrCode size={18} /> UPI
            </button>
            <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 px-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-amber-100 text-amber-700 border border-amber-500' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'}`}>
                <CreditCard size={18} /> Card
            </button>
            <button onClick={() => setPaymentMethod('cod')} className={`flex-1 py-3 px-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'bg-amber-100 text-amber-700 border border-amber-500' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'}`}>
                <Banknote size={18} /> COD
            </button>
        </div>

        {/* 📱 UPI QR UI */}
        {paymentMethod === 'upi' && (
            <div className="animate-in fade-in duration-300 mb-6">
                <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight mb-2">Scan & Pay</h2>
                <p className="text-gray-500 font-medium mb-6 text-sm px-2">Open any UPI app to pay securely.</p>
                <div className="relative inline-block">
                    <div className="relative border-[3px] border-gray-100 bg-white p-4 rounded-[30px] shadow-sm overflow-hidden group">
                        <div className="absolute left-0 right-0 h-1 bg-amber-500 shadow-[0_0_20px_5px_rgba(245,158,11,0.6)] animate-bounce z-20 pointer-events-none" style={{ animationDuration: '3s' }}></div>
                        <div className="bg-white rounded-2xl overflow-hidden flex justify-center items-center relative z-10">
                            <img src="/payment-qr.jpg" alt="Scan to Pay" className="w-40 h-40 object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Insert+QR+Here'; }}/>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 💳 CREDIT CARD UI */}
        {paymentMethod === 'card' && (
            <div className="animate-in fade-in duration-300 text-left space-y-4 mb-6">
                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 font-bold text-gray-800 tracking-widest outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength="5" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 font-bold text-gray-800 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">CVV</label>
                        <input type="password" placeholder="•••" maxLength="3" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-amber-500 font-bold text-center text-gray-800 outline-none transition-all" />
                    </div>
                </div>
            </div>
        )}

        {/* 💵 COD UI */}
        {paymentMethod === 'cod' && (
            <div className="animate-in fade-in duration-300 bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 text-center mb-6">
                <Banknote size={48} className="text-orange-500 mx-auto mb-3" />
                <h3 className="font-black text-lg text-gray-800">Cash on Delivery</h3>
                <p className="text-gray-600 font-medium text-sm mt-2">Please keep exact change ready at the time of delivery.</p>
            </div>
        )}

        {/* 💳 Dark Mode Amount Card */}
        <div className="bg-gradient-to-br from-[#2a1100] to-[#1a0a00] rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-8">
          <p className="text-xs font-bold text-amber-500/80 mb-1 uppercase tracking-widest flex items-center justify-center gap-1">
            <Zap size={14} /> Total Amount Due
          </p>
          <p className="text-5xl font-black text-white tracking-tighter">
            ₹{order?.total_amount}
          </p>
        </div>

        {/* 🚀 Active Listening Indicator (Always running!) */}
        <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl flex items-center justify-center gap-3">
           <div className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
           </div>
           <span className="text-sm font-bold text-amber-900 tracking-wide">
             Waiting for admin approval...
           </span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
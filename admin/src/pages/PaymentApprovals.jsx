import React, { useEffect, useState } from 'react';
import { XCircle, Clock, Smartphone, User, ShoppingBag, Loader2, CheckCircle, Timer, ShieldAlert, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

// ⏱️ THE LIVE COUNTDOWN ENGINE
const LiveTimer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const expireTime = new Date(createdAt).getTime() + 5 * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.floor((expireTime - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTime());
    const timerId = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timerId);
  }, [createdAt]);

  if (timeLeft <= 0) return (
    <div className="flex justify-center mb-3">
      <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse shadow-sm">
        <ShieldAlert size={14}/> Expired
      </span>
    </div>
  );

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  const isUrgent = timeLeft < 60;
  
  return (
    <div className="flex justify-center mb-3">
      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border shadow-sm transition-all ${
        isUrgent ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-amber-50/80 text-amber-600 border-amber-200'
      }`}>
        <Timer size={14} className={isUrgent ? 'text-rose-500' : 'text-amber-500'} />
        {m}:{s}
      </span>
    </div>
  );
};

const PaymentApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 EXPAND STATE
  const [expandedId, setExpandedId] = useState(null);
  
  // 🛑 NEW: BEAUTIFUL CUSTOM MODAL STATE
  const [orderToReject, setOrderToReject] = useState(null);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/pending-approvals');
      const data = await res.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setApprovals(sortedData);
    } catch (err) {
      toast.error("Failed to load approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/approve-payment`, { method: 'PUT' });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.order_id !== id));
        toast.success(`Order #${id} Paid & Moved to Active Queue! 💰`);
      }
    } catch (err) { toast.error("Approval failed."); }
  };

  // 🚀 NEW: THE ACTUAL REJECT FUNCTION CALLED BY THE MODAL
  const executeReject = async () => {
    if (!orderToReject) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderToReject}/cancel-unpaid`, { method: 'POST' });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.order_id !== orderToReject));
        toast.error(`Order #${orderToReject} Rejected & Cancelled. ❌`);
      }
    } catch (err) { 
      toast.error("Rejection failed."); 
    } finally {
      setOrderToReject(null); // Close modal
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prevId => prevId === id ? null : id);
  };

  if (loading) return <div className="p-8 flex justify-center mt-20"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans bg-[#FDFCFB] min-h-screen relative">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-[#0B132B] tracking-tight flex items-center gap-2 mb-2">
          <Zap className="text-amber-500 fill-amber-500" size={32} /> Verify Payments
        </h1>
        <p className="text-slate-500 font-medium mb-4">Review and authorize incoming customer transactions.</p>
        
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200">
           <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-xs tracking-widest uppercase text-slate-700">Auto-Syncing</span>
        </div>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 min-h-[40vh]">
          <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Queue is Clear</h3>
          <p className="text-slate-500 font-medium mt-2 max-w-sm">All pending transactions have been successfully reviewed and processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {approvals.map(order => {
            const isExpanded = expandedId === order.order_id;
            
            return (
              <div 
                key={order.order_id} 
                onClick={() => toggleExpand(order.order_id)}
                className="bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col cursor-pointer"
              >
                <div className="p-7 pb-5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-[1rem] flex items-center justify-center shadow-sm shrink-0">
                      <User size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#0B132B] tracking-tight leading-tight">{order.customer_name}</h3>
                      <div className="flex items-center flex-wrap gap-2 text-slate-500 font-medium text-[13px] mt-1">
                        <span className="flex items-center gap-1.5"><Smartphone size={14} /> {order.phone}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(order.created_at).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Amount Due</p>
                    <p className="text-4xl font-black text-[#0B132B] tracking-tighter">₹{order.total_amount}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-[#F8FAFC] border-t border-b border-slate-100 p-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag size={14} className="text-slate-400"/> Order Contents
                      </p>
                      <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full shadow-sm">
                        ID: #{order.order_id}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                          <span className="bg-slate-100 text-slate-600 text-xs font-black px-2 py-1 rounded-md">{item.quantity}x</span> 
                          <span className="text-sm font-bold text-slate-800 leading-snug">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div 
                  className="p-6 pt-4 bg-white"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <LiveTimer createdAt={order.created_at} />

                  <div className="flex gap-4">
                    {/* 🛑 NEW: OPENS THE CUSTOM MODAL INSTEAD OF BROWSER POPUP */}
                    <button 
                      onClick={() => setOrderToReject(order.order_id)}
                      className="flex-1 py-3.5 bg-white text-rose-500 font-black tracking-widest uppercase text-xs rounded-xl flex justify-center items-center gap-2 transition-all border-2 border-rose-100 hover:bg-rose-50 hover:border-rose-200"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => handleApprove(order.order_id)}
                      className="flex-[2] py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-black tracking-widest uppercase text-sm rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={18} strokeWidth={3} /> Authorize
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 🛑 BEAUTIFUL CUSTOM REJECT MODAL */}
      {orderToReject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-rose-50 mb-6 shadow-inner">
                <XCircle size={40} className="text-rose-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-[#0B132B] mb-2 tracking-tight">Decline Order #{orderToReject}?</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
                Are you absolutely sure? This will permanently cancel the transaction and the customer will need to order again.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setOrderToReject(null)}
                  className="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black tracking-widest uppercase text-xs rounded-xl transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={executeReject}
                  className="flex-[1.5] px-4 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black tracking-widest uppercase text-xs rounded-xl shadow-lg shadow-rose-500/30 transition-all flex justify-center items-center gap-2"
                >
                  Yes, Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentApprovals;
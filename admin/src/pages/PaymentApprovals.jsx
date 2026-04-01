import React, { useEffect, useState } from 'react';
import { IndianRupee, XCircle, Clock, Smartphone, User, ShoppingBag, Loader2, CheckCircle, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

// ⏱️ THE LIVE COUNTDOWN ENGINE
const LiveTimer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      // 5 Minutes (300,000 ms) from the exact moment the order was created
      const expireTime = new Date(createdAt).getTime() + 5 * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.floor((expireTime - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTime());
    const timerId = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timerId);
  }, [createdAt]);

  if (timeLeft <= 0) return <span className="text-red-600 font-black animate-pulse">Expired</span>;

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  
  return (
    <span className={`font-mono font-black tracking-widest ${timeLeft < 60 ? 'text-red-600 animate-ping' : 'text-amber-600'}`}>
      {m}:{s}
    </span>
  );
};

const PaymentApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/pending-approvals');
      const data = await res.json();
      
      // 🚀 FIX: Sort so the NEWEST orders are always at the TOP!
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

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel-unpaid`, { method: 'POST' });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.order_id !== id));
        toast.error(`Order #${id} Rejected & Cancelled. ❌`);
      }
    } catch (err) { toast.error("Rejection failed."); }
  };

  if (loading) return <div className="p-8 flex justify-center mt-20"><Loader2 className="animate-spin text-brand-red w-12 h-12" /></div>;

  return (
    <div className="p-8 bg-orange-50 min-h-screen relative">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <Clock className="text-amber-500 animate-pulse" size={32} /> Payment Approvals
        </h2>
        <p className="text-gray-500 font-medium mt-1">Review and approve customer transactions waiting in the queue.</p>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <CheckCircle className="text-green-400 w-20 h-20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">All Caught Up!</h3>
          <p className="text-gray-500">There are no pending payments waiting for approval right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {approvals.map(order => (
            <div key={order.order_id} className="bg-white rounded-[24px] shadow-lg border border-amber-100 overflow-hidden relative group transition-all hover:shadow-xl hover:-translate-y-1">
              
              <div className="bg-amber-50/50 p-6 border-b border-amber-100 flex justify-between items-start">
                <div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                    Order #{order.order_id}
                  </span>
                  <div className="flex items-center gap-2 text-gray-900 font-black text-xl mb-1">
                    <User size={20} className="text-amber-600" /> {order.customer_name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Smartphone size={16} /> {order.phone}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  {/* ⏱️ THE LIVE TIMER BADGE */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-red-100">
                    <Timer size={14} className="text-red-500" />
                    <LiveTimer createdAt={order.created_at} />
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cart Amount</p>
                    <p className="text-3xl font-black text-brand-red">₹{order.total_amount}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <ShoppingBag size={14} /> Items Ordered
                </p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 max-h-32 overflow-y-auto custom-scrollbar shadow-inner">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-700">
                      <span><span className="text-amber-600 mr-2">{item.quantity}x</span> {item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button 
                  onClick={() => handleReject(order.order_id)}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors border border-red-200 shadow-sm hover:shadow-md"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(order.order_id)}
                  className="flex-[2] py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
                >
                  <IndianRupee size={20} /> Approve Payment
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;
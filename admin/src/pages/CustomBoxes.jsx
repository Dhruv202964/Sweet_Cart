import React, { useState, useEffect } from 'react';
import { PackagePlus, Loader2, CheckCircle, Clock, ChevronDown, ChevronUp, PackageCheck, User, Phone, MapPin, Receipt, XCircle, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomBoxes = () => {
  const [boxOrders, setBoxOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchBoxes = () => {
    fetch('http://localhost:5000/api/orders/custom-boxes')
      .then(res => res.json())
      .then(data => {
        setBoxOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch custom boxes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Box #${orderId} marked as ${newStatus}!`);
        fetchBoxes(); 
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error updating status.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 🚀 Added "Cancelled" to the filtering logic
  const filteredBoxes = filter === 'All' 
    ? boxOrders 
    : boxOrders.filter(box => {
        if (filter === 'Cancelled') {
          return box.status.includes('Cancelled');
        }
        return box.status === filter;
      });

  // 🚀 CLEANS UP BAD DATABASE NAMES ("undefined undefined")
  const getCleanName = (name) => {
    if (!name || name.trim() === 'undefined undefined' || name.trim() === '') {
      return "Guest Customer";
    }
    return name;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>;

  return (
    <div className="p-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <PackagePlus className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Custome Box Queue</h1>
            <p className="text-gray-500 font-medium">Manage, track, and pack custom orders.</p>
          </div>
        </div>

        {/* 🚀 UPGRADED FILTER TABS INCLUDES CANCELLED */}
        <div className="flex flex-wrap bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 gap-1">
          {['All', 'Pending', 'Packed', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                filter === status 
                ? (status === 'Cancelled' ? 'bg-red-500 text-white shadow-md' : 'bg-amber-500 text-white shadow-md') 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredBoxes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <span className="text-6xl mb-4 block opacity-40">📦</span>
          <h3 className="text-2xl font-black text-gray-800">No {filter !== 'All' ? filter : ''} Boxes Found</h3>
          <p className="text-gray-500 mt-2 font-medium">Your queue is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBoxes.map((box) => {
            const isDelivered = box.status === 'Delivered';
            const isCancelled = box.status.includes('Cancelled');
            const isLocked = isDelivered || isCancelled;

            return (
              <div key={box.order_id} className={`bg-white rounded-[24px] shadow-sm border transition-all duration-300 hover:shadow-md ${isCancelled ? 'border-red-100 opacity-80' : 'border-gray-200'}`}>
                
                {/* 🚀 REDESIGNED COMPACT HEADER (FIXED EMPTY SPACE) */}
                <div 
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer bg-transparent hover:bg-gray-50 rounded-[24px] transition-colors"
                  onClick={() => toggleExpand(box.order_id)}
                >
                  
                  {/* Column 1: ID & Weight */}
                  <div className="flex items-center gap-4 min-w-[150px]">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border ${isCancelled ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      #{box.order_id}
                    </div>
                    <span className="text-xs font-black bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg tracking-widest uppercase">
                      {box.box_size}
                    </span>
                  </div>

                  {/* Column 2: Customer Info (Fills the center!) */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-gray-800">
                      <User size={16} className="text-gray-400" />
                      <h3 className="font-bold text-base truncate">{getCleanName(box.customer_name)}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{box.phone || 'No Phone'}</span>
                    </div>
                  </div>

                  {/* Column 3: Status & Expand */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[200px]">
                    
                    {/* STATUS DROPDOWN (LOCKED IF DELIVERED OR CANCELLED) */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      {isLocked ? (
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 ${isCancelled ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {isCancelled ? <Ban size={16}/> : <CheckCircle size={16}/>}
                          {isCancelled ? 'Cancelled' : 'Delivered'}
                        </div>
                      ) : (
                        <select 
                          value={box.status}
                          onChange={(e) => handleStatusChange(box.order_id, e.target.value)}
                          className={`font-bold text-sm px-4 py-2.5 rounded-xl border-2 cursor-pointer outline-none transition-colors appearance-none pr-10 ${
                            box.status === 'Packed' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:border-blue-400' : 
                            'bg-orange-50 text-orange-700 border-orange-200 focus:border-orange-400'
                          }`}
                        >
                          <option value="Pending">🕒 Pending</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Out for Delivery">🚚 Out for Delivery</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                      )}
                    </div>

                    <div className={`p-2 rounded-full transition-colors ${expandedId === box.order_id ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {expandedId === box.order_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* 🚀 REDESIGNED CREATIVE EXPANDED VIEW */}
                {expandedId === box.order_id && (
                  <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 rounded-b-[24px]">
                    <div className="flex flex-col lg:flex-row gap-8">
                      
                      {/* Left Side: Packing Slip */}
                      <div className="lg:w-2/3 bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-200 relative overflow-hidden">
                        {/* Decorative Top Border */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${isCancelled ? 'bg-red-400' : 'bg-amber-400'}`}></div>
                        
                        <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-dashed border-gray-100">
                          <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <Receipt className="text-amber-500"/> Official Packing Slip
                          </h4>
                          <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-md text-xs uppercase tracking-wider border border-gray-200">
                            Box Cap: {box.box_size}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {box.packing_list.split(',').map((item, idx) => {
                            const itemParts = item.trim().split(' ');
                            const weight = itemParts[0];
                            const name = itemParts.slice(1).join(' ');

                            return (
                              <div key={idx} className="flex items-center gap-4 bg-gray-50/80 hover:bg-amber-50/50 transition-colors p-4 rounded-xl border border-gray-100">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-sm ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-amber-400 to-orange-400 text-white'}`}>
                                  {idx + 1}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-black text-gray-900 text-base leading-tight">{name}</span>
                                  <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${isCancelled ? 'text-red-500' : 'text-amber-600'}`}>Portion: {weight}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Side: Delivery Details Card */}
                      <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 h-full">
                          <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Truck className="text-blue-500"/> Logistics
                          </h4>
                          
                          <div className="mb-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={14}/> Destination</p>
                            <p className="text-sm font-bold text-gray-800 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                              {box.delivery_address}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={14}/> Timestamp</p>
                            <p className="text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                              {new Date(box.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomBoxes;
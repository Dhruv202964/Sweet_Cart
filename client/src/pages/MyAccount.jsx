import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Package, MapPin, LogOut, ShieldAlert, Trash2, AlertTriangle, PackageCheck, ShieldCheck, Edit3, Save, X, LayoutDashboard, CheckCircle } from 'lucide-react';

const MyAccount = () => {
  const { user, logout, isAuthenticated, updateContextUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // 🌟 Premium Success Banner State
  const [successMessage, setSuccessMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '', email: '', phone: '' 
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '' 
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.email) {
      const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch(`http://localhost:5000/api/orders/track?email=${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (err) {
          console.error("Failed to fetch user orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [activeTab, user]);

  const handleDeleteAccount = async () => {
    alert("Backend delete API will go here! For now, logging you out...");
    logout();
    navigate('/');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSuccessMessage(''); // Clear any old messages
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          full_name: editForm.full_name,
          email: editForm.email,
          phone: editForm.phone 
        })
      });

      const data = await res.json();
      if (res.ok) {
        if(updateContextUser) updateContextUser(data.user); 
        setIsEditing(false);
        
        // 🌟 NO MORE ALERTS! Beautiful inline success message instead.
        setSuccessMessage("Profile updated successfully! 🎉");
        setTimeout(() => setSuccessMessage(''), 4000); // Disappears after 4 seconds
      } else {
        alert(data.msg || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600 shadow-inner">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">My Account</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your SweetCart profile and orders.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 📱 Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-amber-100 flex flex-col gap-2 sticky top-24">
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <User size={20} /> Personal Details
              </button>
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Package size={20} /> Order History
              </button>
              <button onClick={() => setActiveTab('addresses')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <MapPin size={20} /> Saved Addresses
              </button>
              
              {user.role === 'admin' && (
                <>
                  <div className="my-2 border-t border-gray-100"></div>
                  <button onClick={() => navigate('/admin')} className="flex items-center gap-3 p-4 rounded-2xl font-black bg-gradient-to-r from-gray-900 to-black text-amber-500 hover:from-black hover:to-gray-900 transition-all shadow-md">
                    <LayoutDashboard size={20} /> Admin Dashboard
                  </button>
                </>
              )}
              
              <div className="my-2 border-t border-gray-100"></div>
              
              <button onClick={logout} className="flex items-center gap-3 p-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>

          {/* 🖥️ Main Content Area */}
          <div className="lg:w-3/4">
            
            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-amber-100 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-amber-100 pb-5 mb-8">
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Personal Details</h2>
                  
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>

                {/* 🌟 PREMIUM SUCCESS BANNER */}
                {successMessage && (
                  <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <CheckCircle size={24} className="text-green-500" />
                    {successMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  
                  <div className={`p-6 rounded-2xl border ${isEditing ? 'bg-white border-amber-300 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" name="full_name" value={editForm.full_name} onChange={handleEditChange} className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" />
                    ) : (
                      <p className="text-xl font-black text-gray-900">{user.full_name}</p>
                    )}
                  </div>

                  <div className={`p-6 rounded-2xl border ${isEditing ? 'bg-white border-amber-300 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                    {isEditing ? (
                      <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" />
                    ) : (
                      <p className="text-xl font-black text-gray-900">{user.email}</p>
                    )}
                  </div>

                  <div className={`p-6 rounded-2xl border ${isEditing ? 'bg-white border-amber-300 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Number</label>
                    {isEditing ? (
                      <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Add mobile number" className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" />
                    ) : (
                      <p className={`text-xl font-black ${user.phone ? 'text-gray-900' : 'text-gray-400 italic'}`}>{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex items-end">
                      <button onClick={handleSaveProfile} disabled={savingProfile} className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-black text-lg p-4 rounded-2xl hover:bg-amber-700 transition-all shadow-md disabled:opacity-70">
                        <Save size={20} /> {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                  
                  {!isEditing && user.role === 'admin' && (
                    <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-lg relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                      <div className="z-10">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">System Clearance</p>
                        <p className="text-xl font-black text-white tracking-tight">VIP Administrator Access</p>
                      </div>
                      <ShieldCheck size={40} className="text-amber-400 z-10 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                    </div>
                  )}
                </div>

                {/* 🚨 DANGER ZONE */}
                <div className="mt-16 pt-8 border-t-2 border-dashed border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-3 rounded-full text-red-600 mt-1">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-gray-600 font-medium mb-6">
                        Once you delete your account, there is no going back. All your order history and saved addresses will be permanently wiped.
                      </p>
                      <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 hover:border-red-600 transition-colors">
                        <Trash2 size={18} /> Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tighter ml-2">Recent Orders</h2>
                
                {loadingOrders ? (
                  <div className="bg-white p-10 rounded-3xl shadow-sm border border-amber-100 text-center">
                    <p className="text-amber-600 font-bold animate-pulse">Loading your delicious history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-16 rounded-[35px] shadow-xl border border-amber-100 text-center flex flex-col items-center">
                    <Package size={64} className="text-gray-300 mb-4" />
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No orders yet!</h3>
                    <p className="text-gray-500 mb-8">You haven't placed any orders with this account.</p>
                    <button onClick={() => navigate('/menu')} className="bg-amber-600 text-white font-black px-8 py-4 rounded-xl hover:bg-amber-700 transition-colors">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.order_id} className="bg-white rounded-3xl p-6 md:p-8 border border-amber-100 shadow-md relative overflow-hidden transition hover:shadow-xl">
                        <PackageCheck className="absolute -right-8 -bottom-8 w-40 h-40 text-amber-500 opacity-5" />
                        
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                          <div>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Order ID</p>
                            <p className="text-2xl font-black text-gray-900">#{order.order_id}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {order.status}
                            </span>
                            <p className="text-xs text-gray-500 font-bold mt-2">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-medium text-gray-700">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl font-black text-lg text-red-800 border border-gray-100">
                          <span>Total Paid</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- ADDRESSES TAB (Placeholder) --- */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-amber-100 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-amber-100 pb-5 mb-8">
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Saved Addresses</h2>
                  <button className="text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors">+ Add New</button>
                </div>
                
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
                  <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">You don't have any saved addresses yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Check "Save this address" during your next checkout!</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 🚨 THE BEAUTIFUL DELETE CONFIRMATION MODAL 🚨 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[35px] shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-100 p-5 rounded-full text-red-600 mb-4 shadow-inner">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Delete Account?</h3>
              <p className="text-gray-600 font-medium mt-2">
                This action is <span className="text-red-600 font-bold">permanent</span> and cannot be undone. All your data will be erased.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                To confirm, type <span className="text-red-600 font-black tracking-widest">DELETE</span> below:
              </label>
              <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="Type DELETE" className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 font-black text-center text-red-600 tracking-widest transition-colors" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmation(''); }} className="flex-1 py-4 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button disabled={deleteConfirmation !== 'DELETE'} onClick={handleDeleteAccount} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Permanently Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyAccount;
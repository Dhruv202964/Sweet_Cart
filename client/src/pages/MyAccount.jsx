import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Package, MapPin, LogOut, ShieldAlert, Trash2, AlertTriangle, PackageCheck, ShieldCheck, Edit3, Save, X, LayoutDashboard, CheckCircle, Clock, Truck, Ban, ShoppingBag, XCircle, Home as HomeIcon, Briefcase, Plus } from 'lucide-react';

const MyAccount = () => {
  const { user, logout, isAuthenticated, updateContextUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🌟 BEAUTIFUL TOAST NOTIFICATION STATE
  const [toast, setToast] = useState(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [orderTab, setOrderTab] = useState('active'); 
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // 🌟 ADDRESS BOOK STATE 
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  // 🌟 Editing State
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    address_type: 'Home', full_name: '', phone: '', flat_house: '', area_street: '', landmark: '', city: '', state: '', pincode: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', email: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  // 🌟 MAGIC TOAST FUNCTION
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setEditForm({ full_name: user.full_name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.email) fetchMyOrders();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'addresses' && user?.user_id) fetchAddresses();
  }, [activeTab, user]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/track?email=${user.email}`);
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${user.user_id}`);
      if (res.ok) setAddresses(await res.json());
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/delete/${user.user_id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteModal(false);
        logout(); 
        navigate('/'); 
      } else {
        const data = await res.json();
        showToast(data.msg || "Failed to delete account.", 'error');
      }
    } catch (err) {
      showToast("Server connection failed.", 'error');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingOrder(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: 'Cancelled by User' })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: 'Cancelled by User' } : o));
        showToast("Order cancelled successfully.", 'success');
      } else {
        showToast("Could not cancel the order.", 'error');
      }
    } catch (err) {
      showToast("Server error while cancelling order.", 'error');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, ...editForm })
      });
      const data = await res.json();
      if (res.ok) {
        if(updateContextUser) updateContextUser(data.user); 
        setIsEditing(false);
        showToast("Profile updated successfully! ✨", 'success');
      } else {
        showToast(data.msg || "Failed to update profile.", 'error');
      }
    } catch (err) {
      showToast("Server connection failed.", 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEditClick = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      address_type: address.address_type,
      full_name: address.full_name,
      phone: address.phone,
      flat_house: address.flat_house,
      area_street: address.area_street,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({ address_type: 'Home', full_name: '', phone: '', flat_house: '', area_street: '', landmark: '', city: '', state: '', pincode: '' });
  };

  // 🌟 UPGRADED TOAST-POWERED SAVE FUNCTION
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const url = editingAddressId 
        ? `http://localhost:5000/api/addresses/update/${editingAddressId}` 
        : 'http://localhost:5000/api/addresses/add';
      
      const method = editingAddressId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressForm, user_id: user.user_id })
      });
      
      // 🚨 SILENT BUG CATCHER
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Backend route missing! Check your server.js file for /api/addresses");
      }

      const data = await res.json();
      if (res.ok) {
        if (editingAddressId) {
          setAddresses(addresses.map(a => a.id === editingAddressId ? data.address : a));
          showToast(`Beautiful! Your address was updated in the ${addressForm.address_type} section. ✨`, 'success');
        } else {
          setAddresses([...addresses, data.address]);
          showToast(`Success! Address added in the ${addressForm.address_type} section. 🏠`, 'success');
        }
        resetAddressForm();
      } else {
        showToast(data.msg || "Failed to save address.", 'error');
      }
    } catch (err) {
      showToast(err.message.includes("Backend route") ? err.message : "Server error while saving address.", 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Remove this address from your account?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/delete/${addressId}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== addressId));
        showToast("Address completely removed. 🗑️", 'success');
      } else {
        showToast("Failed to delete address.", 'error');
      }
    } catch (err) {
      showToast("Server error. Could not delete.", 'error');
    }
  };

  const handleAddressChange = (e) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const homeAddress = addresses.find(a => a.address_type === 'Home');
  const workAddress = addresses.find(a => a.address_type === 'Work');
  const otherAddresses = addresses.filter(a => a.address_type === 'Other');

  const DottedAddCard = ({ type, text, subtext, Icon }) => (
    <div onClick={() => { resetAddressForm(); setAddressForm(prev => ({...prev, address_type: type})); setShowAddressForm(true); }} className="w-full flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-3xl p-6 hover:bg-gray-50 hover:border-amber-300 transition-colors cursor-pointer group animate-in zoom-in-95 duration-300">
        <div className="bg-gray-100 p-4 rounded-full text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-500 transition-colors">
            <Icon size={24} />
        </div>
        <div>
            <p className="font-bold text-gray-700">{text}</p>
            <p className="text-sm text-gray-500 font-medium">{subtext}</p>
        </div>
        <Plus size={24} className="ml-auto text-gray-300 group-hover:text-amber-500 transition-colors" />
    </div>
  );

  const AddressCard = ({ address, isCategorized = false }) => (
    <div key={address.id} className={`bg-white border-2 border-gray-100 rounded-[24px] p-6 relative group hover:border-amber-200 transition-colors shadow-sm hover:shadow-md ${isCategorized ? 'w-full md:w-1/2' : ''}`}>
        <div className="absolute top-6 right-6 flex gap-2">
            <button onClick={() => handleEditClick(address)} className="text-gray-300 hover:text-amber-500 transition-colors"><Edit3 size={20} /></button>
            <button onClick={() => handleDeleteAddress(address.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${address.address_type === 'Home' ? 'bg-blue-50 text-blue-500' : address.address_type === 'Work' ? 'bg-purple-50 text-purple-500' : 'bg-gray-100 text-gray-600'}`}>
                {address.address_type === 'Home' ? <HomeIcon size={20} /> : address.address_type === 'Work' ? <Briefcase size={20} /> : <MapPin size={20} />}
            </div>
            <h3 className="font-black text-gray-800 text-lg uppercase tracking-wider">{address.address_type}</h3>
        </div>
        <p className="font-bold text-gray-900 mb-1">{address.full_name}</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">
            {address.flat_house}, {address.area_street} {address.landmark ? `(${address.landmark})` : ''}<br />
            {address.city}, {address.state} {address.pincode}
        </p>
        <p className="text-gray-900 font-bold text-sm bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">📞 {address.phone}</p>
    </div>
  );

  const activeOrders = orders?.filter(o => o.status === 'Pending') || [];
  const completedOrders = orders?.filter(o => o.status === 'Delivered' || o.status === 'Out for Delivery') || [];
  const cancelledOrders = orders?.filter(o => o.status.includes('Cancel')) || [];
  const displayOrders = orderTab === 'active' ? activeOrders : orderTab === 'completed' ? completedOrders : cancelledOrders;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] via-amber-50/40 to-orange-50/30 font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-200 relative">
      
      {/* 🌟 BEAUTIFUL TOAST NOTIFICATION RENDERER 🌟 */}
      {toast && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white shadow-green-500/30' : 'bg-red-600 text-white shadow-red-500/30'}`}>
          {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <p className="font-bold tracking-wide">{toast.message}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center gap-5 animate-in slide-in-from-left-8 duration-500">
          <div className="bg-gradient-to-tr from-amber-400 to-orange-300 p-4 rounded-3xl text-white shadow-lg shadow-amber-500/20"><User size={40} /></div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">My Account</h1>
            <p className="text-gray-500 font-bold mt-1 tracking-wide uppercase text-sm">Manage your SweetCart universe.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[30px] shadow-xl shadow-gray-200/50 border border-white flex flex-col gap-2 sticky top-24 z-10">
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'profile' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><User size={20} /> Personal Details</button>
              <button onClick={() => { setActiveTab('orders'); setOrderTab('active'); }} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'orders' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><Package size={20} /> Order History</button>
              <button onClick={() => setActiveTab('addresses')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'addresses' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><MapPin size={20} /> Saved Addresses</button>
              {user.role === 'admin' && (
                <><div className="my-2 border-t border-gray-100/50"></div><button onClick={() => navigate('/admin')} className="group flex items-center gap-3 p-4 rounded-2xl font-black bg-gradient-to-r from-gray-900 to-gray-800 text-amber-400 hover:from-black hover:to-gray-900 transition-all shadow-lg hover:shadow-gray-900/30 overflow-hidden relative"><div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div><LayoutDashboard size={20} className="relative z-10" /> <span className="relative z-10">Admin Dashboard</span></button></>
              )}
              <div className="my-2 border-t border-gray-100/50"></div>
              <button onClick={logout} className="flex items-center gap-3 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"><LogOut size={20} /> Sign Out</button>
            </div>
          </div>

          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-white animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex justify-between items-center pb-6 mb-8 border-b border-gray-100">
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Profile Details</h2>
                  {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100/50 px-5 py-2.5 rounded-xl hover:bg-amber-100 transition-colors"><Edit3 size={16} /> Edit Profile</button> : <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"><X size={16} /> Cancel</button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className={`p-6 rounded-[24px] border-2 transition-all duration-300 ${isEditing ? 'bg-white border-amber-300 shadow-md' : 'bg-gray-50/50 border-transparent hover:border-gray-200'}`}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    {isEditing ? <input type="text" name="full_name" value={editForm.full_name} onChange={handleEditChange} className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" /> : <p className="text-xl font-black text-gray-900">{user.full_name}</p>}
                  </div>
                  <div className={`p-6 rounded-[24px] border-2 transition-all duration-300 ${isEditing ? 'bg-white border-amber-300 shadow-md' : 'bg-gray-50/50 border-transparent hover:border-gray-200'}`}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                    {isEditing ? <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" /> : <p className="text-xl font-black text-gray-900">{user.email}</p>}
                  </div>
                  <div className={`p-6 rounded-[24px] border-2 transition-all duration-300 ${isEditing ? 'bg-white border-amber-300 shadow-md' : 'bg-gray-50/50 border-transparent hover:border-gray-200'}`}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                    {isEditing ? <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Add mobile number" className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-amber-500 focus:outline-none pb-1" /> : <p className={`text-xl font-black ${user.phone ? 'text-gray-900' : 'text-gray-400 italic'}`}>{user.phone || 'Not provided'}</p>}
                  </div>
                  {isEditing && <div className="flex items-end"><button onClick={handleSaveProfile} disabled={savingProfile} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg p-5 rounded-[24px] hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all disabled:opacity-70"><Save size={20} /> {savingProfile ? 'Saving...' : 'Save Changes'}</button></div>}
                  {!isEditing && user.role === 'admin' && (
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-[24px] border border-gray-700 flex items-center justify-between shadow-xl relative overflow-hidden group"><div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors"></div><div className="z-10"><p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">System Clearance</p><p className="text-xl font-black text-white tracking-tight">VIP Administrator</p></div><ShieldCheck size={44} className="text-amber-400 z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse" /></div>
                  )}
                </div>
                <div className="mt-16 pt-8 border-t-2 border-dashed border-red-100">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-red-50/50 p-6 rounded-[24px] border border-red-100">
                    <div className="flex gap-4 items-center">
                      <div className="bg-red-100 p-3 rounded-full text-red-500"><ShieldAlert size={28} /></div>
                      <div><h3 className="text-xl font-black text-red-900">Danger Zone</h3><p className="text-red-700/70 font-medium text-sm">Permanently wipe your account and history.</p></div>
                    </div>
                    <button onClick={() => setShowDeleteModal(true)} className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm w-full md:w-auto"><Trash2 size={18} /> Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <h2 className="text-3xl font-black text-gray-800 mb-6 tracking-tighter ml-2">Order History</h2>
                {!loadingOrders && orders.length > 0 && (
                  <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl overflow-x-auto shadow-lg shadow-gray-200/30 mb-8">
                    <button onClick={() => setOrderTab('active')} className={`flex-1 min-w-[110px] py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 ${orderTab === 'active' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Clock size={16} /> Active <span className={`px-2 py-0.5 rounded-full text-xs ${orderTab === 'active' ? 'bg-white/20' : 'bg-gray-100'}`}>{activeOrders.length}</span></button>
                    <button onClick={() => setOrderTab('completed')} className={`flex-1 min-w-[130px] py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 ${orderTab === 'completed' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Truck size={16} /> Completed <span className={`px-2 py-0.5 rounded-full text-xs ${orderTab === 'completed' ? 'bg-white/20' : 'bg-gray-100'}`}>{completedOrders.length}</span></button>
                    <button onClick={() => setOrderTab('cancelled')} className={`flex-1 min-w-[110px] py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 ${orderTab === 'cancelled' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Ban size={16} /> Cancelled <span className={`px-2 py-0.5 rounded-full text-xs ${orderTab === 'cancelled' ? 'bg-white/20' : 'bg-gray-100'}`}>{cancelledOrders.length}</span></button>
                  </div>
                )}
                {loadingOrders ? <div className="bg-white/80 backdrop-blur-md p-10 rounded-[35px] shadow-sm border border-white text-center"><p className="text-amber-600 font-bold animate-pulse">Loading your delicious history...</p></div> : orders.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-md p-16 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-white text-center flex flex-col items-center"><div className="bg-gray-50 p-6 rounded-full mb-6"><Package size={64} className="text-amber-300" /></div><h3 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">No orders yet!</h3><p className="text-gray-500 font-medium mb-8">You haven't placed any sweet orders with us.</p><button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all">Start Shopping</button></div>
                ) : displayOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-[30px] border border-white shadow-lg shadow-gray-200/30"><ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-500 font-bold text-lg capitalize">No {orderTab} orders found.</p></div>
                ) : (
                  <div className="space-y-6">
                    {displayOrders.map((order) => (
                      <div key={order.order_id} className="bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 border border-white shadow-xl shadow-gray-200/40 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                        <PackageCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-amber-500 opacity-[0.03] group-hover:scale-110 transition-transform duration-500" />
                        <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-5 relative z-10">
                          <div><p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Receipt ID</p><p className="text-3xl font-black text-gray-900 tracking-tighter">#{order.order_id}</p></div>
                          <div className="text-right flex flex-col items-end"><span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status.includes('Cancel') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{order.status === 'Cancelled by User' ? 'Cancelled' : order.status}</span><p className="text-sm text-gray-500 font-bold mt-2">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div>
                        </div>
                        <div className="space-y-3 mb-6 relative z-10">
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-600 bg-gray-50/50 p-3 rounded-xl"><span>{item.quantity}x {item.name}</span><span className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span></div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                          <div className="bg-gray-900 w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-lg text-white shadow-md flex justify-between gap-8"><span className="text-gray-400">Total</span><span className="text-amber-400">₹{order.total_amount}</span></div>
                          {order.status === 'Pending' && <button onClick={() => handleCancelOrder(order.order_id)} disabled={cancellingOrder === order.order_id} className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-500 bg-red-50 px-6 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"><XCircle size={18} /> {cancellingOrder === order.order_id ? 'Cancelling...' : 'Cancel Order'}</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- ADDRESSES TAB --- */}
            {activeTab === 'addresses' && (
              <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-white animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-8">
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Address Book</h2>
                  {!showAddressForm && <button onClick={() => { resetAddressForm(); setShowAddressForm(true); }} className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100/50 px-5 py-2.5 rounded-xl hover:bg-amber-200 transition-colors"><Plus size={16} /> Add New</button>}
                </div>
                
                {showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="bg-gray-50/50 border border-gray-200 p-8 rounded-[30px] animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-gray-800">{editingAddressId ? 'Update Delivery Address' : 'Add Delivery Address'}</h3>
                      <button type="button" onClick={resetAddressForm} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                    </div>

                    <div className="flex gap-4 mb-6">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <label key={type} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer border-2 transition-all ${addressForm.address_type === type ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-500 hover:border-amber-200'}`}>
                          <input type="radio" name="address_type" value={type} checked={addressForm.address_type === type} onChange={handleAddressChange} className="hidden" />
                          {type === 'Home' ? <HomeIcon size={24} /> : type === 'Work' ? <Briefcase size={24} /> : <MapPin size={24} />}
                          <span className="font-bold text-sm">{type}</span>
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input type="text" name="full_name" required value={addressForm.full_name} onChange={handleAddressChange} placeholder="Receiver's Full Name" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                      <input type="tel" name="phone" required value={addressForm.phone} onChange={handleAddressChange} placeholder="Contact Number" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                    </div>
                    
                    <input type="text" name="flat_house" required value={addressForm.flat_house} onChange={handleAddressChange} placeholder="Flat, House, Building, Company" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium mb-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input type="text" name="area_street" required value={addressForm.area_street} onChange={handleAddressChange} placeholder="Area, Colony, Street" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                      <input type="text" name="landmark" value={addressForm.landmark} onChange={handleAddressChange} placeholder="Landmark (Optional)" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <input type="text" name="city" required value={addressForm.city} onChange={handleAddressChange} placeholder="City" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                      <input type="text" name="state" required value={addressForm.state} onChange={handleAddressChange} placeholder="State" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                      <input type="text" name="pincode" required value={addressForm.pincode} onChange={handleAddressChange} placeholder="Pincode" className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 font-medium" />
                    </div>

                    <button type="submit" disabled={savingAddress} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg p-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50">
                      {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                  </form>
                ) : loadingAddresses ? (
                  <p className="text-center text-amber-500 font-bold animate-pulse py-10">Loading your addresses...</p>
                ) : (
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-5 pl-2">Home Address</h3>
                            {homeAddress ? <AddressCard address={homeAddress} isCategorized /> : <div className="w-full md:w-1/2"><DottedAddCard type="Home" text="Add Home Address" subtext="Save your primary delivery location." Icon={HomeIcon} /></div>}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-5 pl-2">Work Address</h3>
                            {workAddress ? <AddressCard address={workAddress} isCategorized /> : <div className="w-full md:w-1/2"><DottedAddCard type="Work" text="Add Work Address" subtext="Save your workplace for deliveries." Icon={Briefcase} /></div>}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-5 pl-2">Other Addresses</h3>
                            {otherAddresses.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{otherAddresses.map((address) => <AddressCard key={address.id} address={address} />)}</div> : <div className="w-full md:w-1/2"><DottedAddCard type="Other" text="Add Another Address" subtext="Save any other delivery points." Icon={MapPin} /></div>}
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <div className="flex flex-col items-center text-center mb-8 mt-2"><div className="bg-red-50 p-6 rounded-full text-red-500 mb-6 shadow-inner relative"><div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div><AlertTriangle size={48} className="relative z-10" /></div><h3 className="text-3xl font-black text-gray-900 tracking-tight">Final Warning</h3><p className="text-gray-500 font-medium mt-3 leading-relaxed">This action is <span className="text-red-600 font-bold">permanent</span>. All your data, orders, and addresses will be vaporized.</p></div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6"><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Type <span className="text-red-600 font-black">DELETE</span> to confirm</label><input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="DELETE" className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 font-black text-center text-red-600 tracking-widest transition-colors text-lg" /></div>
            <div className="flex gap-4"><button onClick={() => { setShowDeleteModal(false); setDeleteConfirmation(''); }} className="flex-1 py-4 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition-colors">Cancel</button><button disabled={deleteConfirmation !== 'DELETE'} onClick={handleDeleteAccount} className="flex-1 py-4 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30">Vaporize</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
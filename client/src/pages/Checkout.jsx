import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { CheckCircle, Save, Home as HomeIcon, Briefcase, MapPin, User, Mail, Phone, Map, Navigation, ShieldCheck, Package, Truck } from 'lucide-react';
const locationData = {
  "Gujarat": ["Surat", "Ahmedabad", "Vadodara", "Rajkot", "Gandhinagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
  "Delhi": ["New Delhi", "Dwarka"]
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext); 
  
  const [authMode, setAuthMode] = useState('guest'); 
  const [selectedState, setSelectedState] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    address: '', area: '', landmark: '', city: '', pincode: ''
  });

  useEffect(() => {
    if (isAuthenticated && user?.user_id) {
      const nameParts = user.full_name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        mobile: user.phone || ''
      }));

      const fetchAddresses = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/addresses/${user.user_id}`);
          if (res.ok) {
            const data = await res.json();
            setSavedAddresses(data);
          }
        } catch (err) {
          console.error("Failed to fetch saved addresses");
        }
      };
      fetchAddresses();
    }
  }, [isAuthenticated, user]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setAvailableCities(locationData[state] || []);
    setFormData({ ...formData, city: '' }); 
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌟 Auto-fill logic perfectly matched to our new DB!
  const handleSelectSavedAddress = (addr) => {
    setSelectedSavedAddressId(addr.id);
    setSaveAddress(false); // Already saved!
    
    setSelectedState(addr.state);
    setAvailableCities(locationData[addr.state] || []);
    const nameParts = addr.full_name.split(' ');

    setFormData({
      ...formData,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      mobile: addr.phone || '',
      address: addr.flat_house || '',
      area: addr.area_street || '',
      landmark: addr.landmark || '',
      city: addr.city,
      pincode: addr.pincode
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderPayload = {
        ...formData,
        state: selectedState,
        cartItems: cart,
        total_amount: cartTotal,
        customer_id: isAuthenticated && user?.user_id ? user.user_id : null,
    };

    try {
      // 1. PLACE THE ORDER
      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const orderData = await res.json();
        
        // 🚀 2. SILENT ADDRESS SAVE (Perfectly matched to new columns!)
        if (saveAddress && isAuthenticated && user?.user_id) {
            try {
                await fetch('http://localhost:5000/api/addresses/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        address_type: 'Other', 
                        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                        phone: formData.mobile,
                        flat_house: formData.address,
                        area_street: formData.area,
                        landmark: formData.landmark,
                        city: formData.city,
                        state: selectedState,
                        pincode: formData.pincode
                    })
                });
            } catch (addrErr) {
                console.error("Silent address save failed:", addrErr);
            }
        }

        clearCart();
        navigate(`/payment/${orderData.order_id}`);
        
      } else {
        const errorData = await res.json();
        alert(`Oops! Something went wrong: ${errorData.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reusable sleek input component
  const SleekInput = ({ icon: Icon, label, ...props }) => (
    <div className="w-full">
      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">{label} {props.required && <span className="text-red-500">*</span>}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
          <Icon size={18} />
        </div>
        <input 
          {...props} 
          className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-bold text-gray-800 shadow-sm" 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] to-orange-50/20 font-sans py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in slide-in-from-top-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">Secure Checkout</h1>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Complete your SweetCart order</p>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 bg-white p-6 rounded-[30px] border border-gray-100 shadow-xl shadow-gray-200/40 w-fit mx-auto">
            <button onClick={() => navigate('/login')} className={`px-8 py-3.5 rounded-2xl font-black transition-all ${authMode === 'login' ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-amber-400 shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>User Login</button>
            <span className="text-gray-300 font-black px-2">OR</span>
            <button onClick={() => setAuthMode('guest')} className={`px-8 py-3.5 rounded-2xl font-black transition-all ${authMode === 'guest' ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-amber-400 shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>Guest Checkout</button>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-900 p-6 rounded-[24px] mb-10 flex items-center gap-4 shadow-sm w-fit mx-auto animate-in zoom-in-95">
              <ShieldCheck size={28} className="text-green-600" />
              <div>
                  <h3 className="font-black text-lg leading-none">Logged in as {user?.full_name}</h3>
                  <p className="text-xs font-bold text-green-700/70 mt-1 tracking-wider uppercase">{user?.email}</p>
              </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Form Area */}
          <div className="lg:w-2/3">
            
            {/* 🌟 PREMIUM QUICK-SELECT UI 🌟 */}
            {isAuthenticated && savedAddresses.length > 0 && (
                <div className="mb-10 animate-in fade-in duration-500">
                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin size={16}/> Saved Addresses
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedAddresses.map((addr) => (
                            <div 
                                key={addr.id} 
                                onClick={() => handleSelectSavedAddress(addr)}
                                className={`p-5 rounded-[24px] cursor-pointer transition-all duration-300 flex items-start gap-4 ${selectedSavedAddressId === addr.id ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl shadow-orange-500/30 scale-[1.02] border-none' : 'bg-white border-2 border-gray-100 hover:border-amber-300 hover:shadow-md'}`}
                            >
                                <div className={`p-3 rounded-2xl ${selectedSavedAddressId === addr.id ? 'bg-white/20 text-white' : addr.address_type === 'Home' ? 'bg-blue-50 text-blue-500' : addr.address_type === 'Work' ? 'bg-purple-50 text-purple-500' : 'bg-gray-100 text-gray-500'}`}>
                                    {addr.address_type === 'Home' ? <HomeIcon size={20} /> : addr.address_type === 'Work' ? <Briefcase size={20} /> : <MapPin size={20} />}
                                </div>
                                <div>
                                    <p className={`font-black text-lg ${selectedSavedAddressId === addr.id ? 'text-white' : 'text-gray-900'}`}>{addr.address_type}</p>
                                    <p className={`text-xs font-bold line-clamp-2 mt-1 leading-relaxed ${selectedSavedAddressId === addr.id ? 'text-orange-100' : 'text-gray-500'}`}>
                                        {addr.flat_house}, {addr.area_street} <br/> {addr.city}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* CONTACT DETAILS CARD */}
              <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-gray-200/30 border border-white">
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3"><User className="text-amber-500"/> Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SleekInput icon={User} label="First Name" required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                  <SleekInput icon={User} label="Last Name" required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                  <SleekInput icon={Mail} label="Email Address" required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                  <SleekInput icon={Phone} label="Mobile Number" required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} pattern="[0-9]{10}" maxLength="10" title="Please enter exactly 10 digits" placeholder="9876543210" />
                </div>
              </div>

              {/* DELIVERY DETAILS CARD */}
              <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-gray-200/30 border border-white">
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3"><Map className="text-amber-500"/> Delivery Location</h2>
                
                <div className="space-y-6">
                  <SleekInput icon={HomeIcon} label="Flat, House, Building, Company" required name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g. 404 Error Farsan Plaza" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SleekInput icon={Navigation} label="Area, Colony, Street" required name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. Adajan" />
                    <SleekInput icon={MapPin} label="Landmark (Optional)" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Near LP Savani School" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="w-full">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">State <span className="text-red-500">*</span></label>
                      <select required value={selectedState} onChange={handleStateChange} className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-bold text-gray-800 appearance-none cursor-pointer">
                        <option value="" disabled>Select State</option>
                        {Object.keys(locationData).map(state => (<option key={state} value={state}>{state}</option>))}
                      </select>
                    </div>
                    
                    <div className="w-full">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">City <span className="text-red-500">*</span></label>
                      <select required name="city" value={formData.city} onChange={handleInputChange} disabled={!selectedState} className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-bold text-gray-800 appearance-none disabled:opacity-50 cursor-pointer">
                        <option value="" disabled>Select City</option>
                        {availableCities.map(city => (<option key={city} value={city}>{city}</option>))}
                      </select>
                    </div>

                    <SleekInput icon={MapPin} label="Pincode" required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 395009" />
                  </div>
                </div>

                {/* 🌟 SAVE ADDRESS CHECKBOX */}
                {isAuthenticated && selectedSavedAddressId === null && (
                  <div className="mt-8 bg-amber-50/50 p-6 rounded-[24px] border border-amber-200/60 flex items-center gap-5 cursor-pointer hover:bg-amber-50 transition-all group" onClick={() => setSaveAddress(!saveAddress)}>
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${saveAddress ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/30' : 'bg-white border-amber-300 group-hover:border-amber-500'}`}>
                      {saveAddress && <CheckCircle size={20} className="text-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-900 text-lg">Save this address</span>
                      <span className="text-sm font-bold text-amber-700/70">Add to your Address Book for 1-click checkout next time.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 🌟 MASSIVE CTA BUTTON */}
              <button type="submit" disabled={submitting} className="w-full py-6 mt-4 rounded-[24px] font-black text-white text-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-2xl shadow-orange-500/30 hover:-translate-y-2 disabled:opacity-70 disabled:hover:translate-y-0 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 w-full translate-x-[-100%] skew-x-[-15deg] group-hover:animate-[shine_1s_ease-in-out]"></div>
                { submitting ? 'Processing Order...' : `Pay ₹${cartTotal.toFixed(2)} Securely 🚀` }
              </button>

            </form>
          </div>

          {/* RIGHT SIDEBAR: SLEEK RECEIPT */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-white sticky top-24 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 to-orange-400"></div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-b-2 border-dashed border-gray-100 pb-6">Order Summary</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="font-bold">Your cart is empty!</p>
                </div>
              ) : (
                <div className="space-y-5 mb-8">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-black text-gray-800 text-sm">{item.name}</span>
                        <p className="text-xs font-bold text-gray-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-gray-900 font-black">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-[24px] space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 font-bold text-sm">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-bold text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-black bg-green-100 px-2 py-0.5 rounded-md">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-gray-900 mb-8">
                <span>Total</span>
                <span className="text-amber-500">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="bg-amber-50/50 p-6 rounded-[24px] border border-amber-100">
                <p className="font-black uppercase tracking-widest text-amber-800 text-xs mb-3 flex items-center gap-2"><Truck size={14}/> Delivery Timeline</p>
                <div className="space-y-2 text-sm font-bold text-amber-900/70">
                  <p className="flex justify-between"><span>Surat Local</span> <span className="text-amber-700">Same Day</span></p>
                  <p className="flex justify-between"><span>Other Cities</span> <span className="text-amber-700">1-3 Days</span></p>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
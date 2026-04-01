import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { CheckCircle, Save } from 'lucide-react'; 

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
  
  // 🌟 Checkbox state for saving the address
  const [saveAddress, setSaveAddress] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    address: '', area: '', landmark: '', city: '', pincode: ''
  });

  useEffect(() => {
    if (isAuthenticated && user?.full_name) {
      const nameParts = user.full_name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }));
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
        
        // 🚀 2. THE MAGIC: SILENTLY SAVE THE ADDRESS IF CHECKED!
        if (saveAddress && isAuthenticated && user?.user_id) {
            try {
                await fetch('http://localhost:5000/api/addresses/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        flat_house: formData.address,
                        delivery_area: formData.area,
                        delivery_city: formData.city,
                        delivery_state: selectedState,
                        pincode: formData.pincode,
                        landmark: formData.landmark
                    })
                });
            } catch (addrErr) {
                console.error("Silent address save failed:", addrErr);
            }
        }

        clearCart();
        
        // 🔥 JUMP STRAIGHT TO PAYMENT PAGE!
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

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isAuthenticated && (
          <div className="flex justify-center items-center gap-4 mb-12 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
            <button onClick={() => navigate('/login')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-md ${authMode === 'login' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>User Login</button>
            <span className="text-red-600 font-bold">OR</span>
            <button onClick={() => setAuthMode('guest')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-md ${authMode === 'guest' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Guest User</button>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-3xl mb-12 flex items-center gap-4 shadow-sm">
              <span className="text-3xl">👤</span>
              <div>
                  <h3 className="font-black text-xl leading-none">Logged in as {user?.full_name}</h3>
                  <p className="text-sm opacity-80 mt-0.5 truncate">{user?.email}</p>
              </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="lg:w-2/3 bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-amber-100">
            <h2 className="text-4xl font-black text-gray-800 mb-10 border-b border-amber-100 pb-5 tracking-tighter">Billing Address</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">First Name <span className="text-red-500">*</span></label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Last Name <span className="text-red-500">*</span></label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Email Address <span className="text-red-500">*</span></label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Mobile Number <span className="text-red-500">*</span></label>
                  <input required type="tel" name="mobile" onChange={handleInputChange} pattern="[0-9]{10}" maxLength="10" title="Please enter exactly 10 digits" className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 invalid:focus:border-red-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-bold">Flat, House, Building, Company etc. <span className="text-red-500">*</span></label>
                <input required name="address" onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Area, Colony, Street <span className="text-red-500">*</span></label>
                  <input required name="area" onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Landmark <span className="text-red-500">*</span></label>
                  <input required name="landmark" onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">State <span className="text-red-500">*</span></label>
                  <select required value={selectedState} onChange={handleStateChange} className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-500 transition-colors">
                    <option value="" disabled>Select State</option>
                    {Object.keys(locationData).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">City <span className="text-red-500">*</span></label>
                  <select required name="city" value={formData.city} onChange={handleInputChange} disabled={!selectedState} className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-400 transition-colors">
                    <option value="" disabled>Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-bold">Pincode <span className="text-red-500">*</span></label>
                  <input required type="text" name="pincode" onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>

              {/* 🌟 NEW: SAVE ADDRESS PROMPT FOR LOGGED IN USERS */}
              {isAuthenticated && (
                <div 
                  className="mt-8 bg-amber-50 p-5 rounded-2xl border border-amber-200 flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition-all shadow-sm" 
                  onClick={() => setSaveAddress(!saveAddress)}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${saveAddress ? 'bg-amber-600 border-amber-600' : 'bg-white border-amber-400'}`}>
                    {saveAddress && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-900 flex items-center gap-2"><Save size={16}/> Save this address</span>
                    <span className="text-sm text-amber-700">Make checkout faster next time by saving this to your address book.</span>
                  </div>
                </div>
              )}

              {/* 🌟 BIGGER BUTTON */}
              <button type="submit" disabled={submitting} className="w-full py-5 mt-8 rounded-2xl font-black text-white text-2xl bg-amber-600 hover:bg-amber-700 transition shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:scale-100">
                { submitting ? 'Processing Order...' : `Place Order (₹${cartTotal.toFixed(2)}) 🚀` }
              </button>

            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-amber-50 p-7 md:p-8 rounded-[30px] shadow-md border border-amber-200 sticky top-24">
              <h3 className="text-2xl font-black text-amber-950 mb-7 border-b border-amber-200 pb-4.5 tracking-tighter">Your Order</h3>
              
              {cart.length === 0 ? (
                <p className="text-amber-700 text-center py-4">Your cart is empty!</p>
              ) : (
                <div className="space-y-4 mb-7 max-h-72 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                      <span className="text-amber-800 font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-amber-200 pt-5 space-y-2.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-red-800 mt-5 pt-5 border-t-2 border-dashed border-amber-200">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-amber-200 text-xs text-amber-900 bg-amber-100 p-5 rounded-2xl border border-amber-200/50">
                <p className="font-bold uppercase tracking-widest text-amber-950 mb-3">Delivery Estimates</p>
                <ul className="list-disc list-inside space-y-1.5 font-medium leading-relaxed">
                  <li>Surat Special: with-in 24 hours.</li>
                  <li>Other Cities: 1 to 3 business days.</li>
                </ul>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
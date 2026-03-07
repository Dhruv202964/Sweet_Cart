import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // 🌟 NEW

const locationData = {
  "Gujarat": ["Surat", "Ahmedabad", "Vadodara", "Rajkot", "Gandhinagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
  "Delhi": ["New Delhi", "Dwarka"]
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { isAuthenticated, user, token } = useContext(AuthContext); // 🌟 Pull global auth status
  
  const [authMode, setAuthMode] = useState('guest'); 
  const [selectedState, setSelectedState] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    address: '', area: '', landmark: '', city: '', pincode: ''
  });

  // 🌟 MAGIC UX: If user is logged in, pre-fill their name and email!
  useEffect(() => {
    if (isAuthenticated && user) {
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
        total_amount: cartTotal
    };

    console.log("🌟 Order Submitted!", orderPayload);
    alert("ORDER PLACED SUCCESSFULLY! (This would send to the database now). Clearing cart.");
    clearCart();
    navigate('/menu');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🌟 ONLY show this div if we are NOT on logged in! */}
        {!isAuthenticated && (
          <div className="flex justify-center items-center gap-4 mb-12 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
            <button onClick={() => navigate('/login')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-md ${authMode === 'login' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>User Login</button>
            <span className="text-red-600 font-bold">OR</span>
            <button onClick={() => setAuthMode('guest')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-md ${authMode === 'guest' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Guest User</button>
          </div>
        )}

        {/* 🌟 If logged in, show a friendly welcome back banner */}
        {isAuthenticated && (
          <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-3xl mb-12 flex items-center gap-4">
              <span className="text-3xl">👤</span>
              <div>
                  <h3 className="font-black text-xl">Logged in as {user.full_name}</h3>
                  <p className="text-sm opacity-80">Proceeding with your saved details. Not you? <Link to="/login" className="font-bold underline">Change account</Link></p>
              </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-xl border border-amber-100">
            <h2 className="text-3xl font-black text-gray-800 mb-8 border-b pb-4">Billing Address</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                  <input required type="tel" name="mobile" onChange={handleInputChange} pattern="[0-9]{10}" maxLength="10" title="Please enter exactly 10 digits" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 invalid:focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Flat, House, Building, Company etc. <span className="text-red-500">*</span></label>
                <input required name="address" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Area, Colony, Street <span className="text-red-500">*</span></label>
                  <input required name="area" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Landmark <span className="text-red-500">*</span></label>
                  <input required name="landmark" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                  <select required value={selectedState} onChange={handleStateChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-500">
                    <option value="" disabled>Select State</option>
                    {Object.keys(locationData).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                  <select required name="city" value={formData.city} onChange={handleInputChange} disabled={!selectedState} className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-400">
                    <option value="" disabled>Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Pincode <span className="text-red-500">*</span></label>
                  <input required type="text" name="pincode" onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-4 mt-6 rounded-xl font-black text-white text-lg bg-amber-600 hover:bg-amber-700 transition shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:scale-100">
                { submitting ? 'Processing Order...' : `Place Order (₹${cartTotal.toFixed(2)}) 🚀` }
              </button>

            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-amber-50 p-6 rounded-3xl shadow-md border border-amber-200 sticky top-24">
              <h3 className="text-xl font-black text-amber-950 mb-6 border-b border-amber-200 pb-4">Your Order</h3>
              
              {cart.length === 0 ? (
                <p className="text-amber-700 text-center py-4">Your cart is empty!</p>
              ) : (
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                      <span className="text-amber-800 font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-amber-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-red-800 mt-4 pt-4 border-t border-amber-200">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
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
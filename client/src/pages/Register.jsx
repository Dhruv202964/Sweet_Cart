import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { CheckCircle, Loader2, User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'; 

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone, 
          role: 'customer' 
        })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        setRegisterSuccess(true); 
        
        setTimeout(() => {
            navigate('/');
        }, 1500);

      } else {
        setError(data.msg || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error.");
      setLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-100 max-w-sm w-full text-center animate-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-green-500 w-24 h-24 drop-shadow-md animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Account Created!</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Welcome to SweetCart, <span className="font-bold text-amber-700">{formData.full_name}</span>!
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
            <Loader2 className="animate-spin" size={20} /> Logging you in...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-96 bg-amber-600/5 rounded-b-[50%] blur-3xl -translate-y-20 z-0"></div>

      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="bg-amber-500 text-black font-extrabold w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white hover:scale-105 transition-transform">
            SC
          </Link>
        </div>

        <div className="text-center mb-10">
          {/* 🚀 Restored font-black and removed font-serif */}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Account</h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base">Join SweetCart for a faster checkout experience.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center ring-1 ring-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><User size={18} /></span>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name}
                  onChange={handleInputChange} 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-gray-900" 
                  placeholder="e.g. Rahul Sharma" 
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Phone size={18} /></span>
                <input 
                  type="tel" 
                  name="phone" 
                  pattern="[0-9]{10}" 
                  maxLength="10" 
                  value={formData.phone}
                  onChange={handleInputChange} 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-gray-900 invalid:focus:border-red-500" 
                  placeholder="10-digit mobile number" 
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Mail size={18} /></span>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange} 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-gray-900" 
                placeholder="name@example.com" 
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Lock size={18} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                minLength="6" 
                value={formData.password}
                onChange={handleInputChange} 
                required 
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-gray-900" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-1">Must be at least 6 characters long.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3b1700] text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group mt-6 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 font-medium text-sm">
          Already have an account? <Link to="/login" className="text-amber-600 font-bold hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
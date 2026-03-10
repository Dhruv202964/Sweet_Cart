import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 🌟 We need context to auto-login!
import { CheckCircle, Loader2 } from 'lucide-react'; 

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 🌟 Pull login function from context
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '' // 🌟 Changed mobile to phone here just in case!
  });
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone, // 🌟 Make sure we send phone
          role: 'customer' 
        })
      });

      const data = await res.json();

      if (res.ok) {
        // 🌟 INSTANT AUTO-LOGIN! We use the token and user sent back from your DB!
        login(data.user, data.token);
        setRegisterSuccess(true); 
        
        // 🌟 AUTO-REDIRECT after 1.5s
        setTimeout(() => {
            navigate('/');
        }, 1500);

      } else {
        alert(data.msg || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error.");
      setLoading(false);
    }
  };

  // 🌟 THE PREMIUM SUCCESS UI (Auto-redirects!)
  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-100 max-w-sm w-full text-center animate-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-green-500 w-24 h-24 drop-shadow-md animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tighter">Account Created!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            Welcome to SweetCart, <span className="font-black text-amber-700">{formData.full_name}</span>!
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
            <Loader2 className="animate-spin" size={20} /> Logging you in...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-amber-500 text-black font-extrabold w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white">
            SC
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-black text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/login" className="font-bold text-amber-600 hover:text-amber-500">sign in to your existing account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-amber-100 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <div className="mt-1">
                <input required name="full_name" type="text" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors" placeholder="e.g. Rahul Sharma" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <div className="mt-1">
                <input required name="email" type="email" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors" placeholder="name@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
              <div className="mt-1">
                <input required name="phone" type="tel" pattern="[0-9]{10}" maxLength="10" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors invalid:focus:border-red-500" placeholder="10-digit mobile number" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input required name="password" type="password" minLength="6" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-black text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:-translate-y-0.5 disabled:opacity-70">
                {loading ? 'Creating Account...' : 'Register Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
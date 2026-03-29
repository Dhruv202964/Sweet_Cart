import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 🔥 1. IMPORT TOAST

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 🔥 2. Show a loading toast while waiting for the server
    const loadingToast = toast.loading('Authenticating...', {
      style: { border: '2px solid #f59e0b' } // Amber border for loading
    });

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        const role = data.user?.role || 'admin'; 
        localStorage.setItem('role', role);

        // 🔥 3. Kill the loading toast and show Success!
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${role.toUpperCase()}! 🔓`, {
          duration: 3000,
          style: { border: '2px solid #10b981' } // Green border for success
        });
        
        // 🔥 4. Wait 1.5 seconds so they can actually see the awesome animation before redirecting
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);

      } else {
        // 🔥 5. Show error toast instead of native alert
        toast.dismiss(loadingToast);
        toast.error(data.msg || "Login Failed. Check email/password.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Server Error. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-brand-red">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            S
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Sweet<span className="text-brand-red">Cart</span> Admin</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access the panel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition" 
              placeholder="admin@sweetcart.com" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-red text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-800 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Secure Login 🔐
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Protected by SweetCart Security Systems v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
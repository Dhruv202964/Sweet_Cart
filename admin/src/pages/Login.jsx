import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // 1. Save Token for security
        localStorage.setItem('token', data.token);
        
        // 2. SAVE ROLE (Critical for Permissions!) 🔐
        // If the backend doesn't send a role, default to 'admin' to be safe
        const role = data.user?.role || 'admin'; 
        localStorage.setItem('role', role);

        alert(`Welcome back, ${role.toUpperCase()}! 🔓`);
        
        // 3. Force a full reload to update the Sidebar
        window.location.href = "/dashboard";
      } else {
        alert(data.msg || "Login Failed. Check email/password.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-brand-red">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            S
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Sweet<span className="text-brand-red">Cart</span> Admin</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access the panel.</p>
        </div>

        {/* Login Form */}
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
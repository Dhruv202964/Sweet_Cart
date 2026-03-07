import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 🌟 NEW

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 🌟 Pull global login function
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // 🌟 NEW: Call global context login function
        login(data.user, data.token);
        
        const savedOrder = localStorage.getItem('sweetcart_order');
        if(savedOrder && JSON.parse(savedOrder).length > 0) {
            navigate('/checkout');
        } else {
            navigate('/');
        }

      } else {
        alert(data.msg || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-amber-500 text-black font-extrabold w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white">
            SC
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-black text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/register" className="font-bold text-amber-600 hover:text-amber-500">create a new account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-amber-100 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <div className="mt-1">
                <input required name="email" type="email" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors" placeholder="name@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input required name="password" type="password" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-amber-600 hover:text-amber-500">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-black text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:-translate-y-0.5 disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Assuming your auth routes are set up at /api/auth/register
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: 'customer' // Force role to customer!
        })
      });

      if (res.ok) {
        alert("Registration Successful! Please login.");
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.msg || "Registration failed.");
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
                <input required name="mobile" type="tel" pattern="[0-9]{10}" maxLength="10" onChange={handleInputChange} className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors invalid:focus:border-red-500" placeholder="10-digit mobile number" />
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
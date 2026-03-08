import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; // 🌟 Premium Icon

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', mobile: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false); // 🌟 Controls the success screen

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
          role: 'customer' 
        })
      });

      if (res.ok) {
        setRegisterSuccess(true); // 🌟 Show beautiful screen instead of alert!
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

  // 🌟 THE PREMIUM SUCCESS UI
  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-amber-100 max-w-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-green-500 w-24 h-24 drop-shadow-md" />
          </div>
          <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tighter">Account Created! 🎉</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Welcome to the SweetCart family, <span className="font-bold text-amber-700">{formData.full_name}</span>! Your account has been successfully registered.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl font-black text-white text-xl bg-red-800 hover:bg-red-900 transition-all shadow-xl hover:-translate-y-1"
          >
            Proceed to Login ➔
          </button>
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
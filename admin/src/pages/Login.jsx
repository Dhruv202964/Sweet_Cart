import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Authenticating...', {
      style: { border: '2px solid #f59e0b' }
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

        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${role.toUpperCase()}! 🔓`, {
          duration: 3000,
          style: { border: '2px solid #10b981' }
        });
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);

      } else {
        toast.dismiss(loadingToast);
        toast.error(data.msg || "Login Failed. Check email/password.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Server Error. Is the backend running?");
    }
  };

  // 🔥 UPGRADED: Forced white background and crisp dark text
  const handleSupportClick = () => {
    toast("Locked out? Contact the Lead Dev for master credential resets.", {
      icon: '🛡️',
      style: { 
        background: '#ffffff', 
        color: '#1F2937',      
        fontWeight: 'bold', 
        border: '2px solid #991B1B' 
      }
    });
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition pr-12" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-red transition-colors outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-red text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-800 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Secure Login 🔐
          </button>
        </form>

        <div 
          onClick={handleSupportClick}
          className="mt-8 text-center text-xs text-gray-400 relative group cursor-pointer flex items-center justify-center gap-1.5 hover:text-gray-700 transition-colors"
        >
          <ShieldCheck size={14} className="group-hover:text-brand-red transition-colors" />
          <p>Protected by SweetCart Security Systems v2.0</p>
          
          {/* 🔥 UPGRADED: Larger text, higher position, z-index fixed! */}
          <span className="absolute -top-12 z-10 bg-gray-800 text-white text-sm font-bold tracking-widest py-2 px-4 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
            Engineered by Team 404 ERROR
          </span>
        </div>

      </div>
    </div>
  );
};

export default Login;
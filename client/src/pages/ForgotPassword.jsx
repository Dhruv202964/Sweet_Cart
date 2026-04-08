import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // 🌟 BEAUTIFUL TOAST NOTIFICATION STATE
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok) {
                showToast("OTP sent to your email! 📩", 'success');
                setStep(2);
            } else {
                showToast(data.msg || "Failed to send OTP.", 'error');
            }
        } catch (err) {
            showToast("Server error. Please try again.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await res.json();
            
            if (res.ok) {
                showToast("Password reset successful! ✨", 'success');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                showToast(data.msg || "Invalid OTP or request.", 'error');
            }
        } catch (err) {
            showToast("Server error. Please try again.", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFDF8] via-amber-50/40 to-orange-50/30 flex items-center justify-center p-4 relative">
            
            {/* TOAST RENDERER */}
            {toast && (
                <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white shadow-green-500/30' : 'bg-red-600 text-white shadow-red-500/30'}`}>
                    {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    <p className="font-bold tracking-wide">{toast.message}</p>
                </div>
            )}

            <div className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-[40px] shadow-2xl shadow-amber-900/5 border border-white p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
                
                <div className="relative z-10 text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 text-amber-500 mb-6 shadow-inner border border-amber-100">
                        {step === 1 ? <Mail size={36} /> : <ShieldCheck size={36} />}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        {step === 1 ? 'Forgot Password?' : 'Secure Reset'}
                    </h2>
                    <p className="text-gray-500 font-medium text-sm">
                        {step === 1 ? "Enter your email and we'll send you a 6-digit rescue code." : `Enter the code sent to ${email}`}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input 
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-bold text-gray-800"
                                placeholder="name@example.com"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-amber-400 font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-gray-900/30 hover:-translate-y-1 transition-all disabled:opacity-70">
                            {loading ? 'Sending...' : 'Send Rescue Code'} <ArrowRight size={20} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6 relative z-10 animate-in slide-in-from-right-8 duration-500">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">6-Digit OTP</label>
                            <input 
                                type="text" required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-black text-center text-2xl text-gray-800 tracking-[0.5em]"
                                placeholder="000000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                            <div className="relative">
                                <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength="6"
                                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all font-bold text-gray-800"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all disabled:opacity-70">
                            {loading ? 'Verifying...' : 'Reset My Password'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center relative z-10">
                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors">
                        Wait, I remember it! Back to login.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
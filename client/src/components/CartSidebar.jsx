import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CartContext } from '../context/CartContext';
import { ShoppingBag, X, Trash2, ArrowRight, Sparkles, ChefHat } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate(); 

  return (
    <>
      {/* 🌑 Deep Blur Overlay */}
      <div 
        className={`fixed inset-0 bg-[#3b1700]/40 backdrop-blur-md z-40 transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onClose}
      />

      {/* 🚀 The "Floating Receipt" Panel (Custom rounded corners & iOS animation) */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[460px] bg-[#FDFBF7] shadow-[-20px_0_40px_rgba(0,0,0,0.08)] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:rounded-l-[40px] overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* ✨ Premium Gradient Header */}
        <div className="px-8 py-7 bg-gradient-to-br from-[#3b1700] to-red-950 text-white relative overflow-hidden shadow-md">
          {/* Abstract glowing orb effect in the background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <ShoppingBag className="text-amber-400" size={28} /> 
              <span>Your Basket</span>
              {cart.length > 0 && (
                <span className="bg-amber-400 text-[#3b1700] text-sm px-3 py-1 rounded-full ml-2 shadow-lg animate-in zoom-in duration-300">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </h2>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full hover:rotate-90 transition-all duration-300"
            >
              <X size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 🛒 Floating Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FDFBF7] custom-scrollbar relative">
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b1700 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner border-[6px] border-white relative">
                <ChefHat size={56} className="text-amber-600" />
                <Sparkles size={24} className="text-amber-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">It's empty here!</h3>
              <p className="text-base font-medium text-gray-500 px-4 mb-8 leading-relaxed">
                Let's fill this up with some authentic Surati sweetness. Your cravings are waiting!
              </p>
              <button 
                onClick={() => { onClose(); navigate('/menu'); }} 
                className="px-10 py-4 bg-amber-600 text-white text-lg font-black rounded-2xl hover:bg-amber-700 hover:shadow-xl hover:shadow-amber-600/20 transition-all hover:-translate-y-1"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4 relative z-10 pb-4">
              {cart.map((item) => (
                // Floating Item Card
                <div key={item.product_id} className="group flex gap-4 bg-white p-4 rounded-[24px] shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:scale-[1.02]">
                  
                  {/* Premium Rounded Image */}
                  <div className="w-24 h-24 shrink-0 bg-[#FFFDF8] rounded-[18px] overflow-hidden border border-amber-50 shadow-inner relative">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Sweet'; }}
                    />
                  </div>
                  
                  {/* Card Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-black text-gray-900 text-base leading-tight pr-2 line-clamp-2">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors -mt-1 -mr-1"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-black text-red-800 text-xl tracking-tight">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Pill-shaped Quantity Toggle */}
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full overflow-hidden shadow-sm h-10 px-1">
                        <button 
                          onClick={() => decreaseQuantity(item.product_id)} 
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-full font-black transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 h-full flex items-center justify-center text-sm font-black text-gray-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item)} 
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm rounded-full font-black transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💳 Glassmorphic Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-8 bg-white/90 backdrop-blur-md border-t border-gray-100 relative z-20 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
            
            {/* Dashed receipt line effect */}
            <div className="absolute top-0 left-6 right-6 border-t-2 border-dashed border-gray-200"></div>

            <div className="flex justify-between items-end mb-6 mt-2">
              <div className="flex flex-col">
                 <span className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-1">Total Amount</span>
                 <span className="font-medium text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block w-max">Free Delivery</span>
              </div>
              <span className="font-black text-4xl text-gray-900 tracking-tighter">
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>
            
            {/* Glowing Action Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="relative w-full bg-[#1A1A1A] hover:bg-black text-white font-black text-xl py-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Proceed to Checkout</span>
                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                
                {/* Shine effect on hover */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg] group-hover:left-[200%] transition-all duration-700 ease-in-out"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
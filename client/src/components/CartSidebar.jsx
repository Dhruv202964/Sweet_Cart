import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 🌟 NEW: We need this to travel between pages!
import { CartContext } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate(); // 🌟 NEW: Initialize the navigator

  if (!isOpen) return null;

  return (
    <>
      {/* 🌑 Dark Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 🚀 Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-cream-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 bg-red-800 text-white flex justify-between items-center shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🛒</span> Your Order
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-amber-200 text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <span className="text-5xl">🥡</span>
              <p className="text-lg font-medium">Your cart is completely empty!</p>
              <p className="text-sm">Add some Kaju Katli to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product_id} className="flex gap-4 border-b border-gray-100 pb-4">
                  {/* Tiny Item Image */}
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    
                    {/* Interactive Quantity Toggle inside Cart! */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button 
                          onClick={() => decreaseQuantity(item.product_id)} 
                          className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-200 hover:text-red-600 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-bold w-8 text-center bg-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item)} 
                          className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-200 hover:text-green-600 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="font-bold text-red-800 text-lg">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-400 hover:text-red-700 font-bold px-2 text-xl"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-amber-50 border-t border-amber-200 shadow-inner">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="font-bold text-gray-700">Subtotal:</span>
              <span className="font-extrabold text-2xl text-red-800">
                ₹{getCartTotal()}
              </span>
            </div>
            
            {/* 🌟 NEW: This button now closes the cart AND travels to the checkout page! */}
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors text-lg"
            >
              Proceed to Checkout 🚀
            </button>
            
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
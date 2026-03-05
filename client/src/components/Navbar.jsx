import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import { CartContext } from '../context/CartContext';
import CartSidebar from './CartSidebar';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // 🌟 Pull the search state from Context
  const { cart, searchQuery, setSearchQuery } = useContext(CartContext);
  const navigate = useNavigate();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // 🌟 Function to handle typing
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // If they aren't on the menu page, take them there so they can see results!
    if (window.location.pathname !== '/menu') {
      navigate('/menu');
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">
                SC
              </div>
              <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
                SweetCart
              </Link>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center px-8 gap-8">
              <Link to="/" className="text-gray-700 hover:text-amber-600 font-semibold text-lg transition-colors">
                Home
              </Link>
              <Link to="/menu" className="text-gray-700 hover:text-amber-600 font-semibold text-lg transition-colors">
                Full Menu
              </Link>
              
              {/* 🌟 SEARCH BAR WIRED UP */}
              <div className="max-w-md w-full ml-4 hidden lg:block">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for premium sweets, farsan..." 
                    className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-amber-50/30"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default Navbar;
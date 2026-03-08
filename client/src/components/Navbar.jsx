import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
// 🌟 Added Package and LogIn icons here!
import { CircleUser, Menu, X, Settings, LogOut, Package, LogIn } from 'lucide-react'; 
import CartSidebar from './CartSidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); 

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 

  const { cart, searchQuery, setSearchQuery } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext); 

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/menu') {
      navigate('/menu');
    }
  };

  // 🌟 MAGIC UX: Hide cart on checkout, login, AND register pages!
  const hideCartPages = ['/checkout', '/login', '/register'];
  const shouldHideCart = hideCartPages.includes(location.pathname);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">SC</div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">SweetCart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8 gap-8">
              <Link to="/" className={`font-semibold text-lg transition-colors ${location.pathname === '/' ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'}`}>Home</Link>
              <Link to="/menu" className={`font-semibold text-lg transition-colors ${location.pathname === '/menu' ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'}`}>Full Menu</Link>
              
              <div className="max-w-md w-full ml-4 hidden lg:block">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search for premium sweets, farsan..." className="w-full pl-10 pr-4 py-2.5 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-amber-50/30" />
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              
              {/* 🛒 Cart Button (Hidden on specific pages) */}
              {!shouldHideCart && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {totalItems > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">{totalItems}</span>}
                </button>
              )}

              {/* 👤 THE UPGRADED USER MENU BOSS */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-amber-50 group transition-colors"
                >
                  <CircleUser size={28} className={`transition-colors ${isAuthenticated ? 'text-amber-600' : 'text-gray-600'}`} />
                  {isAuthenticated && <span className="text-sm font-bold text-gray-800 hidden lg:block">{user?.full_name}</span>}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50">
                      
                      {/* 🟢 IF LOGGED IN */}
                      {isAuthenticated ? (
                        <>
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                              <p className="font-extrabold text-lg text-gray-900">{user?.full_name}</p>
                              <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">{user?.role}</p>
                              <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                          <ul className="space-y-1">
                              <li>
                                  <Link to="/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Settings size={18} className="text-amber-600" /> My Account & Details
                                  </Link>
                              </li>
                              <li>
                                  <Link to="/track-order" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Package size={18} className="text-amber-600" /> Track Order
                                  </Link>
                              </li>
                              {user?.role === 'admin' && (
                                  <li>
                                    <Link to="/admin" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-brand-red font-bold hover:bg-red-50 text-sm">
                                      <span>🔒</span> Admin Dashboard
                                    </Link>
                                  </li>
                              )}
                              <li className="pt-2 mt-1 border-t border-gray-100">
                                  <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-700 font-bold hover:bg-red-100 text-sm">
                                    <LogOut size={18} /> Logout
                                  </button>
                              </li>
                          </ul>
                        </>
                      ) : (
                        /* 🟡 IF GUEST USER */
                        <>
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                              <p className="font-extrabold text-lg text-gray-900">Welcome, Guest!</p>
                              <p className="text-xs text-gray-500 mt-0.5">Sign in for faster checkout.</p>
                          </div>
                          <ul className="space-y-1">
                              <li>
                                  <Link to="/login" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <LogIn size={18} className="text-amber-600" /> Login / Register
                                  </Link>
                              </li>
                              <li>
                                  <Link to="/track-order" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Package size={18} className="text-amber-600" /> Track Order
                                  </Link>
                              </li>
                          </ul>
                        </>
                      )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-amber-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>

          </div>
        </div>
      </nav>
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
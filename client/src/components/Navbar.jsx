import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { CircleUser, Menu, X, Settings, LogOut, Package, LogIn, Globe } from 'lucide-react'; 
import CartSidebar from './CartSidebar';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); 

  const { t, i18n } = useTranslation();

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

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const hideCartPages = ['/checkout', '/login', '/register'];
  const shouldHideCart = hideCartPages.includes(location.pathname);

  // 🚀 THE SMART ROUTE CHECKER
  const isHome = location.pathname === '/';

  return (
    <>
      {/* 🚀 THE FIX: 'fixed' on Home, 'sticky' on every other page! */}
      <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 w-full z-50 py-4 bg-transparent transition-all duration-300 pointer-events-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ✨ BORDERLESS PILL SHAPE */}
          <div className="flex justify-between items-center h-16 bg-white/40 backdrop-blur-md rounded-full px-6 shadow-sm">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">SC</div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">SweetCart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8 gap-8">
              <Link to="/" className={`font-bold text-lg transition-colors drop-shadow-sm ${location.pathname === '/' ? 'text-amber-700' : 'text-gray-800 hover:text-amber-600'}`}>
                {t('home', 'Home')}
              </Link>
              <Link to="/menu" className={`font-bold text-lg transition-colors drop-shadow-sm ${location.pathname === '/menu' ? 'text-amber-700' : 'text-gray-800 hover:text-amber-600'}`}>
                {t('full_menu', 'Full Menu')}
              </Link>
              
              <div className="max-w-md w-full ml-4 hidden lg:block">
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input type="text" value={searchQuery} onChange={handleSearch} placeholder={t('search_placeholder', 'Search for premium sweets, farsan...')} className="w-full pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white/60 backdrop-blur-sm text-gray-900 font-medium placeholder-gray-600 transition-all group-hover:bg-white/80" />
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              
              {/* 🌍 LANGUAGE SWITCHER */}
              <div className="hidden sm:flex items-center gap-1 bg-white/50 hover:bg-white/80 transition-colors px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                <Globe size={18} className="text-amber-700" />
                <select 
                  onChange={changeLanguage} 
                  defaultValue={i18n.language}
                  className="bg-transparent text-sm font-extrabold text-gray-900 focus:outline-none cursor-pointer border-none appearance-none outline-none"
                >
                  <option value="eng" className="text-black">ENG</option>
                  <option value="hin" className="text-black">HIN</option>
                  <option value="guj" className="text-black">GUJ</option>
                </select>
              </div>

              {/* 🛒 Cart Button */}
              {!shouldHideCart && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-800 hover:text-amber-700 transition-colors bg-white/50 rounded-full hover:bg-white/80 shadow-sm">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">{totalItems}</span>}
                </button>
              )}

              {/* 👤 User Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                  className="flex items-center gap-2 p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors shadow-sm"
                >
                  <CircleUser size={26} className={`transition-colors ${isAuthenticated ? 'text-amber-700' : 'text-gray-700'}`} />
                  {isAuthenticated && <span className="text-sm font-extrabold text-gray-900 hidden lg:block pr-2">{user?.full_name}</span>}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 z-50">
                      {isAuthenticated ? (
                        <>
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                              <p className="font-extrabold text-lg text-gray-900">{user?.full_name}</p>
                              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">{user?.role}</p>
                              <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                          <ul className="space-y-1">
                              <li>
                                  <Link to="/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Settings size={18} className="text-amber-600" /> {t('my_account', 'My Account & Details')}
                                  </Link>
                              </li>
                              <li>
                                  <Link to="/track-order" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Package size={18} className="text-amber-600" /> {t('track_order', 'Track Order')}
                                  </Link>
                              </li>
                              {user?.role === 'admin' && (
                                  <li>
                                    <Link to="/admin" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-red-600 font-bold hover:bg-red-50 text-sm">
                                      <span>🔒</span> {t('admin_dash', 'Admin Dashboard')}
                                    </Link>
                                  </li>
                              )}
                              <li className="pt-2 mt-1 border-t border-gray-100">
                                  <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-700 font-bold hover:bg-red-100 text-sm">
                                    <LogOut size={18} /> {t('logout', 'Logout')}
                                  </button>
                              </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                              <p className="font-extrabold text-lg text-gray-900">{t('welcome_guest', 'Welcome, Guest!')}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{t('sign_in_fast', 'Sign in for faster checkout.')}</p>
                          </div>
                          <ul className="space-y-1">
                              <li>
                                  <Link to="/login" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <LogIn size={18} className="text-amber-600" /> {t('login_register', 'Login / Register')}
                                  </Link>
                              </li>
                              <li>
                                  <Link to="/track-order" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-gray-800 font-semibold hover:bg-amber-50 text-sm">
                                    <Package size={18} className="text-amber-600" /> {t('track_order', 'Track Order')}
                                  </Link>
                              </li>
                          </ul>
                        </>
                      )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-800 bg-white/50 rounded-full hover:bg-white/80 shadow-sm">
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
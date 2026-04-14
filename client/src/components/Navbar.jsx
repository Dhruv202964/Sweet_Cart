import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { CircleUser, Menu, X, Settings, LogOut, Package, LogIn, Globe, Sparkles, ChevronDown } from 'lucide-react'; 
import CartSidebar from './CartSidebar';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); 
  const langDropdownRef = useRef(null); // 🚀 NEW: Ref for Language Dropdown

  const { t, i18n } = useTranslation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false); // 🚀 NEW: State for Custom Lang Dropdown

  const { cart, searchQuery, setSearchQuery } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext); 

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      // 🚀 Close custom language dropdown if clicked outside
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, langDropdownRef]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/menu') {
      navigate('/menu');
    }
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false); // Close dropdown after selection
  };

  const hideCartPages = ['/checkout', '/login', '/register'];
  const shouldHideCart = hideCartPages.includes(location.pathname);
  const isHome = location.pathname === '/';

  // Helper to get active language name
  const getActiveLangName = () => {
    switch(i18n.language) {
      case 'hin': return 'HIN';
      case 'guj': return 'GUJ';
      default: return 'ENG';
    }
  };

  return (
    <>
      <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 w-full z-50 py-4 bg-transparent transition-all duration-300 pointer-events-auto`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center h-16 bg-white/50 backdrop-blur-md rounded-full px-4 sm:px-6 shadow-sm border border-white/40">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0">SC</div>
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm hidden sm:block whitespace-nowrap">SweetCart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center px-2 xl:px-8 gap-4 xl:gap-6">
              
              <Link to="/" className={`font-bold text-base lg:text-lg transition-colors drop-shadow-sm whitespace-nowrap ${location.pathname === '/' ? 'text-amber-700' : 'text-gray-800 hover:text-amber-600'}`}>
                {t('home', 'Home')}
              </Link>
              
              <Link to="/menu" className={`font-bold text-base lg:text-lg transition-colors drop-shadow-sm whitespace-nowrap ${location.pathname === '/menu' ? 'text-amber-700' : 'text-gray-800 hover:text-amber-600'}`}>
                {t('full_menu', 'Full Menu')}
              </Link>
              
              <Link to="/make-your-own-box" className="group flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-1.5 rounded-full border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all shrink-0 whitespace-nowrap">
                <Sparkles size={16} className="text-amber-600 group-hover:animate-pulse shrink-0" />
                <span className="font-bold text-sm text-amber-900">Custom Box</span>
              </Link>
              
              <div className="max-w-xs w-full ml-2 hidden lg:block">
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input type="text" value={searchQuery} onChange={handleSearch} placeholder={t('search_placeholder', 'Search sweets...')} className="w-full pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white/70 backdrop-blur-sm text-gray-900 font-medium placeholder-gray-600 transition-all group-hover:bg-white/90 shadow-inner" />
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* 🚀 PREMIUM CUSTOM LANGUAGE DROPDOWN */}
              <div className="relative hidden sm:block shrink-0" ref={langDropdownRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 bg-white/60 hover:bg-white/90 transition-all px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-white/50 hover:border-amber-300 group"
                >
                  <Globe size={16} className="text-amber-600 group-hover:text-amber-700" />
                  <span className="text-xs font-extrabold text-gray-900">{getActiveLangName()}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100 p-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <button onClick={() => changeLanguage('eng')} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${i18n.language === 'eng' ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'}`}>
                      English <span className="text-[10px] text-gray-400 ml-1">ENG</span>
                    </button>
                    <button onClick={() => changeLanguage('hin')} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${i18n.language === 'hin' ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'}`}>
                      हिंदी <span className="text-[10px] text-gray-400 ml-1">HIN</span>
                    </button>
                    <button onClick={() => changeLanguage('guj')} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${i18n.language === 'guj' ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'}`}>
                      ગુજરાતી <span className="text-[10px] text-gray-400 ml-1">GUJ</span>
                    </button>
                  </div>
                )}
              </div>

              {!shouldHideCart && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-800 hover:text-amber-700 transition-colors bg-white/60 rounded-full hover:bg-white/90 shadow-sm border border-white/50 shrink-0">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">{totalItems}</span>}
                </button>
              )}

              {/* 👤 User Dropdown Menu */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                  className="flex items-center gap-2 p-1.5 rounded-full bg-white/60 hover:bg-white/90 transition-colors shadow-sm border border-white/50"
                >
                  <CircleUser size={22} className={`shrink-0 transition-colors ${isAuthenticated ? 'text-amber-700' : 'text-gray-700'}`} />
                  {isAuthenticated && <span className="text-sm font-extrabold text-gray-900 hidden lg:block pr-2 truncate max-w-[80px] xl:max-w-[120px]">{user?.full_name}</span>}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 z-50 border border-gray-100 animate-in fade-in zoom-in duration-200">
                      {isAuthenticated ? (
                        <>
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                              <p className="font-extrabold text-lg text-gray-900 line-clamp-1">{user?.full_name}</p>
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-800 bg-white/60 rounded-full hover:bg-white/90 shadow-sm border border-white/50 shrink-0">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
          
          {/* MOBILE MENU DROPDOWN */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-4 absolute w-[calc(100%-2rem)] z-50">
              <div className="flex flex-col gap-3">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-lg text-gray-800 p-2 hover:bg-amber-50 rounded-lg">
                  {t('home', 'Home')}
                </Link>
                <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="font-bold text-lg text-gray-800 p-2 hover:bg-amber-50 rounded-lg">
                  {t('full_menu', 'Full Menu')}
                </Link>
                
                <Link to="/make-your-own-box" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 font-bold text-lg text-amber-800 p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <Sparkles size={18} className="text-amber-600" />
                  VIP Custom Box
                </Link>

                {/* Mobile Language Switcher */}
                <div className="flex items-center gap-2 p-2 mt-2 border-t border-gray-100">
                  <Globe size={18} className="text-amber-600" />
                  <select 
                    onChange={(e) => { changeLanguage(e.target.value); setIsMenuOpen(false); }} 
                    defaultValue={i18n.language}
                    className="bg-transparent text-sm font-bold text-gray-900 outline-none w-full"
                  >
                    <option value="eng">English (ENG)</option>
                    <option value="hin">हिंदी (HIN)</option>
                    <option value="guj">ગુજરાતી (GUJ)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </nav>
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
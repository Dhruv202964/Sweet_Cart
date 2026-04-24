import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { CircleUser, Menu, X, Settings, LogOut, Package, LogIn, Globe, Sparkles, ChevronDown, Leaf, Search } from 'lucide-react'; 
import CartSidebar from './CartSidebar';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null); 
  const langDropdownRef = useRef(null);

  const { t, i18n } = useTranslation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { cart, searchQuery, setSearchQuery } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext); 

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
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
    setIsLangOpen(false);
  };

  const hideCartPages = ['/checkout', '/login', '/register'];
  const shouldHideCart = hideCartPages.includes(location.pathname);
  const isHome = location.pathname === '/';

  const getActiveLangName = () => {
    switch(i18n.language) {
      case 'hin': return 'HIN';
      case 'guj': return 'GUJ';
      default: return 'ENG';
    }
  };

  return (
    <>
      <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 w-full z-50 py-3 bg-transparent transition-all duration-300 pointer-events-auto`}>
        <div className="max-w-[1600px] mx-auto px-4">
          
          <div className="flex justify-between items-center h-16 bg-white/70 backdrop-blur-xl rounded-full px-4 xl:px-8 shadow-lg border border-white/50">
            
            {/* 🏎️ SECTION 1: LOGO */}
            <div className="flex-shrink-0 flex items-center mr-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-amber-500 text-black font-black w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md group-hover:rotate-12 transition-transform shrink-0">SC</div>
                <span className="text-xl font-black text-slate-900 tracking-tighter hidden lg:block">SweetCart</span>
              </Link>
            </div>

            {/* 🛣️ SECTION 2: MAIN NAVIGATION */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
              <Link to="/" className={`font-bold text-sm transition-colors ${location.pathname === '/' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
                {t('home', 'Home')}
              </Link>
              
              <Link to="/menu" className={`font-bold text-sm transition-colors ${location.pathname === '/menu' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'}`}>
                {t('full_menu', 'Full Menu')}
              </Link>

              {/* 🌿 NEW: COMPACT SUGAR-FREE */}
              <Link to="/sugar-free" className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${location.pathname === '/sugar-free' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:border-emerald-300'}`}>
                <Leaf size={14} className={`${location.pathname === '/sugar-free' ? 'text-white' : 'text-emerald-600'} group-hover:animate-pulse`} />
                <span className="font-bold text-xs">Sugar-Free</span>
              </Link>
              
              <Link to="/make-your-own-box" className="group flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 hover:border-amber-400 hover:shadow-sm transition-all">
                <Sparkles size={14} className="text-amber-600 group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-xs text-amber-900">Custom Box</span>
              </Link>
            </div>

            {/* 🔍 SECTION 3: SEARCH BAR (FLEXIBLE) */}
            <div className="hidden xl:flex flex-1 max-w-sm mx-6">
              <div className="relative w-full group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={handleSearch} 
                  placeholder={t('search_placeholder', 'Search premium sweets...')} 
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-xs font-bold text-slate-800 placeholder-slate-500 transition-all border border-transparent focus:border-amber-200 shadow-inner" 
                />
              </div>
            </div>

            {/* ⚙️ SECTION 4: ACTIONS & USER */}
            <div className="flex items-center gap-2 lg:gap-4 shrink-0">
              
              {/* Language Selector */}
              <div className="relative hidden sm:block" ref={langDropdownRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 bg-white/80 hover:bg-white transition-all px-3 py-1.5 rounded-full border border-slate-100 hover:border-amber-200"
                >
                  <Globe size={16} className="text-amber-600" />
                  <span className="text-[10px] font-black text-slate-700">{getActiveLangName()}</span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-50 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {['eng', 'hin', 'guj'].map((lang) => (
                      <button key={lang} onClick={() => changeLanguage(lang)} className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-black transition-all ${i18n.language === lang ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {lang === 'eng' ? 'ENGLISH' : lang === 'hin' ? 'HINDI' : 'GUJARATI'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Toggle */}
              {!shouldHideCart && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-slate-700 hover:text-amber-600 bg-white hover:bg-amber-50 rounded-full transition-all border border-slate-100 shadow-sm">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center ring-2 ring-white animate-pulse">{totalItems}</span>}
                </button>
              )}

              {/* User Identity */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                  className={`flex items-center gap-2 p-1 rounded-full border transition-all ${isAuthenticated ? 'bg-amber-50 border-amber-200 pr-3' : 'bg-white border-slate-100'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${isAuthenticated ? 'bg-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                    <CircleUser size={20} />
                  </div>
                  {isAuthenticated && <span className="text-xs font-black text-slate-800 hidden lg:block truncate max-w-[100px] uppercase tracking-tighter">{user?.full_name.split(' ')[0]}</span>}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-2xl p-2 z-50 border border-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {isAuthenticated ? (
                        <div className="flex flex-col">
                          <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-2">
                              <p className="font-black text-sm text-slate-900 line-clamp-1">{user?.full_name}</p>
                              <p className="text-[10px] text-amber-600 font-bold uppercase">{user?.role}</p>
                          </div>
                          {[
                            { to: "/account", icon: Settings, label: "My Profile" },
                            { to: "/track-order", icon: Package, label: "Order History" }
                          ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-slate-700 font-bold hover:bg-amber-50 text-xs transition-colors">
                              <item.icon size={16} className="text-amber-500" /> {item.label}
                            </Link>
                          ))}
                          {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-red-600 font-bold hover:bg-red-50 text-xs mt-1">
                              <span>🔒</span> Admin Dashboard
                            </Link>
                          )}
                          <button onClick={logout} className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 font-bold hover:text-red-700 hover:bg-red-50 text-xs mt-1 border-t border-slate-50 transition-all">
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      ) : (
                        <Link to="/login" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl text-amber-700 font-black hover:bg-amber-50 text-sm transition-all">
                          <LogIn size={20} /> Sign In to SweetCart
                        </Link>
                      )}
                  </div>
                )}
              </div>

              {/* Mobile Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 text-slate-700 bg-slate-50 rounded-full">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
          
          {/* 📱 MOBILE NAVIGATION (FULL SCREEN OVERLAY) */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 absolute w-[calc(100%-2rem)] z-50 animate-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-black text-xl text-slate-900 py-2 border-b border-slate-50">Home</Link>
                <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="font-black text-xl text-slate-900 py-2 border-b border-slate-50">The Collection</Link>
                <Link to="/sugar-free" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 font-black text-xl text-emerald-600 py-2 border-b border-slate-50">
                  <Leaf size={22} /> Sugar-Free
                </Link>
                <Link to="/make-your-own-box" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 font-black text-xl text-amber-600 py-2">
                  <Sparkles size={22} /> VIP Custom Box
                </Link>
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
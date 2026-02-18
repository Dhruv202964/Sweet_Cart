import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');

  const isActive = (path) => location.pathname === path 
    ? "bg-red-800 text-white font-bold shadow-inner" 
    : "text-red-100 hover:bg-red-700 hover:text-white font-medium";

  return (
    <div className="w-56 h-screen bg-brand-red text-white fixed left-0 top-0 shadow-2xl overflow-y-auto z-50">
      
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-red-800">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-red font-bold text-xl shadow-sm">S</div>
        <h1 className="text-xl font-bold tracking-wide">Sweet<span className="text-yellow-300">Cart</span></h1>
      </div>

      <nav className="p-3 space-y-2 mt-4">
        <p className="text-xs font-bold text-red-200 uppercase px-3 mb-2 tracking-wider">Main Menu</p>
        
        {/* DASHBOARD/HOME LINK: STAFF CANNOT SEE IT */}
        {userRole !== 'staff' && (
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/dashboard')}`}>
            {/* Show Home icon for Manager, Dashboard icon for Admin */}
            <span>{userRole === 'admin' ? '📊' : '🏠'}</span> 
            {userRole === 'admin' ? 'Dashboard' : 'Home'}
          </Link>
        )}

        <Link to="/orders" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/orders')}`}>
          <span>📦</span> Orders
        </Link>

        <Link to="/products" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/products')}`}>
          <span>🍬</span> Inventory
        </Link>
        
         <Link to="/riders" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/riders')}`}>
          <span>🛵</span> Riders
        </Link>

        {/* ADMINISTRATION: ONLY ADMIN & MANAGER */}
        {userRole !== 'staff' && (
          <>
            <div className="my-6 border-t border-red-800 mx-4"></div>
            <p className="text-xs font-bold text-red-200 uppercase px-3 mb-2 tracking-wider">Administration</p>

            <Link to="/messages" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/messages')}`}>
              <span>📩</span> Messages
            </Link>

            {/* ONLY ADMIN CAN SEE STAFF SECTION */}
            {userRole === 'admin' && (
              <Link to="/staff" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('/staff')}`}>
                <span>👥</span> Staff / HR
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4 bg-red-900 bg-opacity-50">
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-100 font-bold hover:bg-red-800 hover:text-white rounded-xl transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
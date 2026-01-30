import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    // 1. Parent Wrapper: Locked to 100% Screen Height (No scrolling on body)
    <div className="flex h-screen bg-brand-cream overflow-hidden">
      
      {/* 2. Left Side: Sidebar (Fixed width, does not shrink) */}
      <div className="w-64 flex-shrink-0 h-full">
        <Sidebar />
      </div>
      
      {/* 3. Right Side: Content Area (Takes remaining space + Scrolls independently) */}
      <div className="flex-1 h-full overflow-y-auto p-8 scroll-smooth">
        {children}
      </div>
    </div>
  );
};

export default Layout;
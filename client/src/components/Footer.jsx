import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-amber-950 text-amber-50 pt-16 pb-8 border-t-[6px] border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">
                SC
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                SweetCart
              </span>
            </div>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              Born in the heart of Surat, we have been crafting the finest, 100% pure vegetarian sweets and farsan. Our journey started with a single pan of premium ghee, and today we deliver smiles across the city.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-amber-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-amber-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-amber-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-amber-200/80 hover:text-amber-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/menu" className="text-amber-200/80 hover:text-amber-400 transition-colors text-sm">Full Menu</Link></li>
              <li><Link to="#" className="text-amber-200/80 hover:text-amber-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="#" className="text-amber-200/80 hover:text-amber-400 transition-colors text-sm">Contact & Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> Visit Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-amber-200/80">
                <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <span>101 Premium Complex,<br/>Adajan, Surat, Gujarat 395009</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-amber-200/80">
                <Phone size={18} className="text-amber-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-amber-200/80">
                <Mail size={18} className="text-amber-500 shrink-0" />
                <span>hello@sweetcart.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Expansion / Coming Soon */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> Our Branches
            </h3>
            <div className="bg-amber-900/50 p-4 rounded-xl border border-amber-800/50">
              <div className="mb-3 border-b border-amber-800/50 pb-3">
                <span className="block text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Currently Serving</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Surat (3 Outlets)
                </span>
              </div>
              <div>
                <span className="block text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">Coming Soon 🚀</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-amber-950 border border-amber-700/50 text-amber-200/80 px-2 py-1 rounded">Ahmedabad</span>
                  <span className="text-xs bg-amber-950 border border-amber-700/50 text-amber-200/80 px-2 py-1 rounded">Vadodara</span>
                  <span className="text-xs bg-amber-950 border border-amber-700/50 text-amber-200/80 px-2 py-1 rounded">Mumbai</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-amber-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-500/60 text-sm">
            © 2026 SweetCart. All rights reserved.
          </p>
          <p className="text-amber-500/60 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Team 404 ERROR
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
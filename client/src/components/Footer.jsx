import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Heart } from 'lucide-react';
// 🌍 Import the translation hook!
import { useTranslation } from 'react-i18next';

const Footer = () => {
  // 🌍 Initialize the translation engine
  const { t } = useTranslation();

  return (
    <footer className="bg-[#3b1700] text-[#FFFDF8] pt-16 pb-8 border-t-[8px] border-amber-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 COLUMNS LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">SC</div>
              <span className="text-2xl font-black text-white tracking-tight">SweetCart</span>
            </div>
            <p className="text-[#e8d5c4] text-sm leading-relaxed mb-6 font-medium italic">
              {t('brand_desc', 'Rooted in the rich heritage of Surat, SweetCart is the modern evolution of the beloved Shreenath Farsan. For decades, we have been the custodians of authentic recipes, crafting 100% pure vegetarian sweets and savory farsan with the finest ingredients. From our kitchen to your doorstep, we carry forward a legacy of taste, purity, and joy.')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('quick_links', 'Explore')}
            </h4>
            <ul className="space-y-4 text-[#e8d5c4] text-sm font-medium">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">{t('home', 'Home')}</Link></li>
              <li><Link to="/menu" className="hover:text-amber-500 transition-colors">{t('full_menu', 'The Collection')}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('about_us', 'Our Story')}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">{t('contact_support', 'Contact & Support')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Main Branch + EXACT Map */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('main_branch', 'Main Branch')}
            </h4>
            <div className="flex flex-col gap-4 text-[#e8d5c4] text-sm font-medium">
              <div>
                <p className="flex items-start gap-3 mb-2">
                  <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    {t('main_branch_address_1', 'Navsari Bazar Rd, Rustampura,')}<br/>
                    {t('main_branch_address_2', 'Surat, Gujarat 395002')}
                  </span>
                </p>
                <p className="flex items-center gap-3 pl-7">
                  <Phone size={16} className="text-amber-500 shrink-0" />
                  <span className="text-amber-400 font-bold">+91 98251 53531</span>
                </p>
              </div>
              
              {/* 🔥 PRECISE MAIN BRANCH MAP 🔥 */}
              <iframe 
                title="Main Branch Map"
                className="w-full h-28 rounded-xl border border-[#592300] shadow-inner opacity-90 hover:opacity-100 transition-opacity grayscale-[20%] hover:grayscale-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.123!2d72.825!3d21.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDExJzI0LjAiTiA3MsKwNDknMzAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Column 4: Adajan Branch + EXACT Map */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('adajan_branch', 'Adajan Branch')}
            </h4>
            <div className="flex flex-col gap-4 text-[#e8d5c4] text-sm font-medium">
              <div>
                <p className="flex items-start gap-3 mb-2">
                  <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    {t('adajan_address_1', 'Shop No.3, Green Plaza,')}<br/>
                    {t('adajan_address_2', 'Adajan, Surat 395009')}
                  </span>
                </p>
                <p className="flex items-center gap-3 pl-7">
                  <Phone size={16} className="text-amber-500 shrink-0" />
                  <span className="text-amber-400 font-bold">+91 88667 98147</span>
                </p>
              </div>

              {/* 🔥 PRECISE ADAJAN BRANCH MAP 🔥 */}
              <iframe 
                title="Adajan Branch Map"
                className="w-full h-28 rounded-xl border border-[#592300] shadow-inner opacity-90 hover:opacity-100 transition-opacity grayscale-[20%] hover:grayscale-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5!2d72.78!3d21.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEyJzAwLjAiTiA3MsKwNDYnNDguMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#592300] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#e8d5c4] text-sm font-medium">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>© {new Date().getFullYear()} SweetCart. {t('all_rights_reserved', 'Pure Taste, Delivered with Love.')}</p>
            <Link to="/privacy" className="hover:text-amber-500 transition-colors font-bold border-b border-transparent hover:border-amber-500">
              {t('privacy_policy', 'Privacy Policy')}
            </Link>
          </div>
          <p className="flex items-center gap-2">
            {t('made_with', 'Crafted with')} 
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> 
            {t('by', 'by')} 
            <Link to="/team" className="text-amber-500 font-bold hover:text-amber-400 transition-colors border-b border-transparent hover:border-amber-400">
              Team 4O4 ERROR
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
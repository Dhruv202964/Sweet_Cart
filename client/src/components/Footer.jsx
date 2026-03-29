import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone } from 'lucide-react';
// 🌍 Import the translation hook!
import { useTranslation } from 'react-i18next';

const Footer = () => {
  // 🌍 Initialize the translation engine
  const { t } = useTranslation();

  return (
    <footer className="bg-[#3b1700] text-[#FFFDF8] pt-16 pb-8 border-t-[8px] border-amber-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 text-black font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">SC</div>
              <span className="text-2xl font-black text-white tracking-tight">SweetCart</span>
            </div>
            <p className="text-[#e8d5c4] text-sm leading-relaxed mb-6 font-medium">
              {t('brand_desc', 'Born in the heart of Surat, we have been crafting the finest, 100% pure vegetarian sweets and farsan. Originally Shreenathji Farsan, our journey started with a single pan of premium ghee, and today we deliver smiles across the city.')}
            </p>
            <div className="flex gap-4 text-amber-500">
              <span className="hover:text-amber-400 cursor-pointer transition-colors"><Instagram size={20} /></span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors"><Facebook size={20} /></span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors"><Twitter size={20} /></span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('quick_links', 'Quick Links')}
            </h4>
            <ul className="space-y-4 text-[#e8d5c4] text-sm font-medium">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">{t('home', 'Home')}</Link></li>
              <li><Link to="/menu" className="hover:text-amber-500 transition-colors">{t('full_menu', 'Full Menu')}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('about_us', 'About Us')}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">{t('contact_support', 'Contact & Support')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Visit Us */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('visit_us', 'Visit Us')}
            </h4>
            <ul className="space-y-6 text-[#e8d5c4] text-sm font-medium">
              
              {/* Main Branch Block */}
              <li className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-amber-500 shrink-0 mt-1" />
                  <span>
                    <strong className="text-amber-500">{t('main_branch', 'Main Branch:')}</strong><br/>
                    {t('main_branch_address_1', 'Navsari Bazar Rd, Rustampura,')}<br/>
                    {t('main_branch_address_2', 'Surat, Gujarat 395002')}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <Phone size={16} className="text-amber-500 shrink-0" />
                  <span className="text-amber-400 font-bold hover:text-white transition-colors cursor-pointer">+91 98251 53531</span>
                </div>
              </li>

              {/* Adajan Branch Block */}
              <li className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-amber-500 shrink-0 mt-1" />
                  <span>
                    <strong className="text-amber-500">{t('adajan_branch', 'Adajan Branch:')}</strong><br/>
                    {t('adajan_address_1', 'Shop No.3, Green Plaza,')}<br/>
                    {t('adajan_address_2', 'Subhash Chandra Bose Marg,')}<br/>
                    {t('adajan_address_3', 'Adajan, Surat 395009')}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <Phone size={16} className="text-amber-500 shrink-0" />
                  <span className="text-amber-400 font-bold hover:text-white transition-colors cursor-pointer">+91 88667 98147</span>
                </div>
              </li>
              
            </ul>
          </div>

          {/* Column 4: Our Branches */}
          <div>
            <h4 className="text-xl font-black mb-6 text-white flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-500 rounded-full"></span> {t('our_branches', 'Our Branches')}
            </h4>
            <div className="bg-[#240e00] border border-[#592300] p-6 rounded-2xl shadow-inner">
              <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-2">{t('currently_serving', 'Currently Serving')}</p>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#592300]">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white font-black">{t('surat_outlets', 'Surat (2 Outlets)')}</span>
              </div>
              <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-3">{t('coming_soon', 'Coming Soon 🚀')}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#e8d5c4] bg-[#3b1700] px-3 py-1.5 rounded-lg border border-[#592300]">{t('ahmedabad', 'Ahmedabad')}</span>
                <span className="text-xs font-bold text-[#e8d5c4] bg-[#3b1700] px-3 py-1.5 rounded-lg border border-[#592300]">{t('vadodara', 'Vadodara')}</span>
                <span className="text-xs font-bold text-[#e8d5c4] bg-[#3b1700] px-3 py-1.5 rounded-lg border border-[#592300]">{t('mumbai', 'Mumbai')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#592300] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#e8d5c4] text-sm font-medium">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>&copy; {new Date().getFullYear()} SweetCart. {t('all_rights_reserved', 'All rights reserved.')}</p>
            <Link to="/privacy" className="hover:text-amber-500 transition-colors font-bold border-b border-transparent hover:border-amber-500">
              {t('privacy_policy', 'Privacy Policy')}
            </Link>
          </div>
          <p>{t('made_with', 'Made with')} <span className="text-red-500 animate-pulse">❤️</span> {t('by', 'by')} <Link to="/team" className="text-amber-500 font-bold hover:text-amber-400 transition-colors border-b border-transparent hover:border-amber-400">Team 4O4 ERROR</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
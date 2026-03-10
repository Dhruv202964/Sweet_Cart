import React, { useState } from 'react';
import { Store, Heart, ShieldCheck, MapPin, ChefHat, Clock, Phone } from 'lucide-react';

const About = () => {
  // 🌟 NEW: React State to toggle between the two branches!
  const [activeBranch, setActiveBranch] = useState('main');

  // 🌟 The Real Shop Data from your Google Maps Links!
  const branches = {
    main: {
      id: 'main',
      title: 'Rustampura Main Hub',
      name: 'Shreenathji Farsan Sarasiya Khaja & Sweets',
      address: 'Navsari Bazar Rd, Rustampura, Surat, Gujarat 395002',
      phone: '+91 98251 53531',
      hours: 'Mon - Sun: 7:00 AM - 9:00 PM',
      iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.105652720149!2d72.8269672!3d21.1879615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e68084f56d9%3A0xadb43948aea625bd!2sShreenathji%20Farsan%20Sarasiya%20Khaja%20%26%20Sweets!5e0!3m2!1sen!2sin!4v1773151857780!5m2!1sen!2sin'
    },
    adajan: {
      id: 'adajan',
      title: 'Adajan Branch',
      name: 'Shree Nathji Farsan',
      address: 'Shop No.3, Green Plaza, Subhash Chandra Bose Marg, Adajan, Surat 395009',
      phone: '+91 88667 98147',
      hours: 'Mon - Sun: 7:00 AM - 9:00 PM',
      iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.7765262677376!2d72.78235649999999!3d21.201034699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04df28824a71b%3A0xd51cd461c13ad370!2sShree%20Nathji%20Farsan!5e0!3m2!1sen!2sin!4v1773151913983!5m2!1sen!2sin'
    }
  };

  const currentBranch = branches[activeBranch];

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
            Our <span className="text-amber-600">Heritage</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Bringing the authentic, generations-old flavors of Surat's finest sweets and farsan directly to your family's table.
          </p>
        </div>

        {/* The Story Split Section */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight border-b-4 border-amber-500 pb-4 inline-block">The SweetCart Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              It started with a simple vision: to preserve the authentic, rich taste of traditional Surati delicacies. In a world of mass-produced snacks, we wanted to create a haven where every bite feels like home.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              We source only the highest quality ingredients—premium besan, pure desi ghee, and hand-picked spices. Our master chefs bring decades of experience to the kitchen, ensuring that whether it's our famous Sarasiya Khaja or our crispy nylon khaman, the standard remains flawlessly consistent.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Today, SweetCart has grown from our original Rustampura hub to a brand new location in Adajan. Our core philosophy hasn't changed: we don't just sell food; we deliver happiness, celebrations, and memories.
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="bg-amber-100 h-64 rounded-[30px] flex items-center justify-center shadow-inner">
               <ChefHat size={80} className="text-amber-500 opacity-50" />
            </div>
            <div className="bg-red-100 h-64 rounded-[30px] flex items-center justify-center shadow-inner translate-y-8">
               <Store size={80} className="text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-10 rounded-[35px] shadow-xl border border-amber-100 text-center hover:-translate-y-2 transition-transform">
            <div className="bg-amber-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-amber-600 mb-6">
              <Store size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">Authentic Taste</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Prepared using generations-old recipes, ensuring every bite takes you back to the vibrant streets of Surat.</p>
          </div>
          <div className="bg-white p-10 rounded-[35px] shadow-xl border border-amber-100 text-center hover:-translate-y-2 transition-transform">
            <div className="bg-red-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-red-600 mb-6">
              <Heart size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">Made with Love</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Premium quality ingredients and 100% pure ghee go into every single batch we make daily.</p>
          </div>
          <div className="bg-white p-10 rounded-[35px] shadow-xl border border-amber-100 text-center hover:-translate-y-2 transition-transform">
            <div className="bg-green-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-green-600 mb-6">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">100% Hygienic</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Strict quality controls and enterprise-grade packaging keep your food safe, fresh, and perfectly intact.</p>
          </div>
        </div>

        {/* 🗺️ THE INTERACTIVE MULTI-BRANCH MAP SECTION */}
        <div className="bg-gray-900 rounded-[40px] p-8 md:p-16 text-center shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 p-5 rounded-full backdrop-blur-sm mb-6">
              <MapPin size={48} className="text-amber-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Visit Our Kitchens</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              We love seeing our customers! Drop by our main hub in Rustampura or our newly opened Adajan branch to experience the aroma of fresh sweets and farsan being prepared live.
            </p>

            {/* 🌟 The Branch Switcher Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 bg-gray-800 p-2 rounded-2xl w-full max-w-lg mx-auto border border-gray-700">
              <button 
                onClick={() => setActiveBranch('main')}
                className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${activeBranch === 'main' ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                {branches.main.title}
              </button>
              <button 
                onClick={() => setActiveBranch('adajan')}
                className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${activeBranch === 'adajan' ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                {branches.adajan.title}
              </button>
            </div>

            {/* 🌟 The Active Branch Details Card */}
            <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-3xl max-w-4xl w-full mx-auto mb-8 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">{currentBranch.name}</h3>
                <p className="text-gray-400 flex items-start gap-2">
                  <MapPin size={18} className="text-amber-500 shrink-0 mt-1" />
                  {currentBranch.address}
                </p>
              </div>
              <div className="space-y-3 shrink-0">
                <div className="flex items-center gap-3 text-white font-bold bg-gray-900 px-4 py-3 rounded-xl border border-gray-700">
                  <Phone size={18} className="text-amber-500" /> {currentBranch.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm font-medium px-2">
                  <Clock size={16} className="text-gray-500" /> {currentBranch.hours}
                </div>
              </div>
            </div>
            
            {/* 🌟 The Interactive Google Maps Iframe */}
            <div className="w-full max-w-4xl h-[450px] bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden relative mx-auto animate-in zoom-in-95 duration-500">
              <iframe 
                src={currentBranch.iframe} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
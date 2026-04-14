import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, PackagePlus, Info, Mail, Loader2 } from 'lucide-react'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH LIVE SLIDERS FROM THE DATABASE
  useEffect(() => {
    fetch('http://localhost:5000/api/sliders')
      .then(res => res.json())
      .then(data => {
        const activeSliders = data.filter(slider => slider.is_active);
        setSlides(activeSliders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch sliders", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[85vh] bg-zinc-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
      </div>
    );
  }

  // 2. FALLBACK ENGINE: If the database is empty, show a default banner
  const displaySlides = slides.length > 0 ? slides : [
    {
      id: 'fallback_1',
      image_url: 'https://images.unsplash.com/photo-1633933358116-a27b902fad35?q=80&w=1920&auto=format&fit=crop', 
      title: 'Royal Surat Sweets',
      subtitle: 'PREMIUM QUALITY 100% PURE',
      cta_text: 'Explore Collection',
      cta_link: '/menu'
    }
  ];

  return (
    <div className="w-full h-[85vh] relative bg-zinc-900 group">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={displaySlides.length > 1} 
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {displaySlides.map((slide) => {
          const ctaText = slide.cta_text || 'Shop Now';
          const ctaLink = slide.cta_link || '/menu';
          
          let IconComponent = ShoppingCart; 
          if (ctaLink.includes('make-your-own-box')) IconComponent = PackagePlus;
          if (ctaLink.includes('about')) IconComponent = Info;
          if (ctaLink.includes('contact')) IconComponent = Mail;
          
          const isSpecialLink = ctaLink.includes('make-your-own-box') || ctaLink.includes('contact');

          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              
              <img 
                src={slide.image_url} 
                alt={slide.title || "SweetCart Hero Banner"} 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent z-10"></div>

              <div className="relative z-20 max-w-7xl mx-auto h-full flex items-center px-6 sm:px-8 lg:px-12">
                
                <div className="max-w-2xl text-left mt-24 md:mt-32">
                  
                  {slide.subtitle && (
                    <span className="inline-block text-amber-500 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase mb-4 drop-shadow-md">
                      {isSpecialLink && <PackagePlus size={16} className="inline mr-2 -mt-1" />}
                      {slide.subtitle}
                    </span>
                  )}

                  {slide.title && (
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg font-serif">
                      {slide.title}
                    </h1>
                  )}
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md font-light">
                    Experience pure indulgence with our signature traditional sweets. Crafted with premium desi ghee and generations of love.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Link 
                      to={ctaLink} 
                      className={`inline-flex items-center gap-3 px-8 py-4 font-bold rounded-full text-lg shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        isSpecialLink 
                        ? 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                        : 'bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      }`}
                    >
                      <IconComponent size={22} />
                      {ctaText}
                    </Link>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {displaySlides.length > 1 && (
          <>
            <div className="swiper-button-prev !text-white/70 hover:!text-amber-500 transition-colors !left-4 md:!left-8 after:!text-2xl md:after:!text-3xl"></div>
            <div className="swiper-button-next !text-white/70 hover:!text-amber-500 transition-colors !right-4 md:!right-8 after:!text-2xl md:after:!text-3xl"></div>
          </>
        )}

      </Swiper>
    </div>
  );
};

export default HeroSlider;
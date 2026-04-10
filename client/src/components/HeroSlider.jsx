import { Link } from 'react-router-dom';
import { ShoppingCart, PackagePlus, Zap } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Removed the buggy effect-fade import!
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const slidesData = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1633933358116-a27b902fad35?q=80&w=1920&auto=format&fit=crop', 
    title: 'Royal Surat Sweets',
    subtitle: 'PREMIUM QUALITY 100% PURE',
    description: 'Experience pure indulgence with our signature traditional sweets. Crafted with premium desi ghee, rich dry fruits, and generations of love.',
    ctaText: 'Explore Collection',
    ctaLink: '/menu',
    ctaIcon: ShoppingCart,
    isSpecial: false
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1920&auto=format&fit=crop', 
    title: 'Make Your Own Box',
    subtitle: 'BESPOKE GIFTING EXPERIENCE',
    description: 'The ultimate gift, designed by you. Select from our entire range of premium sweets and authentic namkeen to create a custom box tailored to your taste.',
    ctaText: 'Customize Now',
    ctaLink: '/make-your-own-box', 
    ctaIcon: PackagePlus,
    isSpecial: true 
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1546549021-ebb2cfeb13eb?q=80&w=1920&auto=format&fit=crop',
    title: 'Authentic Surati Farsan',
    subtitle: 'CRISPY, SPICY & FRESH',
    description: 'Irresistibly fresh and savory. Order our famous namkeen and enjoy the true, spicy flavors of Surat delivered straight to your door.',
    ctaText: 'Order Fresh',
    ctaLink: '/menu', 
    ctaIcon: Zap,
    isSpecial: false
  },
];

const HeroSlider = () => {
  return (
    <div className="w-full h-[85vh] relative bg-zinc-900 group">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        // Removed buggy fade effect. Now uses ultra-smooth standard slide!
        loop={true}
        speed={800} // Smooth, premium sliding speed
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
        {slidesData.map((slide) => {
          const IconComponent = slide.ctaIcon;
          
          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              
              {/* Background Image */}
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Aesthetic Overlay: Darker gradient so white text pops perfectly */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent z-10"></div>

              {/* Content Container */}
              <div className="relative z-20 max-w-7xl mx-auto h-full flex items-center px-6 sm:px-8 lg:px-12">
                
                {/* 🚀 ADDED mt-24 TO PUSH TEXT DOWN BELOW THE NAVBAR */}
                <div className="max-w-2xl text-left mt-24 md:mt-32">
                  
                  {/* Purshottam Style Subtitle */}
                  <span className="inline-block text-amber-500 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase mb-4 drop-shadow-md">
                    {slide.isSpecial && <PackagePlus size={16} className="inline mr-2 -mt-1" />}
                    {slide.subtitle}
                  </span>

                  {/* Purshottam Style Serif Heading */}
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg font-serif">
                    {slide.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md font-light">
                    {slide.description}
                  </p>
                  
                  {/* Clickable Buttons */}
                  <div className="flex items-center gap-4">
                    <Link 
                      to={slide.ctaLink} 
                      className={`inline-flex items-center gap-3 px-8 py-4 font-bold rounded-full text-lg shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        slide.isSpecial 
                        ? 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                        : 'bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      }`}
                    >
                      <IconComponent size={22} />
                      {slide.ctaText}
                    </Link>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Navigation Arrows */}
        <div className="swiper-button-prev !text-white/70 hover:!text-amber-500 transition-colors !left-4 md:!left-8 after:!text-2xl md:after:!text-3xl"></div>
        <div className="swiper-button-next !text-white/70 hover:!text-amber-500 transition-colors !right-4 md:!right-8 after:!text-2xl md:after:!text-3xl"></div>

      </Swiper>
    </div>
  );
};

export default HeroSlider;
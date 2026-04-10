import React, { useState, useEffect, useContext } from 'react';
import { Star, Plus, ChevronRight, Award, ShieldCheck, Heart, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// 🚀 IMPORTING YOUR CUSTOM LOCAL IMAGES
import story1Img from '../assets/story1.png'; 
import story2Img from '../assets/story2.png';
import story3Img from '../assets/story3.png';

// 🌟 IMPORTING THE NEW MASTERPIECE SLIDER
import HeroSlider from '../components/HeroSlider'; 

// 🌟 Magic Auto-Sliding Image Component
const AutoSlidingImage = ({ mainImage, gallery, category }) => {
  const images = [mainImage, ...(gallery || [])].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return <span className="text-7xl group-hover:scale-110 transition duration-500 drop-shadow-md">{category === 'Sweets' ? '🍬' : category === 'Dairy' ? '🥛' : '🥟'}</span>;

  return (
    <img 
      src={images[currentIndex]} 
      alt="Product view" 
      className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-all duration-700 ease-in-out" 
      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=500&auto=format&fit=crop'; }}
    />
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQuantity } = useContext(CartContext); 

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const availableProducts = data.filter(p => p.stock_quantity > 0);
        setProducts(availableProducts);
        const uniqueCategories = [...new Set(availableProducts.map(p => p.category_name || 'Sweets'))];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) setActiveCategory(uniqueCategories[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const displayedProducts = products
    .filter(product => product.category_name === activeCategory)
    .slice(0, 4);

  // 🏆 BESTSELLER LOGIC
  const bestsellers = products.filter(p => p.is_bestseller);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers.slice(0, 4) : products.slice(0, 4);

  // Reusable Product Card Component
  const ProductCard = ({ product, isBestsellerBadge }) => (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden border border-amber-100 group flex flex-col relative">
      
      {/* 🏆 Bestseller Badge */}
      {isBestsellerBadge && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-in zoom-in duration-300">
          <Sparkles size={12} /> Bestseller
        </div>
      )}

      <Link to={`/product/${product.product_id}`} className="block h-52 bg-amber-50 relative overflow-hidden flex items-center justify-center p-4 cursor-pointer">
        <AutoSlidingImage mainImage={product.image_url} gallery={product.gallery_images} category={product.category_name} />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link to={`/product/${product.product_id}`} className="cursor-pointer hover:underline decoration-amber-500 decoration-2">
            <h3 className="text-md font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center bg-amber-100 px-2 py-0.5 rounded text-amber-700 text-xs font-bold"><Star size={10} className="mr-1 fill-amber-500 text-amber-500" /> 4.8</div>
        </div>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-amber-50">
          <div>
            <span className="text-xl font-black text-gray-900">₹{parseFloat(product.price).toFixed(2)}</span>
            <span className="text-[10px] text-amber-600 font-bold ml-1 uppercase">/ {product.unit || 'kg'}</span>
          </div>
          
          {(() => {
            const cartItem = cart.find(c => c.product_id === product.product_id);
            if (cartItem) {
              return (
                <div className="flex items-center bg-amber-100 rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                  <button onClick={() => decreaseQuantity(product.product_id)} className="px-3 py-2 text-amber-700 hover:bg-amber-200 hover:text-red-700 transition-colors font-black text-lg leading-none">-</button>
                  <span className="px-1 py-2 text-amber-900 font-bold min-w-[24px] text-center text-sm">{cartItem.quantity}</span>
                  <button onClick={() => addToCart(product)} className="px-3 py-2 text-amber-700 hover:bg-amber-200 hover:text-green-700 transition-colors font-black text-lg leading-none">+</button>
                </div>
              );
            }
            return (
              <button onClick={() => addToCart(product)} className="bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white p-2.5 rounded-xl transition-all group-hover:shadow-md">
                <Plus size={18} strokeWidth={3} />
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20 overflow-hidden relative">
      
      {/* 🌟 PREMIUM HERO CAROUSEL REPLACES OLD BANNER */}
      <HeroSlider />

      {/* 🌟 LUXURY CATEGORY TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-10 relative z-10">
        <div className="flex justify-center overflow-x-auto hide-scrollbar gap-4 pb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-white text-gray-600 shadow-sm border border-amber-100 hover:text-amber-600 hover:border-amber-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 CATEGORY PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin text-amber-500 w-12 h-12 mx-auto" /></div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">No items found</h3></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map(product => <ProductCard key={product.product_id} product={product} />)}
            </div>

            <div className="mt-12 text-center">
              <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 bg-white border-2 border-amber-200 text-amber-700 px-8 py-3 rounded-full font-bold hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm">
                See Full Menu <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🏆 BESTSELLERS SECTION */}
      {!loading && products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-amber-500" size={36} />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Our Bestsellers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {displayBestsellers.map(product => <ProductCard key={`best-${product.product_id}`} product={product} isBestsellerBadge={true} />)}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 📖 THE INSPIRING STORY SECTIONS */}
      {/* ========================================== */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden relative z-10">
        
        {/* STORY 1: ORIGIN (Image Right) */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-32">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="flex items-center gap-2 text-amber-600 font-bold tracking-widest uppercase text-sm mb-4">
              <Heart size={16} /> The Legacy Begins
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">From Shreenath Farsan <br/> to SweetCart.</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">
              It all started with a simple passion: bringing the most authentic, mouth-watering Surati snacks and sweets to our local community. For years, Shreenath Farsan has been a household name, known for our secret family recipes and unmatched taste.
            </p>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Now, with SweetCart, we are taking that same love and tradition online. We believe that distance shouldn't stop you from enjoying the flavors you grew up with. Our digital storefront brings the heart of our kitchen directly to your doorstep.
            </p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            {/* ✨ TILTED IMAGE EFFECT - LOCAL CUSTOM IMAGE 1 */}
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img 
                 src={story1Img} 
                 alt="Traditional Indian Farsan and Snacks" 
                 className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
               />
               <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>

        {/* STORY 2: QUALITY & HYGIENE (Image Left) */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-32">
          <div className="md:w-1/2">
            {/* ✨ TILTED IMAGE EFFECT - LOCAL CUSTOM IMAGE 2 */}
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img 
                 src={story2Img} 
                 alt="Premium Sweets Packaging" 
                 className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
               />
               <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 text-red-600 font-bold tracking-widest uppercase text-sm mb-4">
              <ShieldCheck size={16} /> Uncompromised Quality
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">Pure Ingredients.<br/>Perfect Packaging.</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">
              We never cut corners. Every single sweet and snack is prepared in a state-of-the-art, hyper-hygienic kitchen using only 100% pure desi ghee, premium nuts, and locally sourced spices. 
            </p>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              But great food needs great care. Our custom-designed packaging ensures that whether you order Kaju Katli or crispy Farsan, it arrives at your home looking and tasting exactly as fresh as the moment it left our kitchen. Zero spills, maximum freshness.
            </p>
          </div>
        </div>

        {/* STORY 3: TECH & EXPERIENCE (Image Right) */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="flex items-center gap-2 text-amber-600 font-bold tracking-widest uppercase text-sm mb-4">
              <Sparkles size={16} /> The SweetCart Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">Why Our Customers<br/>Love Shopping Here.</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">
              We didn't just build a website; we built an experience. SweetCart is designed to be blazingly fast and incredibly easy to use. No confusing menus, no hidden fees.
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> Real-time Order Tracking</li>
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> 100% Secure UPI & Wallet Payments</li>
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> Express 24-Hour Delivery in Surat</li>
            </ul>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We combined the old-school charm of traditional sweets with cutting-edge technology to give you the ultimate dessert shopping experience.
            </p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
             {/* ✨ TILTED IMAGE EFFECT - LOCAL CUSTOM IMAGE 3 */}
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img 
                 src={story3Img} 
                 alt="Secure Mobile Ordering" 
                 className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
               />
               <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
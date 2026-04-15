import React, { useState, useEffect, useContext } from 'react';
import { Star, Plus, ChevronRight, Award, ShieldCheck, Heart, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
// 🌍 NEW: IMPORTING TRANSLATION ENGINE
import { useTranslation } from 'react-i18next';

import story1Img from '../assets/story1.png'; 
import story2Img from '../assets/story2.png';
import story3Img from '../assets/story3.png';
import HeroSlider from '../components/HeroSlider'; 

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
  
  // 🌍 NEW: INIT TRANSLATION
  const { t } = useTranslation();

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

  const displayedProducts = products.filter(product => product.category_name === activeCategory).slice(0, 4);
  const bestsellers = products.filter(p => p.is_bestseller);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers.slice(0, 4) : products.slice(0, 4);

  const ProductCard = ({ product, isBestsellerBadge }) => {
    const [selectedWeight, setSelectedWeight] = useState('1KG');
    const isKg = product.unit?.toLowerCase() === 'kg';
    const weightMultiplier = selectedWeight === '250G' ? 0.25 : selectedWeight === '500G' ? 0.5 : 1;
    const displayPrice = isKg ? (parseFloat(product.price) * weightMultiplier) : parseFloat(product.price);
    const uniqueCartId = isKg ? `${product.product_id}_${selectedWeight}` : `${product.product_id}_default`;
    const cartItem = cart.find(c => c.cartItemId ? c.cartItemId === uniqueCartId : c.product_id === product.product_id);

    const handleAddToCart = () => {
      addToCart({ ...product, price: displayPrice, weight_selected: isKg ? selectedWeight : (product.unit || 'pcs'), cartItemId: uniqueCartId });
    };
    const handleDecrease = () => { decreaseQuantity(cartItem.cartItemId || product.product_id); };

    return (
      <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden border border-amber-100 group flex flex-col relative">
        {isBestsellerBadge && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-in zoom-in duration-300">
            <Sparkles size={12} /> {t('bestseller_badge', 'Bestseller')}
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
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-amber-50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{t('price_label', 'Price')}</span>
              <div className="flex items-baseline">
                <span className="text-xl font-black text-gray-900">₹{displayPrice.toFixed(2)}</span>
                {isKg ? (
                  <select value={selectedWeight} onChange={(e) => setSelectedWeight(e.target.value)} className="ml-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded focus:ring-amber-500 focus:border-amber-500 py-0.5 px-1 cursor-pointer outline-none">
                    <option value="250G">250G</option>
                    <option value="500G">500G</option>
                    <option value="1KG">1KG</option>
                  </select>
                ) : (
                  <span className="text-[10px] text-amber-600 font-bold ml-1 uppercase">/ {product.unit || 'kg'}</span>
                )}
              </div>
            </div>
            {cartItem ? (
              <div className="flex items-center bg-amber-100 rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                <button onClick={handleDecrease} className="px-3 py-2 text-amber-700 hover:bg-amber-200 hover:text-red-700 transition-colors font-black text-lg leading-none">-</button>
                <span className="px-1 py-2 text-amber-900 font-bold min-w-[24px] text-center text-sm">{cartItem.quantity}</span>
                <button onClick={handleAddToCart} className="px-3 py-2 text-amber-700 hover:bg-amber-200 hover:text-green-700 transition-colors font-black text-lg leading-none">+</button>
              </div>
            ) : (
              <button onClick={handleAddToCart} className="bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white p-2.5 rounded-xl transition-all group-hover:shadow-md">
                <Plus size={18} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20 overflow-hidden relative">
      
      {/* 🚀 THE FADE FIX: Wrapper around HeroSlider */}
      <div className="relative">
        <HeroSlider />
        {/* Seamless bottom fade overlay */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FFFDF8] to-transparent pointer-events-none z-10"></div>
      </div>

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
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">{t('no_items_found', 'No items found')}</h3></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map(product => <ProductCard key={product.product_id} product={product} />)}
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 bg-white border-2 border-amber-200 text-amber-700 px-8 py-3 rounded-full font-bold hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm">
                {t('see_full_menu', 'See Full Menu')} <ChevronRight size={20} />
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{t('our_bestsellers', 'Our Bestsellers')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {displayBestsellers.map(product => <ProductCard key={`best-${product.product_id}`} product={product} isBestsellerBadge={true} />)}
          </div>
        </div>
      )}

      {/* 📖 THE INSPIRING STORY SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden relative z-10">
        
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-32">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="flex items-center gap-2 text-amber-600 font-bold tracking-widest uppercase text-sm mb-4">
              <Heart size={16} /> {t('story1_subtitle', 'The Legacy Begins')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">{t('story1_title', 'From Shreenath Farsan to SweetCart.')}</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">{t('story1_p1', 'It all started with a simple passion...')}</p>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">{t('story1_p2', 'Now, with SweetCart, we are taking that same love and tradition online...')}</p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img src={story1Img} alt="Traditional Farsan" className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
               <div className="absolute inset-0 bg-amber-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-32">
          <div className="md:w-1/2">
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img src={story2Img} alt="Premium Sweets" className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
               <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 text-red-600 font-bold tracking-widest uppercase text-sm mb-4">
              <ShieldCheck size={16} /> {t('story2_subtitle', 'Uncompromised Quality')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">{t('story2_title', 'Pure Ingredients. Perfect Packaging.')}</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">{t('story2_p1', 'We never cut corners...')}</p>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">{t('story2_p2', 'But great food needs great care...')}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="flex items-center gap-2 text-amber-600 font-bold tracking-widest uppercase text-sm mb-4">
              <Sparkles size={16} /> {t('story3_subtitle', 'The SweetCart Advantage')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-6 leading-tight">{t('story3_title', 'Why Our Customers Love Shopping Here.')}</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">{t('story3_p1', 'We didn\'t just build a website...')}</p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> {t('story3_li1', 'Real-time Order Tracking')}</li>
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> {t('story3_li2', '100% Secure Payments')}</li>
              <li className="flex items-center gap-3 text-gray-700 font-bold"><CheckCircle className="text-green-500" size={20} /> {t('story3_li3', 'Express Delivery')}</li>
            </ul>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">{t('story3_p2', 'We combined the old-school charm...')}</p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border-8 border-white bg-amber-100">
               <img src={story3Img} alt="Secure Mobile Ordering" className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
               <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
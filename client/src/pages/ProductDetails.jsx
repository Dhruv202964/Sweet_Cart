import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { CartContext } from '../context/CartContext';
// 🌍 NEW: IMPORTING TRANSLATION ENGINE
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
  const { t } = useTranslation(); // 🌍 INIT TRANSLATION
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const foundProduct = data.find(p => String(p.product_id) === String(id));
        setProduct(foundProduct);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch product details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center text-amber-900">
        <span className="text-6xl mb-4">🥺</span>
        <h2 className="text-3xl font-black mb-4">{t('product_not_found', 'Product Not Found')}</h2>
        <button onClick={() => navigate('/menu')} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-md transition-all">
          {t('back_to_menu', 'Back to Menu')}
        </button>
      </div>
    );
  }

  const cartItem = cart.find(c => c.product_id === product.product_id);

  // Combine images for gallery
  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> {t('back_to_menu', 'Back to Menu')}
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: IMAGE GALLERY */}
          <div className="md:w-1/2 bg-amber-50 relative p-8 flex items-center justify-center min-h-[400px] group">
            {allImages.length > 0 ? (
              <>
                <img 
                  src={allImages[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-2xl shadow-lg transition-all duration-500"
                />
                
                {allImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-10 bg-white/80 hover:bg-white text-amber-900 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="absolute right-10 bg-white/80 hover:bg-white text-amber-900 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight size={24} />
                    </button>
                    
                    <div className="absolute bottom-12 flex gap-2">
                      {allImages.map((_, idx) => (
                        <div key={idx} className={`h-2 w-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-amber-600 w-4' : 'bg-amber-300/60'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <span className="text-9xl drop-shadow-md">
                {product.category_name === 'Sweets' ? '🍬' : product.category_name === 'Dairy' ? '🥛' : '🥟'}
              </span>
            )}
            
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-red-800 text-sm font-black px-4 py-2 rounded-full shadow border border-amber-100 uppercase tracking-wider">
              {product.category_name}
            </div>
          </div>

          {/* Right Side: Product Details & Cart */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="flex items-center gap-2 text-amber-600 font-bold mb-2">
              <Star className="fill-amber-500" size={18} /> 4.8 / 5.0 {t('authentic_surati_taste', '(Authentic Surati Taste)')}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-red-800 mb-6 flex items-end gap-2">
              ₹{parseFloat(product.price).toFixed(2)}
              <span className="text-sm text-gray-500 mb-1 font-semibold uppercase">/ {product.unit || 'kg'}</span>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description || t('default_product_desc', 'Experience the rich, authentic taste of our premium sweets.')}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-black text-amber-950 mb-3 flex items-center gap-2">
                <Leaf size={20} className="text-green-600" /> {t('premium_ingredients_title', 'Premium Ingredients')}
              </h3>
              <p className="text-amber-800 font-medium leading-relaxed">
                {product.ingredients || t('premium_ingredients_desc', 'Premium quality ingredients. Contact store for exact details.')}
              </p>
            </div>

            <div className="flex gap-4 mb-auto">
              <span className="flex items-center gap-1 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200"><ShieldCheck size={16}/> {t('pure_veg', '100% Pure Veg')}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">{t('freshly_made', 'Freshly Made')}</span>
            </div>

            {/* Magic Cart Button */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              {cartItem ? (
                <div className="flex items-center justify-between bg-amber-100 rounded-2xl border border-amber-300 overflow-hidden shadow-sm h-14">
                  <button onClick={() => decreaseQuantity(product.product_id)} className="w-16 h-full flex items-center justify-center text-amber-800 hover:bg-amber-200 hover:text-red-700 transition-colors font-black text-2xl">-</button>
                  <span className="flex-1 text-center text-amber-950 font-black text-xl">{cartItem.quantity} {product.unit || 'kg'} {t('in_cart', 'in Cart')}</span>
                  <button onClick={() => addToCart(product)} className="w-16 h-full flex items-center justify-center text-amber-800 hover:bg-amber-200 hover:text-green-700 transition-colors font-black text-2xl">+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)} className="w-full h-14 bg-red-800 hover:bg-red-900 text-white rounded-2xl font-black text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
                  {t('add_to_cart', 'Add to Cart')} 🛒
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
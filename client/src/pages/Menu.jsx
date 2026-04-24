import React, { useState, useEffect, useContext } from 'react';
import { Star, Plus, Award, Sparkles, Loader2, Leaf, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import { CartContext } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

// ✨ THE PERFECT SPARKLE HEADING
const FancyHeading = ({ word1, word2, color1 = "text-amber-950", color2 = "text-red-700", iconColor = "text-amber-500", dividerColor = "bg-amber-200" }) => (
  <div className="flex flex-col items-center justify-center mb-10 w-full text-center">
    <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-wide mb-3 flex gap-3 justify-center items-center">
      <span className={color1}>{word1}</span>
      {word2 && <span className={color2}>{word2}</span>}
    </h2>
    <div className="flex items-center gap-4 opacity-80">
      <div className={`h-[2px] w-12 md:w-24 ${dividerColor} rounded-full`}></div>
      <Sparkles className={`${iconColor} w-6 h-6`} />
      <div className={`h-[2px] w-12 md:w-24 ${dividerColor} rounded-full`}></div>
    </div>
  </div>
);

// ✨ ELEGANT CATEGORY DIVIDER (NO EMOJIS, PURE PREMIUM)
const CategoryDivider = ({ title }) => (
  <div className="flex items-center justify-center gap-6 mb-8 mt-12 w-full">
    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-amber-200 rounded-full"></div>
    <h2 className="text-3xl font-serif font-bold text-amber-950 tracking-wide">
      {title}
    </h2>
    <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-amber-200 rounded-full"></div>
  </div>
);

const MenuProductCard = ({ product, category }) => {
  const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
  const [selectedWeight, setSelectedWeight] = useState('1KG');
  const { t } = useTranslation();

  const isKg = product.unit?.toLowerCase() === 'kg';
  const weightMultiplier = selectedWeight === '250G' ? 0.25 : selectedWeight === '500G' ? 0.5 : 1;
  const displayPrice = isKg ? (parseFloat(product.price) * weightMultiplier) : parseFloat(product.price);

  const uniqueCartId = isKg ? `${product.product_id}_${selectedWeight}` : `${product.product_id}_default`;
  const cartItem = cart.find(c => c.cartItemId ? c.cartItemId === uniqueCartId : c.product_id === product.product_id);
  const isSugarFree = product.category_name?.toLowerCase() === 'sugar-free';

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: displayPrice,
      weight_selected: isKg ? selectedWeight : (product.unit || 'pcs'),
      cartItemId: uniqueCartId
    });
  };

  const handleDecrease = () => {
    decreaseQuantity(cartItem.cartItemId || product.product_id);
  };

  return (
    <div className={`bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border group flex flex-col relative ${isSugarFree ? 'hover:shadow-emerald-500/20 border-emerald-100' : 'hover:shadow-amber-500/10 border-amber-100'}`}>
      
      {/* 🌿 SUGAR-FREE BADGE */}
      {isSugarFree && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <Leaf size={12} /> {t('sugar_free_badge', 'Sugar-Free')}
        </div>
      )}

      {/* 🔥 BESTSELLER BADGE */}
      {product.is_bestseller && !isSugarFree && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <Award size={12} /> {t('bestseller_badge', 'Bestseller')}
        </div>
      )}

      <Link to={`/product/${product.product_id}`} className={`block h-56 relative overflow-hidden flex items-center justify-center p-4 cursor-pointer ${isSugarFree ? 'bg-emerald-50/50' : 'bg-amber-50'}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition duration-700" />
        ) : (
          <span className="text-7xl group-hover:scale-110 transition duration-500">{category === 'Sweets' ? '🍬' : '🍽️'}</span>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link to={`/product/${product.product_id}`} className={`cursor-pointer hover:underline decoration-2 ${isSugarFree ? 'decoration-emerald-500' : 'decoration-amber-500'}`}>
            <h3 className={`text-lg font-bold text-gray-900 leading-tight transition-colors ${isSugarFree ? 'group-hover:text-emerald-700' : 'group-hover:text-amber-600'}`}>{product.name}</h3>
          </Link>
          <div className="flex items-center bg-amber-100 px-2 py-1 rounded text-amber-700 text-xs font-bold shrink-0">
            <Star size={12} className="mr-1 fill-amber-500 text-amber-500" /> 4.8
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">{product.description || t('default_product_desc', 'Fresh and authentic quality, made with premium ingredients.')}</p>
        
        <div className={`flex items-end justify-between mt-auto pt-4 border-t ${isSugarFree ? 'border-emerald-50' : 'border-amber-50'}`}>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{t('price_label', 'Price')}</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-gray-900">₹{displayPrice.toFixed(2)}</span>
              
              {isKg ? (
                <select 
                  value={selectedWeight} 
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className={`ml-1 border text-xs font-bold rounded py-0.5 px-1 cursor-pointer outline-none ${isSugarFree ? 'bg-emerald-50 border-emerald-200 text-emerald-900 focus:ring-emerald-500' : 'bg-amber-50 border-amber-200 text-amber-900 focus:ring-amber-500'}`}
                >
                  <option value="250G">250G</option>
                  <option value="500G">500G</option>
                  <option value="1KG">1KG</option>
                </select>
              ) : (
                <span className="text-xs text-amber-600 font-bold ml-1 uppercase">/ {product.unit || 'pcs'}</span>
              )}
            </div>
          </div>

          {/* 🌟 QUANTITY BUTTONS */}
          {cartItem ? (
            <div className={`flex items-center rounded-2xl border overflow-hidden shadow-sm h-12 ${isSugarFree ? 'bg-emerald-100 border-emerald-200' : 'bg-amber-100 border-amber-200'}`}>
              <button onClick={handleDecrease} className={`w-12 h-full flex items-center justify-center transition-colors font-black text-2xl ${isSugarFree ? 'text-emerald-700 hover:bg-emerald-200 hover:text-red-700' : 'text-amber-700 hover:bg-amber-200 hover:text-red-700'}`}>-</button>
              <span className={`w-8 text-center font-bold text-base ${isSugarFree ? 'text-emerald-900' : 'text-amber-900'}`}>{cartItem.quantity}</span>
              <button onClick={handleAddToCart} className={`w-12 h-full flex items-center justify-center transition-colors font-black text-2xl ${isSugarFree ? 'text-emerald-700 hover:bg-emerald-200' : 'text-amber-700 hover:bg-amber-200'}`}>+</button>
            </div>
          ) : (
            <button onClick={handleAddToCart} className={`w-12 h-full flex items-center justify-center rounded-2xl transition-all group-hover:shadow-md ${isSugarFree ? 'bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white' : 'bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white'}`}>
              <Plus size={20} strokeWidth={3} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { searchQuery } = useContext(CartContext);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const availableProducts = data.filter(p => p.stock_quantity > 0);
        setProducts(availableProducts);
        
        // Exclude Sugar-Free from main loop to give it the special green section below!
        const uniqueCategories = [...new Set(availableProducts.map(p => p.category_name || 'Uncategorized'))].filter(c => c.toLowerCase() !== 'sugar-free');
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  const sugarFreeProducts = filteredProducts.filter(p => p.category_name?.toLowerCase() === 'sugar-free');

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🌟 BRAND-ALIGNED TITLE */}
        <div className="mb-10 text-center">
          <FancyHeading word1="SweetCart" word2="Signatures" color1="text-slate-800" color2="text-amber-600" />
          <p className="text-amber-800 text-lg -mt-4">{t('menu_subtitle', 'Our exclusive range of authentic Surat farsan and mithai, delivered fresh.')}</p>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin text-amber-500 w-12 h-12 mx-auto" /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">{t('no_items_found', 'No items found')}</h3></div>
        ) : (
          <div className="space-y-16">
            
            {/* 🌟 RENDER STANDARD CATEGORIES (NO EMOJIS) */}
            {categories.map(category => {
              const categoryProducts = filteredProducts.filter(p => p.category_name === category);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="category-section">
                  <CategoryDivider title={category} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryProducts.map(product => (
                      <MenuProductCard key={product.product_id} product={product} category={category} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 🌿 DEDICATED SUGAR-FREE SECTION AT THE BOTTOM OF THE MENU PAGE */}
            {sugarFreeProducts.length > 0 && (
              <div className="mt-20 pt-10 border-t-2 border-emerald-100">
                 <div className="bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-[3rem] p-8 md:p-12 shadow-sm border border-emerald-100 relative overflow-hidden">
                    <Leaf className="absolute -top-10 -left-10 text-emerald-200 opacity-40 w-48 h-48 -rotate-45" />
                    <Leaf className="absolute -bottom-10 -right-10 text-emerald-200 opacity-40 w-48 h-48 rotate-45" />
                    
                    <div className="relative z-10">
                      <FancyHeading 
                        word1="Sugar" 
                        word2="Free" 
                        color1="text-emerald-900" 
                        color2="text-emerald-600"
                        iconColor="text-emerald-500"
                        dividerColor="bg-emerald-200" 
                      />
                      <p className="text-center text-emerald-800 font-medium mb-12 max-w-2xl mx-auto text-lg">
                        Indulge without the guilt! Our exclusive range of diabetic-friendly farsan and mithai, perfect for health-conscious lovers.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {sugarFreeProducts.map(product => (
                          <MenuProductCard key={`sf-${product.product_id}`} product={product} category="Sugar-Free" />
                        ))}
                      </div>

                      {/* 🌟 LINK TO THE DEDICATED SUGAR-FREE STORY PAGE */}
                      <div className="mt-12 text-center">
                        <button 
                          onClick={() => navigate('/sugar-free')} 
                          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                          Explore the Full Health Story <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                 </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Star, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const availableProducts = data.filter(p => p.stock_quantity > 0);
        setProducts(availableProducts);
        
        // Exclude "All", just get the pure categories
        const uniqueCategories = [...new Set(availableProducts.map(p => p.category_name || 'Sweets'))];
        setCategories(uniqueCategories);
        
        // Automatically select the first category (e.g., 'Sweets')
        if (uniqueCategories.length > 0) setActiveCategory(uniqueCategories[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic: If searching, search everything. If not, filter by exact category.
  let filteredProducts = products;
  if (searchQuery) {
    filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
  } else {
    filteredProducts = products.filter(product => product.category_name === activeCategory);
  }

  // Strictly limit to 4 items unless they are actively typing a search
  const displayedProducts = searchQuery ? filteredProducts : filteredProducts.slice(0, 4);

  const handleAddToCart = (productName) => {
    setCartCount(prev => prev + 1);
    alert(`${productName} added to your cart! 🍬`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-amber-950 font-black text-xl shadow-md border-2 border-white">
                SC
              </div>
              <span className="font-black text-2xl text-gray-800 tracking-tight">Sweet<span className="text-amber-500">Cart</span></span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-400" />
              </div>
              <input type="text" placeholder="Search for premium sweets, farsan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-11 pr-4 py-3 border border-amber-200 rounded-full bg-amber-50/50 placeholder-amber-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 sm:text-sm transition-all shadow-inner" />
            </div>

            <div className="flex items-center">
              <button className="relative p-2 text-gray-600 hover:text-amber-600 transition">
                <ShoppingCart size={28} />
                {cartCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-15 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8] to-transparent top-3/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
          <span className="text-amber-900 font-bold tracking-widest uppercase text-sm mb-4 bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm">Premium Quality 100% Pure</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-amber-950 mb-6 drop-shadow-sm">Authentic Taste, <br className="hidden md:block" /> Delivered Fresh.</h1>
          <p className="text-lg md:text-xl text-amber-900 max-w-2xl mb-10 font-medium leading-relaxed">From our signature Pista Ghari to crispy Nylon Khaman. Experience the true flavors of Surat.</p>
          <button onClick={() => navigate('/menu')} className="bg-amber-950 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 hover:shadow-xl transition-all hover:-translate-y-1">Explore Full Menu</button>
        </div>
      </div>

      {/* LUXURY CATEGORY TABS (NO "ALL" BUTTON) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-10 pt-4">
        <div className="flex justify-center overflow-x-auto hide-scrollbar gap-4 pb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => { setActiveCategory(category); setSearchQuery(''); }}
              className={`whitespace-nowrap px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category && !searchQuery
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-white text-gray-600 shadow-sm border border-amber-100 hover:text-amber-600 hover:border-amber-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 4-ITEM PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500 mx-auto mb-4"></div></div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">No items found</h3></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map(product => (
                <div key={product.product_id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden border border-amber-100 group flex flex-col">
                  <div className="h-52 bg-amber-50 relative overflow-hidden flex items-center justify-center p-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition duration-700" />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition duration-500 drop-shadow-md">{product.category_name === 'Sweets' ? '🍬' : product.category_name === 'Dairy' ? '🥛' : '🥟'}</span>
                    )}
                    {product.stock_quantity < 10 && <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase">Only {product.stock_quantity} Left!</div>}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-md font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                      <div className="flex items-center bg-amber-100 px-2 py-0.5 rounded text-amber-700 text-xs font-bold"><Star size={10} className="mr-1 fill-amber-500 text-amber-500" /> 4.8</div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-amber-50">
                      <div>
                        <span className="text-xl font-black text-gray-900">₹{parseFloat(product.price).toFixed(2)}</span>
                        <span className="text-[10px] text-amber-600 font-bold ml-1 uppercase">/ {product.unit || 'kg'}</span>
                      </div>
                      <button onClick={() => handleAddToCart(product.name)} className="bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white p-2.5 rounded-xl transition-all group-hover:shadow-md"><Plus size={18} strokeWidth={3} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Menu Button! */}
            {!searchQuery && (
              <div className="mt-12 text-center">
                <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 bg-white border-2 border-amber-200 text-amber-700 px-8 py-3 rounded-full font-bold hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm">
                  See Full Menu <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
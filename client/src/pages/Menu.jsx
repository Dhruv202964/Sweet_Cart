import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Star, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
        
        // Get unique categories for sections
        const uniqueCategories = [...new Set(availableProducts.map(p => p.category_name || 'Uncategorized'))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // 🛡️ BULLETPROOF FILTER: Added ?. to prevent crashes if name/description is null
  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const descMatch = product.description?.toLowerCase().includes(searchLower);
    return nameMatch || descMatch;
  });

  const handleAddToCart = (productName) => {
    setCartCount(prev => prev + 1);
    alert(`${productName} added to your cart! 🍬`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20">
      
      {/* MENU NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-black text-amber-950">Our Menu</h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-400" />
              </div>
              <input type="text" placeholder="Search the entire menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-11 pr-4 py-3 border border-amber-200 rounded-full bg-amber-50/50 placeholder-amber-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 sm:text-sm transition-all shadow-inner" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500 mx-auto mb-4"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">No items found</h3></div>
        ) : (
          <div className="space-y-16">
            {categories.map(category => {
              const categoryProducts = filteredProducts.filter(p => p.category_name === category);
              
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="category-section">
                  {/* BEAUTIFUL SECTION HEADER */}
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black text-amber-950 tracking-tight">
                      {category === 'Sweets' ? '🍬 ' : category === 'Dairy' ? '🥛 ' : '🥟 '}
                      {category}
                    </h2>
                    <div className="flex-1 h-px bg-amber-200"></div>
                  </div>

                  {/* GRID FOR THIS SPECIFIC SECTION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryProducts.map(product => (
                      <div key={product.product_id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden border border-amber-100 group flex flex-col">
                        <div className="h-56 bg-amber-50 relative overflow-hidden flex items-center justify-center p-4">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition duration-700" />
                          ) : (
                            <span className="text-7xl group-hover:scale-110 group-hover:rotate-3 transition duration-500">{category === 'Sweets' ? '🍬' : category === 'Dairy' ? '🥛' : '🥟'}</span>
                          )}
                          {product.stock_quantity < 10 && <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md">Only {product.stock_quantity} Left!</div>}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">{product.name}</h3>
                            <div className="flex items-center bg-amber-100 px-2 py-1 rounded text-amber-700 text-xs font-bold shrink-0"><Star size={12} className="mr-1 fill-amber-500 text-amber-500" /> 4.8</div>
                          </div>
                          <p className="text-sm text-gray-500 mb-6 line-clamp-2">{product.description || "Fresh and authentic quality, made with premium ingredients."}</p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-50">
                            <div>
                              <span className="text-2xl font-black text-gray-900">₹{parseFloat(product.price || 0).toFixed(2)}</span>
                              <span className="text-xs text-amber-600 font-bold ml-1 uppercase">/ {product.unit || 'kg'}</span>
                            </div>
                            <button onClick={() => handleAddToCart(product.name)} className="bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white p-3 rounded-2xl transition-all group-hover:shadow-md"><Plus size={20} strokeWidth={3} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
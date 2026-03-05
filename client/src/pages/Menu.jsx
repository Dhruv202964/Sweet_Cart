import React, { useState, useEffect, useContext } from 'react';
import { Star, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 Grab the searchQuery from our global brain!
  const { cart, addToCart, decreaseQuantity, searchQuery } = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const availableProducts = data.filter(p => p.stock_quantity > 0);
        setProducts(availableProducts);
        
        const uniqueCategories = [...new Set(availableProducts.map(p => p.category_name || 'Uncategorized'))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // 🌟 NEW: Filter the products based on the search bar typing!
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true; // Show everything if search is empty
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-amber-950 tracking-tight mb-4">Our Full Menu</h1>
          <p className="text-amber-800 text-lg">Discover the authentic taste of Surat, made fresh daily.</p>
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500 mx-auto mb-4"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100"><span className="text-6xl mb-4 block">🥺</span><h3 className="text-xl font-bold text-gray-800">No items found</h3></div>
        ) : (
          <div className="space-y-16">
            {categories.map(category => {
              // 🌟 IMPORTANT: Map over the filtered list, not the full list!
              const categoryProducts = filteredProducts.filter(p => p.category_name === category);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="category-section">
                  {/* SECTION HEADER */}
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black text-amber-950 tracking-tight">
                      {category === 'Sweets' ? '🍬 ' : category === 'Dairy' ? '🥛 ' : '🥟 '}
                      {category}
                    </h2>
                    <div className="flex-1 h-px bg-amber-200"></div>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryProducts.map(product => (
                      <div key={product.product_id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden border border-amber-100 group flex flex-col">
                        <div className="h-56 bg-amber-50 relative overflow-hidden flex items-center justify-center p-4">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition duration-700" />
                          ) : (
                            <span className="text-7xl group-hover:scale-110 group-hover:rotate-3 transition duration-500">{category === 'Sweets' ? '🍬' : category === 'Dairy' ? '🥛' : '🥟'}</span>
                          )}
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

                            {/* Magic Toggle Button Logic */}
                            {(() => {
                              const cartItem = cart.find(c => c.product_id === product.product_id);
                              if (cartItem) {
                                return (
                                  <div className="flex items-center bg-amber-100 rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
                                    <button 
                                      onClick={() => decreaseQuantity(product.product_id)} 
                                      className="px-4 py-2.5 text-amber-700 hover:bg-amber-200 hover:text-red-700 transition-colors font-black text-xl leading-none"
                                    >
                                      -
                                    </button>
                                    <span className="px-2 py-2.5 text-amber-900 font-bold min-w-[28px] text-center text-base">
                                      {cartItem.quantity}
                                    </span>
                                    <button 
                                      onClick={() => addToCart(product)} 
                                      className="px-4 py-2.5 text-amber-700 hover:bg-amber-200 hover:text-green-700 transition-colors font-black text-xl leading-none"
                                    >
                                      +
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <button 
                                  onClick={() => addToCart(product)} 
                                  className="bg-amber-100 hover:bg-amber-500 text-amber-700 hover:text-white p-3 rounded-2xl transition-all group-hover:shadow-md"
                                >
                                  <Plus size={20} strokeWidth={3} />
                                </button>
                              );
                            })()}

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
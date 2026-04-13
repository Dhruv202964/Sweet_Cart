import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Trash2, ShoppingBag, Loader2, Sparkles, Scale, AlertCircle, ShieldAlert, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const MAX_WEIGHT_GRAMS = 5000; // 5 KG Limit
const MAX_SECTIONS = 5; // 5 Sections Limit
const PREMIUM_BOX_FEE = 50; // ₹50 Box Charge

const MakeYourOwnBox = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 THE NEW DYNAMIC ARRAY & CUSTOM ALERT STATE
  const [boxItems, setBoxItems] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ show: false, title: '', message: '' });
  
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // 🚀 THE FIX: Bring in all Sweets/Farsan, but STRICTLY BLOCK "pcs" (Samosas, etc.)
        const boxableProducts = data.filter(p => {
          const isCategoryValid = p.category_name === 'Sweets' || p.category_name === 'Farsan' || p.category_name === 'Premium';
          const inStock = p.stock_quantity > 0;
          const isPricedByWeight = p.unit?.toLowerCase() === 'kg' || p.unit?.toLowerCase() === 'g'; 
          
          return inStock && isCategoryValid && isPricedByWeight;
        });
        
        setProducts(boxableProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const currentTotalWeight = boxItems.reduce((sum, item) => sum + item.weightGrams, 0);
  
  const itemsTotalPrice = boxItems.reduce((total, item) => {
    if (!item.product.price) return total;
    const kgRatio = item.weightGrams / 1000;
    return total + (parseFloat(item.product.price) * kgRatio);
  }, 0);
  
  const finalPrice = boxItems.length > 0 ? itemsTotalPrice + PREMIUM_BOX_FEE : 0;

  const formatWeight = (grams) => {
    if (grams >= 1000) {
      return (grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 2) + 'KG';
    }
    return grams + 'G';
  };

  // 🚀 HELPER TO SHOW BEAUTIFUL ALERTS
  const showCustomAlert = (title, message) => {
    setAlertInfo({ show: true, title, message });
    // Auto-hide after 3.5 seconds
    setTimeout(() => setAlertInfo({ show: false, title: '', message: '' }), 3500);
  };

  const handleAddProduct = (product) => {
    if (boxItems.length >= MAX_SECTIONS) {
      showCustomAlert("Section Limit Reached!", `You can only mix up to ${MAX_SECTIONS} different items in one box. Build another box if you need more variety!`);
      return;
    }
    if (currentTotalWeight + 250 > MAX_WEIGHT_GRAMS) {
      showCustomAlert("Weight Limit Exceeded!", `Adding this makes the box heavier than our ${MAX_WEIGHT_GRAMS / 1000}KG maximum limit.`);
      return;
    }
    
    setBoxItems([...boxItems, { id: Date.now(), product, weightGrams: 250 }]);
  };

  const handleRemoveItem = (idToRemove) => {
    setBoxItems(boxItems.filter(item => item.id !== idToRemove));
  };

  const handleWeightChange = (id, newWeightGrams) => {
    const weightOfOtherItems = boxItems.filter(item => item.id !== id).reduce((sum, item) => sum + item.weightGrams, 0);
    
    if (weightOfOtherItems + newWeightGrams > MAX_WEIGHT_GRAMS) {
      showCustomAlert("Too Heavy!", `Increasing this item pushes the box over the ${MAX_WEIGHT_GRAMS / 1000}KG limit. Reduce another item first!`);
      return;
    }
    
    setBoxItems(boxItems.map(item => 
      item.id === id ? { ...item, weightGrams: newWeightGrams } : item
    ));
  };

  const handleAddBoxToCart = () => {
    if (boxItems.length === 0) return;

    const boxContents = boxItems.map(item => `${formatWeight(item.weightGrams)} ${item.product.name}`).join(', ');
    const uniqueCartId = `custom_box_${Date.now()}`;
    const formattedTotalWeight = formatWeight(currentTotalWeight);

    const customBoxProduct = {
      product_id: 99999, 
      name: `VIP Custom Box (${formattedTotalWeight} / ${boxItems.length} Sections)`,
      description: `Includes: ${boxContents}`,
      price: finalPrice,
      image_url: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=800&auto=format&fit=crop', 
      is_custom_box: true,
      custom_box_selections: boxContents,
      cartItemId: uniqueCartId,
      weight_selected: formattedTotalWeight,
      quantity: 1
    };

    addToCart(customBoxProduct);
    navigate('/checkout'); 
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 pt-24 relative">
      
      {/* 🚀 THE BEAUTIFUL CUSTOM ALERT MODAL */}
      {alertInfo.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full animate-in zoom-in-95 duration-300 relative border-t-8 border-amber-500">
            <button onClick={() => setAlertInfo({ show: false, title: '', message: '' })} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <ShieldAlert size={36} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{alertInfo.title}</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">{alertInfo.message}</p>
              <button 
                onClick={() => setAlertInfo({ show: false, title: '', message: '' })}
                className="mt-6 bg-gray-900 text-white font-bold py-3 px-8 rounded-xl w-full hover:bg-amber-600 transition-colors shadow-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> VIP Gifting Experience
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Make Your Own Box</h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">Mix and match different sweets. Choose exactly how much of each item you want!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: THE BOX CONFIGURATOR & VISUALIZER */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 sticky top-28">
              
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Package className="text-amber-500" /> Your Custom Box
              </h2>
              
              {/* PROGRESS BARS */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1"><Scale size={14}/> Total Weight</span>
                    <span className={currentTotalWeight === MAX_WEIGHT_GRAMS ? 'text-amber-600 font-black' : 'text-amber-600'}>
                      {formatWeight(currentTotalWeight)} / {MAX_WEIGHT_GRAMS / 1000}KG
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${currentTotalWeight === MAX_WEIGHT_GRAMS ? 'bg-amber-500' : 'bg-amber-400'}`} 
                      style={{ width: `${(currentTotalWeight / MAX_WEIGHT_GRAMS) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    <span>Sections Used</span>
                    <span className={boxItems.length === MAX_SECTIONS ? 'text-amber-600 font-black' : 'text-amber-600'}>
                      {boxItems.length} / {MAX_SECTIONS}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full flex gap-1">
                    {[...Array(MAX_SECTIONS)].map((_, i) => (
                      <div key={i} className={`h-full flex-1 rounded-full transition-all duration-300 ${i < boxItems.length ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC LIST OF SELECTED ITEMS */}
              <div className="space-y-3 mb-6 min-h-[160px]">
                {boxItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-bold">Your box is empty.</p>
                    <p className="text-xs mt-1">Select items from the right to begin.</p>
                  </div>
                ) : (
                  boxItems.map((item) => (
                    <div key={item.id} className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-center gap-3 relative animate-in fade-in zoom-in-95 duration-300">
                      
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-200 shrink-0">
                        {item.product.image_url ? <img src={item.product.image_url} className="w-full h-full object-cover" alt="" /> : <span className="w-full h-full flex justify-center items-center">🍬</span>}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 pr-6">{item.product.name}</h4>
                        
                        {/* 🚀 INDEPENDENT WEIGHT DROPDOWN */}
                        <div className="mt-1">
                          <select 
                            value={item.weightGrams} 
                            onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value))}
                            className="bg-white border border-amber-200 text-amber-800 text-xs font-bold rounded-lg focus:ring-amber-500 focus:border-amber-500 py-1 px-2 cursor-pointer outline-none shadow-sm"
                          >
                            <option value={250}>250G</option>
                            <option value={500}>500G</option>
                            <option value={1000}>1 KG</option>
                            <option value={2000}>2 KG</option>
                            <option value={3000}>3 KG</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* PRICE CALCULATION */}
              <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Sweets Total</span>
                  <span>₹{itemsTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Premium Packaging</span>
                  <span>₹{boxItems.length === 0 ? '0.00' : PREMIUM_BOX_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Box Total</span>
                  <span>₹{finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleAddBoxToCart}
                disabled={boxItems.length === 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                  boxItems.length > 0 
                  ? 'bg-[#3b1700] text-white hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={20} />
                {boxItems.length > 0 ? `Add Box to Cart • ₹${finalPrice.toFixed(0)}` : 'Box is Empty'}
              </button>
            </div>
          </div>

          {/* RIGHT: AVAILABLE PRODUCTS LIST */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
            ) : products.length === 0 ? (
               <div className="text-center py-10 text-gray-500 font-bold bg-white rounded-3xl border border-gray-100">
                 No items available for boxing at this moment.
               </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                   <h3 className="font-bold text-gray-900">Select Items for Your Box</h3>
                   {currentTotalWeight >= MAX_WEIGHT_GRAMS && (
                     <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                       <AlertCircle size={14}/> Max Weight Reached
                     </span>
                   )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(product => {
                    const pricePer250g = parseFloat(product.price || 0) * 0.25;
                    const isMaxWeight = currentTotalWeight >= MAX_WEIGHT_GRAMS;
                    const isMaxSections = boxItems.length >= MAX_SECTIONS;
                    const isDisabled = isMaxWeight || isMaxSections;

                    return (
                      <div key={product.product_id} className={`rounded-2xl border p-3 flex items-center gap-4 transition-all duration-300 ${isDisabled ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md group'}`}>
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">🍬</div>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                          <p className="text-gray-500 font-bold text-xs mt-1">₹{pricePer250g.toFixed(0)} / 250G</p>
                          
                          <button 
                            onClick={() => handleAddProduct(product)}
                            disabled={isDisabled}
                            className={`mt-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all w-full flex items-center justify-center gap-1 ${
                              isDisabled 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-200 hover:border-amber-500'
                            }`}
                          >
                            <Plus size={14} strokeWidth={3} /> Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MakeYourOwnBox;
import React, { useState } from 'react';
import { X, PackagePlus, IndianRupee, Box, Image, Tag, Leaf, Sparkles } from 'lucide-react';

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '1', // Default to Sweets (ID 1)
    stock_quantity: '',
    image_url: '',
    description: '',
    unit: 'kg'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Success vibe
        onProductAdded(); 
        onClose(); 
      } else {
        alert('Failed to add product. Check if the backend is running!');
      }
    } catch (error) {
      console.error(error);
      alert('Server Error: Connection refused.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 relative border border-white/20 animate-in zoom-in-95 duration-300">
        
        {/* ❌ CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-red-100 p-3 rounded-2xl text-red-600">
            <PackagePlus size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Signature</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
              <Tag size={12} className="text-amber-500" /> Item Name
            </label>
            <input 
              type="text" name="name" required
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-red-600 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
              placeholder="e.g. Premium Sugar-Free Kaju Katli"
              onChange={handleChange}
            />
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                <IndianRupee size={12} className="text-amber-500" /> Price (₹)
              </label>
              <input 
                type="number" name="price" required
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-red-600 outline-none font-bold text-slate-800 transition-all"
                placeholder="0.00"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                <Box size={12} className="text-amber-500" /> Stock Qty
              </label>
              <input 
                type="number" name="stock_quantity" required
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-red-600 outline-none font-bold text-slate-800 transition-all"
                placeholder="Available units"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
              <Sparkles size={12} className="text-amber-500" /> Select Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '1', name: 'Sweets', icon: '🍬' },
                { id: '2', name: 'Farsan', icon: '🌶️' },
                { id: '3', name: 'Dairy', icon: '🥛' },
                { id: '7', name: 'Sugar-Free', icon: '🌿' } // Linked to your DB ID 7
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category_id: cat.id })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                    formData.category_id === cat.id 
                    ? (cat.id === '7' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-red-50 border-red-600 text-red-700 shadow-md')
                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
              <Image size={12} className="text-amber-500" /> Image URL
            </label>
            <input 
              type="text" name="image_url"
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-red-600 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
              placeholder="https://images.unsplash.com/..."
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full py-5 bg-red-700 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[1.5rem] shadow-xl hover:bg-red-800 hover:shadow-red-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Commit to Collection <Sparkles size={18} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
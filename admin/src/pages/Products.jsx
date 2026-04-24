import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Edit, X, UploadCloud, Check, Leaf } from 'lucide-react';
import toast from 'react-hot-toast'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', category: '1', price: '', stock: '', description: '', unit: 'kg', ingredients: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = products;
    if (activeFilter !== 'All') {
      result = result.filter(p => (p.category_name || '').toLowerCase() === activeFilter.toLowerCase());
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [products, searchTerm, activeFilter]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category_id.toString(),
      price: product.price,
      stock: product.stock_quantity,
      description: product.description || '',
      unit: product.unit || 'kg',
      ingredients: product.ingredients || ''
    });
    setPreviewUrl(`http://localhost:5000${product.image_url}`);
    setGalleryFiles([]); 
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading(isEditing ? 'Updating product...' : 'Saving new product...', {
      style: { border: '2px solid #f59e0b', backgroundColor: '#1f2937', color: '#fff' }
    });
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);
    if (galleryFiles.length > 0) {
      Array.from(galleryFiles).forEach(file => {
        data.append('gallery', file);
      });
    }

    try {
      const url = isEditing ? `http://localhost:5000/api/products/${selectedProduct.product_id}` : 'http://localhost:5000/api/products';
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', body: data });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
        setImageFile(null);
        setPreviewUrl(null);
        setGalleryFiles([]);
        
        toast.dismiss(loadingToast);
        toast.success(isEditing ? 'Product Updated! 📦' : 'New Product Added! 🎉', {
          style: { border: '2px solid #10b981', backgroundColor: '#1f2937', color: '#fff' }
        });
      }
    } catch (err) { 
      toast.dismiss(loadingToast);
      toast.error("Connection failed. Server offline?"); 
    }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
      toast.success('Product Deleted 🗑️', {
        style: { border: '2px solid #ef4444', backgroundColor: '#1f2937', color: '#fff' }
      });
    } catch (err) { console.error(err); }
  };

  // 🛠️ UPDATED CATEGORIES ARRAY (SYNCED WITH DB ID 7)
  const categories = [
    { id: '1', name: 'Sweets', color: 'bg-pink-100 text-pink-700 active:bg-pink-200' },
    { id: '2', name: 'Farsan', color: 'bg-yellow-100 text-yellow-700 active:bg-yellow-200' },
    { id: '3', name: 'Dairy', color: 'bg-blue-100 text-blue-700 active:bg-blue-200' },
    { id: '7', name: 'Sugar-Free', color: 'bg-emerald-100 text-emerald-700 active:bg-emerald-200' },
  ];

  // 🛠️ UPDATED FILTER CATEGORIES
  const filterCategories = ['All', 'Sweets', 'Farsan', 'Dairy', 'Sugar-Free'];

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Inventory Management</h2>
        <button onClick={() => { 
          setIsEditing(false); 
          setPreviewUrl(null); 
          setImageFile(null);
          setGalleryFiles([]);
          setFormData({name:'', category:'1', price:'', stock:'', description:'', unit:'kg', ingredients: ''}); 
          setShowModal(true); 
        }} className="bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-800 transition shadow-xl hover:shadow-red-200">
          <Plus size={20} strokeWidth={3} /> Add New Signature
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
              activeFilter === category
                ? 'bg-red-800 text-white shadow-lg scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-red-300 hover:text-red-700'
            }`}
          >
            {category === 'Sugar-Free' && <Leaf size={14} className="inline mr-2" />}
            {category}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
            <tr>
              <th className="p-6">Product</th>
              <th className="p-6">Category</th>
              <th className="p-6">Price</th>
              <th className="p-6">Inventory</th>
              <th className="p-6 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="5" className="p-20 text-center text-slate-300 font-bold text-lg italic">No products found in {activeFilter} category.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={`http://localhost:5000${p.image_url}`} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" onError={(e) => { e.target.src = 'https://placehold.co/100?text=Sweet'; }} />
                      <div>
                        <p className="font-black text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{p.unit || 'KG'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.category_name?.toLowerCase() === 'sugar-free' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.category_name || 'General'}
                    </span>
                  </td>
                  <td className="p-6 font-black text-red-700 text-lg">₹{p.price}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${p.stock_quantity < 10 ? 'bg-red-500' : 'bg-amber-500'}`} style={{width: `${Math.min(p.stock_quantity, 100)}%`}}></div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500">{p.stock_quantity} IN STOCK</p>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEditClick(p)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={18}/></button>
                      <button onClick={() => handleDelete(p.product_id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SECTION */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><X size={28} /></button>
            <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">{isEditing ? "Modify Signature" : "Create New Signature"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Product Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-700 transition-all font-bold" placeholder="e.g. Premium Pista Ghari" />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Select Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.category === cat.id ? `border-red-700 shadow-md ${cat.color}` : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="850" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Initial Stock</label>
                  <div className="flex mt-1">
                    <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-l-2xl outline-none font-bold" placeholder="50" />
                    <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="px-4 bg-slate-100 border-y border-r border-slate-100 rounded-r-2xl text-[10px] font-black text-slate-500 outline-none uppercase">
                      <option value="kg">KG</option>
                      <option value="g">G</option>
                      <option value="pcs">PCS</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Key Ingredients</label>
                <textarea value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-red-700 font-medium text-sm" placeholder="Pure Ghee, Premium Pistachios, Stevia..." rows="2" />
              </div>

              {/* IMAGE UPLOADS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer group hover:border-red-300 transition-colors">
                  <input type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) { setImageFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {previewUrl ? (
                    <img src={previewUrl} className="h-24 w-full object-contain rounded-lg" alt="Preview" />
                  ) : (
                    <div className="text-slate-400 py-2 flex flex-col items-center"><UploadCloud size={24} /><span className="text-[10px] font-black uppercase mt-2">Cover Image</span></div>
                  )}
                </div>

                <div className="relative border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-4 text-center cursor-pointer group hover:border-amber-300 transition-colors">
                  <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="text-slate-400 py-2 flex flex-col items-center">
                    <UploadCloud size={24} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 mt-2">Gallery ({galleryFiles.length})</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] text-white bg-red-700 hover:bg-red-800 transition-all shadow-xl hover:shadow-red-200 active:scale-[0.98]">
                {loading ? 'Committing to Vault...' : isEditing ? 'Update Signature' : 'Add to Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
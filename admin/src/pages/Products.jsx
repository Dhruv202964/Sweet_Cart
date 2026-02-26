import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Edit, X, UploadCloud, Check } from 'lucide-react';

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
    name: '', category: '1', price: '', stock: '', description: '', unit: 'kg'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  // 🧮 1. Filter Logic (Already perfectly set up to listen to activeFilter!)
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
      unit: product.unit || 'kg'
    });
    setPreviewUrl(`http://localhost:5000${product.image_url}`);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      const url = isEditing ? `http://localhost:5000/api/products/${selectedProduct.product_id}` : 'http://localhost:5000/api/products';
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', body: data });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
        setImageFile(null);
        setPreviewUrl(null);
      }
    } catch (err) { alert("Connection failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  // Fixed 'Namkeen' to 'Farsan' to perfectly match our Database injection!
  const categories = [
    { id: '1', name: 'Sweets', color: 'bg-pink-100 text-pink-700' },
    { id: '2', name: 'Farsan', color: 'bg-yellow-100 text-yellow-700' },
    { id: '3', name: 'Dairy', color: 'bg-blue-100 text-blue-700' },
  ];

  // 🏙️ Define filter buttons
  const filterCategories = ['All', 'Sweets', 'Farsan', 'Dairy'];

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Inventory</h2>
        <button onClick={() => { setIsEditing(false); setPreviewUrl(null); setFormData({name:'', category:'1', price:'', stock:'', description:'', unit:'kg'}); setShowModal(true); }} className="bg-brand-red text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-red-800 transition shadow-lg">
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* 🍬 CATEGORY FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6 mt-4">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
              activeFilter === category
                ? 'bg-red-800 text-white border-2 border-red-800 scale-105' 
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-red-50 text-brand-red uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-5">Image</th>
              <th className="p-5">Product Name</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">No products found for {activeFilter}.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-red-50 transition">
                  <td className="p-4"><img src={`http://localhost:5000${p.image_url}`} className="w-12 h-12 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/100'; }} /></td>
                  <td className="p-4 font-bold text-gray-800">{p.name}</td>
                  <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{p.category_name || 'General'}</span></td>
                  <td className="p-4 font-bold text-brand-red">₹{p.price}</td>
                  <td className="p-4 font-medium">{p.stock_quantity} {p.unit?.toUpperCase() || 'KG'}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEditClick(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(p.product_id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red" placeholder="Product Name" />
              
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition ${formData.category === cat.id ? `bg-red-50 text-brand-red border-brand-red` : 'bg-gray-50 text-gray-400 border-transparent'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Price (₹)" />
                
                <div className="relative flex items-center">
                  <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-l-xl rounded-r-none outline-none focus:border-brand-red border-r-0" placeholder="Qty" />
                  <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="h-[46px] px-3 bg-gray-100 border border-gray-200 rounded-r-xl border-l-gray-300 text-xs font-bold text-gray-600 outline-none">
                    <option value="kg">KG</option>
                    <option value="g">G</option>
                    <option value="pcs">PCS</option>
                  </select>
                </div>
              </div>

              {/* 📸 IMAGE SECTION */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer group">
                <input type="file" accept="image/*" onChange={(e) => { 
                  if(e.target.files[0]) {
                    setImageFile(e.target.files[0]); 
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} className="h-32 w-full object-contain rounded-lg" alt="Preview" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-white text-xs font-bold">Change Image</div>
                  </div>
                ) : (
                  <div className="text-gray-400 py-4 flex flex-col items-center"><UploadCloud size={32} /><span className="text-xs mt-2">Upload Image</span></div>
                )}
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold text-white bg-brand-red hover:bg-red-800 transition shadow-lg">
                {loading ? 'Processing...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
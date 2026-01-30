import React, { useEffect, useState } from 'react';
import AddProductModal from '../components/AddProductModal'; // <--- Import the Modal

// 1. Reusable Table Component
const ProductSection = ({ title, color, data }) => (
  <div className="mb-12">
    <h3 className={`text-2xl font-bold mb-4 border-l-8 pl-3 ${color}`}>
      {title} <span className="text-sm font-normal text-gray-500 ml-2">({data.length} Items)</span>
    </h3>
    
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Item Name</th>
            <th className="p-4">Price (Per Unit)</th>
            <th className="p-4">Current Stock</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((product) => (
            <tr key={product.product_id} className="hover:bg-gray-50 transition">
              <td className="p-4">
                <img 
                  src={product.image_url || "https://placehold.co/50"} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
              </td>
              <td className="p-4 font-bold text-gray-800">{product.name}</td>
              <td className="p-4 font-bold text-brand-orange">₹ {product.price}</td>
              <td className="p-4 text-gray-700 font-medium">{product.stock_quantity}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="p-6 text-center text-gray-400 italic">No products in this category yet.</div>
      )}
    </div>
  </div>
);

// 2. Main Page Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- State for Modal

  // Function to fetch data (We need this to run on load AND after adding a product)
  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching products:", err));
  };

  // Run on initial page load
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading && products.length === 0) return <div className="text-center mt-20 text-gray-500">Loading Inventory...</div>;

  // Filter Logic
  const sweets = products.filter(p => p.category && p.category.toLowerCase() === 'sweets');
  const farsan = products.filter(p => p.category && (p.category.toLowerCase() === 'namkeen' || p.category.toLowerCase() === 'farsan'));
  const seasonal = products.filter(p => p.category && p.category.toLowerCase() === 'seasonal');
  const others = products.filter(p => {
    const c = p.category ? p.category.toLowerCase() : '';
    return !['sweets', 'namkeen', 'farsan', 'seasonal'].includes(c);
  });

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-red">📦 Inventory Management</h2>
          <p className="text-gray-500 mt-1">View and update your shop's menu.</p>
        </div>
        
        {/* The Button that opens the Modal */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-brand-orange text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition font-bold"
        >
          + Add New Item
        </button>
      </div>

      {/* Render the Sections */}
      <ProductSection title="🍬 Sweets (Mithai)" color="border-brand-orange text-brand-orange" data={sweets} />
      <ProductSection title="🌶️ Farsan (Namkeen)" color="border-brand-red text-brand-red" data={farsan} />
      <ProductSection title="🌟 Seasonal Specials" color="border-purple-500 text-purple-600" data={seasonal} />
      
      {others.length > 0 && (
        <ProductSection title="🥡 Other Items" color="border-gray-500 text-gray-600" data={others} />
      )}

      {/* The Modal Popup (Only shows when isModalOpen is true) */}
      {isModalOpen && (
        <AddProductModal 
          onClose={() => setIsModalOpen(false)} 
          onProductAdded={fetchProducts} 
        />
      )}

    </div>
  );
};

export default Products;
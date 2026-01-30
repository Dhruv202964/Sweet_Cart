import React, { useState } from 'react';

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'sweets', // Default option
    stock_quantity: '',
    image_url: '' 
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
        alert('Product Added Successfully! 🍬');
        onProductAdded(); // Refresh the list
        onClose(); // Close the modal
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error(error);
      alert('Server Error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 font-bold text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-brand-red mb-6">Add New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Item Name</label>
            <input 
              type="text" name="name" required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="e.g. Kesar Peda"
              onChange={handleChange}
            />
          </div>

          {/* Row: Price & Stock */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700">Price (₹)</label>
              <input 
                type="number" name="price" required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                placeholder="0.00"
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700">Stock Qty</label>
              <input 
                type="number" name="stock_quantity" required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                placeholder="Available units"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Category</label>
            <select 
              name="category" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              onChange={handleChange}
            >
              <option value="sweets">🍬 Sweets</option>
              <option value="namkeen">🌶️ Namkeen (Farsan)</option>
              <option value="seasonal">🌟 Seasonal</option>
              <option value="other">🥡 Other</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Image URL</label>
            <input 
              type="text" name="image_url"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="https://..."
              onChange={handleChange}
            />
            <p className="text-xs text-gray-400 mt-1">Paste a link to the image for now.</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-brand-orange text-white font-bold rounded shadow hover:bg-red-700 transition"
            >
              Save Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
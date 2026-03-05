import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  // Grab the addToCart function from our global brain!
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      
      {/* 🖼️ Product Image (Perfectly uniform 500x500 object-cover!) */}
      <div className="h-56 w-full bg-cream-50 relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="h-full w-full object-cover"
        />
        {/* Optional: Small category badge hovering over the image */}
        <span className="absolute top-2 left-2 bg-white/90 text-red-800 text-xs font-bold px-2 py-1 rounded shadow">
          {product.category_name || 'SweetCart'}
        </span>
      </div>
      
      {/* 📝 Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
          <span className="text-red-800 font-extrabold text-lg">₹{product.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-5 line-clamp-2">
          {product.description}
        </p>
        
        {/* 🛒 Add to Cart Button Area */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2 py-1 rounded">
            Per {product.unit}
          </span>
          
          <button 
            onClick={() => addToCart(product)}
            className="bg-red-800 hover:bg-red-900 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
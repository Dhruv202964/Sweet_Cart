import React, { useState, useEffect, useContext } from 'react';
import { Plus, Sparkles, Loader2, Leaf, Heart, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

// 🖼️ IMPORT YOUR 3 STORY IMAGES (Ensure these exist in src/assets/)
import story1Img from '../assets/sugarfree_story1.png';
import story2Img from '../assets/sugarfree_story2.png';
import story3Img from '../assets/sugarfree_story3.png';

const FancyHeading = ({ word1, word2, color1 = "text-emerald-950", color2 = "text-emerald-600" }) => (
  <div className="flex flex-col items-center mb-10 text-center">
    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-wide flex gap-4">
      <span className={color1}>{word1}</span>
      <span className={color2}>{word2}</span>
    </h2>
    <div className="flex items-center gap-4 mt-2">
      <div className="h-[2px] w-24 bg-emerald-200 rounded-full"></div>
      <Sparkles className="text-emerald-500 w-6 h-6" />
      <div className="h-[2px] w-24 bg-emerald-200 rounded-full"></div>
    </div>
  </div>
);

const StorySection = ({ title, desc, img, reverse, subtitle = "Certified Healthy" }) => (
  <div className={`flex flex-col md:flex-row items-center gap-12 my-20 ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2">
      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">
        <ShieldCheck size={16}/> {subtitle}
      </div>
      <h3 className="text-4xl font-serif font-bold text-emerald-900 mb-6">{title}</h3>
      <p className="text-lg text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
    <div className="md:w-1/2">
      <div className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
        <img src={img} className="w-full h-96 object-cover" alt="Health Story" />
      </div>
    </div>
  </div>
);

const SugarFree = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter(p => p.category_name?.toLowerCase() === 'sugar-free' || p.category_id === 7));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const InternalProductCard = ({ p }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm hover:shadow-emerald-200 transition-all flex flex-col group h-full">
      <div className="h-48 w-full bg-emerald-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
        {p.image_url ? (
            <img 
              src={p.image_url.startsWith('http') ? p.image_url : `http://localhost:5000${p.image_url}`} 
              alt={p.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
            />
        ) : (
            <span className="text-5xl group-hover:rotate-12 transition-transform">🌿</span>
        )}
      </div>
      <div className="flex items-center gap-1 text-emerald-600 mb-2">
        <Heart size={12} fill="currentColor"/> 
        <span className="text-[10px] font-black uppercase tracking-tighter">Diabetic Friendly</span>
      </div>
      <h4 className="font-bold text-emerald-900 text-lg mb-2">{p.name}</h4>
      <p className="text-xs text-slate-500 mb-6 line-clamp-2">{p.description}</p>
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-emerald-50">
        <span className="font-black text-xl text-emerald-950">₹{parseFloat(p.price).toFixed(2)}</span>
        <button 
            onClick={() => addToCart(p)} 
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
        >
          <Plus size={20}/>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7FDF9] pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <FancyHeading word1="Healthy" word2="Signatures" />
        
        {loading ? <div className="text-center py-20"><Loader2 className="animate-spin text-emerald-500 mx-auto" /></div> : (
          <>
            <StorySection 
              title="A Promise of Pure Ghee & Zero Sugar" 
              desc="Surat’s legacy of Pista Ghari and Kaju Katli shouldn't be off-limits. We use premium Stevia and natural fruit fibers to ensure the sweetness remains authentic." 
              img={story1Img}
              subtitle="Ancient Tradition"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
              {products.slice(0, 4).map(p => <InternalProductCard key={p.product_id} p={p} />)}
            </div>

            <StorySection 
              reverse
              title="Crafted with Nature's Best" 
              desc="No artificial sweeteners. We use premium California almonds, Arabian dates, and fresh milk mawa to ensure every bite is rich in nutrients." 
              img={story2Img}
              subtitle="100% Natural"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
              {products.slice(4, 8).map(p => <InternalProductCard key={p.product_id} p={p} />)}
            </div>

            <StorySection 
              title="Sweetness Without Sacrifice" 
              desc="From your morning snack to your festive celebrations, our Sugar-Free range is designed to keep your energy steady and your heart happy." 
              img={story3Img}
              subtitle="The SweetCart Promise"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
              {products.slice(8, 12).map(p => <InternalProductCard key={p.product_id} p={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SugarFree;
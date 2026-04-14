import React, { useState, useEffect } from 'react';
import { ImagePlus, Trash2, Eye, EyeOff, UploadCloud, Loader2, Sparkles, Edit3, X, ChevronLeft, ChevronRight } from 'lucide-react'; // 🚀 Added Chevrons for buttons
import toast from 'react-hot-toast';

const ManageSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State & EDIT MODE Tracker
  const [editId, setEditId] = useState(null); 
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState(''); 
  const [ctaLink, setCtaLink] = useState('/menu'); 
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 🚀 NEW: PAGINATION ENGINE STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Shows exactly 4 per mini-page

  const fetchSliders = () => {
    fetch('http://localhost:5000/api/sliders')
      .then(res => res.json())
      .then(data => {
        setSliders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load sliders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // 🚀 CALCULATE THE MINI-PAGES
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSlidersPage = sliders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sliders.length / itemsPerPage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (slider) => {
    setEditId(slider.id);
    setTitle(slider.title || '');
    setSubtitle(slider.subtitle || '');
    setCtaText(slider.cta_text || '');
    setCtaLink(slider.cta_link || '/menu');
    setPreviewUrl(slider.image_url); 
    setImageFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSubtitle('');
    setCtaText('');
    setCtaLink('/menu');
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editId && !imageFile) {
      toast.error("An image is required for new banners!");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile); 
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('cta_text', ctaText); 
    formData.append('cta_link', ctaLink); 

    const url = editId 
      ? `http://localhost:5000/api/sliders/${editId}` 
      : 'http://localhost:5000/api/sliders';
      
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        body: formData, 
      });

      if (res.ok) {
        toast.success(editId ? "Banner Updated!" : "New Banner Live!");
        resetForm();
        fetchSliders();
      } else {
        const data = await res.json();
        toast.error(data.msg || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection lost.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this banner?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sliders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Banner deleted.");
        // Go back a page if we delete the last item on the current page
        if (currentSlidersPage.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        fetchSliders();
      } else {
        toast.error("Failed to delete banner.");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sliders/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Banner hidden from storefront." : "Banner is now LIVE!");
        fetchSliders();
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 size={64} className="text-brand-red animate-spin" /></div>;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans">
      
      {/* 🌟 EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b-4 border-gray-900">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">Studio Manager</h1>
          <p className="text-gray-500 font-bold text-lg tracking-wide">Design your storefront's primary hero slider.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
          <Sparkles size={18} className="text-yellow-400" />
          <span className="font-bold text-sm tracking-widest uppercase">Live Sync Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 🎨 LEFT COLUMN: THE UPLOAD STUDIO */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className={`p-6 sm:p-8 border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] sticky top-6 transition-colors ${editId ? 'bg-amber-50' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                {editId ? <><Edit3 /> Edit Banner</> : <><ImagePlus /> New Banner</>}
              </h2>
              {editId && (
                <button type="button" onClick={resetForm} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Image Upload Zone */}
              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">
                  Cinematic Image {!editId && <span className="text-brand-red">*</span>}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 hover:border-gray-900 bg-white rounded-xl transition-colors cursor-pointer overflow-hidden group h-48 flex items-center justify-center">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!editId} />
                  
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <UploadCloud size={40} className="mx-auto text-gray-400 group-hover:text-gray-900 transition-colors mb-2" />
                      <p className="text-sm font-bold text-gray-600">Click or Drop Image</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">1920x800 recommended</p>
                    </div>
                  )}
                  {editId && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none">
                      <span className="text-white font-bold bg-black/60 px-3 py-1 rounded">Click to change image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Typography Inputs */}
              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Headline Text</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g., The Diwali Collection"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-gray-900 rounded-xl outline-none transition-colors font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Subtext</label>
                <input 
                  type="text" 
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)} 
                  placeholder="e.g., Handcrafted sweets delivered fresh."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-gray-900 rounded-xl outline-none transition-colors font-bold text-gray-900"
                />
              </div>

              {/* BUTTON CONTROLS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Button Text</label>
                  <input 
                    type="text" 
                    value={ctaText} 
                    onChange={(e) => setCtaText(e.target.value)} 
                    placeholder="e.g. Shop Now"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-gray-900 rounded-xl outline-none transition-colors font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Button Link</label>
                  <select 
                    value={ctaLink} 
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-gray-900 rounded-xl outline-none transition-colors font-bold text-gray-900 cursor-pointer"
                  >
                    <option value="/menu">Full Menu (/menu)</option>
                    <option value="/make-your-own-box">VIP Box (/make-your-own-box)</option>
                    <option value="/about">About Us (/about)</option>
                    <option value="/contact">Contact Us (/contact)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                {editId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="w-1/3 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(17,24,39,1)] flex items-center justify-center"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`flex-1 py-4 text-white font-black text-sm sm:text-lg uppercase tracking-widest rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] flex items-center justify-center gap-2 ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-brand-red hover:bg-red-800'}`}
                >
                  {submitting ? <Loader2 className="animate-spin" /> : (editId ? 'Update Banner' : 'Publish to Live')}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 🎬 RIGHT COLUMN: THE GALLERY GRID */}
        <div className="lg:col-span-2">
          {sliders.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-white h-full">
              <ImagePlus size={64} className="text-gray-300 mb-4" />
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight">Gallery is Empty</h3>
              <p className="text-gray-400 font-bold mt-2">Upload your first hero banner to the left.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* 🚀 ONLY MAP OVER THE CURRENT PAGE'S SLIDERS */}
              {currentSlidersPage.map((slider) => (
                <div 
                  key={slider.id} 
                  className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-300 bg-white shadow-sm flex flex-col sm:flex-row ${editId === slider.id ? 'border-amber-500 ring-4 ring-amber-100' : (slider.is_active ? 'border-gray-900 hover:shadow-lg' : 'border-gray-200 grayscale-[60%] opacity-80')}`}
                >
                  
                  {/* Status Overlay Badge */}
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-md shadow-sm border-2 ${slider.is_active ? 'bg-green-400 text-green-950 border-green-900' : 'bg-gray-200 text-gray-600 border-gray-400'}`}>
                    {slider.is_active ? '● Live' : 'Hidden'}
                  </div>

                  {/* Image Section */}
                  <div className="sm:w-2/5 h-40 sm:h-auto bg-gray-100 relative">
                    <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover" />
                    {!slider.is_active && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                         <EyeOff size={40} className="text-gray-600 drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* Typography & Controls Section */}
                  <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight mb-1 line-clamp-1">
                        {slider.title || <span className="italic text-gray-400 font-medium">Untitled Banner</span>}
                      </h3>
                      <p className="text-gray-600 font-medium text-xs line-clamp-2 mb-2">
                        {slider.subtitle || 'No subtext provided.'}
                      </p>
                      {slider.cta_text && (
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded inline-block border border-amber-100">
                          Btn: {slider.cta_text} ➔ {slider.cta_link}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <button 
                        onClick={() => handleEditClick(slider)}
                        className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-400 rounded-lg transition-colors flex items-center justify-center shrink-0 font-bold text-xs uppercase tracking-widest"
                      >
                        <Edit3 size={16} className="mr-1" /> Edit
                      </button>

                      <button 
                        onClick={() => handleToggle(slider.id, slider.is_active)}
                        className={`flex-1 py-2 rounded-lg font-black uppercase tracking-wider text-xs border transition-colors flex items-center justify-center gap-1 ${slider.is_active ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100' : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'}`}
                      >
                        {slider.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        {slider.is_active ? 'Hide' : 'Show'}
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(slider.id)}
                        className="px-3 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 rounded-lg transition-colors flex items-center justify-center shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 🚀 NEW: PAGINATION CONTROLS (Only visible if > 4 items) */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
                  <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                      disabled={currentPage === 1} 
                      className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 font-bold text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors text-gray-800"
                    >
                      <ChevronLeft size={16}/> Prev
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                      disabled={currentPage === totalPages} 
                      className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 font-bold text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors text-gray-800"
                    >
                      Next <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageSliders;
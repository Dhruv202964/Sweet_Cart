import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Disc3, Volume2, ArrowLeft, Loader2, Heart } from 'lucide-react';

const GiftPlayback = () => {
  const { id } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/gift/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Gift not found");
        return res.json();
      })
      .then(data => {
        setGift(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
    </div>
  );

  if (error || !gift) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
      <Disc3 size={64} className="text-zinc-800 mb-6" />
      <h2 className="text-3xl font-black text-zinc-400 tracking-widest uppercase">Tape Not Found</h2>
      <p className="text-zinc-600 mt-2">This voice gift may have expired or doesn't exist.</p>
      <Link to="/" className="mt-8 px-6 py-3 border border-zinc-700 text-zinc-400 rounded-full hover:bg-zinc-900 transition-all">Go to Store</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      
      {/* Cinematic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={gift.audio} 
        onEnded={handleAudioEnded} 
        className="hidden" 
      />

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        <div className="text-center mb-10">
          <p className="text-amber-500 font-black tracking-[0.3em] uppercase text-xs mb-2">A Special Message From</p>
          <h1 className="text-4xl font-black text-zinc-100 tracking-tight">{gift.sender}</h1>
        </div>

        {/* 📼 THE RETRO CASSETTE TAPE UI */}
        <div className="bg-zinc-900 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-zinc-800 relative group">
          
          {/* Cassette Label Area */}
          <div className="bg-[#FFFDF8] rounded-xl p-6 border-b-8 border-amber-600 relative overflow-hidden">
            <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-2 mb-6">
              <span className="font-black text-zinc-800 tracking-widest uppercase text-sm">SweetCart Audio</span>
              <span className="text-xs font-bold text-zinc-400">Side A</span>
            </div>

            {/* The Spinning Tape Wheels */}
            <div className="flex justify-center items-center gap-12 bg-zinc-900/5 py-4 rounded-full border-2 border-dashed border-zinc-300">
              <div className="w-16 h-16 bg-zinc-800 rounded-full border-4 border-zinc-900 flex items-center justify-center shadow-inner relative overflow-hidden">
                <Disc3 size={48} className={`text-zinc-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
                <div className="absolute w-2 h-2 bg-zinc-300 rounded-full"></div>
              </div>
              <div className="w-16 h-16 bg-zinc-800 rounded-full border-4 border-zinc-900 flex items-center justify-center shadow-inner relative overflow-hidden">
                <Disc3 size={48} className={`text-zinc-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
                <div className="absolute w-2 h-2 bg-zinc-300 rounded-full"></div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="font-script text-3xl text-zinc-800 -rotate-2">"Enjoy the Sweets!"</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <Volume2 className={`text-zinc-600 transition-all ${isPlaying ? 'text-amber-500 animate-pulse' : ''}`} size={24} />
            
            <button 
              onClick={togglePlay}
              className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-zinc-900 shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(217,119,6,0.5)] transition-all"
            >
              {isPlaying ? <Pause size={32} className="fill-zinc-900" /> : <Play size={32} className="fill-zinc-900 ml-2" />}
            </button>
            
            <Heart className={`text-zinc-600 transition-all ${isPlaying ? 'text-red-500 animate-pulse' : ''}`} size={24} />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 font-bold tracking-widest uppercase text-xs transition-colors">
            <ArrowLeft size={16} /> Return to SweetCart
          </Link>
        </div>

      </div>
    </div>
  );
};

export default GiftPlayback;
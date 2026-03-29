import React, { useEffect, useState } from 'react';
import { Mail, Trash2, X, MessageSquare, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast'; // 🔥 1. IMPORT TOAST

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // 🔥 For the Read More Modal

  // 1. Fetch Messages
  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error loading messages:", err));
  }, []);

  // 2. Delete Message Function (Upgraded to Toasts)
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevents the modal from opening when clicking delete
    if(!window.confirm("Are you sure you want to delete this message?")) return;

    try {
        await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE' });
        setMessages(messages.filter(msg => msg.id !== id)); 
        toast.success('Message Deleted 🗑️', {
          style: { border: '2px solid #ef4444', backgroundColor: '#1f2937', color: '#fff' }
        });
    } catch (err) {
        toast.error("Failed to delete.");
    }
  };

  // 3. One-Click GMAIL Reply Engine 🚀
  const handleReply = (email, subject, e) => {
    e.stopPropagation(); // Prevents modal from opening
    
    // The secret URL to force Gmail to open a new compose window
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Re: ${subject} - SweetCart Support`;
    
    // Opens Gmail in a brand new tab so they don't lose their Admin Panel!
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customer Inbox</h2>
          <p className="text-gray-500">Read inquiries about bulk orders and feedback.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
          <span className="text-gray-500 font-bold text-sm">Total Messages:</span>
          <span className="text-2xl font-bold text-brand-red ml-2">{messages.length}</span>
        </div>
      </div>
      
      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 flex flex-col items-center">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-400 text-xl font-bold">Inbox is Empty</p>
                <p className="text-sm text-gray-400 mt-2">No new messages from customers.</p>
            </div>
        ) : (
            messages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => setSelectedMessage(msg)} // Open Modal on Click
              className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-brand-red hover:shadow-xl transition relative group cursor-pointer flex flex-col h-full hover:-translate-y-1"
            >
                
                {/* Delete Button */}
                <button 
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"
                    title="Delete Message"
                >
                    <Trash2 size={18} />
                </button>

                <div className="flex justify-between items-start mb-4">
                    <div className="pr-8">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{msg.subject}</h3>
                        <p className="text-[10px] font-bold text-brand-red uppercase tracking-wide mt-1">New Inquiry</p>
                    </div>
                </div>

                {/* 🔥 TRUNCATED MESSAGE PREVIEW */}
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex-grow mb-4 relative">
                    <p className="text-gray-600 text-sm line-clamp-3 italic">"{msg.message}"</p>
                    <div className="absolute bottom-2 right-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                      Read More <ExternalLink size={12}/>
                    </div>
                </div>

                {/* Footer / Contact Info */}
                <div className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-black text-lg shadow-sm">
                          {msg.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <p className="font-bold text-sm text-gray-800">{msg.customer_name}</p>
                          <p className="text-xs text-gray-500 font-medium truncate max-w-[120px]">{msg.email}</p>
                      </div>
                    </div>
                    
                    {/* 🔥 QUICK REPLY BUTTON */}
                    <button 
                      onClick={(e) => handleReply(msg.email, msg.subject, e)}
                      className="bg-brand-red text-white p-2 rounded-lg hover:bg-red-800 transition shadow-sm"
                      title="Reply via Email"
                    >
                      <Mail size={16} />
                    </button>
                </div>
                
                <div className="absolute bottom-[-10px] right-6 bg-white px-2 text-[10px] text-gray-400 font-bold tracking-wider border border-gray-100 rounded-full shadow-sm">
                    {new Date(msg.created_at).toLocaleDateString()}
                </div>
            </div>
            ))
        )}
      </div>

      {/* 🔥 THE "READ MORE" MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50">
              <div className="pr-4">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1 block">Subject</span>
                <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Full Message) */}
            <div className="p-6">
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 shadow-inner max-h-[40vh] overflow-y-auto custom-scrollbar">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-black text-xl border border-gray-200">
                    {selectedMessage.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-bold text-gray-800">{selectedMessage.customer_name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => handleReply(selectedMessage.email, selectedMessage.subject, e)}
                className="flex items-center gap-2 bg-brand-red hover:bg-red-800 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-lg"
              >
                <Mail size={18} /> Reply Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;
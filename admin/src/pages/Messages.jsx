import React, { useEffect, useState } from 'react';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  // 1. Fetch Messages
  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error loading messages:", err));
  }, []);

  // 2. Delete Message Function
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this message?")) return;

    try {
        await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE' });
        setMessages(messages.filter(msg => msg.id !== id)); // Remove from UI instantly
    } catch (err) {
        alert("Failed to delete.");
    }
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Customer Inbox</h2>
        <p className="text-gray-500">Read inquiries about bulk orders and feedback.</p>
      </div>
      
      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <p className="text-gray-400 text-xl font-bold">📭 Inbox is Empty</p>
                <p className="text-sm text-gray-400 mt-2">No new messages from customers.</p>
            </div>
        ) : (
            messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-brand-red hover:shadow-xl transition relative group">
                
                {/* Delete Button (Visible on Hover) */}
                <button 
                    onClick={() => handleDelete(msg.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition p-1"
                    title="Delete Message"
                >
                    🗑️
                </button>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{msg.subject}</h3>
                        <p className="text-xs font-bold text-brand-red uppercase tracking-wide">New Inquiry</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm mb-4 min-h-[80px]">
                    "{msg.message}"
                </div>

                <div className="border-t pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange font-bold text-xl">
                        {msg.customer_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-800">{msg.customer_name}</p>
                        <p className="text-xs text-blue-500 hover:underline cursor-pointer">{msg.email}</p>
                    </div>
                </div>
                
                <div className="absolute bottom-4 right-4 text-xs text-gray-300 font-mono">
                    {new Date(msg.created_at).toLocaleDateString()}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Messages;
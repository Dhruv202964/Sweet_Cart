import React, { useEffect, useState } from 'react';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // Added 'name' to the state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', phone: '' });

  // 1. Fetch Staff Data
  useEffect(() => {
    fetch('http://localhost:5000/api/staff')
      .then(res => res.json())
      .then(data => setStaff(data))
      .catch(err => console.error("Failed to load staff:", err));
  }, []);

  // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
        alert("Please select a role!");
        return;
    }

    const res = await fetch('http://localhost:5000/api/staff/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
        alert("Staff Access Granted! ✅");
        window.location.reload();
    } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.error || "Failed to create user."));
    }
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Team Management</h2>
          <p className="text-gray-500">Manage access and roles for your employees.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-800 transition transform hover:-translate-y-1"
        >
          + Add New Employee
        </button>
      </div>

      {/* Staff Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-50 text-brand-red uppercase text-sm font-bold tracking-wider">
            <tr>
              <th className="p-5">ID</th>
              <th className="p-5">Employee Details</th>
              <th className="p-5">Role / Position</th>
              <th className="p-5">Access Level</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No staff members found.</td></tr>
            ) : (
                staff.map((s) => (
                <tr key={s.user_id} className="hover:bg-red-50 transition">
                    <td className="p-5 font-bold text-gray-400">#{s.user_id}</td>
                    <td className="p-5">
                    {/* Show Full Name here instead of just Email */}
                    <p className="font-bold text-gray-800">{s.full_name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{s.email}</p>
                    </td>
                    <td className="p-5 capitalize font-medium text-gray-700">{s.position || s.role}</td>
                    <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                        ${s.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                          s.role === 'manager' ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {s.role}
                    </span>
                    </td>
                    <td className="p-5">
                    <span className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                    </span>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-brand-red">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Grant Staff Access</h3>
            <p className="text-sm text-gray-500 mb-6">Create a login for a new employee.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 👇 NEW NAME INPUT 👇 */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Login ID)</label>
                <input 
                    type="email"
                    placeholder="staff@sweetcart.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input 
                    type="password" 
                    placeholder="Create a password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign Role</label>
                    <select 
                        className="..." 
                        onChange={e => setFormData({...formData, role: e.target.value.toLowerCase()})} // Added .toLowerCase()
                        required
                    >
                        <option value="" disabled>Select Role...</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                    <input 
                        placeholder="Optional" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-800 transition">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
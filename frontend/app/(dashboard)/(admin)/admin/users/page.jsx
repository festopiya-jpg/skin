'use client';

import { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, Trash2, CheckCircle2 } from 'lucide-react';

export default function ManageUsers() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('system_doctors') || '[]');
    setDoctors(loaded);
  }, []);

  const handleDelete = (email) => {
    if (confirm('Are you sure you want to remove this doctor from the system?')) {
      const updated = doctors.filter(d => d.email !== email);
      setDoctors(updated);
      localStorage.setItem('system_doctors', JSON.stringify(updated));
    }
  };

  const handleToggleStatus = (email) => {
    const updated = doctors.map(d => {
      if (d.email === email) {
        return { ...d, status: d.status === 'APPROVED' ? 'REVOKED' : 'APPROVED' };
      }
      return d;
    });
    setDoctors(updated);
    localStorage.setItem('system_doctors', JSON.stringify(updated));
  };

  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">View, approve, and manage registered doctors and staff.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 flex items-center gap-3 bg-white/50">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="text-[#306CE9] w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Registered Doctors</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Doctor Name</th>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-white/50 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <span className="font-bold text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doc.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                        doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        doc.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {doc.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {doc.status || 'APPROVED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(doc.email)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium border border-gray-200"
                        >
                          Toggle Status
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.email)}
                          className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg transition-colors font-medium border border-rose-200 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, ShieldAlert, Trash2, CheckCircle2, 
  Stethoscope, Pill, Microscope, UserCheck, Plus, ShieldCheck 
} from 'lucide-react';

const DEFAULT_ALL_STAFF = [
  {
    id: 1,
    name: 'Dr. Sarah Mercer, MD',
    email: 'sarah.mercer@dermxai.org',
    role: 'doctor',
    department: 'Cutaneous Oncology & Melanoma',
    credentials: 'NPI-1849204921 • Board Certified Dermatologist',
    status: 'APPROVED',
    room: 'Consultation Suite 304'
  },
  {
    id: 2,
    name: 'Dr. Alexander Hayes, MD',
    email: 'alex.hayes@dermxai.org',
    role: 'doctor',
    department: 'Dermatopathology & Mohs Surgery',
    credentials: 'NPI-1928471029 • Surgical Fellow',
    status: 'APPROVED',
    room: 'Surgical Clinic 108'
  },
  {
    id: 3,
    name: 'Elena Rostova, PharmD',
    email: 'pharmacy@dermxai.org',
    role: 'medical',
    department: 'Clinical Pharmacy & Therapeutics',
    credentials: 'RPH-8849201 • Licensed Clinical Pharmacist',
    status: 'APPROVED',
    room: 'Hospital Central Pharmacy Desk'
  },
  {
    id: 4,
    name: 'Dr. Victor Chen, PhD',
    email: 'lab@dermxai.org',
    role: 'lab',
    department: 'Dermatopathology & Biopsy Diagnostics',
    credentials: 'DABCC-91204 • Histopathology Specialist',
    status: 'APPROVED',
    room: 'Pathology Lab Ward 2B'
  },
  {
    id: 5,
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    role: 'patient',
    department: 'Outpatient Dermatology Clinic',
    credentials: 'MRN-772910 • Patient Account',
    status: 'APPROVED',
    room: 'Self-Service Portal'
  }
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('system_staff_registry') || 'null');
    if (loaded && loaded.length > 0) {
      setUsers(loaded);
    } else {
      setUsers(DEFAULT_ALL_STAFF);
      localStorage.setItem('system_staff_registry', JSON.stringify(DEFAULT_ALL_STAFF));
    }
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('system_staff_registry', JSON.stringify(newUsers));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this staff member from the hospital directory?')) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return { label: 'Physician', icon: Stethoscope, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'medical':
        return { label: 'Pharmacist', icon: Pill, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'lab':
        return { label: 'Lab Specialist', icon: Microscope, color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Patient', icon: UserCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Staff & User Registry</h1>
          <p className="text-gray-500 mt-1">Central administration for Physicians, Clinical Pharmacists, Pathology Lab Specialists, and Patients.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search name, department, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: `All Personnel (${users.length})` },
          { id: 'doctor', label: `Physicians (${users.filter(u => u.role === 'doctor').length})`, icon: Stethoscope },
          { id: 'medical', label: `Pharmacy / Medical (${users.filter(u => u.role === 'medical').length})`, icon: Pill },
          { id: 'lab', label: `Pathology Lab (${users.filter(u => u.role === 'lab').length})`, icon: Microscope },
          { id: 'patient', label: `Patients (${users.filter(u => u.role === 'patient').length})`, icon: UserCheck },
        ].map((tab) => {
          const isActive = selectedRole === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive 
                  ? 'bg-[#306CE9] text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-[#306CE9]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Active Hospital Personnel</h2>
              <p className="text-xs text-gray-500">Verified credentials and department room assignments</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {filteredUsers.length} Record{filteredUsers.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Staff Member / User</th>
                <th className="px-6 py-4 font-semibold">Role & Dept</th>
                <th className="px-6 py-4 font-semibold">Location / Station</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No staff found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const RoleIcon = roleBadge.icon;
                  const isApproved = user.status === 'APPROVED';

                  return (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{user.credentials}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${roleBadge.color} mb-1`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {roleBadge.label}
                        </span>
                        <div className="text-xs text-gray-600 font-medium">{user.department}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-700">
                        {user.room}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className="text-xs bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-gray-200 shadow-sm cursor-pointer"
                          >
                            {isApproved ? 'Suspend' : 'Reactivate'}
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-rose-200 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

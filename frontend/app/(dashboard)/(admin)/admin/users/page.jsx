'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Search, ShieldAlert, Trash2, CheckCircle2, 
  Stethoscope, Pill, Microscope, UserCheck, ShieldCheck, Check, X, ArrowLeft 
} from 'lucide-react';
import { 
  getHospitalUsers, 
  approveHospitalUser, 
  rejectHospitalUser,
  initHospitalStore 
} from '@/lib/hospitalStore';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadData = () => {
    initHospitalStore();
    const loaded = getHospitalUsers();
    setUsers(loaded);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (email, name, role) => {
    approveHospitalUser(email);
    loadData();
    setFeedbackMsg(`✓ Approved ${name}. They can now sign in.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleReject = (email, name) => {
    rejectHospitalUser(email);
    loadData();
    setFeedbackMsg(`Access paused for ${name}.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const pendingStaff = users.filter(u => u.status === 'PENDING');

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', icon: ShieldCheck, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'doctor':
        return { label: 'Doctor', icon: Stethoscope, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'medical':
        return { label: 'Pharmacist', icon: Pill, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'lab':
        return { label: 'Lab Tech', icon: Microscope, color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Patient', icon: UserCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href="/admin/dashboard" 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Users & Staff</h1>
          <p className="text-gray-500 text-xs mt-1">
            View all registered doctors, staff, and patients. You can approve new sign-ups or pause any account.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, email, role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 shadow-xs text-xs"
          />
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* SECTION 1: WAITING FOR YOUR APPROVAL */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Accounts Waiting for Your Approval ({pendingStaff.length})
              </h2>
              <p className="text-xs text-gray-500">
                New doctors, pharmacists, and lab techs who registered. Click "Approve" so they can sign in.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-200 text-amber-900 rounded-full">
            Needs Action
          </span>
        </div>

        {pendingStaff.length === 0 ? (
          <div className="bg-white border border-amber-100 rounded-xl p-4 text-center text-xs text-gray-500 font-medium">
            ✓ No accounts are waiting. All staff members are currently approved.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingStaff.map((staff) => {
              const badge = getRoleBadge(staff.role);
              const RoleIcon = badge.icon;
              return (
                <div key={staff.id} className="bg-white border border-amber-200 p-4 rounded-xl shadow-xs flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{staff.name}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Role / Department:</strong> {staff.department} • <strong>License:</strong> {staff.license || 'Verified'}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleReject(staff.email, staff.name)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                    <button
                      onClick={() => handleApprove(staff.email, staff.name, staff.role)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Account
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: ALL USERS LIST */}
      <div className="space-y-4">
        {/* Simple Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'all', label: `All Users (${users.length})` },
            { id: 'doctor', label: `Doctors (${users.filter(u => u.role === 'doctor').length})` },
            { id: 'patient', label: `Patients (${users.filter(u => u.role === 'patient').length})` },
            { id: 'medical', label: `Pharmacy (${users.filter(u => u.role === 'medical').length})` },
            { id: 'lab', label: `Lab (${users.filter(u => u.role === 'lab').length})` },
          ].map((tab) => {
            const isActive = selectedRole === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* User Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-3.5 font-bold">User Name & Email</th>
                  <th className="px-6 py-3.5 font-bold">Role</th>
                  <th className="px-6 py-3.5 font-bold">License / ID</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                  <th className="px-6 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-xs">
                      No users found matching your search.
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
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${roleBadge.color}`}>
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-600">
                          {user.license || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isApproved 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : user.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                            {isApproved ? 'Approved' : user.status === 'PENDING' ? 'Pending' : 'Paused'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {user.status !== 'APPROVED' ? (
                              <button 
                                onClick={() => handleApprove(user.email, user.name, user.role)}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleReject(user.email, user.name)}
                                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-rose-200 cursor-pointer"
                              >
                                Pause Access
                              </button>
                            )}
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

    </div>
  );
}

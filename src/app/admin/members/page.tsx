'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminMembers() {
  const [search, setSearch] = useState('');

  const members = [
    { id: '1', name: 'Aarav Mehta', email: 'aarav@college.edu', role: 'President', status: 'Active', joinDate: '2023-08-12' },
    { id: '2', name: 'Diya Sharma', email: 'diya@college.edu', role: 'Vice President', status: 'Active', joinDate: '2023-08-15' },
    { id: '3', name: 'Rohan Verma', email: 'rohan@college.edu', role: 'General', status: 'Inactive', joinDate: '2024-01-10' },
    { id: '4', name: 'Ananya Singh', email: 'ananya@college.edu', role: 'General', status: 'Pending', joinDate: '2024-05-20' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-gray-400">View, manage roles, and activate/deactivate members.</p>
        </div>
        
        <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
          Add New Member
        </button>
      </div>

      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Role</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Joined</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{member.name}</span>
                      <span className="text-xs text-gray-500">{member.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {member.status === 'Active' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {member.status === 'Inactive' && <XCircle className="w-4 h-4 text-red-400" />}
                      {member.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-orange-400" />}
                      <span className={`text-sm ${
                        member.status === 'Active' ? 'text-green-400' :
                        member.status === 'Inactive' ? 'text-red-400' : 'text-orange-400'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{member.joinDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
          <span>Showing 1 to 4 of 1,248 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

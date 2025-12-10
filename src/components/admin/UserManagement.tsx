import React, { useState } from 'react';
import { Search, MoreVertical, Shield, ShieldOff, Eye, TrendingUp } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'writer' | 'admin';
  status: 'active' | 'inactive';
  tier: 'free' | 'pro' | 'enterprise';
  lastActive: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const users: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', status: 'active', tier: 'pro', lastActive: '2 mins ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'inactive', tier: 'free', lastActive: '5 days ago' },
    { id: '3', name: 'Charlie Admin', email: 'charlie@admin.com', role: 'admin', status: 'active', tier: 'enterprise', lastActive: 'Just now' },
  ];

  return (
    <div className="space-y-6 p-6 bg-slate-950 min-h-screen text-white ml-64">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white">User Management</h2>
           <p className="text-slate-400">Manage access, roles, and subscriptions.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold transition-colors">
            + Add New User
        </button>
      </div>

      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                        {user.status}
                    </span>
                </td>
                <td className="px-6 py-4 capitalize">{user.tier}</td>
                <td className="px-6 py-4 text-slate-400">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
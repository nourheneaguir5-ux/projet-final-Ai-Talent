import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, Shield, TrendingUp, Search, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data — in production this would come from admin API endpoints
  const mockUsers = [
    { _id: '1', name: 'Ahmed Ben Ali', email: 'ahmed@example.com', role: 'CANDIDATE', createdAt: '2026-04-01' },
    { _id: '2', name: 'Sara Mansour', email: 'sara@techcorp.tn', role: 'RECRUITER', createdAt: '2026-04-02' },
    { _id: '3', name: 'Youssef Trabelsi', email: 'youssef@example.com', role: 'CANDIDATE', createdAt: '2026-04-05' },
    { _id: '4', name: 'Amira Bourguiba', email: 'amira@startup.tn', role: 'RECRUITER', createdAt: '2026-04-08' },
    { _id: '5', name: 'Admin System', email: 'admin@tanit.ai', role: 'ADMIN', createdAt: '2026-01-01' },
  ];

  const stats = [
    { label: 'Total Users', value: '1,248', icon: <Users size={24} />, color: 'indigo' },
    { label: 'Active Jobs', value: '89', icon: <Briefcase size={24} />, color: 'pink' },
    { label: 'Applications', value: '3,421', icon: <FileText size={24} />, color: 'emerald' },
    { label: 'AI Analyses', value: '2,890', icon: <TrendingUp size={24} />, color: 'amber' },
  ];

  const tabs = [
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
    { id: 'apps', label: 'Applications', icon: <FileText size={16} /> },
  ];

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleStyle = {
    CANDIDATE: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    RECRUITER: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    ADMIN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="container animate-fade">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-emerald-400" size={28} />
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        <p className="text-slate-400 text-lg">Platform oversight and user management.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="glass-card p-6 text-center"
          >
            <div className={`inline-flex p-3 rounded-xl mb-3 ${
              stat.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' :
              stat.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
              stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>{stat.icon}</div>
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          className="input-glass pl-10"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Name</th>
                  <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Email</th>
                  <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Role</th>
                  <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Joined</th>
                  <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={u._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4 text-slate-400 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleStyle[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button className="p-2 rounded-lg hover:bg-pink-500/10 text-pink-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="glass-card text-center py-16 text-slate-500">
          <Briefcase className="mx-auto mb-4 opacity-20" size={48} />
          <p className="font-medium">Job management will be connected to the backend API.</p>
        </div>
      )}

      {activeTab === 'apps' && (
        <div className="glass-card text-center py-16 text-slate-500">
          <FileText className="mx-auto mb-4 opacity-20" size={48} />
          <p className="font-medium">Application oversight will be connected to the backend API.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

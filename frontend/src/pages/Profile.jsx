import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Upload, Save, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, loginUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: user?.skills || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would call an API endpoint
      // await updateProfile(formData);
      const updatedUser = { ...user, ...formData };
      loginUser(updatedUser, localStorage.getItem('token'));
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = {
    CANDIDATE: { label: 'Candidate', color: 'indigo', icon: <User size={14} /> },
    RECRUITER: { label: 'Recruiter', color: 'pink', icon: <Briefcase size={14} /> },
    ADMIN: { label: 'Administrator', color: 'emerald', icon: <Shield size={14} /> },
  };

  const badge = roleBadge[user?.role] || roleBadge.CANDIDATE;

  return (
    <div className="container animate-fade">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-1">{user?.name}</h1>
              <p className="text-slate-400 font-medium mb-3">{user?.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-${badge.color}-500/10 text-${badge.color}-400 border border-${badge.color}-500/20`}>
                {badge.icon} {badge.label}
              </span>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className={`btn ${editing ? 'btn-glass' : 'btn-primary'}`}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSave} className="glass-card space-y-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    className="input-glass pl-10"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled={!editing}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    className="input-glass pl-10"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Phone</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="+216 XX XXX XXX"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Location</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Tunis, Tunisia"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            {user?.role === 'CANDIDATE' && (
              <>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Skills</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="React, Python, NLP, Machine Learning..."
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Bio / Summary</label>
                  <textarea
                    rows={4}
                    className="input-glass"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Upload CV</label>
                  <div className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all ${editing ? 'border-white/10 hover:border-indigo-500/60 hover:bg-indigo-500/5 cursor-pointer' : 'border-white/5 opacity-50'} relative`}>
                    <input type="file" accept=".pdf,.doc,.docx" disabled={!editing} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="mx-auto text-slate-500 mb-2" size={32} />
                    <p className="text-sm font-medium">Drop your CV here (PDF/DOCX)</p>
                  </div>
                </div>
              </>
            )}

            {editing && (
              <div className="pt-4 border-t border-white/5">
                <button type="submit" disabled={loading} className="btn btn-primary px-8 py-3">
                  {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

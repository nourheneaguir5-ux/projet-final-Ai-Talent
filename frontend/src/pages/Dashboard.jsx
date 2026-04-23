import React, { useEffect, useState } from 'react';
import { fetchJobs, createJob, fetchJobApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, Award, TrendingUp, PlusCircle, X, Loader2, MapPin, Clock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', type: 'Full-time' });
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMyJobs();
  }, []);

  const loadMyJobs = async () => {
    try {
      const { data } = await fetchJobs();
      setJobs(data.data.filter(j => j.recruiter?._id === user?.id || j.company === user?.name));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      setShowAddJob(false);
      setFormData({ title: '', description: '', company: '', location: '', type: 'Full-time' });
      loadMyJobs();
    } catch (err) {
      alert('Error creating job');
    }
  };

  const viewApplications = async (jobId) => {
    try {
      const { data } = await fetchJobApplications(jobId);
      setSelectedJobApps(data.data);
    } catch (err) {
      alert('Error fetching applications');
    }
  };

  return (
    <div className="container animate-fade">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Recruiter Dashboard</h1>
          <p className="text-slate-400 text-lg">Manage your listings and analyze candidates with AI-powered insights.</p>
        </div>
        <button onClick={() => setShowAddJob(true)} className="btn btn-primary px-8 py-4 text-lg group">
          <PlusCircle className="group-hover:rotate-90 transition-transform" /> Post New Job
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="glass-card flex items-center gap-6 p-8 border-l-4 border-indigo-500">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl"><PlusCircle size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Active Jobs</p>
            <p className="text-4xl font-black">{jobs.length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card flex items-center gap-6 p-8 border-l-4 border-pink-500">
          <div className="p-4 bg-pink-500/10 text-pink-400 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Total Applicants</p>
            <p className="text-4xl font-black">48</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card flex items-center gap-6 p-8 border-l-4 border-emerald-500">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Top Match Rate</p>
            <p className="text-4xl font-black">92%</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Briefcase className="text-indigo-400" /> Your Active Listings</h2>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="glass h-24 skeleton mb-4" />)
          ) : jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={job._id} 
                onClick={() => viewApplications(job._id)} 
                className="glass p-6 cursor-pointer hover:bg-white/5 transition-all border-l-4 border-indigo-500 flex justify-between items-center group"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-xl text-[10px] font-black mb-1 inline-block border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    12 APPLICATIONS
                  </div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Priority Listing</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass p-12 text-center text-slate-500">
              <PlusCircle className="mx-auto mb-4 opacity-20" size={48} />
              <p>You haven't posted any jobs yet.</p>
            </div>
          )}
        </div>

        {/* Selected Job Apps (Ranking View) */}
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Award className="text-pink-400" /> AI Match Analysis</h2>
          <div className="glass-card p-0 overflow-hidden min-h-[500px]">
            {!selectedJobApps ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12 text-center min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Users size={40} className="opacity-30" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Select a Position</h3>
                <p className="text-sm max-w-xs">Click on any job listing to view the AI-ranked candidates for that role.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                <div className="p-4 bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                  <span>Candidate Details</span>
                  <span>Match Score</span>
                </div>
                {selectedJobApps.map((app, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={app._id} 
                    className="p-6 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-indigo-400"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg mb-1">{app.candidate?.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{app.candidate?.email}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-black mb-1 ${
                          app.aiScore > 0.7 ? 'text-emerald-400' :
                          app.aiScore > 0.4 ? 'text-amber-400' : 'text-pink-400'
                        }`}>
                          {Math.round(app.aiScore * 100)}%
                        </div>
                        <a 
                          href={(() => {
                            const fileName = app.cvPath.split(/[/\\]/).pop();
                            return `http://localhost:5000/uploads/${fileName}`;
                          })()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-glass py-2 px-4 text-[10px] uppercase tracking-widest group/cv"
                        >
                          <FileText size={14} className="text-indigo-400 group-hover/cv:scale-110 transition-transform" />
                          View Portfolio
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddJob(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="glass-card w-full max-w-2xl relative z-10 p-0 overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-3xl font-black">Post New Position</h2>
                <button onClick={() => setShowAddJob(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddJob} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Job Title</label>
                   <input required type="text" className="input-glass py-4" placeholder="Lead AI Engineer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Company Name</label>
                   <input required type="text" className="input-glass py-4" placeholder="Tanit Talent AI" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Location</label>
                   <input required type="text" className="input-glass py-4" placeholder="Remote / Global" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <div className="md:col-span-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Detailed Description</label>
                   <textarea required rows={5} className="input-glass" placeholder="Describe the role and key matching criteria for our AI..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <div className="md:col-span-2 flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddJob(false)} className="btn btn-glass flex-1 justify-center py-4">Cancel</button>
                    <button type="submit" className="btn btn-primary flex-1 justify-center py-4 text-lg">Deploy Job Listing</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

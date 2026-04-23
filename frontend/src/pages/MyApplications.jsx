import React, { useEffect, useState } from 'react';
import { fetchMyApplications } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data } = await fetchMyApplications();
      setApplications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const statusConfig = {
    pending: { icon: <Clock size={16} />, label: 'Pending', color: 'amber' },
    reviewed: { icon: <AlertCircle size={16} />, label: 'Under Review', color: 'blue' },
    accepted: { icon: <CheckCircle size={16} />, label: 'Accepted', color: 'emerald' },
    rejected: { icon: <XCircle size={16} />, label: 'Rejected', color: 'pink' },
  };

  return (
    <div className="container animate-fade">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">My Applications</h1>
          <p className="text-slate-400 text-lg">Track the status of all your job applications.</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass h-24 skeleton" />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, idx) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={app._id}
                  className="glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{app.job?.title || 'Untitled Position'}</h3>
                      <p className="text-sm text-slate-500">{app.job?.company} • {app.job?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {app.aiScore !== undefined && (
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-500 uppercase tracking-widest">AI Match</p>
                        <p className={`text-lg font-black ${
                          app.aiScore > 0.7 ? 'text-emerald-400' :
                          app.aiScore > 0.4 ? 'text-amber-400' : 'text-pink-400'
                        }`}>{Math.round(app.aiScore * 100)}%</p>
                      </div>
                    )}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                      ${status.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                      ${status.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                      ${status.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                      ${status.color === 'pink' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : ''}
                    `}>
                      {status.icon} {status.label}
                    </div>
                    {app.cvPath && (
                      <a 
                        href={`http://localhost:5000/uploads/${app.cvPath.split(/[/\\]/).pop()}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                        title="View Uploaded CV"
                      >
                        <FileText size={20} />
                      </a>
                    )}
                    <p className="text-xs text-slate-500 hidden md:block">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card text-center py-20">
            <FileText className="mx-auto text-slate-500 mb-6 opacity-20" size={64} />
            <h2 className="text-2xl font-bold mb-2 text-slate-300">No applications yet</h2>
            <p className="text-slate-500 mb-8">Start exploring jobs and submit your CV to get matched by AI.</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

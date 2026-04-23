import React, { useEffect, useState } from 'react';
import { fetchJobs, applyToJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Building, Search, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await fetchJobs();
      setJobs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      // Simulate slightly longer loading for skeleton preview
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const file = e.target.cv.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      await applyToJob(selectedJob._id, formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedJob(null);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade">
      <div className="text-center py-16 mb-12 relative">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
            Find Your <span className="text-gradient-primary">Dream Job</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Le matching intelligent pour la nouvelle génération de talents.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto mt-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass p-2 flex items-center gap-2">
            <div className="pl-4 text-slate-500"><Search size={22} /></div>
            <input 
              type="text" 
              placeholder="Rechercher un poste, une compétence ou une entreprise..."
              className="bg-transparent border-none outline-none flex-1 py-4 text-lg text-white placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary py-3 px-6 rounded-xl hidden md:flex">Rechercher</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card h-[250px] space-y-4">
              <div className="skeleton w-12 h-12 rounded-xl"></div>
              <div className="skeleton w-3/4 h-6"></div>
              <div className="skeleton w-1/2 h-4"></div>
              <div className="skeleton w-1/2 h-4"></div>
              <div className="mt-8 skeleton w-full h-10 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                layoutId={job._id}
                key={job._id} 
                className="glass-card flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                    <Briefcase size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black px-2 py-1 rounded-md bg-white/5 text-white/40 uppercase tracking-widest mb-2 border border-white/5">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400/80 uppercase">Recrutement Ouvert</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-black mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-400 transition-all">{job.title}</h2>
                
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-400 font-medium">
                    <Building size={16} className="text-indigo-500" /> 
                    <span className="text-sm">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-medium">
                    <MapPin size={16} className="text-pink-500" /> 
                    <span className="text-sm">{job.location}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  {user?.role === 'CANDIDATE' ? (
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="btn btn-primary flex-1 py-4 shadow-xl hover:shadow-indigo-500/20"
                    >
                      Postuler Directement
                    </button>
                  ) : !user ? (
                    <Link to="/login" className="btn btn-glass flex-1 py-4 justify-center">Connectez-vous</Link>
                  ) : (
                    <div className="flex-1 text-center py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Dashboard Recruteur
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
               <AlertCircle className="mx-auto text-slate-500 mb-4" size={48} />
               <p className="text-slate-400 text-lg font-medium">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-lg relative z-10 p-0 overflow-hidden"
            >
              <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-transparent">
                <h2 className="text-3xl font-bold mb-1">Apply for {selectedJob.title}</h2>
                <p className="text-indigo-400 font-medium">{selectedJob.company} • {selectedJob.location}</p>
              </div>

              <div className="p-8 pt-0">
                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-6 rounded-full bg-green-500/10 text-green-400 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 size={56} className="animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Application Sent!</h3>
                    <p className="text-slate-400">Our AI algorithm is now analyzing your match potential. We'll be in touch soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl text-center hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-all duration-300 relative group">
                      <input 
                        type="file" 
                        name="cv" 
                        accept=".pdf,.doc,.docx" 
                        required
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-indigo-400" size={32} />
                      </div>
                      <p className="text-lg font-bold">Drop your CV here</p>
                      <p className="text-sm text-slate-500 mt-2">PDF, DOCX up to 10MB</p>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setSelectedJob(null)} className="btn btn-glass flex-1 justify-center py-4">Cancel</button>
                      <button type="submit" disabled={uploadLoading} className="btn btn-primary flex-1 justify-center py-4 text-lg">
                        {uploadLoading ? <Loader2 className="animate-spin" /> : 'Confirm Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

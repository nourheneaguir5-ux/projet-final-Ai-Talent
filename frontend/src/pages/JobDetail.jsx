import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJob, applyToJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Building, Clock, ArrowLeft, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const { data } = await fetchJob(id);
      setJob(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      await applyToJob(id, formData);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowApply(false); }, 2500);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container animate-fade">
        <div className="glass-card skeleton h-[400px] mb-8"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container animate-fade text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Briefcase size={32} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Building size={14} /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.type || 'Full-time'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {job.description || 'No description provided.'}
              </div>
            </div>

            {job.requirements && (
              <div className="border-t border-white/5 pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
            <h3 className="text-lg font-bold mb-4">Quick Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">Company</span>
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">Location</span>
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">Type</span>
                <span className="font-medium">{job.type || 'Full-time'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Posted</span>
                <span className="font-medium">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {user?.role === 'CANDIDATE' ? (
              <button onClick={() => setShowApply(true)} className="btn btn-primary w-full justify-center py-4 text-lg">
                Apply Now
              </button>
            ) : !user ? (
              <Link to="/login" className="btn btn-primary w-full justify-center py-4 text-lg">
                Sign In to Apply
              </Link>
            ) : (
              <div className="glass-card text-center text-slate-500 text-sm font-medium">
                You are viewing as a Recruiter
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowApply(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg relative z-10 p-0 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-transparent">
                <h2 className="text-2xl font-bold mb-1">Apply for {job.title}</h2>
                <p className="text-indigo-400 font-medium">{job.company}</p>
              </div>
              <div className="p-8 pt-4">
                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-6 rounded-full bg-green-500/10 text-green-400 mb-6 border border-green-500/20">
                      <CheckCircle2 size={48} className="animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Application Sent!</h3>
                    <p className="text-slate-400">Our AI is now analyzing your match potential.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl text-center hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-all duration-300 relative group">
                      <input type="file" name="cv" accept=".pdf,.doc,.docx" required className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-indigo-400" size={32} />
                      </div>
                      <p className="text-lg font-bold">Drop your CV here</p>
                      <p className="text-sm text-slate-500 mt-2">PDF, DOCX up to 10MB</p>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setShowApply(false)} className="btn btn-glass flex-1 justify-center py-4">Cancel</button>
                      <button type="submit" disabled={uploadLoading} className="btn btn-primary flex-1 justify-center py-4 text-lg">
                        {uploadLoading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
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

export default JobDetail;

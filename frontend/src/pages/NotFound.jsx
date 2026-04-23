import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 animate-fade">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card text-center max-w-lg py-16 px-12"
      >
        <div className="inline-flex p-4 rounded-2xl bg-pink-500/10 text-pink-400 mb-6">
          <Ghost size={48} />
        </div>
        <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.history.back()} className="btn btn-glass">
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 mt-auto relative z-10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Zap className="text-indigo-400" size={16} />
              </div>
              <span className="text-xl font-black text-gradient">Tanit <span className="text-indigo-400">Talent</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              La nouvelle ère du recrutement propulsée par le <span className="text-slate-300 font-bold">Deep NLP</span> et l'intelligence artificielle générative.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Features</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-slate-500">AI Matching (TF-IDF)</span></li>
              <li><span className="text-sm text-slate-500">Sentiment Analysis</span></li>
              <li><span className="text-sm text-slate-500">Clickstream Analytics</span></li>
              <li><span className="text-sm text-slate-500">Recruiter Dashboard</span></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tech Stack</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-slate-500">React.js + Vite</span></li>
              <li><span className="text-sm text-slate-500">Node.js / Express</span></li>
              <li><span className="text-sm text-slate-500">Python / Flask (IA)</span></li>
              <li><span className="text-sm text-slate-500">MongoDB + PostgreSQL</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 Tanit Talent AI — Projet PFE • MERN + Python IA
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-colors"><ExternalLink size={18} /></a>
            <a href="#" className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-colors"><ExternalLink size={18} /></a>
            <a href="#" className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

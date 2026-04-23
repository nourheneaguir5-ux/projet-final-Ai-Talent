import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Brain, BarChart3, Shield, ArrowRight, Zap, Target, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    { icon: <Brain size={28} />, title: "NLP-Powered Analysis", desc: "Our AI extracts and analyzes CV content using TF-IDF and cosine similarity for precise matching." },
    { icon: <Target size={28} />, title: "Smart Matching Score", desc: "Get an instant compatibility score between candidates and job offers, ranked automatically." },
    { icon: <BarChart3 size={28} />, title: "Sentiment Analysis", desc: "Evaluate candidate feedback and platform reviews with real-time sentiment scoring." },
    { icon: <Shield size={28} />, title: "Secure & Scalable", desc: "JWT authentication, role-based access, and a modern MERN + Python microservices architecture." },
    { icon: <Users size={28} />, title: "Recruiter Dashboard", desc: "Visualize, filter, and rank candidates from a centralized AI-powered control panel." },
    { icon: <Zap size={28} />, title: "Clickstream Analytics", desc: "Track user behavior in real-time to optimize the recruitment funnel." },
  ];

  const steps = [
    { num: "01", title: "Create Your Account", desc: "Sign up as a Candidate or Recruiter in seconds." },
    { num: "02", title: "Post or Browse Jobs", desc: "Recruiters publish offers, candidates discover opportunities." },
    { num: "03", title: "Upload Your CV", desc: "Our AI automatically extracts skills and experience." },
    { num: "04", title: "Get Matched by AI", desc: "Instant scoring and ranking powered by NLP algorithms." },
  ];

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section className="container py-24 md:py-40 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-indigo-400 text-sm font-bold mb-10 border border-white/10 backdrop-blur-xl">
            <Zap size={14} className="animate-pulse" /> 
            <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-widest text-[10px]">
              AI-Powered Recruitment 2.0
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 leading-none tracking-tighter">
            Hire Smarter.
            <span className="block mt-2 text-gradient-primary">
              Scale Faster.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-14 font-medium px-4">
            Tanit Talent AI utilise le <span className="text-white font-bold">Deep NLP</span> pour transformer votre processus de recrutement. 
            Analysez, scorez et recrutez les meilleurs talents en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {user ? (
              <Link to="/jobs" className="btn btn-primary px-10 py-5 text-lg group">
                Exploration des Offres <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-10 py-5 text-lg group">
                  Commencer l'aventure <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn btn-glass px-10 py-5 text-lg">
                  Se Connecter
                </Link>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Visual elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Active Jobs" },
              { value: "10K+", label: "Candidates" },
              { value: "95%", label: "Match Accuracy" },
              { value: "< 3s", label: "Analysis Speed" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Fonctionnalités Clés</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Une stack technologique de pointe pour un recrutement à la hauteur de vos ambitions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card group"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-white/5">
        <div className="container py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Comment Ça Marche ?</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Un processus en 4 étapes simples, automatisé du début à la fin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card text-center relative"
              >
                <div className="text-5xl font-black text-indigo-500/20 mb-4">{step.num}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="glass-card text-center py-16 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Prêt à transformer votre recrutement ?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Rejoignez des centaines de recruteurs qui utilisent déjà l'IA pour trouver les meilleurs talents.
            </p>
            <Link to="/register" className="btn btn-primary px-10 py-4 text-lg">
              Commencer Maintenant <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

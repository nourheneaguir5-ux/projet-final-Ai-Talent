import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, User as UserIcon, Menu, X, FileText, BarChart3, Home, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setMobileOpen(false);
    navigate('/login');
  };

  const NavLink = ({ to, children, icon: Icon, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => { setMobileOpen(false); onClick?.(); }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
          isActive 
            ? 'bg-indigo-500/10 text-indigo-400' 
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        {Icon && <Icon size={18} />}
        {children}
      </Link>
    );
  };

  return (
    <nav className="glass sticky top-6 z-[100] self-center w-[94%] max-w-7xl px-6 md:px-10 py-5 shadow-2-xl">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 p-2 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tight text-gradient">
            Tanit <span className="text-indigo-400">Talent</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/jobs" icon={Briefcase}>Jobs</NavLink>

              {user.role === 'RECRUITER' && (
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              )}
              {user.role === 'CANDIDATE' && (
                <NavLink to="/my-applications" icon={FileText}>My Applications</NavLink>
              )}
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" icon={BarChart3}>Admin</NavLink>
              )}

              <div className="flex items-center gap-3 pl-4 ml-4 border-l border-white/10">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-indigo-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <UserIcon size={16} />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/10 text-pink-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/jobs" icon={Briefcase}>Jobs</NavLink>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              <Link to="/login" className="btn btn-glass text-sm py-2 px-4">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-1 border-t border-white/10 mt-3">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/jobs" icon={Briefcase}>Jobs</NavLink>

              {user ? (
                <>
                  {user.role === 'RECRUITER' && (
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  )}
                  {user.role === 'CANDIDATE' && (
                    <NavLink to="/my-applications" icon={FileText}>My Applications</NavLink>
                  )}
                  {user.role === 'ADMIN' && (
                    <NavLink to="/admin" icon={BarChart3}>Admin</NavLink>
                  )}
                  <NavLink to="/profile" icon={UserIcon}>Profile</NavLink>

                  <div className="pt-2 mt-2 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-pink-400 hover:bg-pink-500/10 text-sm font-medium transition-all"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-glass w-full justify-center text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full justify-center text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

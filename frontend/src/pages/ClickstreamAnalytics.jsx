import React from 'react';
import { MousePointer2, Eye, Clock, ArrowUpRight, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchStats } from '../services/api';
import { useEffect, useState } from 'react';

const ClickstreamAnalytics = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchStats();
        setStatsData(res.data.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="container p-20 text-center font-bold">Loading Platform Analytics...</div>;

  // Process data from events
  const recentEvents = statsData?.recentEvents || [];
  const eventDistribution = statsData?.eventDistribution || [];
  
  const totalViews = eventDistribution.find(d => d._id === 'PAGE_VIEW')?.count || 0;
  const totalClicks = eventDistribution.find(d => d._id === 'BUTTON_CLICK')?.count || 0;

  const stats = [
    { label: 'Total Page Views', value: totalViews, icon: <Eye size={24} />, change: '+-' },
    { label: 'Total Clicks', value: totalClicks, icon: <MousePointer2 size={24} />, change: '+-' },
    { label: 'Active Users', value: statsData?.counts.users || 0, icon: <Clock size={24} />, change: '+-' },
    { label: 'Jobs Posted', value: statsData?.counts.jobs || 0, icon: <ArrowUpRight size={24} />, change: '+-' },
  ];

  // Simple placeholder for chart till more data
  const chartData = [20, 30, 45, 35, 60, 55, 70, 80, 85, 90, 80, 70];
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="container animate-fade">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="text-pink-400" size={28} />
          <h1 className="text-4xl md:text-5xl font-black">Clickstream Analytics</h1>
        </div>
        <p className="text-slate-400 text-lg">Track user behavior patterns and optimize the recruitment funnel.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">{stat.icon}</div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-indigo-400" /> Monthly Traffic Overview
            </h2>
            <div className="flex items-end justify-between gap-2 h-[200px] pt-4">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400/50 rounded-t-lg min-h-[4px] hover:from-pink-500 hover:to-pink-400/50 transition-colors cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">{chartLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Actions Placeholder */}
        <div className="lg:col-span-4">
          <div className="glass-card p-8 text-center flex flex-col items-center justify-center h-full">
             <BarChart3 className="text-pink-400 mb-4" size={48} />
             <p className="text-lg font-bold">Deep Funnel Analysis</p>
             <p className="text-sm text-slate-500">Real-time action frequency tracking active.</p>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="glass overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Recent Raw Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Time</th>
                <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">User</th>
                <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Type</th>
                <th className="text-left text-xs font-black text-slate-500 uppercase tracking-widest p-4">Page/Action</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((e, i) => (
                <tr key={e._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs text-slate-500">{new Date(e.timestamp).toLocaleTimeString()}</td>
                  <td className="p-4 font-bold">{e.user?.name || 'Anonymous'}</td>
                  <td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${e.type === 'PAGE_VIEW' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400'}`}>{e.type}</span></td>
                  <td className="p-4 text-sm font-medium">{e.page || e.element}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClickstreamAnalytics;

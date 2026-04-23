import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, TrendingUp, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createReview, fetchReviews } from '../services/api';
import { useEffect } from 'react';

const SentimentAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetchReviews();
      setHistory(res.data.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const analyze = async () => {
    setAnalyzing(true);
    try {
      const res = await createReview({ text: inputText });
      const data = res.data.data;
      setResults({
        sentiment: data.sentiment.toLowerCase(),
        confidence: Math.abs(data.score),
        text: data.text
      });
      loadHistory();
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    analyze();
  };

  // Calculate aggregated stats from history
  const posCount = history.filter(h => h.sentiment === 'Positive').length;
  const neuCount = history.filter(h => h.sentiment === 'Neutral').length;
  const negCount = history.filter(h => h.sentiment === 'Negative').length;
  const total = history.length || 1;

  const aggregated = [
    { label: 'Positive Reviews', count: posCount, pct: Math.round((posCount / total) * 100), color: 'emerald' },
    { label: 'Neutral Reviews', count: neuCount, pct: Math.round((neuCount / total) * 100), color: 'amber' },
    { label: 'Negative Reviews', count: negCount, pct: Math.round((negCount / total) * 100), color: 'pink' },
  ];

  const sentimentStyle = {
    positive: { icon: <ThumbsUp size={32} />, color: 'emerald', label: 'Positive' },
    neutral: { icon: <Minus size={32} />, color: 'amber', label: 'Neutral' },
    negative: { icon: <ThumbsDown size={32} />, color: 'pink', label: 'Negative' },
  };

  return (
    <div className="container animate-fade">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="text-indigo-400" size={28} />
          <h1 className="text-4xl md:text-5xl font-black">Sentiment Analysis</h1>
        </div>
        <p className="text-slate-400 text-lg">Analyze feedback and comments with NLP-powered sentiment detection.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-4">Analyze Text</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                rows={5}
                className="input-glass"
                placeholder="Paste a review, comment, or feedback to analyze its sentiment..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button type="submit" disabled={analyzing || !inputText.trim()} className="btn btn-primary px-8 py-3">
                {analyzing ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Analyze Sentiment</>}
              </button>
            </form>
          </div>

          {/* Result */}
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
              <h2 className="text-xl font-bold mb-6">Analysis Result</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className={`p-4 rounded-2xl ${
                  results.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                  results.sentiment === 'neutral' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-pink-500/10 text-pink-400'
                }`}>
                  {sentimentStyle[results.sentiment].icon}
                </div>
                <div>
                  <p className="text-2xl font-black">{sentimentStyle[results.sentiment].label}</p>
                  <p className="text-sm text-slate-500">Confidence: {(results.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-300 italic">
                "{results.text}"
              </div>
            </motion.div>
          )}
        </div>

        {/* Aggregated Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-400" /> Platform Sentiment Overview
            </h2>
            <div className="space-y-6">
              {aggregated.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-bold">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full rounded-full ${
                        item.color === 'emerald' ? 'bg-emerald-500' :
                        item.color === 'amber' ? 'bg-amber-500' :
                        'bg-pink-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card text-center p-8">
            <p className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              {Math.round((posCount / total) * 100)}%
            </p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Overall Positive Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;

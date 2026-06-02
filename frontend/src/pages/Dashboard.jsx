import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Flame, 
  Award, 
  Mic, 
  FileText, 
  Clock, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Code
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/authStore';
import SubscriptionModal from '../components/SubscriptionModal';
import { Crown, Lock, Unlock, Calendar, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [showSubModal, setShowSubModal] = useState(false);
  const [subModalTab, setSubModalTab] = useState('full');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/user');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load user analytics:', err);
        setError('Could not connect to analysis service. Ensure backend server is executing.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <Loader2 className="w-12 h-12 text-cyber-accent animate-spin" />
        <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
          Loading preparation analytics cockpit...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-red-500/20 text-center my-12 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-white">System Sync Offline</h3>
          <p className="text-gray-400 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white/5 border border-white/10 hover:border-cyber-accent hover:bg-cyber-accent/5 px-6 py-2.5 rounded-xl font-semibold text-gray-300 transition"
          >
            Retry Sync
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Pre-calculate Level XP progress
  const levelXPNeeded = user.level * 150;
  const xpPercentage = Math.min(Math.round((user.xp / levelXPNeeded) * 100), 100);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        
        {/* Header Hero card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyber-accentGlow filter blur-[80px] pointer-events-none -z-10"></div>
          <div>
            <span className="text-xs font-bold text-cyber-neon tracking-widest uppercase block mb-2">
              TARGET ROLE: {user.targetRole}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Welcome to Your Cockpit, {user.name}!
            </h2>
            <p className="text-gray-400 text-sm mt-1 leading-normal max-w-xl">
              Track your hiring readiness indicators, complete technical prep loops, and optimize your ATS score.
            </p>
          </div>

          <Link
            to="/interview-setup"
            className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold px-6 py-3.5 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center gap-2"
          >
            <Mic className="w-4 h-4 shrink-0" />
            Start AI Mock Interview
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-accent/15 p-3.5 rounded-xl text-cyber-accent">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Interviews Taken</span>
              <span className="text-2xl font-black text-white">{stats.totalInterviews}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-neon/15 p-3.5 rounded-xl text-cyber-neon">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Average AI Score</span>
              <span className="text-2xl font-black text-white">{stats.avgScore}%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-amber-500/15 p-3.5 rounded-xl text-cyber-gold">
              <Flame className="w-5 h-5 fill-cyber-gold" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Daily Streak</span>
              <span className="text-2xl font-black text-white">{stats.user?.streak} Days</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-jade/15 p-3.5 rounded-xl text-cyber-jade">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">ATS Resume Score</span>
              <span className="text-2xl font-black text-white">{stats.latestAtsScore ? `${stats.latestAtsScore}%` : 'N/A'}</span>
            </div>
          </div>

        </div>

        {/* MODULAR SAAS SUBSCRIPTION COCKPIT */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/40 relative overflow-hidden flex flex-col gap-6 text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-black text-cyber-neon tracking-widest uppercase block mb-1">MEMBERSHIP CENTER</span>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400 animate-bounce" />
                SaaS Subscription & Premium Hub
              </h3>
            </div>
            
            {user?.isFullPremium ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-yellow-400 font-extrabold shadow-lg">
                <Crown className="w-4 h-4 animate-spin-slow" />
                PLATFORM FULL PRO ACCESS
              </div>
            ) : (
              <button 
                onClick={() => { setSubModalTab('full'); setShowSubModal(true); }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl hover:scale-[1.01] transition shadow-lg shadow-yellow-500/10 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                Get Full Access Pass (₹99)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Module 1: Interview Pro */}
            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition hover:border-purple-500/25">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-1">Interview Module</h4>
                  <span className="text-sm font-extrabold text-white">Mock Interview Pro</span>
                </div>
                {(user?.isFullPremium || user?.mockInterviewPremium) ? (
                  <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-gray-500 bg-white/2 border border-white/5 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-400" /> Locked
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">Unlimited AI simulations, Speech-to-Text transcriptions, real-time vocal feedback & detailed analytical radar metrics.</p>
              
              <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-black text-white font-mono">₹49/month</span>
                {(user?.isFullPremium || user?.mockInterviewPremium) ? (
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase">Active Pro</span>
                ) : (
                  <button 
                    onClick={() => { setSubModalTab('mock'); setShowSubModal(true); }}
                    className="text-[10px] font-black uppercase text-cyber-neon hover:text-cyan-300"
                  >
                    Subscribe Pro →
                  </button>
                )}
              </div>
            </div>

            {/* Module 2: Resume Pro */}
            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition hover:border-cyan-500/25">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">Resume Module</h4>
                  <span className="text-sm font-extrabold text-white">Resume ATS Pro</span>
                </div>
                {(user?.isFullPremium || user?.resumePremium) ? (
                  <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-gray-500 bg-white/2 border border-white/5 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" /> Locked
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">AI ATS CV optimizer, dynamic STAR enhancers, project builders, cover letter generators & print PDF/DOCX templates.</p>
              
              <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-black text-white font-mono">₹39/month</span>
                {(user?.isFullPremium || user?.resumePremium) ? (
                  <span className="text-[10px] text-cyan-400 font-extrabold uppercase">Active Pro</span>
                ) : (
                  <button 
                    onClick={() => { setSubModalTab('resume'); setShowSubModal(true); }}
                    className="text-[10px] font-black uppercase text-cyber-neon hover:text-cyan-300"
                  >
                    Subscribe Pro →
                  </button>
                )}
              </div>
            </div>

            {/* Module 3: Sandbox Pro */}
            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition hover:border-emerald-500/25">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-1">DSA Sandbox Module</h4>
                  <span className="text-sm font-extrabold text-white">Coding Sandbox Pro</span>
                </div>
                {(user?.isFullPremium || user?.codingPremium) ? (
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-gray-500 bg-white/2 border border-white/5 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Locked
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">Access to Medium/Hard questions, step-by-step AI hints, detailed code reviews, solution explainers & company DSA paths.</p>
              
              <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-black text-white font-mono">₹59/month</span>
                {(user?.isFullPremium || user?.codingPremium) ? (
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase">Active Pro</span>
                ) : (
                  <button 
                    onClick={() => { setSubModalTab('coding'); setShowSubModal(true); }}
                    className="text-[10px] font-black uppercase text-cyber-neon hover:text-cyan-300"
                  >
                    Subscribe Pro →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle split: Chart & Gamification Level Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recharts Area progress */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-white"> Hitting Timeline Score Growth</h3>
              <span className="text-[10px] bg-cyber-neon/10 text-cyber-neon px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                Last 7 Interviews
              </span>
            </div>

            <div className="w-full h-64 mt-2">
              {stats.progressLog.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.progressLog} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#06b6d4', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white/2 rounded-2xl border border-white/5 select-none">
                  <Mic className="w-10 h-10 text-gray-600 mb-2 animate-bounce" />
                  <span className="text-sm font-semibold text-gray-400">No score history plotted yet</span>
                  <p className="text-xs text-gray-600 mt-1 max-w-xs">
                    Complete your initial mock voice interview to plot score charts!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Gamification Milestone Board */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
            <h3 className="font-extrabold text-lg text-white">Gamification Profile</h3>
            
            {/* Circle Level dial */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="52" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="52" 
                    stroke="#8b5cf6" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - xpPercentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 font-bold uppercase">LEVEL</span>
                  <span className="text-3xl font-black text-white leading-none">{user.level}</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-cyber-neon uppercase tracking-widest mb-1">
                {user.xp} / {levelXPNeeded} XP
              </span>
              <p className="text-xs text-gray-500">
                Next level grants the {user.level + 1} level prep master emblem!
              </p>
            </div>

            {/* Streaks Weakness Area box */}
            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyber-neon" />
                  <span className="text-xs font-semibold text-gray-400">Strongest Area</span>
                </div>
                <span className="text-xs font-extrabold text-white uppercase">{stats.strongArea}</span>
              </div>

              <div className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold text-gray-400">Needs Practice</span>
                </div>
                <span className="text-xs font-extrabold text-red-400 uppercase">{stats.weakArea}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Lower split: Recent achievements & Quick pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Badges board */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 md:col-span-2 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white">Unlocked Preparation Badges</h3>
            
            {user.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {user.badges.map((badge, idx) => (
                  <div key={idx} className="bg-gradient-to-tr from-white/3 to-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:border-cyber-accent/40 transition">
                    <span className="text-2xl select-none shrink-0">{badge.icon || '🏆'}</span>
                    <div className="text-left overflow-hidden">
                      <h5 className="text-xs font-extrabold text-white truncate">{badge.name}</h5>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/2 p-6 rounded-2xl text-center border border-white/5">
                <span className="text-3xl block mb-2 select-none">🎖️</span>
                <span className="text-xs text-gray-400 font-bold block mb-1">No Badges Unlocked Yet</span>
                <p className="text-[11px] text-gray-600 max-w-xs mx-auto">
                  Earn XP by taking voice interviews, running code assertions, or improving ATS files.
                </p>
              </div>
            )}
          </div>

          {/* Core Action triggers */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-3 justify-center">
            <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest mb-2">QUICK ACTIONS</h4>
            
            <Link to="/resume-analyzer" className="flex justify-between items-center bg-cyber-neon/10 hover:bg-cyber-neon/15 border border-cyber-neon/20 p-4 rounded-2xl group transition">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyber-neon shrink-0" />
                <span className="text-sm font-semibold text-white">Upload New Resume</span>
              </div>
              <ChevronRight className="w-4 h-4 text-cyber-neon group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/coding-sandbox" className="flex justify-between items-center bg-cyber-accent/10 hover:bg-cyber-accent/15 border border-cyber-accent/20 p-4 rounded-2xl group transition">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-cyber-accent shrink-0" />
                <span className="text-sm font-semibold text-white">Solve DSA Sandbox</span>
              </div>
              <ChevronRight className="w-4 h-4 text-cyber-accent group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
      <SubscriptionModal 
        isOpen={showSubModal} 
        onClose={() => setShowSubModal(false)} 
        initialTab={subModalTab} 
      />
    </PageWrapper>
  );
}

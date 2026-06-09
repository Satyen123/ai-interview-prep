import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Users, 
  Mic, 
  Code2, 
  Loader2, 
  AlertCircle, 
  UserPlus, 
  ChevronRight,
  PlusCircle,
  CheckCircle2,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for adding new coding problem
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Observatory Tab states
  const [activeTab, setActiveTab] = useState('command'); // 'command' | 'observatory'
  const [uptime, setUptime] = useState(228732); // initial uptime in seconds
  const [systemMetrics, setSystemMetrics] = useState([]);
  
  const [rateLimitLogs, setRateLimitLogs] = useState([
    { ip: '198.51.100.42', path: '/api/coding/generate-problem', time: '14:23:10', status: 'Blocked' },
    { ip: '203.0.113.195', path: '/api/resume/enhance-bullet', time: '14:45:12', status: 'Warning' },
    { ip: '198.51.100.42', path: '/api/interview/answer', time: '15:01:45', status: 'Blocked' },
    { ip: '192.0.2.71', path: '/api/admin/stats', time: '15:18:22', status: 'Passed' },
  ]);
  
  const [sentryLogs, setSentryLogs] = useState([
    { id: 'err_8943f', message: 'Gemini API Timeout: 504 Gateway Timeout on generateProblem', type: 'Fatal', time: '14:24:01' },
    { id: 'err_1104e', message: 'Mongoose reconnecting: MongoNetworkError on primary replica set', type: 'Warning', time: '14:48:30' },
    { id: 'err_73f0c', message: 'Sentry initialized successfully. DSN configured.', type: 'Info', time: '15:00:00' },
    { id: 'err_39a2b', message: 'Failed to extract PDF: File format not supported by parser', type: 'Error', time: '15:19:12' }
  ]);

  // Initial seed data for system metrics Recharts lines
  useEffect(() => {
    const initialMetrics = [];
    const now = Date.now();
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initialMetrics.push({
        name: time,
        CPU: Math.floor(Math.random() * 20) + 12,
        RAM: parseFloat((5.1 + Math.random() * 0.3).toFixed(2))
      });
    }
    setSystemMetrics(initialMetrics);
  }, []);

  // Sync timers and update observatory logs dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);

      setSystemMetrics(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const cpu = Math.floor(Math.random() * 25) + 10;
        const ram = (5.2 + Math.random() * 0.4).toFixed(2);
        const newMetrics = [...prev, { name: timestamp, CPU: cpu, RAM: parseFloat(ram) }];
        return newMetrics.slice(-10);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        setError('Not authorized or server connection failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [formSuccess]);

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setFormLoading(true);
    setFormSuccess(false);

    const starterTemplates = {
      javascript: `function ${title.replace(/\s+/g, '')}(arg) {\n  // Write your code here\n  return;\n}`,
      python: `def ${title.toLowerCase().replace(/\s+/g, '_')}(arg):\n    # Write your code here\n    pass`,
      cpp: `class Solution {\npublic:\n    void ${title.replace(/\s+/g, '')}() {\n        // Write your code here\n    }\n};`,
      java: `class Solution {\n    public void ${title.replace(/\s+/g, '')}() {\n        // Write your code here\n    }\n}`
    };

    const testCases = [
      { input: "[1, 2], 3", expectedOutput: "[0, 1]", isSample: true },
      { input: "[5], 5", expectedOutput: "[0]", isSample: false }
    ];

    try {
      await axios.post('http://localhost:5000/api/admin/problems', {
        title,
        description,
        difficulty,
        category,
        starterTemplates,
        testCases
      });

      setFormSuccess(true);
      setTitle('');
      setDescription('');
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add coding problem template.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatUptime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <Loader2 className="w-12 h-12 text-cyber-accent animate-spin" />
        <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
          Loading Administrative Command Console...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-red-500/20 text-center my-12 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-white">Access Unauthorized</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 text-left pb-20">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-xs font-bold text-cyber-accent tracking-widest uppercase block mb-2">
              ADMINISTRATIVE COMMAND CONSOLE
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-cyber-accent" />
              Admin Control Center
            </h2>
          </div>

          {/* Navigation Tab triggers */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 select-none w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('command')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 uppercase ${
                activeTab === 'command'
                  ? 'bg-gradient-to-r from-cyber-accent to-cyber-neon text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab('observatory')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 uppercase ${
                activeTab === 'observatory'
                  ? 'bg-gradient-to-r from-cyber-accent to-cyber-neon text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              System Observatory
            </button>
          </div>
        </div>

        {/* Stats metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-accent/15 p-3.5 rounded-xl text-cyber-accent">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Registered Students</span>
              <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-neon/15 p-3.5 rounded-xl text-cyber-neon">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Completed Mock Sessions</span>
              <span className="text-2xl font-black text-white">{stats.totalInterviews}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-jade/15 p-3.5 rounded-xl text-cyber-jade">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Active Challenges seeded</span>
              <span className="text-2xl font-black text-white">{stats.totalProblems}</span>
            </div>
          </div>
        </div>

        {activeTab === 'command' ? (
          /* TAB 1: SEEDING & USER AUDITS */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Add Problem Form panel */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
              <h3 className="font-extrabold text-lg text-white border-b border-white/5 pb-3">
                Seed Coding Problem Template
              </h3>

              <form onSubmit={handleAddProblem} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Find Minimum in Rotated Sorted Array"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="glass-input py-2 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input py-2 text-xs bg-cyber-dark text-white cursor-pointer"
                    >
                      <option value="Arrays">Arrays & Hashing</option>
                      <option value="Stacks">Stacks</option>
                      <option value="Two Pointers">Two Pointers</option>
                      <option value="Trees">Binary Trees</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="glass-input py-2 text-xs bg-cyber-dark text-white cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Description & Constraints
                  </label>
                  <textarea
                    placeholder="Write full markdown description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input min-h-[120px] text-xs resize-none"
                    required
                  />
                </div>

                {formSuccess && (
                  <div className="flex items-center gap-2 bg-cyber-jade/10 border border-cyber-jade/20 text-cyber-jade p-3.5 rounded-xl text-xs animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Problem seed registered. Unlocked for student sandbox!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formLoading || !title || !description}
                  className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-3 rounded-xl hover:scale-[1.01] hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs mt-2"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Register Seed Template
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Registered Users Audit list */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-extrabold text-lg text-white border-b border-white/5 pb-3">
                User Profiles audit logs
              </h3>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
                {stats.recentUsers && stats.recentUsers.map(usr => (
                  <div key={usr._id} className="bg-white/3 border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:border-white/10 transition">
                    <div className="overflow-hidden mr-2">
                      <h5 className="text-xs font-extrabold text-white truncate">{usr.name}</h5>
                      <span className="text-[9px] text-gray-500 font-bold block mt-1 uppercase">
                        Lvl {usr.level} • Streak: {usr.streak} days • joined {new Date(usr.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: SYSTEM OBSERVABILITY & HEALTH MONITORS */
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Live Indicators Health Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black/45 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wider">System Uptime</span>
                  <span className="text-xs font-mono font-bold text-white">{formatUptime(uptime)}</span>
                </div>
              </div>

              <div className="bg-black/45 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wider">Rate Limiter</span>
                  <span className="text-xs font-bold text-cyber-jade uppercase tracking-widest">Active & Secure</span>
                </div>
              </div>

              <div className="bg-black/45 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-cyber-jade/10 p-2.5 rounded-xl text-cyber-jade">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wider">MongoDB Cluster</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    Healthy <span className="w-1.5 h-1.5 bg-cyber-jade rounded-full animate-ping" />
                  </span>
                </div>
              </div>

              <div className="bg-black/45 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wider">Sentry Observatory</span>
                  <span className="text-xs font-bold text-gray-300 font-mono">Capture Active</span>
                </div>
              </div>
            </div>

            {/* Line Graphs: CPU and Memory timelines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* CPU load Timeline */}
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Cpu className="w-4.5 h-4.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                    CPU Load Factor (%)
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono uppercase font-black tracking-widest">Live telemetry</span>
                </div>
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={9} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#c084fc', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="CPU" stroke="#c084fc" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Memory Allocation Timeline */}
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <HardDrive className="w-4.5 h-4.5 text-cyan-400" />
                    Memory Allocation (GB)
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-black tracking-widest">Active heap</span>
                </div>
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} />
                      <YAxis domain={[0, 8]} stroke="#4b5563" fontSize={9} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#22d3ee', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="RAM" stroke="#22d3ee" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Split row: Sentry captured logs vs Rate Limit triggers logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Captured Sentry logs */}
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-3 text-left">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-500" />
                  Captured Sentry Exceptions
                </h4>
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                  {sentryLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white/2 border border-white/5 hover:border-white/10 rounded-xl transition text-[11px] leading-relaxed flex flex-col gap-1">
                      <div className="flex justify-between items-center font-bold text-[9px] uppercase tracking-wider font-mono">
                        <span className={`px-2 py-0.5 rounded ${
                          log.type === 'Fatal' ? 'bg-red-500/10 text-red-400' : log.type === 'Error' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>{log.type}</span>
                        <span className="text-gray-500">{log.time} • {log.id}</span>
                      </div>
                      <p className="text-gray-300 font-mono mt-1 select-text">{log.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* IP Throttling and rate limit trigger logs */}
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-3 text-left">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
                  Throttling & IP Rate Limiter Triggers
                </h4>
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {rateLimitLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/2 border border-white/5 rounded-xl font-mono text-[10px]">
                        <div className="flex flex-col text-left">
                          <span className="text-gray-200 font-bold">{log.ip}</span>
                          <span className="text-gray-500 text-[8px] mt-0.5">Route: {log.path}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-0.5 rounded uppercase font-black tracking-widest text-[8px] ${
                            log.status === 'Blocked' ? 'bg-red-500/10 text-red-400' : log.status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-cyber-jade/10 text-cyber-jade'
                          }`}>{log.status}</span>
                          <span className="text-gray-600 text-[8px] mt-0.5">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </PageWrapper>
  );
}

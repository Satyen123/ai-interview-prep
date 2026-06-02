import React, { useEffect, useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
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

    // Mock initial templates
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
      <div className="flex flex-col gap-8 text-left">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-bold text-cyber-accent tracking-widest uppercase block mb-2">
            ADMINISTRATIVE COMMAND CONSOLE
          </span>
          <h2 className="text-2xl font-extrabold text-white leading-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyber-accent" />
            Admin Control Center
          </h2>
        </div>

        {/* Stats metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-accent/15 p-3.5 rounded-xl text-cyber-accent">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Registered Users</span>
              <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-neon/15 p-3.5 rounded-xl text-cyber-neon">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total Interviews</span>
              <span className="text-2xl font-black text-white">{stats.totalInterviews}</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-cyber-jade/15 p-3.5 rounded-xl text-cyber-jade">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Seeded Problems</span>
              <span className="text-2xl font-black text-white">{stats.totalProblems}</span>
            </div>
          </div>

        </div>

        {/* Middle row splitting: problem adds vs user logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                <div className="flex items-center gap-2 bg-cyber-jade/10 border border-cyber-jade/20 text-cyber-jade p-3.5 rounded-xl text-xs">
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

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1">
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

      </div>
    </PageWrapper>
  );
}

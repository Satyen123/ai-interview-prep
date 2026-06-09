import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  Sparkles, 
  Cpu, 
  Mic, 
  Code2, 
  LineChart, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  ChevronDown,
  Play,
  Briefcase,
  Layers,
  Zap,
  Users,
  Compass,
  Star,
  Globe,
  Smile,
  Terminal,
  Activity,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Check,
  CheckSquare
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';

// --- ANIMATION CONFIGURATION PRESETS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- SHOWCASE: INTERACTIVE CODE EDITOR WIDGET ---
function CodeEditorShowcase() {
  const [lang, setLang] = useState('python');
  
  const codeTemplates = {
    python: `def twoSum(nums, target):
    mp = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in mp:
            return [mp[complement], i]
        mp[num] = i
    return []`,
    javascript: `function twoSum(nums, target) {
    const mp = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in mp) {
            return [mp[complement], i];
        }
        mp[nums[i]] = i;
    }
    return [];
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}`,
    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> mp = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (mp.containsKey(complement)) {
            return new int[] { mp.get(complement), i };
        }
        mp.put(nums[i], i);
    }
    return new int[] {};
}`
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 via-cyber-darker to-[#0a0515] p-5 md:p-6 text-left relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Tab select row */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase ml-2 flex items-center gap-1 font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyber-neon" />
            judge_sandbox_v2.1
          </span>
        </div>
        <div className="flex bg-white/2 border border-white/5 p-1 rounded-xl gap-1">
          {['python', 'javascript', 'cpp', 'java'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition duration-300 ${
                lang === l ? 'bg-cyber-accent text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {l === 'cpp' ? 'C++' : l}
            </button>
          ))}
        </div>
      </div>

      {/* Main editor split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Code window */}
        <div className="lg:col-span-3 flex flex-col gap-2 font-mono text-[11px] leading-relaxed text-gray-300 bg-black/60 p-4 rounded-xl border border-white/5 min-h-[160px] overflow-x-auto custom-scrollbar">
          <pre>{codeTemplates[lang]}</pre>
        </div>

        {/* Runtime feedback metrics */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="bg-white/2 border border-white/5 p-3 rounded-xl flex flex-col gap-2">
            <span className="text-[9px] font-black text-cyber-neon tracking-widest uppercase block">Cloud Judge Verdict</span>
            <div className="flex items-center gap-2 text-cyber-jade text-xs font-extrabold uppercase">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-cyber-jade" />
              Accepted (4ms, 14.1MB)
            </div>
          </div>

          <div className="bg-cyber-accent/5 border border-cyber-accent/15 p-3.5 rounded-xl flex flex-col gap-2 relative">
            <div className="absolute top-1 right-2">
              <Sparkles className="w-4 h-4 text-cyber-accent animate-pulse" />
            </div>
            <span className="text-[9px] font-black text-cyber-accent tracking-widest uppercase block">AI Complexity Analysis</span>
            <div className="flex flex-col gap-1.5 text-[11px] leading-relaxed text-gray-400">
              <div className="flex justify-between">
                <span>Expected Time:</span>
                <span className="font-mono text-white font-bold">O(N)</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Space:</span>
                <span className="font-mono text-white font-bold">O(N)</span>
              </div>
              <p className="text-[10px] text-gray-500 border-t border-white/5 pt-2 mt-1 leading-normal">
                Using a single-pass hash map correctly prevents quadratic O(N²) index searches. Optimal solution confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SHOWCASE: INTERACTIVE CHAT DIALOG WIDGET ---
function AIChatShowcase() {
  return (
    <div className="w-full glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 via-cyber-darker to-[#0a0515] p-5 md:p-6 text-left flex flex-col gap-4 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
      
      {/* Chat header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-[10px]">AI</div>
          <div>
            <h5 className="text-xs font-black text-white leading-none">AI Recruiter Chat</h5>
            <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Google Prep Pathway</span>
          </div>
        </div>
        <span className="text-[9px] font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
          active round
        </span>
      </div>

      {/* Chat bubbles timeline */}
      <div className="flex flex-col gap-4 text-xs font-sans">
        
        {/* Recruiter Question */}
        <div className="flex gap-2.5 items-start max-w-[85%] mr-auto">
          <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black shrink-0 flex items-center justify-center select-none uppercase">AI</div>
          <div className="bg-white/3 border border-white/5 p-3 rounded-2xl rounded-tl-none text-gray-300 leading-relaxed">
            "Your submitted Two Sum code is Accepted. Can you explain the space complexity of your hash map and how it changes if we sort the elements first?"
          </div>
        </div>

        {/* User Answer */}
        <div className="flex gap-2.5 items-start max-w-[85%] ml-auto flex-row-reverse text-right">
          <div className="w-6 h-6 rounded-full bg-cyber-neon/15 border border-cyber-neon/30 text-cyber-neon text-[9px] font-black shrink-0 flex items-center justify-center select-none uppercase">ME</div>
          <div className="bg-cyber-accent/5 border border-cyber-accent/15 p-3 rounded-2xl rounded-tr-none text-left text-gray-300 leading-relaxed shadow-sm">
            "With the hash map, space is O(N) to store target elements. If we sort first, we could use two-pointers which reduces space to O(1) auxiliary variables, but increases time complexity to O(N log N) due to sorting."
          </div>
        </div>

        {/* Dynamic AI Follow-up & Grade */}
        <div className="flex gap-2.5 items-start max-w-[85%] mr-auto">
          <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black shrink-0 flex items-center justify-center select-none uppercase">AI</div>
          <div className="bg-white/3 border border-white/5 p-4 rounded-2xl rounded-tl-none text-gray-300 leading-relaxed flex flex-col gap-3">
            <div className="flex items-center gap-2 text-cyber-jade text-[10px] font-black uppercase border-b border-white/5 pb-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Accuracy score: 9.6 / 10
            </div>
            <p className="text-[11px] leading-relaxed text-gray-400">
              "Excellent explanation. You accurately mapped the trade-offs between O(N) space vs sorting time overheads. Follow-up: how would you handle duplicate values in the sorted list to avoid duplicates in outputs?"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SHOWCASE: INTERACTIVE ATS RESUME PROFILE WIDGET ---
function ATSResumeShowcase() {
  return (
    <div className="w-full glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 via-cyber-darker to-[#0a0515] p-5 md:p-6 text-left relative overflow-hidden shadow-2xl flex flex-col gap-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
      
      {/* Card Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyber-neon" />
          <div>
            <h5 className="text-xs font-black text-white leading-none">ATS Diagnostic Desk</h5>
            <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Resume: Software_Engineer_V3.pdf</span>
          </div>
        </div>
        <span className="text-xs font-black font-mono text-cyan-400">92 / 100 ATS Score</span>
      </div>

      {/* Main layout split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upload specs checklist */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Structural Compatibility</span>
          {[
            { label: 'Single-Column Layout Verification', status: 'Passed', color: 'text-cyber-jade' },
            { label: 'Standard ATS Font Compatibility', status: 'Passed', color: 'text-cyber-jade' },
            { label: 'Power Action Verb Usage', status: 'Passed', color: 'text-cyber-jade' },
            { label: 'Quantifiable Results Metrics', status: 'Warning', color: 'text-yellow-400' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/2 border border-white/5 px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-[11px] leading-none">
              <span className="text-gray-300 font-semibold">{item.label}</span>
              <span className={`font-black uppercase text-[9px] ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="bg-cyber-accent/5 border border-cyber-accent/15 p-4 rounded-xl flex flex-col gap-2 relative">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-cyber-accent" />
          </div>
          <span className="text-[9px] font-black text-cyber-accent tracking-widest uppercase block">ATS Phrasing Upgrades</span>
          <div className="flex flex-col gap-3 mt-1 text-[11px] leading-relaxed text-gray-400">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[9px] text-red-400 line-through font-mono">"Responsible for database code scaling."</span>
              <span className="text-[10px] text-cyber-jade font-mono block font-bold mt-0.5">➔ "Optimized database indexes and reduced Query Read Latency by 42%."</span>
            </div>
            <div>
              <span className="text-[9px] text-red-400 line-through font-mono">"Worked on microservices migration."</span>
              <span className="text-[10px] text-cyber-jade font-mono block font-bold mt-0.5">➔ "Spearheaded migration of legacy monolith to AWS microservices under SLA bounds."</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SHOWCASE: RECHARTS ANALYTICS RADAR PANEL ---
function AnalyticsShowcase() {
  const radarData = [
    { subject: 'Technical Depth', A: 92, fullMark: 100 },
    { subject: 'Communication', A: 85, fullMark: 100 },
    { subject: 'Vocal Clarity', A: 80, fullMark: 100 },
    { subject: 'Confidence', A: 88, fullMark: 100 },
    { subject: 'Grammar', A: 95, fullMark: 100 },
    { subject: 'Behavioral', A: 90, fullMark: 100 },
  ];

  const progressData = [
    { name: 'Wk 1', Score: 62 },
    { name: 'Wk 2', Score: 70 },
    { name: 'Wk 3', Score: 78 },
    { name: 'Wk 4', Score: 85 },
    { name: 'Wk 5', Score: 92 }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 via-cyber-darker to-[#0a0515] p-5 md:p-6 text-left relative overflow-hidden shadow-2xl flex flex-col gap-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/5 rounded-full filter blur-2xl pointer-events-none"></div>
      
      {/* Card Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-neon animate-pulse" />
          <div>
            <h5 className="text-xs font-black text-white leading-none">Job Readiness Matrices</h5>
            <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Student Profile: placement_cohort_2026</span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase text-cyber-jade tracking-widest bg-cyber-jade/10 border border-cyber-jade/20 px-3 py-1 rounded-full">
          Ready for FAANG
        </span>
      </div>

      {/* Main charts split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
        
        {/* Radar skill chart */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col items-center">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block self-start mb-2">Readiness Dimensions</span>
          <div className="w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.03)" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={8} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" fontSize={7} />
                <Radar name="Hiring Readiness" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress chart */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Hiring score timeline</span>
          <div className="w-full h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={progressData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={8} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#6b7280" fontSize={8} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#06b6d4', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="Score" stroke="#06b6d4" strokeWidth={2} activeDot={{ r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase border-t border-white/5 pt-2 mt-2">
            <span>Overall rating: 92.4%</span>
            <span className="text-cyber-neon flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +30% growth
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- MAIN PORTAL LANDING PAGE ---
export default function Landing() {
  const { user } = useAuthStore();
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const featureCards = [
    {
      title: "AI Mock Interviews",
      desc: "Practice HR, Technical, Behavioral, and System Design interviews with AI-generated questions and real-time verbal feedback.",
      icon: Mic,
      color: "from-blue-600 to-cyan-400"
    },
    {
      title: "Coding Sandbox",
      desc: "Solve coding challenges with live dynamic compilation, optimal reference outputs, and automated Big-O space/time complexity analysis.",
      icon: Code2,
      color: "from-purple-600 to-indigo-500"
    },
    {
      title: "ATS Resume Review",
      desc: "Upload resumes to scan for structural parsing bottlenecks, calculate alignment percentages, and find high-impact keywords.",
      icon: FileText,
      color: "from-cyan-600 to-teal-500"
    },
    {
      title: "AI Resume Builder",
      desc: "Generate clean, modern, fully ATS-compliant PDF resumes using structured STAR-format metrics without altering original records.",
      icon: Layers,
      color: "from-yellow-600 to-amber-500"
    },
    {
      title: "Cover Letter Generator",
      desc: "Draft highly compelling cover letters optimized specifically for your target job descriptions with one click.",
      icon: Sparkles,
      color: "from-rose-600 to-red-500"
    },
    {
      title: "Company-Specific Prep",
      desc: "Access customized preparational pathways mapped to hiring guidelines for Google, Amazon, Microsoft, Meta, TCS, Infosys, and more.",
      icon: Briefcase,
      color: "from-emerald-600 to-green-500"
    }
  ];

  const stepList = [
    { step: "01", title: "Upload Resume", desc: "Instantly scan your layout, extract tech tags, and calculate baseline ATS metrics." },
    { step: "02", title: "Select Target Role", desc: "Choose your target role (Frontend, Backend, System Designer) and target company." },
    { step: "03", title: "Practice Interviews", desc: "Interact with voice-activated mock panels that formulate custom behavioral queries." },
    { step: "04", title: "Solve Coding Challenges", desc: "Type solutions inside the Monaco editor with dynamic multi-language compilations." },
    { step: "05", title: "Receive AI Feedback", desc: "Get comprehensive scores mapping weaknesses, strengths, and optimal answers." },
    { step: "06", title: "Become Interview Ready", desc: "Scale placement readiness, bypass evaluation bottlenecks, and secure premium offers." }
  ];

  const faqItems = [
    {
      q: "What is the AI Mock Interview system?",
      a: "It is an autonomous conversational panel that simulates technical and behavioral interviews. It reviews your answers to provide feedback on conceptual accuracy, confidence metrics, and grammatical improvements."
    },
    {
      q: "How does the ATS Resume Reviewer work?",
      a: "It parses your resume PDF, compares it with standard recruiter parsing algorithms, checks for keyword compatibility with your target job description, and provides actionable text modifications."
    },
    {
      q: "Is the Coding Sandbox free to use?",
      a: "Yes. Our Starter plan includes access to easy algorithm challenges and code executions. Upgrading to the Pro plan unlocks medium/hard problems and deep AI refactoring evaluations."
    },
    {
      q: "Can I prepare for specific companies?",
      a: "Yes. You can filter problems, coding sandboxes, and interview styles by target paths tailored to Google, Amazon, Microsoft, Meta, TCS, Infosys, and other companies."
    },
    {
      q: "How accurate is the AI feedback?",
      a: "Our evaluations are backed by optimized Gemini LLM schemas tailored specifically to developer job descriptions, ensuring highly relevant feedback."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans selection:bg-cyber-neon selection:text-black">
      
      {/* Background Mesh Light Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-900/10 filter blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-950/15 filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] left-[-15%] w-[50%] h-[50%] rounded-full bg-cyan-950/10 filter blur-[150px] pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-24 pb-16 flex flex-col items-center text-center">
        
        {/* Sub-label banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 px-4 py-2 rounded-full mb-6 cursor-pointer hover:bg-white/5 transition-all select-none"
        >
          <Sparkles className="w-4 h-4 text-cyber-neon animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest font-mono">
            NEXT-GEN AI INTERVIEW ENGINE
          </span>
        </motion.div>

        {/* Dynamic Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.06] max-w-4xl text-white mb-6 uppercase"
        >
          AI-Powered <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Interview Preparation
          </span> <br className="hidden sm:inline" />
          Platform
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Practice mock interviews, solve coding challenges, optimize resumes, and prepare for top companies with personalized AI guidance.
        </motion.p>

        {/* CTA Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center shrink-0 mb-16 px-4"
        >
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs px-8 py-4 rounded-xl hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition duration-300 group uppercase tracking-widest"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs px-8 py-4 rounded-xl hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition duration-300 group uppercase tracking-widest"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          <a
            href="#sandbox-showcase"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/3 text-gray-300 border border-white/5 hover:border-cyber-neon hover:bg-cyber-neon/5 font-extrabold text-xs px-8 py-4 rounded-xl transition duration-300 uppercase tracking-widest"
          >
            <Play className="w-4 h-4 text-cyber-neon fill-cyber-neon/20" />
            Watch Demo
          </a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-4xl border-t border-white/5 pt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-500 text-[10px] font-black uppercase tracking-wider select-none"
        >
          <div className="flex items-center gap-1.5"><Mic className="w-4 h-4 text-blue-500" /> AI Mock Interviews</div>
          <div className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-purple-500" /> Coding Sandbox</div>
          <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-cyan-500" /> ATS Resume Review</div>
          <div className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-yellow-500" /> Resume Builder</div>
          <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500" /> Company Preparation</div>
        </motion.div>
      </section>

      {/* --- FEATURE GRID SECTION --- */}
      <section className="py-24 max-w-[1600px] w-full mx-auto px-6 md:px-12 border-t border-white/5" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
            ROBUST SaaS CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            Everything you need to secure offers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="glass-card p-6 md:p-8 rounded-3xl flex flex-col text-left gap-4 bg-gradient-to-br from-white/3 via-transparent to-white/1 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${feat.color} text-white shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- HOW IT WORKS: TIMELINE SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-[#030303]/40">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-cyber-accent uppercase tracking-widest block mb-3 font-mono">
              PREPARATION TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
            {stepList.map((step, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/3 to-transparent text-left relative flex flex-col justify-between min-h-[160px] group hover:border-white/15 transition-all duration-300"
              >
                <div>
                  <span className="text-2xl font-black font-mono bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent block mb-3">
                    {step.step}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase">{step.title}</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEDICATED VISUAL SHOWCASE MODULES (SCROLLING CONSOLE) --- */}
      
      {/* 1. CODING SANDBOX SHOWCASE */}
      <section className="py-24 border-t border-white/5 max-w-[1600px] w-full mx-auto px-6 md:px-12" id="sandbox-showcase">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left flex flex-col gap-4">
            <span className="text-xs font-black text-cyber-neon uppercase tracking-widest font-mono">MODULE SHOWCASE 01</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Coding Sandbox</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Compile, execute, and analyze your algorithms inside a fully-featured compiler environment directly integrated into the learning stack.
            </p>
            <ul className="flex flex-col gap-2 mt-2 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Multi-language compiling support (JS, Py, C++, Java, etc.)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Real-time code execution with custom test inputs</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Dedicated company coding round pathways</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Infinite AI-driven complexity log critiques</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <CodeEditorShowcase />
          </div>
        </div>
      </section>

      {/* 2. AI INTERVIEW SHOWCASE */}
      <section className="py-24 border-t border-white/5 bg-[#030303]/20">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <AIChatShowcase />
            </div>
            <div className="lg:col-span-5 text-left flex flex-col gap-4 order-1 lg:order-2">
              <span className="text-xs font-black text-cyber-neon uppercase tracking-widest font-mono">MODULE SHOWCASE 02</span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">AI Mock Interviews</h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Experience simulated recruiter rounds built specifically to audit target behavioral guidelines. Answer vocal queries, defend systems structures, and review score diagnostics.
              </p>
              <ul className="flex flex-col gap-2 mt-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Transcribed Speech-to-Text inputs with zero latency</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Real-time ratings and model benchmark answers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Interactive diagnostic feedback cards</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Dynamic follow-up questioning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ATS RESUME SHOWCASE */}
      <section className="py-24 border-t border-white/5 max-w-[1600px] w-full mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left flex flex-col gap-4">
            <span className="text-xs font-black text-cyber-neon uppercase tracking-widest font-mono">MODULE SHOWCASE 03</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">ATS Resume Reviewer</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Unlock gatekeepers' filters. Our parser reviews your PDF layout, targets key technologies matching target descriptions, and updates achievements dynamically.
            </p>
            <ul className="flex flex-col gap-2 mt-2 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Single-column compatibility verifications</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> High-frequency keyword matching logic</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Metric-focused STAR formatting suggestions</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Cover letter and template builders</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ATSResumeShowcase />
          </div>
        </div>
      </section>

      {/* 4. ANALYTICS SHOWCASE */}
      <section className="py-24 border-t border-white/5 bg-[#030303]/20">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <AnalyticsShowcase />
            </div>
            <div className="lg:col-span-5 text-left flex flex-col gap-4 order-1 lg:order-2">
              <span className="text-xs font-black text-cyber-neon uppercase tracking-widest font-mono">MODULE SHOWCASE 04</span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Readiness Analytics</h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Examine diagnostic graphs indicating preparation growth. Compare communication clarity, grammar metrics, and coding execution progress over time.
              </p>
              <ul className="flex flex-col gap-2 mt-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Recharts skill mapping graphs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Coding and algorithm execution trackers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Detailed weak vs strong area diagnostics</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyber-neon shrink-0" /> Success metrics dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF & LOGOS SECTION --- */}
      <section className="py-24 border-t border-white/5 max-w-[1600px] w-full mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3 font-mono">
            TRUSTED PARTNER PATHWAYS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            PLACEMENT METRICS
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-2 leading-relaxed">
            Helping developers secure offers at FAANG, global corporations, and top tech startups.
          </p>
        </div>

        {/* Company logos wrapper */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 select-none mb-16">
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">GOOGLE</span>
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">AMAZON</span>
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">MICROSOFT</span>
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">META</span>
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">TCS</span>
          <span className="font-extrabold text-lg sm:text-xl font-sans tracking-widest">INFOSYS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left select-none">
          {[
            {
              quote: "The voice mock sessions aligned exactly with Microsoft's HR and behavioral screening methods. The instant feedback scorecard was incredibly accurate.",
              name: "Sanket Deshmukh",
              role: "SWE II",
              company: "Microsoft",
              avatar: "S"
            },
            {
              quote: "Using the ATS resume optimizer, my score rose from 54 to 92. I immediately started receiving callbacks from recruitment panels at top tech firms.",
              name: "Pooja Hegde",
              role: "Product Developer",
              company: "Amazon",
              avatar: "P"
            },
            {
              quote: "Defending my runtime complex solutions in the sandbox compiler to the recruiter chatbot mapped precisely to my final rounds at Google.",
              name: "Abhinav Sinha",
              role: "Systems Specialist",
              company: "Google",
              avatar: "A"
            }
          ].map((testi, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/2 to-transparent flex flex-col justify-between gap-5 relative hover:border-white/10 transition"
            >
              <div className="flex gap-1 text-cyber-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-cyber-gold shrink-0" />
                ))}
              </div>
              <p className="text-gray-300 italic text-xs leading-relaxed">"{testi.quote}"</p>
              
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-8 h-8 rounded-lg bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent flex items-center justify-center font-bold text-xs">
                  {testi.avatar}
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-white leading-none">{testi.name}</h5>
                  <span className="text-[9px] text-gray-500 font-bold block mt-1 uppercase">
                    {testi.role} @ <span className="text-cyan-400">{testi.company}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent via-purple-950/5 to-black" id="pricing">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
              PREPARATION INVESTMENTS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              Pricing Models
            </h2>
            
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-xs font-bold transition-all duration-300 ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button 
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-11 h-6 bg-white/10 hover:bg-white/15 border border-white/5 rounded-full p-1 transition cursor-pointer flex items-center"
              >
                <div className={`w-4 h-4 rounded-full bg-cyber-neon transition-transform duration-300 ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
                Annually
                <span className="bg-cyber-jade/10 border border-cyber-jade/20 text-cyber-jade px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch select-none">
            
            {/* Free Starter Plan */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/5 flex flex-col justify-between gap-6 bg-gradient-to-br from-white/3 to-transparent relative">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Free Starter Plan</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Essential feature exploration</p>
                
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-extrabold text-white font-mono">₹0</span>
                  <span className="text-gray-500 text-xs font-bold ml-1.5 uppercase">/ lifetime</span>
                </div>

                <ul className="flex flex-col gap-3.5 mt-8 border-t border-white/5 pt-6 text-left">
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0 mt-0.5" />
                    <span>Limited mock voice interviews (2 sessions)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0" />
                    <span>Basic ATS PDF checklist scans</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0" />
                    <span>Access to easy compiler sandbox problems</span>
                  </li>
                </ul>
              </div>

              <Link 
                to={user ? "/dashboard" : "/register"} 
                className="w-full text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 transition duration-300 text-xs uppercase tracking-wider"
              >
                {user ? "Go to Dashboard" : "Start Free"}
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-cyber-accent flex flex-col justify-between gap-6 bg-gradient-to-br from-cyber-accent/5 to-transparent relative overflow-hidden shadow-2xl shadow-cyber-accent/15">
              <div className="absolute top-0 right-0 bg-cyber-accent text-white font-black text-[9px] tracking-widest uppercase py-1.5 px-4 rounded-bl-2xl">
                POPULAR PRO
              </div>
              
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Premium Access Plan</h3>
                <p className="text-[10px] text-cyber-neon font-bold uppercase tracking-widest block">Unbounded preparation catalog</p>
                
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {isAnnual ? '₹79' : '₹99'}
                  </span>
                  <span className="text-gray-500 text-xs font-bold ml-1.5 uppercase">
                    / month {isAnnual ? 'billed yearly' : ''}
                  </span>
                </div>

                <ul className="flex flex-col gap-3.5 mt-8 border-t border-white/5 pt-6 text-left">
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0 mt-0.5" />
                    <span>Unlimited voice mock interviews</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Unlimited ATS resume reviews & optimizers</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Unlimited coding submissions & complexity metrics</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Dynamic cover letter builders</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Google, Amazon & Microsoft pathways</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/register" 
                className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-4 rounded-xl hover:scale-[1.02] shadow-lg shadow-indigo-500/25 transition duration-300 text-xs uppercase tracking-wider"
              >
                Upgrade to Premium
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- FAQ ACCORDIONS SECTION --- */}
      <section className="py-24 max-w-5xl mx-auto px-6 border-t border-white/5" id="faq">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
            PLACEMENT KNOWLEDGEBASE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            FAQ
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <div 
                key={idx} 
                className="glass-panel border border-white/5 rounded-2xl overflow-hidden bg-gradient-to-r from-white/2 to-transparent text-left"
              >
                <div 
                  onClick={() => toggleFAQ(idx)}
                  className="px-5 py-4 flex justify-between items-center cursor-pointer select-none bg-white/1 hover:bg-white/3 transition"
                >
                  <span className="font-extrabold text-xs sm:text-sm text-gray-200">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-cyber-neon' : ''}`} />
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/3 bg-black/10 text-gray-400 text-xs leading-relaxed font-sans font-medium">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-[#030303]/40 text-center relative overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] rounded-full bg-cyber-accent/5 filter blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 relative flex flex-col items-center gap-6">
          <span className="text-xs font-black text-cyber-neon tracking-widest uppercase block mb-1">CAREER ACCELERATION PROTOCOL</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">Start Preparing Smarter Today</h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Join thousands of developers, architects, and engineering placement students utilizing our autonomous AI engine to practice interviews and verify algorithm solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-4 w-full sm:w-auto">
            {user ? (
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs px-8 py-4 rounded-xl hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition duration-300 uppercase tracking-widest"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs px-8 py-4 rounded-xl hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition duration-300 uppercase tracking-widest"
                >
                  Start Free
                </Link>
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-black text-xs px-8 py-4 rounded-xl transition duration-300 uppercase tracking-widest"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black text-center text-gray-500 text-xs max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-cyber-accent/20 text-cyber-accent p-2 rounded-xl border border-cyber-accent/30 shadow-inner">
            <Cpu className="w-4 h-4 animate-pulse-slow" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-widest uppercase">
            AI INTERVIEW <span className="text-cyber-neon">PREP</span>
          </span>
        </div>
        <p className="font-mono text-[10px] text-gray-600 leading-normal">
          © 2026 AI Interview Prep Startup. Production grade placement cockpit.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-bold text-gray-400 uppercase tracking-widest text-[9px]">
          <Link to="/about-us" className="hover:text-cyber-neon transition-colors font-semibold">About Us</Link>
          <Link to="/contact-us" className="hover:text-cyber-neon transition-colors font-semibold">Contact Us</Link>
          <Link to="/privacy-policy" className="hover:text-cyber-neon transition-colors font-semibold">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-cyber-neon transition-colors font-semibold">Terms & Conditions</Link>
          <Link to="/refund-policy" className="hover:text-cyber-neon transition-colors font-semibold">Refund Policy</Link>
          <Link to="/cookie-policy" className="hover:text-cyber-neon transition-colors font-semibold">Cookie Policy</Link>
        </div>
      </footer>

    </div>
  );
}

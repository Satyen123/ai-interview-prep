import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

// --- CUSTOM INTERACTIVE WIDGET FOR HERO DEMO ---
function HeroDemoWidget() {
  const [activeSpeech, setActiveSpeech] = useState(0);
  const conversations = [
    {
      role: "System Design Interviewer",
      question: "How would you design a rate limiter for a high-traffic microservices architecture?",
      answer: "I would use a Redis-backed Token Bucket algorithm. Redis allows atomic increments for tracking tokens per IP, preventing race conditions under high concurrency.",
      critique: "Conceptually robust. Excellent choice of Token Bucket and atomic Redis lookups. Bonus recommendation: mention sliding window counters for memory efficiency.",
      score: 9.4
    },
    {
      role: "Behavioral Recruiter",
      question: "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
      answer: "We disagreed on using SQL vs NoSQL. I set up a structured benchmark comparing write throughput and join latencies, which helped us align objectively on SQL.",
      critique: "Great utilization of the STAR method. Focused on objective data rather than emotion. Recommend adding quantitative details about the final benchmark results.",
      score: 8.9
    },
    {
      role: "Core DSA Interviewer",
      question: "Given an array of integers, find the length of the longest consecutive elements sequence.",
      answer: "I can insert all elements into a Hash Set. Then, I iterate through and check if num - 1 is present to identify sequence starts, giving O(N) time complexity.",
      critique: "Flawless optimal logic. Correct Big-O time and space complexity explanations. Bonus: mention stack recursion bounds on large sets.",
      score: 9.8
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpeech((prev) => (prev + 1) % conversations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [conversations.length]);

  return (
    <div className="w-full max-w-4xl glass-panel rounded-3xl p-5 md:p-7 border border-white/10 relative overflow-hidden bg-gradient-to-br from-black/60 via-[#070b19]/80 to-[#12071f]/80 shadow-2xl">
      <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-cyber-accent/10 rounded-full filter blur-[60px] pointer-events-none"></div>
      
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyber-neon animate-pulse-slow" />
          ACTIVE SIMULATOR: {conversations[activeSpeech].role.toUpperCase()}
        </div>
        <div className="flex gap-2">
          {conversations.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSpeech(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSpeech === i ? 'bg-cyber-neon w-6' : 'bg-white/10'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4 text-left">
          <div className="bg-[#030712]/80 border border-white/5 p-4 rounded-2xl relative">
            <span className="text-[9px] font-black text-cyber-neon tracking-widest uppercase block mb-1">
              Interviewer Prompt
            </span>
            <p className="text-gray-200 text-xs md:text-sm font-medium leading-relaxed">
              "{conversations[activeSpeech].question}"
            </p>
          </div>
          <div className="bg-cyber-accent/5 border border-cyber-accent/15 p-4 rounded-2xl">
            <span className="text-[9px] font-black text-cyber-accent tracking-widest uppercase block mb-1">
              Your Transcribed Response
            </span>
            <p className="text-gray-300 text-xs italic leading-relaxed">
              "{conversations[activeSpeech].answer}"
            </p>
          </div>
        </div>

        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyber-accent/5 via-transparent to-cyber-neon/5 pointer-events-none"></div>
          <div className="w-20 h-20 rounded-full border-2 border-cyber-neon/30 flex flex-col items-center justify-center mb-3 relative bg-black/40">
            <span className="text-2xl font-black text-white font-mono">{conversations[activeSpeech].score}</span>
            <span className="text-[8px] font-black text-cyber-neon uppercase tracking-widest mt-0.5">SCORE</span>
          </div>
          <h5 className="text-[10px] font-black uppercase tracking-wider text-cyber-jade mb-1">Feedback Synopsis</h5>
          <p className="text-[10px] text-gray-400 leading-normal">
            {conversations[activeSpeech].critique}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- DYNAMIC COUNTING CARD FOR STATS ---
function StatCard({ label, targetValue, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(targetValue.replace(/,/g, ''));
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    if (incrementTime < 10) incrementTime = 10; 

    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col items-center relative overflow-hidden bg-gradient-to-tr from-white/2 to-white/5">
      <span className="text-3xl md:text-4xl font-extrabold text-white font-mono mb-1">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// --- MAIN STARTUP LANDING PAGE ---
export default function Landing() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const featureItems = [
    {
      title: "AI Mock Interviews",
      desc: "Simulate real-time voice rounds. Receive diagnostic scorecards, grammar evaluations, and perfect reference responses instantly.",
      icon: Mic,
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Coding Sandbox",
      desc: "Practice endless data structure challenges. Get instant compiler tests, optimal Big-O codes, and recruiter critiques.",
      icon: Code2,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "ATS Resume Review",
      desc: "Upload resumes to detect missing high-frequency keywords. Match formatting against scanning parameters.",
      icon: FileText,
      color: "from-cyan-500 to-teal-500"
    },
    {
      title: "AI Resume Builder",
      desc: "Draft professional bullet points dynamically structured with active power action verbs and metric values.",
      icon: Layers,
      color: "from-yellow-500 to-amber-500"
    },
    {
      title: "Cover Letter Generator",
      desc: "Draft bespoke, highly compelling cover letters tailored specifically for your target jobs in one click.",
      icon: Sparkles,
      color: "from-rose-500 to-red-500"
    },
    {
      title: "Company Specific Prep",
      desc: "Access customized prep pathways mapped to hiring guidelines for FAANG, startups, and top tech corporations.",
      icon: Briefcase,
      color: "from-emerald-500 to-green-500"
    },
    {
      title: "Job Readiness Analytics",
      desc: "Track placement eligibility logs with beautiful skill radar dashboards mapping behavioral and tech competence.",
      icon: LineChart,
      color: "from-pink-500 to-purple-500"
    }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Upload Resume",
      desc: "Instantly import your existing resume file to run an ATS check and establish skill vectors."
    },
    {
      step: "02",
      title: "Select Role",
      desc: "Choose your target role (Frontend, Fullstack, AI Engineer) and target company difficulty."
    },
    {
      step: "03",
      title: "Practice",
      desc: "Engage in voice interviews, type in the live sandbox, and write STAR achievements."
    },
    {
      step: "04",
      title: "Improve",
      desc: "Review your detailed diagnostic reports, missing conceptual keywords, and ideal answers."
    },
    {
      step: "05",
      title: "Get Hired",
      desc: "Enter real corporate rounds with maximized confidence, technical fluency, and optimized assets."
    }
  ];

  const faqItems = [
    {
      q: "How does the AI Mock Interview system evaluate my answer?",
      a: "Our core evaluation framework reviews your transcribed responses to map conceptual accuracy, vocabulary choice, and keyword density. It ranks your answer on a scale from 1 to 10 and outlines strengths, growth vectors, and a model answer."
    },
    {
      q: "Does the voice interview system require browser extensions?",
      a: "No browser extensions are required. We utilize your browser's native HTML5 Speech Recognition and vocal synthesis engines to ensure a completely latency-free, direct conversational experience."
    },
    {
      q: "How does the ATS Resume Reviewer compute scores?",
      a: "It parses your PDF structure, analyzes the keyword density required for your target job description, flags passive phrasings, and checks if your formatting blocks are fully machine-readable."
    },
    {
      q: "Is the Coding Sandbox integrated with the recruiter rounds?",
      a: "Yes. In Interview Mode, when you submit a solution to the judge, the recruiter chatbot automatically receives the evaluation verdict and starts follow-up dialogs asking you to explain complexities."
    },
    {
      q: "Can I cancel my Premium subscription at any time?",
      a: "Absolutely. Subscriptions are billed on a flexible rolling cycle (monthly or annually) and can be canceled instantly in your Profile Settings with zero penalties."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans selection:bg-cyber-neon selection:text-black">
      
      {/* --- BG GRADIENT LIGHT BLOBS --- */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[55%] rounded-full bg-blue-900/15 filter blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[25%] right-[-10%] w-[45%] h-[50%] rounded-full bg-purple-950/20 filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[50%] rounded-full bg-cyan-950/15 filter blur-[150px] pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-20 pb-16 flex flex-col items-center text-center">
        
        {/* Animated glowing label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 px-4 py-2 rounded-full mb-6 cursor-pointer hover:bg-white/5 transition-all select-none"
        >
          <Sparkles className="w-4 h-4 text-cyber-neon animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            THE ULTIMATE AI PLACEMENT LAUNCHPAD
          </span>
        </motion.div>

        {/* Dynamic Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl text-white mb-6"
        >
          Ace Every Interview <br className="hidden sm:inline" />
          with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Autonomous AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Practice realistic voice-activated mock interviews, solve algorithm challenges in our sandbox, check resume ATS keyword compliance, and prepare for top-tier tech companies.
        </motion.p>

        {/* Action triggers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center shrink-0 mb-16 px-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs px-8 py-4 rounded-xl hover:scale-[1.02] shadow-xl shadow-indigo-500/20 transition duration-300 group uppercase tracking-widest"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/3 text-gray-300 border border-white/5 hover:border-cyber-neon hover:bg-cyber-neon/5 font-extrabold text-xs px-8 py-4 rounded-xl transition duration-300 uppercase tracking-widest"
          >
            <Play className="w-4 h-4 text-cyber-neon fill-cyber-neon/20" />
            Watch Demo
          </a>
        </motion.div>

        {/* Interactive Floating Dashboard simulator */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full flex justify-center px-2 select-none"
          id="demo"
        >
          <HeroDemoWidget />
        </motion.div>
      </section>

      {/* --- STATISTICS COUNTERS SECTION --- */}
      <section className="py-12 border-y border-white/5 bg-[#030303]/50 backdrop-blur-sm select-none">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="PREPARING CANDIDATES" targetValue="15,000" suffix="+" />
          <StatCard label="DSA PROBLEMS COMPLED" targetValue="100,000" suffix="+" />
          <StatCard label="INTERVIEWS EVALUATED" targetValue="25,000" suffix="+" />
          <StatCard label="PLACEMENT SUCCESS RATE" targetValue="95" suffix="%" />
        </div>
      </section>

      {/* --- FEATURES GRID SECTION --- */}
      <section className="py-24 max-w-6xl mx-auto px-6" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Designed for Top-Tier Placement Prep
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-2 leading-relaxed">
            Avoid simple templates. Gain comprehensive automated evaluations, full voice feedback, and algorithm test validations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feat, idx) => {
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

      {/* --- HOW IT WORKS TIMELINE SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-[#030303]/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-cyber-accent uppercase tracking-widest block mb-3">
              PREPARATION LIFECYCLE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Five Steps to Get Hired
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorksSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/3 to-transparent text-left relative flex flex-col justify-between min-h-[160px] group hover:border-white/15 transition-all duration-300"
              >
                <div>
                  <span className="text-2xl font-black font-mono bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent block mb-3">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING PLANS SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent via-purple-950/5 to-black" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
              FLEXIBLE MODULE LICENSING
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Invest in Your Career
            </h2>
            
            {/* Billing interval switcher */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch select-none">
            
            {/* Starter free tier */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/5 flex flex-col justify-between gap-6 bg-gradient-to-br from-white/3 to-transparent relative">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Free Starter Pass</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Essential feature exploration</p>
                
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-extrabold text-white font-mono">₹0</span>
                  <span className="text-gray-500 text-xs font-bold ml-1.5 uppercase">/ lifetime</span>
                </div>

                <ul className="flex flex-col gap-3.5 mt-8 border-t border-white/5 pt-6 text-left">
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0 mt-0.5" />
                    <span>2 voice mock interviews</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0" />
                    <span>Basic ATS PDF keyword checks</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-jade shrink-0" />
                    <span>Access to easy coding challenges</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/register" 
                className="w-full text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 transition duration-300 text-xs uppercase tracking-wider"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Premium Full Access Plan */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-cyber-accent flex flex-col justify-between gap-6 bg-gradient-to-br from-cyber-accent/5 to-transparent relative overflow-hidden shadow-2xl shadow-cyber-accent/15">
              <div className="absolute top-0 right-0 bg-cyber-accent text-white font-black text-[9px] tracking-widest uppercase py-1.5 px-4 rounded-bl-2xl">
                RECOMMENDED
              </div>
              
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Full Access Pro Pass</h3>
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
                    <span>Unlimited voice & AI mock simulations</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Deep ATS PDF optimization & templates</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>Unlimited coding submissions & optimal explanations</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0" />
                    <span>24/7 AI Mentor Chatbot panel</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/register" 
                className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-4 rounded-xl hover:scale-[1.02] shadow-lg shadow-indigo-500/25 transition duration-300 text-xs uppercase tracking-wider"
              >
                Upgrade to Pro
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 max-w-6xl mx-auto px-6 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
            SUCCESS REVIEWS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Approved by Engineers at Top Tech Companies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              quote: "The voice AI feels incredibly natural. Practicing behavioral answers with real-time feedback helped me restructure my STAR syntax before Microsoft interview rounds.",
              name: "Rohit Sharma",
              role: "Software Engineer",
              company: "Microsoft",
              avatar: "R"
            },
            {
              quote: "The ATS checker was a total game-changer. It flagged four missing tech stack keywords on my experience logs. Once fixed, I landed calls at Amazon and Meta.",
              name: "Ananya Nair",
              role: "Frontend Architect",
              company: "Amazon",
              avatar: "A"
            },
            {
              quote: "The sandbox judge + recruiter chat synergy is phenomenal. Explaining my DSA complexity choices to the recruiter chatbot mapped exactly to what my Google interview was like.",
              name: "Saurabh Sen",
              role: "System Designer",
              company: "Google",
              avatar: "S"
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

      {/* --- FAQ ACCORDIONS SECTION --- */}
      <section className="py-24 max-w-3xl mx-auto px-6 border-t border-white/5" id="faq">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-cyber-neon uppercase tracking-widest block mb-3">
            PREPARATION KNOWLEDGEBASE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Frequently Asked Questions
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
                      <div className="px-5 pb-5 pt-1 border-t border-white/3 bg-black/10 text-gray-400 text-xs leading-relaxed font-sans">
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

      {/* --- PREMIUM FOOTER --- */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black text-center text-gray-500 text-xs max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 select-none">
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
          <Link to="/about-us" className="hover:text-cyber-neon transition-colors">About Us</Link>
          <Link to="/contact-us" className="hover:text-cyber-neon transition-colors">Contact Us</Link>
          <Link to="/privacy-policy" className="hover:text-cyber-neon transition-colors">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-cyber-neon transition-colors">Terms & Conditions</Link>
          <Link to="/refund-policy" className="hover:text-cyber-neon transition-colors">Refund Policy</Link>
          <Link to="/cookie-policy" className="hover:text-cyber-neon transition-colors">Cookie Policy</Link>
        </div>
      </footer>

    </div>
  );
}

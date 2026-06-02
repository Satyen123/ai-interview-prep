import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  Mic, 
  Code2, 
  LineChart, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('tech');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const faqItems = [
    {
      q: "How does the AI Mock Interview system evaluate my answer?",
      a: "The platform extracts key conceptual components, technical accuracy, and keyword presence from your response (text or audio transcript) and compares them against industry-standard rubrics tailored to your role. It provides a numeric score, core improvements, and a model answer."
    },
    {
      q: "Is the voice interview system free to use?",
      a: "Yes, absolutely. By harnessing your browser's native HTML5 Speech Recognition and Speech Synthesis engines, we provide high-fidelity voice-to-text and text-to-speech completely free with zero latency or subscription billing."
    },
    {
      q: "What does the ATS Resume Analyzer check?",
      a: "The ATS Resume Analyzer checks your PDF format layout, scores your readiness based on high-frequency keywords required for your target role, suggests impact-driven phrasing upgrades, and identifies gaps in technical skills."
    },
    {
      q: "Can I practice coding problems in other languages?",
      a: "Our Sandbox fully supports typing, running, and analyzing DSA problems in JavaScript, Python, C++, and Java, including instant AI-driven space/time complexity reports (Big-O analysis)."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-cyber-darker">
      {/* Background Mesh Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-accentGlow filter blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-neonGlow filter blur-[120px] animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 bg-cyber-accent/10 border border-cyber-accent/20 px-4 py-2 rounded-full mb-6 cursor-pointer hover:bg-cyber-accent/15 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyber-accent" />
          <span className="text-xs font-bold text-cyber-accent uppercase tracking-widest">Next-Gen Placement Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-white mb-6"
        >
          Master Technical & HR Interviews with{' '}
          <span className="bg-gradient-to-r from-cyber-accent to-cyber-neon bg-clip-text text-transparent">
            AI Engineering
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Conduct realistic voice-activated mock interviews, build flawless resume ATS profiles, compile DSA solutions with live execution logs, and crush your upcoming assessments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold px-8 py-4 rounded-2xl hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-cyber-accent/25 group"
          >
            Start Preparing Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto bg-white/5 text-gray-300 border border-white/10 hover:border-cyber-neon hover:bg-cyber-neon/5 font-bold px-8 py-4 rounded-2xl transition-all duration-300"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Floating Mini Dash Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full max-w-5xl mt-16 glass-panel rounded-3xl p-4 md:p-6 border border-white/10 relative overflow-hidden"
          id="demo"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-green-500"></span>
            </div>
            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase">
              VIRTUAL AI ASSESSMENT PANEL
            </div>
            <div className="bg-cyber-accent/10 text-cyber-accent px-3 py-1 rounded-xl text-xs font-extrabold border border-cyber-accent/20">
              Active Simulation
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* QA Transcript Block */}
            <div className="md:col-span-2 flex flex-col gap-4 text-left">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <span className="text-xs font-extrabold text-cyber-neon tracking-wider uppercase block mb-1">
                  Interviewer AI Question
                </span>
                <p className="text-gray-300 font-medium leading-relaxed">
                  "Explain the core differences between a process and a thread. How do they handle memory allocations?"
                </p>
              </div>
              <div className="bg-cyber-accent/5 border border-cyber-accent/10 p-4 rounded-2xl relative">
                <span className="text-xs font-extrabold text-cyber-accent tracking-wider uppercase block mb-1">
                  Candidate Answer (Voice-Transcribed)
                </span>
                <p className="text-gray-400 italic">
                  "A process has its own dedicated address space, while threads of the same process share that memory segment... allowing fast thread-communication but introducing synchronization issues."
                </p>
              </div>
            </div>

            {/* Scorecard Widget */}
            <div className="bg-white/3 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-cyber-neon flex items-center justify-center mb-4 relative shadow-lg shadow-cyber-neon/15">
                <span className="text-3xl font-extrabold text-white">9.2</span>
                <span className="absolute bottom-0 text-[10px] bg-cyber-neon text-cyber-dark font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  SCORE
                </span>
              </div>
              <h4 className="font-bold text-gray-200 mb-2">High accuracy answer!</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Conceptually flawless. Added thread memory sharing correctly. Recommended optimization: mention scheduling stack differences.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted Metrics */}
      <section className="py-12 border-y border-white/5 bg-white/2">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-2">12,500+</h3>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">Interviews Simulates</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-cyber-accent mb-2">94%</h3>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">Placement Score Improvement</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-cyber-neon mb-2">80+</h3>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">ATS Score Average</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-2">0 SEC</h3>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">Voice Analysis Latency</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyber-neon uppercase tracking-widest block mb-3">
            ROBUST SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Everything You Need to Ace Placements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-3xl flex flex-col gap-4">
            <div className="bg-cyber-accent/15 w-12 h-12 rounded-2xl flex items-center justify-center text-cyber-accent mb-2">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Voice Interviewer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Interact with responsive virtual HR panels and tech interviewers using browser-speech synthesizers. Complete questions in real-time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 rounded-3xl flex flex-col gap-4">
            <div className="bg-cyber-neon/15 w-12 h-12 rounded-2xl flex items-center justify-center text-cyber-neon mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Resume ATS Gap Analysis</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload your PDF resume. Our parsing pipeline identifies missing keywords, assesses ATS read scores, and proposes impact-based formatting upgrades.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-3xl flex flex-col gap-4">
            <div className="bg-cyber-jade/15 w-12 h-12 rounded-2xl flex items-center justify-center text-cyber-jade mb-2">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">DSA Coding Sandbox</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Solve complex coding problems in JavaScript, Python, C++, and Java. Get instant AI runtime complex logs and optimal refactoring reports.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 border-t border-white/5 bg-white/1" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyber-accent uppercase tracking-widest block mb-3">
              FLEXIBLE INVESTMENT
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              SaaS Level Pricing Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-10 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Starter Prep</h3>
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Essential features for beginners</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-gray-500 text-sm font-semibold ml-2">/ lifetime</span>
              </div>
              <ul className="flex flex-col gap-3 my-4">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-jade shrink-0" />
                  <span>3 Complete Voice Interviews</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-jade shrink-0" />
                  <span>Basic ATS Resume Analysis</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-jade shrink-0" />
                  <span>Access to Easy DSA Sandbox Problems</span>
                </li>
              </ul>
              <Link to="/register" className="w-full text-center bg-white/5 text-white font-bold py-3.5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 mt-auto">
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="glass-card p-10 rounded-3xl border-2 border-cyber-accent flex flex-col gap-6 relative overflow-hidden shadow-2xl shadow-cyber-accent/10">
              <div className="absolute top-0 right-0 bg-cyber-accent text-white font-extrabold text-[10px] tracking-widest uppercase py-1.5 px-4 rounded-bl-2xl">
                POPULAR
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro Prep Master</h3>
                <p className="text-xs text-cyber-neon font-bold tracking-widest uppercase">Unbounded prep for hiring readiness</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$19</span>
                <span className="text-gray-500 text-sm font-semibold ml-2">/ month</span>
              </div>
              <ul className="flex flex-col gap-3 my-4">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-neon shrink-0" />
                  <span>Unlimited Voice Interview Simulators</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-neon shrink-0" />
                  <span>Full-Deep ATS Resume Optimizations</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-neon shrink-0" />
                  <span>Unlimited DSA Coding Reviews (Big-O logs)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-neon shrink-0" />
                  <span>24/7 AI Mentor Interactive Bot Drawer</span>
                </li>
              </ul>
              <Link to="/register" className="w-full text-center bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-cyber-accent/20 transition-all mt-auto">
                Unlock Pro Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-6" id="faq">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyber-neon uppercase tracking-widest block mb-3">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl flex gap-4 text-left items-start">
              <HelpCircle className="w-6 h-6 text-cyber-neon shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-lg mb-2">{item.q}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-cyber-darker text-center text-gray-500 text-xs flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-cyber-accent/20 text-cyber-accent p-1.5 rounded-lg">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold text-white tracking-wider">AI INTERVIEW PREP</span>
        </div>
        <p>© 2026 AI Interview Preparation Platform. Architected beautifully for top-tier engineers.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  X, 
  Sparkles, 
  Check, 
  Loader2, 
  Lock, 
  Crown, 
  ShieldAlert, 
  Flame, 
  Trophy, 
  Award,
  Zap, 
  Eye, 
  BookOpen, 
  Code2, 
  Terminal, 
  HelpCircle, 
  CheckCircle2 
} from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, initialTab = 'full' }) {
  const { user, upgradeToPremium } = useAuthStore();
  const [activePlanTab, setActivePlanTab] = useState(initialTab); // full, mock, resume, coding
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false); // only applies to full plan

  useEffect(() => {
    if (isOpen) {
      setActivePlanTab(initialTab);
      setCheckoutSuccess(false);
      setIsCheckingOut(false);
      setIsLifetime(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Plan Details configuration
  const plans = {
    full: {
      title: 'Full Access Premium Pass',
      price: isLifetime ? '₹299' : '₹99',
      period: isLifetime ? 'one-time flat rate' : '/month recurring',
      features: [
        'Mock Interview Advanced (Unlimited simulated interviews & text mode)',
        'Full Voice Speech AI Synthesis (Vocal synthesis & TTS checks)',
        'Interactive Recruiter Resume ATS Optimizers & Generative STAR templates',
        'Direct Print PDF Templates & standard DOCX ATS-friendly export downloads',
        'Unlimited DSA Coding Sandbox problem submissions & multi-language executions',
        'AI Step-by-Step Hints, Brute-Force Code Reviews and alternative explainers',
        'Google, Amazon, and Startup targeted company preparation paths',
        'Complete analytical radar dashboards & XP streak masteries',
        'Future platform upgrades and modular unlocks automatically!'
      ],
      planCode: isLifetime ? 'lifetime' : 'full',
      color: 'from-amber-600 to-yellow-500 text-yellow-400 border-yellow-500/35 bg-yellow-500/10'
    },
    mock: {
      title: 'Mock Interview Premium Pass',
      price: '₹49',
      period: '/month recurring',
      features: [
        'Unlimited simulated interviews (Bypasses the 2-interview free cap)',
        'Full AI Voice Interviews (Real-time Speech-to-Text & vocal Synthesis checks)',
        'Deep Recruiter-grade Performance Analysis (Radar charts & structural weak analysis)',
        'Advanced system design, behavioral, and standard HR modes'
      ],
      planCode: 'mock',
      color: 'from-purple-600 to-indigo-500 text-purple-400 border-purple-500/35 bg-purple-500/10'
    },
    resume: {
      title: 'Resume ATS Premium Pass',
      price: '₹39',
      period: '/month recurring',
      features: [
        'AI ATS Resume Generation and text re-writings tailored for recruiter systems',
        'Dynamic STAR Enhancer (Starts with active power verbs & quantifiable results)',
        'Personalized Project & Cover Letter Generators',
        'Interactive Modern Tech, Creative Executive and Minimalist Elite templates',
        'Direct Print PDF views & plain-text ATS-proof DOCX downloads'
      ],
      planCode: 'resume',
      color: 'from-cyan-600 to-teal-500 text-cyan-400 border-cyan-500/35 bg-cyan-500/10'
    },
    coding: {
      title: 'Coding Sandbox Premium Pass',
      price: '₹59',
      period: '/month recurring',
      features: [
        'Unlimited problem submissions (Bypasses the 10-problem limit)',
        'Access to Medium and Hard competitive programming questions',
        'Step-by-step AI Hint Engine (Visual complexity & edge case hints)',
        'AI Code Review (Flagging code smells, brute-force checks & refactoring tips)',
        'Personalized Google, Amazon, and Startup targeted interview path listings'
      ],
      planCode: 'coding',
      color: 'from-emerald-600 to-green-500 text-emerald-400 border-emerald-500/35 bg-emerald-500/10'
    }
  };

  const activePlan = plans[activePlanTab] || plans.full;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    // Simulate Razorpay secure payment processing checkout delay
    setTimeout(async () => {
      const ok = await upgradeToPremium(activePlan.planCode);
      if (ok) {
        setCheckoutSuccess(true);
        setIsCheckingOut(false);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setIsCheckingOut(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-[4px] animate-fadeIn text-left">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full flex flex-col gap-5 relative bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-950 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-accent/10 rounded-full filter blur-[80px]"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/2 border border-white/10 text-gray-500 hover:text-white transition duration-300 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header visual */}
        <div className="text-center relative">
          <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Premium Upgrade Center</h3>
          <p className="text-[11px] text-gray-500 mt-1 max-w-[340px] mx-auto">Get targeted SaaS module accesses or unlock the complete interview prep platform.</p>
        </div>

        {/* Modular Tabs Selector */}
        <div className="flex border-b border-white/5 bg-black/30 rounded-xl overflow-hidden p-1 flex-wrap sm:flex-nowrap">
          {[
            { id: 'full', label: 'Full Access' },
            { id: 'mock', label: 'Interview' },
            { id: 'resume', label: 'Resume ATS' },
            { id: 'coding', label: 'DSA Sandbox' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlanTab(tab.id);
                setCheckoutSuccess(false);
                setIsLifetime(false);
              }}
              className={`
                flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition duration-300
                ${activePlanTab === tab.id
                  ? 'bg-white/5 text-white border border-white/10 shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Target Plan Details Container */}
        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-[9px] font-black text-cyber-neon tracking-widest uppercase block mb-1">active subscription plan</span>
              <h4 className="text-sm font-extrabold text-white uppercase">{activePlan.title}</h4>
            </div>
            
            <div className="text-right">
              <span className="text-lg font-mono font-black text-white">{activePlan.price}</span>
              <span className="text-[9px] text-gray-500 block font-bold mt-0.5">{activePlan.period}</span>
            </div>
          </div>

          {/* Toggle Monthly vs Lifetime only for Full Plan */}
          {activePlanTab === 'full' && (
            <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 w-fit">
              <span className="text-[9px] font-black text-gray-500 tracking-wider uppercase">Full Plan Range:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsLifetime(false)}
                  className={`px-3 py-1 rounded text-[9px] font-black uppercase transition ${!isLifetime ? 'bg-cyber-neon/15 text-cyber-neon border border-cyber-neon/30' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Monthly (₹99)
                </button>
                <button
                  type="button"
                  onClick={() => setIsLifetime(true)}
                  className={`px-3 py-1 rounded text-[9px] font-black uppercase transition ${isLifetime ? 'bg-cyber-neon/15 text-cyber-neon border border-cyber-neon/30' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Lifetime (₹299)
                </button>
              </div>
            </div>
          )}

          {/* Feature checks grid */}
          <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar border-t border-white/5 pt-3">
            {activePlan.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs font-sans text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-neon shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Razorpay Mock Charging Visual Checkout Panel */}
        <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isCheckingOut || checkoutSuccess}
              className="flex-1 bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-xs py-4 rounded-xl hover:scale-[1.01] transition duration-300 flex items-center justify-center gap-1.5 shadow-xl shadow-cyber-accent/20"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Processing Secure Razorpay Transaction...
                </>
              ) : checkoutSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  Payment Successful! Module Unlocked.
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-white animate-pulse" />
                  Upgrade Plan to Pro
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white/2 hover:bg-white/5 border border-white/5 text-gray-500 hover:text-white font-bold text-xs px-6 rounded-xl transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Security / anti-abuse badges */}
        <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-wider border-t border-white/5 pt-3">
          <span>Secured by Razorpay Checkout</span>
          <span>PCI-DSS Compliant 256-bit encryption</span>
        </div>

      </div>
    </div>
  );
}

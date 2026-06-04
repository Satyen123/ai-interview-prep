import React, { useEffect } from 'react';
import { Compass, Sparkles, Cpu, Award, Users, ShieldCheck } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function AboutUs() {
  useEffect(() => {
    document.title = "About Us - AI Interview Prep";
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20 text-left select-none">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Corporate Profile Dashboard</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-cyber-neon animate-pulse" />
            About Our Mission
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">ESTABLISHED 2026</p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Mission Block */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-br from-cyber-accent/5 via-transparent to-transparent">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Our Core Mission
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-semibold">
              To make high-fidelity placement preparation accessible, personalized, and powered by secure autonomous AI systems.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Cracking modern tech placement rounds is increasingly competitive. Traditional coding platforms ignore verbal and behavioral skills, while human mock interviews are expensive and difficult to scale. We bridged this gap by engineering a unified platform that evaluates coders across all parameters in real-time.
            </p>
          </div>

          {/* Pillars List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-bold text-sm text-white">Advanced AI Models</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Leveraging the Google Gemini API to analyze speech, resume parameters, and code style objectively.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-bold text-sm text-white">Equal Opportunities</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Democratizing recruitment prep for candidates worldwide, bypassing expensive coaching fees.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="font-bold text-sm text-white">Security-First Logs</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Safeguarding user resume histories and data parameters behind encrypted Mongo schemas.</p>
            </div>

          </div>

          {/* What We Help With */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Award className="w-5 h-5 text-cyber-neon" />
              What We Help You Master
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our placement cockpit spans across all major hiring assessments required by modern recruiters:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2">
              {[
                "Vocal HR Interviews",
                "Technical System Design",
                "Data Structure Sandboxes",
                "ATS Resume Reviews",
                "Dynamic Cover Letters",
                "Company-Specific Paths"
              ].map((item, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 px-4 py-3 rounded-xl text-center text-xs font-bold text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

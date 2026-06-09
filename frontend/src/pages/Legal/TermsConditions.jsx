import React, { useEffect } from 'react';
import { Book, CheckCircle, ShieldAlert, Cpu, Award } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function TermsConditions() {
  useEffect(() => {
    document.title = "Terms & Conditions - AI Interview Prep";
  }, []);

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-20 text-left select-none px-4 md:px-8 xl:px-12">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Service Agreement Protocol</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Book className="w-8 h-8 text-cyber-neon animate-pulse" />
            Terms & Conditions
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">Last Updated: June 5, 2026</p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Account Usage */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              1. Account Registration & Usage
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              By registering an account on our platform, you agree to supply authentic registration details (such as your correct name, email address, and career profile targets). You are responsible for preserving the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized access to your account panel. One account is permitted per developer; account sharing or credential distribution is strictly prohibited.
            </p>
          </div>

          {/* Section 2: Acceptable Use */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              2. Acceptable Use Policy
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We provide this platform to assist candidates with hiring preparation. The following behaviors are strictly prohibited and will trigger immediate account suspension and IP bans:
            </p>
            <ul className="list-disc pl-5 text-gray-400 text-xs leading-relaxed flex flex-col gap-2">
              <li>Deploying automated scrapers, web spiders, or data extraction scripts to harvest questions, tutorials, reference codes, or sandbox outputs.</li>
              <li>Performing load spikes, DDoS triggers, or buffer overflow attempts on the cloud judge compiler.</li>
              <li>Attempting to reverse engineer the code checker, database structures, or AI model prompts.</li>
              <li>Abusing our Google Gemini API interface by submitting irrelevant, malicious, or spam prompts.</li>
              <li>Using the platform for any illegal activities or to store harmful file materials.</li>
            </ul>
          </div>

          {/* Section 3: Intellectual Property */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Award className="w-5 h-5 text-cyan-400" />
              3. Intellectual Property Rights
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              All visual assets, layouts, algorithms, template configurations, logo graphics, design tokens, and compiler orchestrations are the exclusive intellectual property of the **AI Interview Prep Platform**. User-submitted materials, including your uploaded PDF resumes, typed solution codes, and voice transcript recordings, remain your exclusive property.
            </p>
          </div>

          {/* Section 4: AI Accuracy Disclaimer */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              4. Automated AI Content Disclaimer
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our service provides feedback and scores using automated LLM prompts. Because AI systems are subject to hallucinations, dynamic API updates, and language modeling quirks:
            </p>
            <div className="bg-purple-950/15 border border-purple-500/10 p-4 rounded-xl">
              <p className="text-gray-400 text-[11px] leading-relaxed">
                We make **no representations or warranties** regarding the 100% correctness of AI-generated answers, coding hints, resume scores, or complexity critiques. Evaluative recommendations should serve as educational guidance. Users should verify critical programming syntax or theoretical parameters independently.
              </p>
            </div>
          </div>

          {/* Section 5: Limitation of Liability */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-tr from-white/2 to-transparent">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              5. Limitation of Liability
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              This service is supplied strictly on an **"As Is"** and **"As Available"** basis. We make no guarantees that utilizing this platform will guarantee employment, successful placements, or interview pass rates. Under no circumstances shall the platform owners be liable for any direct, indirect, consequential, or special damages arising out of your usage of the site.
            </p>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

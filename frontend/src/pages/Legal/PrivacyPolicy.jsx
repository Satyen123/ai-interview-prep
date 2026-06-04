import React, { useEffect } from 'react';
import { ShieldCheck, Info, Cpu, Database, Eye, Mail } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy - AI Interview Prep";
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20 text-left select-none">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Legal Compliance Registry</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyber-neon animate-pulse" />
            Privacy Policy
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">Last Updated: June 5, 2026</p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Information Collected */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Info className="w-5 h-5 text-blue-400" />
              1. Information We Collect
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We process data categories necessary to provide our mock interviews, resume ATS evaluations, and sandbox compiler activities. The specifics of data types include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-cyber-neon uppercase tracking-wider block mb-1">Account Credentials</span>
                <p className="text-gray-400 text-[11px] leading-relaxed">Name, email address, profile photo identifiers, and target career roles used for personalized preparation dashboards.</p>
              </div>
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-cyber-neon uppercase tracking-wider block mb-1">Resume Data</span>
                <p className="text-gray-400 text-[11px] leading-relaxed">Uploaded PDF files, parsed text details, skill strings, work histories, and generated resume templates.</p>
              </div>
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-cyber-neon uppercase tracking-wider block mb-1">Interview & Speech transcripts</span>
                <p className="text-gray-400 text-[11px] leading-relaxed">System-generated questions, voice recording files, audio transcripts, overall ratings, and AI critiques.</p>
              </div>
              <div className="bg-white/2 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-cyber-neon uppercase tracking-wider block mb-1">Coding & Sandbox history</span>
                <p className="text-gray-400 text-[11px] leading-relaxed">Submitted algorithm codes, compiler execution status, execution times, memory usage details, and solver logs.</p>
              </div>
            </div>
            <p className="text-gray-500 text-[10px] leading-relaxed italic border-t border-white/5 pt-3">
              * Technical metrics such as browser type, operating system version, dynamic IP, and authentication session cookies are logged automatically for logging diagnostics.
            </p>
          </div>

          {/* Section 2: AI Processing Disclosure */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              2. Artificial Intelligence Processing Disclosure
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our core evaluation dashboards rely on the **Google Gemini API** (and equivalent Large Language Models) to compute mock scores, formulate follow-up recruiter queries, review resume structures, suggest edits, and diagnose runtime code failures.
            </p>
            <div className="bg-purple-950/15 border border-purple-500/10 p-4 rounded-xl">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block mb-1">Important Data Handling Notice</span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                We send only raw resume text, transcript data, and submitted codes to the AI service endpoints. No personal credentials (like passwords or payment details) are ever shared. By using the platform, you acknowledge and agree that your submitted preparation content is evaluated programmatically through these secure APIs.
              </p>
            </div>
          </div>

          {/* Section 3: Data Storage & Security */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Database className="w-5 h-5 text-cyan-400" />
              3. Data Storage & Retention
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We store your data within a secure **MongoDB** database cluster. Our cloud architecture applies standard SSL/TLS encryption for all data in transit, strict dynamic firewalls, and credential hashing. Resumes and transcripts are retained for as long as your account remains active, enabling your performance dashboards to plot streak metrics over time.
            </p>
          </div>

          {/* Section 4: User Rights & Deletion */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-emerald-400" />
              4. User Rights & Data Deletion
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              You retain full ownership of your data. You can access your profile settings at any time to:
            </p>
            <ul className="list-disc pl-5 text-gray-400 text-xs leading-relaxed flex flex-col gap-1">
              <li>Request a copy of your stored resume files and performance evaluations.</li>
              <li>Edit or update account records, target company selections, or skills checklists.</li>
              <li>Instantly wipe specific resume PDFs or interview transcripts from your history panels.</li>
              <li>Request **complete account deletion** by emailing our support desk, which triggers an irreversible purge of all records from our database.</li>
            </ul>
          </div>

          {/* Section 5: Contact Coordinates */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-tr from-white/2 to-transparent">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-amber-400" />
              5. Contact Support Information
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              For any questions regarding this Privacy Policy, your dynamic data logs, or complete account deletion requests, please contact our data safety desk:
            </p>
            <div className="flex items-center gap-3 bg-white/3 border border-white/5 p-4 rounded-xl w-fit">
              <Mail className="w-4 h-4 text-cyber-neon shrink-0" />
              <span className="text-xs font-mono font-bold text-gray-300">support@yourdomain.com</span>
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

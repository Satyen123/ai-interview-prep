import React, { useEffect } from 'react';
import { Eye, Shield, Cpu, Settings, CheckSquare } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function CookiePolicy() {
  useEffect(() => {
    document.title = "Cookie Policy - AI Interview Prep";
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20 text-left select-none">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Browser Cookie Protocol</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Eye className="w-8 h-8 text-cyber-neon animate-pulse" />
            Cookie Policy
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">Last Updated: June 5, 2026</p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Cookies Used */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-blue-400" />
              1. What Cookies We Deploy
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We deploy HTTP cookies (small text blocks saved on your device) to preserve browser states, optimize response speeds, and secure account entries. The categories we utilize are:
            </p>
            
            <div className="border border-white/5 rounded-2xl overflow-hidden mt-2 bg-white/1">
              <table className="w-full text-xs text-left text-gray-400 border-collapse">
                <thead className="bg-white/3 text-[10px] font-black text-white uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Lifespan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 leading-relaxed">
                  <tr>
                    <td className="p-4 font-bold text-cyber-neon">Authentication</td>
                    <td className="p-4">Holds your secure JSON Web Token (JWT) so you remain signed into your dashboard panels on reload.</td>
                    <td className="p-4 font-mono">30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-cyber-neon">Session Manager</td>
                    <td className="p-4">Tracks active voice simulations and coding workspace buffer modifications.</td>
                    <td className="p-4 font-mono">Session</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-cyber-neon">Preferences</td>
                    <td className="p-4">Saves code editors settings (Monaco language parameters, layout splits, and dashboard theme toggles).</td>
                    <td className="p-4 font-mono">Persistent</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-cyber-neon">Analytics</td>
                    <td className="p-4">Monitors dynamic user navigation paths to detect slow loading latency and optimize core buttons.</td>
                    <td className="p-4 font-mono">1 Year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Third-Party Services */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              2. Third-Party Trackers
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We integrate third-party analytical utilities to help us optimize placement diagnostics and platform infrastructure:
            </p>
            <ul className="list-disc pl-5 text-gray-400 text-xs leading-relaxed flex flex-col gap-2">
              <li>**Google Analytics**: Collects metrics regarding geographical distribution, browser type, and page interaction times.</li>
              <li>**Microsoft Clarity**: Captures anonymous visual sessions to isolate where form layouts or responsive panels overflow.</li>
              <li>**Gemini API Integrations**: Secure tokens managing session limits for dynamic AI prompts.</li>
            </ul>
          </div>

          {/* Section 3: User Control */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-tr from-white/2 to-transparent">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-amber-400" />
              3. Manage Cookie Preferences
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Most web browsers accept cookies by default. You can adjust your browser settings to decline or clear cookies:
            </p>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                * Note: Disabling cookies will break your dashboard log-ins, causing you to be signed out on every page refresh since the browser won't be able to retain the security token.
              </p>
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

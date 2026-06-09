import React, { useEffect } from 'react';
import { CreditCard, Sparkles, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy - AI Interview Prep";
  }, []);

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-20 text-left select-none px-4 md:px-8 xl:px-12">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Billing & Remittance Protocol</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-cyber-neon animate-pulse" />
            Refund Policy
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">Last Updated: June 5, 2026</p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Free Trial */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-400" />
              1. Try Before You Buy (Free Plan)
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We provide a permanent **Free Plan** giving you 2 complete voice mock interviews, basic ATS resume parsing, and access to easy-rated algorithm challenges in the Sandbox. This allows all developers to fully audit and evaluate the platform latency, accuracy, and UI tools prior to choosing a subscription plan.
            </p>
          </div>

          {/* Section 2: Subscription Terms */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-purple-400" />
              2. Subscription Billing Terms
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Our Premium plans are billed in rolling cycles:
            </p>
            <ul className="list-disc pl-5 text-gray-400 text-xs leading-relaxed flex flex-col gap-1">
              <li>**Monthly Subscriptions**: Billed every 30 days. Cancel anytime to prevent next cycle charge.</li>
              <li>**Annual Subscriptions**: Billed once every 365 days (offering a 20% discount).</li>
            </ul>
          </div>

          {/* Section 3: Refund parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Refundable */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 flex flex-col gap-4">
              <h3 className="font-extrabold text-base text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Refundable Situations
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Refund requests are eligible for review within **7 days** of transaction billing if:
              </p>
              <ul className="list-disc pl-5 text-gray-400 text-[11px] leading-relaxed flex flex-col gap-1.5">
                <li>You were double-charged due to payment gateway duplicate checkouts.</li>
                <li>A verified backend system outage or server failure occurred that blocked premium execution completely during your active usage.</li>
              </ul>
            </div>

            {/* Non-Refundable */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-red-500/10 bg-red-500/5 flex flex-col gap-4">
              <h3 className="font-extrabold text-base text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Non-Refundable Situations
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Refund requests will be denied under these parameters:
              </p>
              <ul className="list-disc pl-5 text-gray-400 text-[11px] leading-relaxed flex flex-col gap-1.5">
                <li>Change of mind or career preparation scope.</li>
                <li>Partial billing cycle usage (e.g. subscribing, conducting 5 interviews, and requesting refunds 4 days later).</li>
                <li>Failure to pass actual job hiring rounds.</li>
              </ul>
            </div>

          </div>

          {/* Section 4: Refund Requests */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-tr from-white/2 to-transparent">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              4. Submit a Refund Claim
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              To submit a claim, please email us with your user account details, transaction timestamp, payment invoice copy, and a detailed description of the technical blocker:
            </p>
            <div className="flex items-center gap-3 bg-white/3 border border-white/5 p-4 rounded-xl w-fit">
              <CreditCard className="w-4 h-4 text-cyber-neon shrink-0" />
              <span className="text-xs font-mono font-bold text-gray-300">support@yourdomain.com</span>
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

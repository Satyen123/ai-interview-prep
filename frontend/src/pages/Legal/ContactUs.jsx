import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function ContactUs() {
  useEffect(() => {
    document.title = "Contact Us - AI Interview Prep";
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please input a valid email address.";
    }
    if (!formData.subject.trim()) errors.subject = "Subject header is required.";
    if (!formData.message.trim()) {
      errors.message = "Message details are required.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must contain at least 10 characters.";
    }
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate support ticket creation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-20 text-left select-none px-4 md:px-8 xl:px-12">
        
        {/* Header Title Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent p-8 rounded-3xl border border-white/5 shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest block mb-2">Help Desk Communication</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-cyber-neon animate-pulse" />
            Contact Support
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1 font-mono">SUPPORT TICKET CENTER</p>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/3 to-transparent relative">
            <h3 className="font-extrabold text-lg text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyber-neon" />
              Create Support Ticket
            </h3>

            {submitSuccess && (
              <div className="mb-6 flex items-center gap-3 bg-cyber-jade/10 border border-cyber-jade/30 text-cyber-jade p-4 rounded-xl text-xs animate-fadeIn">
                <CheckCircle className="w-5 h-5 shrink-0 animate-bounce" />
                <div>
                  <span className="font-bold block">Support ticket created successfully!</span>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">Our placement operations team will contact you within 24 hours.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="glass-input text-xs"
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && <span className="text-[10px] font-bold text-red-400 mt-0.5">{formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="glass-input text-xs font-mono"
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <span className="text-[10px] font-bold text-red-400 mt-0.5">{formErrors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="glass-input text-xs"
                  placeholder="Ticket Subject"
                  disabled={isSubmitting}
                />
                {formErrors.subject && <span className="text-[10px] font-bold text-red-400 mt-0.5">{formErrors.subject}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Message Description</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="glass-input text-xs min-h-[140px] leading-relaxed resize-none placeholder-gray-600"
                  placeholder="Detail your request, question, or placement feedback..."
                  disabled={isSubmitting}
                />
                {formErrors.message && <span className="text-[10px] font-bold text-red-400 mt-0.5">{formErrors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto self-start bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs px-8 py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20 transition duration-300 flex items-center justify-center gap-2 uppercase tracking-wider mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Logging ticket...</>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Support Channels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Target Support Blocks */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyber-neon" />
                Placement Help Channels
              </h4>
              
              <div className="flex flex-col gap-3.5 mt-2">
                
                {/* General Support */}
                <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">General Support Email</span>
                    <span className="text-xs font-mono font-bold text-white truncate block mt-0.5">support@yourdomain.com</span>
                  </div>
                </div>

                {/* Business Inquiries */}
                <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Business Inquiries</span>
                    <span className="text-xs font-mono font-bold text-white truncate block mt-0.5">business@yourdomain.com</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Operating Guidelines */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left bg-gradient-to-tr from-white/2 to-transparent">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Response SLA Commitments
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Our support channels monitor logs around the clock:
              </p>
              <ul className="list-disc pl-5 text-gray-400 text-[11px] leading-relaxed flex flex-col gap-1.5">
                <li>General placement tickets: Response inside 12-24 hours.</li>
                <li>Premium payment adjustments: Priority triage inside 2 hours.</li>
                <li>Enterprise/B2B business calls: Handled by account managers next business day.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

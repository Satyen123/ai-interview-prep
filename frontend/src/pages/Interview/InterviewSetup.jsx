import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/interviewStore';
import { useAuthStore } from '../../store/authStore';
import SubscriptionModal from '../../components/SubscriptionModal';
import { Mic, Briefcase, BarChart, Settings, Loader2, Crown, Lock, Sparkles, UserCheck, Search, X } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function InterviewSetup() {
  const { user } = useAuthStore();
  const [role, setRole] = useState('MERN Stack Developer');
  const [type, setType] = useState('Technical Interview');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [companyType, setCompanyType] = useState('Startup');
  const [interviewerStyle, setInterviewerStyle] = useState('Friendly');
  const [showSubModal, setShowSubModal] = useState(false);

  // Search and custom profiles states
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customRoles, setCustomRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_job_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);
  const { startSession, loading } = useInterviewStore();
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save custom roles to localStorage
  useEffect(() => {
    localStorage.setItem('custom_job_profiles', JSON.stringify(customRoles));
  }, [customRoles]);

  const handleStart = async () => {
    const session = await startSession(type, difficulty, role, experienceLevel, companyType, interviewerStyle);
    if (session) {
      navigate('/live-interview');
    } else {
      setShowSubModal(true);
    }
  };

  const defaultRolesList = [
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Java Developer',
    'Data Analyst',
    'AI Engineer',
    'DevOps Engineer',
    'Cybersecurity Analyst',
    'Cloud Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Full Stack Python Developer',
    'Blockchain Developer',
    'Mobile App Developer',
    'QA Automation Engineer',
    'SAP Consultant',
    'Data Scientist',
    'ML Engineer',
    'Prompt Engineer',
    'Business Analyst',
    'Game Developer',
    'Systems Engineer',
    'Solutions Architect'
  ];

  const allAvailableRoles = Array.from(new Set([...defaultRolesList, ...customRoles]));

  const filteredRoles = searchQuery.trim() === ''
    ? allAvailableRoles.slice(0, 8)
    : allAvailableRoles.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateCustomProfile = (customTitle) => {
    const trimmed = customTitle.trim();
    if (!trimmed) return;

    if (!customRoles.includes(trimmed)) {
      setCustomRoles(prev => [trimmed, ...prev]);
    }
    setRole(trimmed);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleDeleteCustomProfile = (e, customTitle) => {
    e.stopPropagation();
    setCustomRoles(prev => prev.filter(r => r !== customTitle));
    if (role === customTitle) {
      setRole('MERN Stack Developer');
    }
  };

  const types = [
    'Technical Interview',
    'HR Interview',
    'System Design',
    'Behavioral',
    'Coding Interview',
    'Resume Viva',
    'Project Discussion',
    'Rapid Fire',
    'Company Mock'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'FAANG', 'Expert'];
  const experienceLevels = ['Fresher', 'Mid-Level', 'Senior'];
  const companyTypes = ['FAANG', 'Startup', 'Corporate'];

  const personalities = [
    { id: 'Friendly', name: 'Friendly Partner', icon: '😊', desc: 'Encouraging & supportive tone. Perfect for building confidence and lowering pressure.' },
    { id: 'Strict', name: 'Strict Bar-Raiser', icon: '🤨', desc: 'Direct, formal, and critical. Probes deep into logical gaps and highlights weak points.' },
    { id: 'FAANG-level', name: 'FAANG Lead', icon: '💻', desc: 'Obsessed with algorithmic optimization, exact Big-O complexities, and large-scale designs.' },
    { id: 'Startup-style', name: 'Startup Founder', icon: '🚀', desc: 'Fast-paced, highly practical. Drills into product agility, execution speed, and ownership.' },
    { id: 'HR recruiter', name: 'HR Recruiter', icon: '📋', desc: 'Focuses on cultural alignment, emotional intelligence, STAR behavioral scenarios, and values.' },
    { id: 'Senior engineer', name: 'Senior Architect', icon: '🛠️', desc: 'Explores database sharding, latency limits, failovers, index configurations, and code architecture.' },
    { id: 'Rapid-fire', name: 'Rapid Fire AI', icon: '⚡', desc: 'High tempo, prompt questioning. Demands instant, punchy direct technical answers.' }
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
        
        {/* Setup Info Hero */}
        <div className="text-center">
          <div className="bg-cyber-accent/15 w-14 h-14 rounded-2xl flex items-center justify-center text-cyber-accent mx-auto mb-4 border border-cyber-accent/25">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Configure Your Session</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Customize your AI recruiter style, career target parameters, and difficulty to mirror a realistic live interview.
          </p>
        </div>

        {/* Options box */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyber-accentGlow filter blur-[120px] pointer-events-none -z-10"></div>
          
          {/* Target Role Selector Cockpit */}
          <div className="flex flex-col gap-4 relative" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyber-neon" />
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Target Job Profile
                </label>
              </div>
              <span className="text-[10px] font-bold text-cyber-neon uppercase tracking-wider bg-cyber-neon/10 px-2 py-0.5 rounded border border-cyber-neon/20">
                Active: {role}
              </span>
            </div>

            {/* Glowing Search Box */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search any career or type a custom role (e.g. Cybersecurity Engineer)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-cyber-darker text-white pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/30 transition-all duration-300 text-xs md:text-sm placeholder-gray-600 font-medium shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-white/10 text-gray-500 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Custom Matching Dropdown Drawer */}
            {showDropdown && (
              <div className="absolute top-[86px] left-0 w-full bg-[#0d1527] border border-white/15 rounded-2xl p-3 z-[100] max-h-[240px] overflow-y-auto flex flex-col gap-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] custom-scrollbar animate-fadeIn">
                {filteredRoles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className={`
                      px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-200 flex items-center justify-between border group
                      ${role === r 
                        ? 'bg-cyber-neon/10 border-cyber-neon/30 text-cyber-neon shadow-sm' 
                        : 'bg-[#121c32]/40 hover:bg-[#1a2846] text-gray-300 hover:text-white border-transparent hover:border-white/5'
                      }
                    `}
                  >
                    <span>{r}</span>
                    {customRoles.includes(r) ? (
                      <span 
                        onClick={(e) => handleDeleteCustomProfile(e, r)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/20 hover:text-white text-[10px] uppercase tracking-wider shrink-0 transition"
                        title="Delete custom profile"
                      >
                        Delete ×
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-600 group-hover:text-cyber-neon transition shrink-0 uppercase tracking-widest font-black">
                        Select →
                      </span>
                    )}
                  </button>
                ))}

                {/* Create Custom Profile Widget */}
                {searchQuery.trim() !== '' && !allAvailableRoles.some(ar => ar.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                  <button
                    onClick={() => handleCreateCustomProfile(searchQuery)}
                    className="p-3.5 rounded-xl text-left bg-gradient-to-r from-cyber-neon/15 via-purple-500/15 to-cyber-accent/15 border border-cyber-neon/30 hover:border-cyber-neon text-white font-extrabold flex items-center justify-between text-xs transition-all duration-300 mt-1 hover:scale-[1.005] shadow-lg shadow-cyber-neon/5"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyber-neon animate-pulse" />
                      Create Custom Profile: "{searchQuery}"
                    </span>
                    <span className="text-[10px] text-cyber-neon uppercase font-black tracking-widest pl-2 hover:underline">
                      Create & Add →
                    </span>
                  </button>
                )}

                {filteredRoles.length === 0 && searchQuery.trim() === '' && (
                  <p className="text-center text-gray-500 text-xs py-3 font-medium">Type to search standard profiles...</p>
                )}
              </div>
            )}

            {/* Custom Profiles Capsules Shelf */}
            <div className="flex flex-wrap gap-2 mt-1">
              {/* Selected role capsule if not empty */}
              <div className="bg-cyber-neon/10 border border-cyber-neon/20 text-cyber-neon text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md shadow-cyber-neon/5 animate-pulse">
                <span>Selected: {role}</span>
              </div>

              {/* Saved custom roles capsules */}
              {customRoles.filter(cr => cr !== role).map(cr => (
                <div 
                  key={cr}
                  onClick={() => setRole(cr)}
                  className="bg-purple-500/10 border border-purple-500/25 hover:border-purple-400 text-purple-300 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-purple-500/20 transition-all"
                >
                  <span>{cr}</span>
                  <X 
                    onClick={(e) => handleDeleteCustomProfile(e, cr)}
                    className="w-3.5 h-3.5 text-purple-400 hover:text-red-400 shrink-0 transition" 
                  />
                </div>
              ))}

              {/* Quick default suggestions */}
              {defaultRolesList.slice(0, 4).filter(dr => dr !== role).map(dr => (
                <button
                  key={dr}
                  onClick={() => setRole(dr)}
                  className="bg-cyber-card border border-white/5 text-gray-400 hover:text-white hover:border-white/15 text-[11px] font-medium px-3.5 py-1.5 rounded-full transition"
                >
                  {dr}
                </button>
              ))}
            </div>
          </div>

          {/* Setup Type Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyber-accent" />
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Interview Category
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`
                    px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 text-left
                    ${type === t 
                      ? 'bg-cyber-accent/10 border-cyber-accent text-cyber-accent shadow-md shadow-cyber-accent/10' 
                      : 'bg-cyber-card border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Personality Style Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyber-neon" />
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                AI Interviewer Personality & Style
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personalities.map(p => (
                <button
                  key={p.id}
                  onClick={() => setInterviewerStyle(p.id)}
                  className={`
                    p-4 rounded-xl text-left border transition-all duration-300 flex items-start gap-3.5 hover:scale-[1.01]
                    ${interviewerStyle === p.id 
                      ? 'bg-purple-500/10 border-purple-500 text-white shadow-md shadow-purple-500/10' 
                      : 'bg-cyber-card border-white/5 text-gray-400 hover:border-white/15'
                    }
                  `}
                >
                  <span className="text-2xl mt-0.5 shrink-0">{p.icon}</span>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${interviewerStyle === p.id ? 'text-purple-400' : 'text-gray-300'}`}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-cyber-jade" />
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Difficulty Level
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`
                    px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 text-center
                    ${difficulty === d 
                      ? 'bg-cyber-jade/10 border-cyber-jade text-cyber-jade shadow-md shadow-cyber-jade/10' 
                      : 'bg-cyber-card border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                    }
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyber-neon" />
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Experience Level
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {experienceLevels.map(el => (
                <button
                  key={el}
                  type="button"
                  onClick={() => setExperienceLevel(el)}
                  className={`
                    px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 text-center
                    ${experienceLevel === el 
                      ? 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon shadow-md shadow-cyber-neon/10' 
                      : 'bg-cyber-card border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                    }
                  `}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          {/* Target Company Selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-accent" />
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Target Company Type
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {companyTypes.map(ct => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => setCompanyType(ct)}
                  className={`
                    px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 text-center
                    ${companyType === ct 
                      ? 'bg-cyber-accent/10 border-cyber-accent text-cyber-accent shadow-md shadow-cyber-accent/10' 
                      : 'bg-cyber-card border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                    }
                  `}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyber-accent via-purple-600 to-cyber-neon text-white font-bold py-4 rounded-2xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Synthesizing Custom AI Interview Panel...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 shrink-0" />
                Launch Virtual Assessment Room
              </>
            )}
          </button>

          {/* SaaS Gating Indicators */}
          {(user?.isFullPremium || user?.mockInterviewPremium) ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-400 font-bold mt-4 shadow-md">
              <Crown className="w-5 h-5 text-yellow-400 shrink-0 animate-bounce" />
              <span>Mock Interview Pro Active! Unlimited voice simulations and analytical reports unlocked.</span>
            </div>
          ) : (
            <div 
              onClick={() => setShowSubModal(true)}
              className="bg-black/35 border border-white/5 hover:border-purple-500/20 p-4 rounded-2xl flex items-center justify-between text-xs text-gray-400 cursor-pointer mt-4 group transition"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="leading-relaxed">Basic Text Mode active (Voice AI and detailed synthesis locked).</span>
              </div>
              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-wider group-hover:underline shrink-0 pl-2">Upgrade Pro →</span>
            </div>
          )}

        </div>

      </div>
      <SubscriptionModal 
        isOpen={showSubModal} 
        onClose={() => setShowSubModal(false)} 
        initialTab="mock" 
      />
    </PageWrapper>
  );
}

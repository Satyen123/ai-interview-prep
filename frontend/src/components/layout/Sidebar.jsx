import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import SubscriptionModal from '../SubscriptionModal';
import { 
  LayoutDashboard, 
  Mic, 
  FileText, 
  Code2, 
  LineChart, 
  User, 
  MessageSquare,
  ShieldCheck,
  Crown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuthStore();
  const [showSub, setShowSub] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mock Interview', path: '/interview-setup', icon: Mic },
    { name: 'Resume ATS Review', path: '/resume-analyzer', icon: FileText },
    { name: 'Coding Sandbox', path: '/coding-sandbox', icon: Code2 },
    { name: 'Performance Logs', path: '/analytics', icon: LineChart },
    { name: 'AI Mentor Chat', path: '/mentor-chat', icon: MessageSquare },
    { name: 'Profile Settings', path: '/profile', icon: User }
  ];

  // Insert Admin panel if user is admin
  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Sidebar Toggle FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-cyber-accent to-cyber-neon text-white p-4 rounded-full shadow-lg shadow-cyber-accent/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Backdrop for Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-45 md:z-auto md:static
          w-72 md:w-20 lg:w-72 xl:w-80 p-4 md:p-3 lg:p-5 bg-[#080d1a]/95 md:bg-transparent
          border-r border-white/5 flex flex-col gap-3
          transition-all duration-300 ease-in-out shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="hidden lg:block px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            PREP SYSTEM MENU
          </span>
        </div>
        
        <nav className="flex flex-col gap-1 select-none whitespace-nowrap">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-center lg:justify-start gap-3 px-4 py-3 md:px-0 md:py-3 lg:px-4 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyber-accent/15 to-cyber-neon/5 border border-cyber-accent/35 text-white shadow-inner' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
                title={link.name}
              >
                <Icon className="w-4 h-4 text-cyber-neon shrink-0" />
                <span className="md:hidden lg:inline">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

      {/* Footer Info inside Sidebar */}
      <div className="flex md:hidden lg:flex mt-auto bg-gradient-to-tr from-white/2 to-white/5 border border-white/5 p-4 rounded-2xl flex-col gap-2 relative overflow-hidden">
        {user?.isFullPremium ? (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 animate-bounce" />
              FULL ACCESS PRO
            </span>
            <span className="text-[8px] text-gray-500 font-mono font-bold block">Expires: {user.subscriptionExpiryDate ? new Date(user.subscriptionExpiryDate).toLocaleDateString() : 'Lifetime'}</span>
          </div>
        ) : (user?.mockInterviewPremium || user?.resumePremium || user?.codingPremium) ? (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              MODULE PRO MEMBER
            </span>
            <button 
              onClick={() => setShowSub(true)}
              className="text-[8px] font-black uppercase text-yellow-500 hover:text-yellow-400 text-left cursor-pointer flex items-center gap-0.5 mt-0.5"
            >
              Get Full Access Pass
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              FREE TIER ACTIVE
            </span>
            <button 
              onClick={() => setShowSub(true)}
              className="text-[9px] font-black uppercase text-cyber-neon hover:text-cyan-300 text-left cursor-pointer flex items-center gap-0.5 mt-0.5"
            >
              Upgrade Platform
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2 border-t border-white/5 pt-2">
          <span className="w-2 h-2 rounded-full bg-cyber-jade animate-pulse"></span>
          <span className="text-[10px] text-gray-400 font-bold">AI Core Online</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-normal">
          Powered by Gemini 2.5 Flash. Real-time online judge ready.
        </p>
      </div>

      <SubscriptionModal 
        isOpen={showSub} 
        onClose={() => setShowSub(false)} 
        initialTab="full" 
      />
    </aside>
    </>
  );
}

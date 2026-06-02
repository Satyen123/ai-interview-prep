import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Flame, Award, LogOut, User as UserIcon, LogIn, Cpu } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-3 md:py-4 px-4 md:px-12 flex justify-between items-center gap-4">
      <Link to="/" className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
        <div className="bg-gradient-to-tr from-cyber-accent to-cyber-neon p-2 md:p-2.5 rounded-xl text-white shadow-lg shadow-cyber-accent/25">
          <Cpu className="w-4 h-4 md:w-5 md:h-5 animate-pulse-slow" />
        </div>
        <div className="flex items-center">
          <span className="font-extrabold text-sm sm:text-base md:text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI INTERVIEW
          </span>
          <span className="ml-1 text-[9px] md:text-xs font-bold text-cyber-neon px-1.5 md:px-2 py-0.5 rounded-full bg-cyber-neon/10 tracking-widest uppercase">
            PREP
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {user ? (
          <>
            {/* Gamification Streak Widget */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-inner select-none cursor-pointer" title="Daily Streak">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyber-gold fill-cyber-gold animate-bounce" />
              <span className="text-xs sm:text-sm font-bold text-cyber-gold tracking-wide">
                <span className="hidden xs:inline">{user.streak} Day Streak</span>
                <span className="xs:hidden">{user.streak}d</span>
              </span>
            </div>

            {/* User Level and XP Info */}
            <div className="hidden sm:flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl select-none" title="User Level">
              <Award className="w-4 h-4 text-cyber-accent" />
              <span className="text-sm font-bold text-cyber-accent tracking-wide">Lvl {user.level}</span>
            </div>

            {/* Profile trigger */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/profile" className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 hover:border-cyber-accent hover:bg-cyber-accent/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-300 shrink-0">
                <div className="bg-cyber-accent/20 text-cyber-accent w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-xs select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-300">{user.name}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500/10 text-red-400 border border-red-500/20 p-1.5 sm:p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-gray-300 text-xs sm:text-sm font-semibold hover:text-white px-3 sm:px-4 py-2 hover:bg-white/5 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyber-accent to-indigo-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyber-accent/20 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

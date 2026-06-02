import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, KeyRound, User, Briefcase, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('MERN Stack Developer');
  const [validationError, setValidationError] = useState('');

  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!name || !email || !password) {
      setValidationError('Please input all required credentials fields.');
      return;
    }

    const success = await register(name, email, password, targetRole);
    if (success) {
      navigate('/dashboard');
    }
  };

  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Java Developer',
    'Data Analyst',
    'AI Engineer'
  ];

  return (
    <PageWrapper>
      <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-6">
        {/* Ambient background glowing circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyber-neonGlow filter blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="bg-cyber-neon/15 w-12 h-12 rounded-2xl flex items-center justify-center text-cyber-neon mx-auto mb-4 border border-cyber-neon/25">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h2>
            <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">
              Unlock your placement prep cockpit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Satyendra Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 glass-input"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 glass-input"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 glass-input"
                />
              </div>
            </div>

            {/* Input Target Role */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Target Job Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-12 glass-input appearance-none bg-cyber-dark cursor-pointer"
                >
                  {rolesList.map(role => (
                    <option key={role} value={role} className="bg-cyber-darker text-gray-200">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Indicators */}
            {(validationError || error) && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mt-1">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Profile Cockpit'
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
            Already have an account?{' '}
            <Link to="/login" className="text-cyber-neon hover:underline font-extrabold ml-1">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

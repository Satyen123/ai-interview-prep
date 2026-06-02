import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { KeyRound, Mail, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email || !password) {
      setValidationError('Please input both credentials fields.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <PageWrapper>
      <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-6">
        {/* Ambient background glowing circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyber-accentGlow filter blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="bg-cyber-accent/15 w-12 h-12 rounded-2xl flex items-center justify-center text-cyber-accent mx-auto mb-4 border border-cyber-accent/25">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">
              Securely sign in to your placement cockpit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-cyber-neon hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 glass-input"
                />
              </div>
            </div>

            {/* Error Indicators */}
            {(validationError || error) && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
            New to the cockpit?{' '}
            <Link to="/register" className="text-cyber-neon hover:underline font-extrabold ml-1">
              Create an Account
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

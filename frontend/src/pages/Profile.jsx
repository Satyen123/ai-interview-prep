import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  User, 
  Mail, 
  KeyRound, 
  Briefcase, 
  Tag, 
  Award, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

export default function Profile() {
  const { user, updateProfile, loading, error, clearError } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'MERN Stack Developer');
  
  // Manage technical skills as a tag list
  const [skillsInput, setSkillsInput] = useState(user?.skills?.join(', ') || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    // Convert comma input into array of skills tags
    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const profileData = {
      name,
      email,
      targetRole,
      skills: skillsArray
    };

    if (password) {
      profileData.password = password;
    }

    const ok = await updateProfile(profileData);
    if (ok) {
      setSuccess(true);
      setPassword('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Java Developer',
    'Data Analyst',
    'AI Engineer'
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-bold text-cyber-neon tracking-widest uppercase block mb-2">
            PREPARATION MANAGEMENT
          </span>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            Profile & Target Settings
          </h2>
        </div>

        {/* Dynamic lower split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Settings forms split left */}
          <div className="md:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-85 h-85 rounded-full bg-cyber-accentGlow filter blur-[100px] pointer-events-none -z-10"></div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Input Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 glass-input"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Update Password (Optional)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Leave blank to preserve current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 glass-input"
                  />
                </div>
              </div>

              {/* Input Role */}
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
                    {roles.map(r => (
                      <option key={r} value={r} className="bg-cyber-darker text-gray-200">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills comma input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Technical Skills (Comma Separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="React, Node.js, Express, MongoDB, Git"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full pl-12 glass-input"
                  />
                </div>
              </div>

              {/* Alerts indicators */}
              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 bg-cyber-jade/10 border border-cyber-jade/20 text-cyber-jade p-4 rounded-xl text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Profile details synchronized successfully.</span>
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
                    Synchronizing Settings...
                  </>
                ) : (
                  'Synchronize Profile'
                )}
              </button>

            </form>
          </div>

          {/* Gamification widgets right split */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-5">
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3">
              Achievements & Milestones
            </h3>
            
            {/* Level card */}
            <div className="bg-gradient-to-tr from-white/3 to-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-cyber-neon/40 transition">
              <div className="bg-cyber-neon/15 text-cyber-neon w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg select-none">
                {user.level}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">Prepper Level</h4>
                <span className="text-[10px] text-gray-500 font-medium block mt-1">
                  Accumulated XP: {user.xp} points
                </span>
              </div>
            </div>

            {/* Badges list summary */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">
                Unlocked Emblems ({user.badges?.length || 0})
              </span>

              {user.badges && user.badges.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px] pr-1">
                  {user.badges.map((b, i) => (
                    <div key={i} className="bg-white/2 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                      <span className="text-xl select-none shrink-0">{b.icon || '🏆'}</span>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-white truncate">{b.name}</h5>
                        <span className="text-[9px] text-gray-500 block leading-none mt-0.5">
                          unlocked at {new Date(b.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/2 p-4 rounded-xl text-center border border-white/5 text-xs text-gray-500">
                  No badges unlocked yet.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

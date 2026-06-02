import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import PageWrapper from '../components/layout/PageWrapper';
import SubscriptionModal from '../components/SubscriptionModal';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Loader2, 
  RefreshCw,
  Award,
  ChevronRight,
  ShieldAlert,
  Zap,
  Sparkles,
  Lock,
  Download,
  Brain,
  FileSpreadsheet,
  CheckCircle2,
  Wand2,
  Copy,
  ChevronLeft,
  Crown,
  Trash2,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  CopyPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';
// 1. Collapsible Section wrapper with Framer Motion transitions
function ResumeSection({ title, isOpen, onToggle, children, onAddEntry, addLabel = "+ Add Item" }) {
  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] overflow-visible relative z-10">
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-5 border-b border-cyan-500/10 cursor-pointer select-none bg-white/2 hover:bg-white/5 transition rounded-t-2xl"
      >
        <h2 className="text-cyan-400 font-bold tracking-wide text-xs uppercase tracking-widest flex items-center gap-2">
          {title}
        </h2>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {onAddEntry && (
            <button
              onClick={onAddEntry}
              className="bg-cyber-accent/15 border border-cyber-accent/30 hover:bg-cyber-accent text-cyber-accent hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              {addLabel}
            </button>
          )}
          <button 
            onClick={onToggle}
            className="text-gray-400 font-bold text-[10px] uppercase tracking-wider hover:text-white transition cursor-pointer"
          >
            {isOpen ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-5 flex flex-col gap-5">
          {children}
        </div>
      )}
    </div>
  );
}

// 2. Reusable Keyboard-friendly auto-resizing bullet point editor
function DynamicBulletInput({ bullets = [], onChange, onEnhance, sectionName }) {
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const handleTextareaChange = (e, index) => {
    const newBullets = [...bullets];
    newBullets[index] = e.target.value;
    onChange(newBullets);

    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyDown = (e, index) => {
    // Enter key creates a new bullet point directly below
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBullets = [...bullets];
      newBullets.splice(index + 1, 0, "");
      onChange(newBullets);
      
      // Auto focus newly created textarea
      setTimeout(() => {
        const textareas = document.querySelectorAll(`textarea[data-section="${sectionName}"]`);
        if (textareas[index + 1]) {
          textareas[index + 1].focus();
        }
      }, 50);
    }
    
    // Backspace on empty bullet deletes it and focuses the previous one
    if (e.key === 'Backspace' && bullets[index] === "" && bullets.length > 1) {
      e.preventDefault();
      const newBullets = bullets.filter((_, idx) => idx !== index);
      onChange(newBullets);
      
      setTimeout(() => {
        const textareas = document.querySelectorAll(`textarea[data-section="${sectionName}"]`);
        if (textareas[index - 1]) {
          textareas[index - 1].focus();
        } else if (textareas[0]) {
          textareas[0].focus();
        }
      }, 50);
    }
  };

  const handleEnhanceClick = async (index) => {
    if (!bullets[index].trim()) return;
    setEnhancingIndex(index);
    try {
      const response = await onEnhance(bullets[index]);
      const newBullets = [...bullets];
      newBullets[index] = response;
      onChange(newBullets);
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const addBullet = () => {
    onChange([...bullets, ""]);
  };

  const removeBullet = (index) => {
    if (bullets.length <= 1) {
      onChange([""]);
    } else {
      onChange(bullets.filter((_, idx) => idx !== index));
    }
  };

  const duplicateBullet = (index) => {
    const newBullets = [...bullets];
    newBullets.splice(index + 1, 0, bullets[index]);
    onChange(newBullets);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newBullets = [...bullets];
    const temp = newBullets[index];
    newBullets[index] = newBullets[index - 1];
    newBullets[index - 1] = temp;
    onChange(newBullets);
  };

  const moveDown = (index) => {
    if (index === bullets.length - 1) return;
    const newBullets = [...bullets];
    const temp = newBullets[index];
    newBullets[index] = newBullets[index + 1];
    newBullets[index + 1] = temp;
    onChange(newBullets);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-2.5">
        <AnimatePresence>
          {bullets.map((bullet, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-start gap-2 group bg-white/2 hover:bg-white/3 border border-white/5 p-3 rounded-2xl transition"
            >
              <span className="text-cyber-neon text-xs mt-2.5 select-none font-bold shrink-0">{index + 1}.</span>
              <textarea
                data-section={sectionName}
                value={bullet}
                onChange={(e) => handleTextareaChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="Describe a key delivery using the STAR format (e.g. Automated deployments saving 4 hours weekly)..."
                rows={1}
                className="flex-1 bg-transparent text-xs text-gray-300 focus:text-white placeholder-gray-600 outline-none border-none resize-none pt-2.5 font-sans leading-relaxed min-h-[38px] max-h-[150px] overflow-y-auto"
                style={{ height: 'auto' }}
              />
              
              <div className="flex items-center gap-1 hover:opacity-100 transition shrink-0 mt-1">
                <button
                  type="button"
                  onClick={() => handleEnhanceClick(index)}
                  disabled={enhancingIndex !== null || !bullet.trim()}
                  className="p-1.5 bg-cyber-accent/10 border border-cyber-accent/20 hover:bg-cyber-accent text-cyber-accent hover:text-white rounded-lg transition disabled:opacity-40"
                  title="Enhance with AI STAR verbs"
                >
                  {enhancingIndex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => duplicateBullet(index)}
                  className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition"
                  title="Duplicate Bullet"
                >
                  <CopyPlus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === bullets.length - 1}
                  className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBullet(index)}
                  className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition"
                  title="Delete Bullet"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={addBullet}
        className="w-full py-2 bg-white/2 border border-dashed border-white/10 hover:border-cyber-accent/50 hover:bg-cyber-accent/5 text-gray-400 hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition flex items-center justify-center gap-1 mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        + Add Bullet Point
      </button>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const generateId = () => Math.random().toString(36).substring(2, 9);
  const { user, upgradeToPremium } = useAuthStore();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'MERN Stack Developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Navigation Tabs State: 'ats' | 'generator' | 'tools'
  const [activeTab, setActiveTab] = useState('ats');
  
  // Simulated SaaS Level (Free vs Pro)
  const [isPremium, setIsPremium] = useState((user?.isFullPremium || user?.resumePremium) || false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Animated Score states for premium visual count-up animations
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedBeforeScore, setAnimatedBeforeScore] = useState(0);
  const [animatedAfterScore, setAnimatedAfterScore] = useState(0);

  // AI Generator specific states
  const [generatorFile, setGeneratorFile] = useState(null);
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [editedResume, setEditedResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // modern, corporate, developer, analyst, fresher
  const previewContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(794);
  const previewA4Ref = useRef(null);
  const [a4Height, setA4Height] = useState(1123);
  const [zoomLevel, setZoomLevel] = useState(null); // null means auto-scale

  useEffect(() => {
    const timer = setTimeout(() => {
      if (previewA4Ref.current) {
        setA4Height(previewA4Ref.current.scrollHeight || 1123);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [editedResume, optimizedResume, selectedTemplate, isEditing, activeTab, containerWidth]);

  useEffect(() => {
    if (!previewContainerRef.current) return;
    
    setContainerWidth(previewContainerRef.current.getBoundingClientRect().width || 794);
    
    if (typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    
    resizeObserver.observe(previewContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [previewContainerRef.current, isEditing, activeTab, optimizedResume]);

  const [generatingResume, setGeneratingResume] = useState(false);

  // Pro AI Writing Tools states
  const [bulletInput, setBulletInput] = useState('');
  const [enhancedBullet, setEnhancedBullet] = useState('');
  const [enhancingBullet, setEnhancingBullet] = useState(false);

  // Advanced AI Controls states
  const [temperature, setTemperature] = useState(0.7);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [companyName, setCompanyName] = useState('');
  const [coverRole, setCoverRole] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [selectedCoverTone, setSelectedCoverTone] = useState('Professional'); // Professional, Corporate, Friendly, Startup, Formal

  // 1. Sync isPremium state with authStore user state
  useEffect(() => {
    if (user) {
      setIsPremium((user.isFullPremium || user.resumePremium) || false);
    }
  }, [user]);

  // Sync edited resume state with stable unique IDs
  useEffect(() => {
    if (optimizedResume) {
      const base = JSON.parse(JSON.stringify(optimizedResume));
      
      base.experience = (base.experience || []).map(exp => ({
        id: exp.id || generateId(),
        role: exp.role || '',
        company: exp.company || '',
        duration: exp.duration || '',
        bullets: exp.bullets || [""]
      }));
      
      base.projects = (base.projects || []).map(proj => ({
        id: proj.id || generateId(),
        title: proj.title || '',
        tech: proj.tech || '',
        bullets: proj.bullets || [""]
      }));
      
      base.internships = (base.internships || []).map(intern => ({
        id: intern.id || generateId(),
        role: intern.role || '',
        company: intern.company || '',
        duration: intern.duration || '',
        bullets: intern.bullets || [""]
      }));
      
      base.leadership = (base.leadership || []).map(lead => ({
        id: lead.id || generateId(),
        role: lead.role || '',
        organization: lead.organization || '',
        duration: lead.duration || '',
        bullets: lead.bullets || [""]
      }));
      
      base.educationList = base.educationList && base.educationList.length > 0
        ? base.educationList.map(edu => ({
            id: edu.id || generateId(),
            school: edu.school || '',
            degree: edu.degree || '',
            duration: edu.duration || '',
            details: edu.details || ''
          }))
        : (base.education && base.education.trim())
          ? [{ id: generateId(), school: base.education, degree: '', duration: '', details: '' }] 
          : [];
          
      if (!base.certifications) base.certifications = [];
      if (!base.achievements) base.achievements = [];
      if (!base.extracurriculars) base.extracurriculars = [];
      
      setEditedResume(base);
    }
  }, [optimizedResume]);

  // Restore latest optimized resume from MongoDB history on load
  useEffect(() => {
    if (!optimizedResume && history && history.length > 0) {
      const savedOptimized = history.find(res => res.optimizedData);
      if (savedOptimized) {
        setOptimizedResume(savedOptimized.optimizedData);
      }
    }
  }, [history, optimizedResume]);

  const [expandedSections, setExpandedSections] = useState({
    header: true,
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    internships: false,
    certifications: false,
    achievements: false,
    education: true,
    leadership: false,
    extracurriculars: false
  });

  const toggleSection = (sec) => {
    setExpandedSections(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const resumeToShow = editedResume || optimizedResume;

  const handleBaseFieldChange = (field, val) => {
    setEditedResume(prev => ({
      ...prev,
      [field]: val
    }));
  };
  
  const handleSkillChange = (val) => {
    setEditedResume(prev => ({
      ...prev,
      skills: val.split(',').map(s => s.trim())
    }));
  };

  const handleCertificationsChange = (newCerts) => {
    setEditedResume(prev => ({
      ...prev,
      certifications: newCerts
    }));
  };

  const handleAchievementsChange = (newAch) => {
    setEditedResume(prev => ({
      ...prev,
      achievements: newAch
    }));
  };

  const handleExtracurricularsChange = (newExtra) => {
    setEditedResume(prev => ({
      ...prev,
      extracurriculars: newExtra
    }));
  };

  const handleEnhanceBulletText = async (bulletText) => {
    try {
      const response = await axios.post('http://localhost:5000/api/resume/tools/enhance-bullet', {
        bulletText,
        targetRole,
        temperature: parseFloat(temperature || 0.7)
      });
      return response.data.enhancedText;
    } catch (err) {
      console.error(err);
      alert('Failed to enhance bullet with AI. Please make sure backend server is active.');
      throw err;
    }
  };

  const handleAddExpEntry = () => {
    setEditedResume(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { id: generateId(), role: "New Job Role", company: "Company Name", duration: "2025 - Present", bullets: [""] }
      ]
    }));
  };

  const handleRemoveExpEntry = (id) => {
    setEditedResume(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(exp => exp.id !== id)
    }));
  };

  const handleExpFieldChange = (id, field, val) => {
    setEditedResume(prev => {
      const newExp = (prev.experience || []).map(exp => {
        if (exp.id !== id) return exp;
        return { ...exp, [field]: val };
      });
      return { ...prev, experience: newExp };
    });
  };

  const handleExpBulletsChange = (id, newBullets) => {
    setEditedResume(prev => {
      const newExp = (prev.experience || []).map(exp => {
        if (exp.id !== id) return exp;
        return { ...exp, bullets: newBullets };
      });
      return { ...prev, experience: newExp };
    });
  };

  const handleAddProjEntry = () => {
    setEditedResume(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: generateId(), title: "New Project", tech: "Technologies Used", bullets: [""] }
      ]
    }));
  };

  const handleRemoveProjEntry = (id) => {
    setEditedResume(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(proj => proj.id !== id)
    }));
  };

  const handleProjFieldChange = (id, field, val) => {
    setEditedResume(prev => {
      const newProj = (prev.projects || []).map(proj => {
        if (proj.id !== id) return proj;
        return { ...proj, [field]: val };
      });
      return { ...prev, projects: newProj };
    });
  };

  const handleProjBulletsChange = (id, newBullets) => {
    setEditedResume(prev => {
      const newProj = (prev.projects || []).map(proj => {
        if (proj.id !== id) return proj;
        return { ...proj, bullets: newBullets };
      });
      return { ...prev, projects: newProj };
    });
  };

  const handleAddInternshipEntry = () => {
    setEditedResume(prev => ({
      ...prev,
      internships: [
        ...(prev.internships || []),
        { id: generateId(), role: "Intern Role", company: "Company Name", duration: "Summer 2024", bullets: [""] }
      ]
    }));
  };

  const handleRemoveInternshipEntry = (id) => {
    setEditedResume(prev => ({
      ...prev,
      internships: (prev.internships || []).filter(intern => intern.id !== id)
    }));
  };

  const handleInternshipFieldChange = (id, field, val) => {
    setEditedResume(prev => {
      const newIntern = (prev.internships || []).map(intern => {
        if (intern.id !== id) return intern;
        return { ...intern, [field]: val };
      });
      return { ...prev, internships: newIntern };
    });
  };

  const handleInternshipBulletsChange = (id, newBullets) => {
    setEditedResume(prev => {
      const newIntern = (prev.internships || []).map(intern => {
        if (intern.id !== id) return intern;
        return { ...intern, bullets: newBullets };
      });
      return { ...prev, internships: newIntern };
    });
  };

  const handleAddLeadershipEntry = () => {
    setEditedResume(prev => ({
      ...prev,
      leadership: [
        ...(prev.leadership || []),
        { id: generateId(), role: "Leader Role", organization: "Organization", duration: "2024", bullets: [""] }
      ]
    }));
  };

  const handleRemoveLeadershipEntry = (id) => {
    setEditedResume(prev => ({
      ...prev,
      leadership: (prev.leadership || []).filter(lead => lead.id !== id)
    }));
  };

  const handleLeadershipFieldChange = (id, field, val) => {
    setEditedResume(prev => {
      const newLead = (prev.leadership || []).map(lead => {
        if (lead.id !== id) return lead;
        return { ...lead, [field]: val };
      });
      return { ...prev, leadership: newLead };
    });
  };

  const handleLeadershipBulletsChange = (id, newBullets) => {
    setEditedResume(prev => {
      const newLead = (prev.leadership || []).map(lead => {
        if (lead.id !== id) return lead;
        return { ...lead, bullets: newBullets };
      });
      return { ...prev, leadership: newLead };
    });
  };

  const handleAddEduEntry = () => {
    setEditedResume(prev => ({
      ...prev,
      educationList: [
        ...(prev.educationList || []),
        { id: generateId(), school: "University / School", degree: "Degree Program", duration: "2021 - 2025", details: "GPA/Details" }
      ]
    }));
  };

  const handleRemoveEduEntry = (id) => {
    setEditedResume(prev => ({
      ...prev,
      educationList: (prev.educationList || []).filter(edu => edu.id !== id)
    }));
  };

  const handleEduFieldChange = (id, field, val) => {
    setEditedResume(prev => {
      const newEdu = (prev.educationList || []).map(edu => {
        if (edu.id !== id) return edu;
        return { ...edu, [field]: val };
      });
      return { ...prev, educationList: newEdu };
    });
  };

  const handlePrintCoverLetter = () => {
    if (!generatedLetter) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups to print or download your Cover Letter.');
      return;
    }

    const primaryColor = '#1e3a8a';
    const fontStack = 'Georgia, "Times New Roman", Times, serif';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cover_Letter_\${companyName.replace(/\\s+/g, '_')}</title>
        <style>
          @page {
            size: A4;
            margin: 25mm;
          }
          body {
            font-family: \${fontStack};
            color: #1f2937;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-size: 12px;
          }
          .letterhead {
            border-bottom: 2px solid \${primaryColor};
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          .sender-name {
            font-size: 18px;
            font-weight: bold;
            color: \${primaryColor};
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .sender-info {
            font-size: 11px;
            color: #4b5563;
            margin-top: 4px;
            font-family: monospace;
          }
          .recipient-info {
            margin-bottom: 24px;
            font-size: 12px;
          }
          .letter-date {
            margin-bottom: 20px;
            font-weight: 600;
          }
          .letter-body {
            white-space: pre-wrap;
            font-size: 12px;
            color: #1f2937;
          }
          @media print {
            body {
              background-color: #ffffff;
              color: #000000;
            }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <div class="sender-name">\${(editedResume || optimizedResume)?.name || user?.name || 'CANDIDATE'}</div>
          <div class="sender-info">
            Email: \${(editedResume || optimizedResume)?.email || user?.email} | 
            Phone: \${(editedResume || optimizedResume)?.phone || 'N/A'} | 
            LinkedIn: \${(editedResume || optimizedResume)?.linkedin || 'N/A'}
          </div>
        </div>
        
        <div class="letter-date">
          Date: \${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <div class="recipient-info">
          <strong>Hiring Team</strong><br>
          \${companyName}<br>
          Subject: Application for \${coverRole} Role
        </div>
        
        <div class="letter-body">\${generatedLetter}</div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'corporate':
        return {
          card: "lg:col-span-3 bg-white text-slate-900 p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-200 font-serif",
          headerName: "text-2xl font-bold text-black tracking-normal text-center uppercase font-serif",
          headerLinks: "flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 mt-2 font-mono",
          sectionHeader: "text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b-2 border-slate-900 pb-1 mb-3 font-serif mt-6",
          skillBadge: "text-[10px] font-mono border border-slate-300 bg-slate-50 text-slate-800 px-3 py-1 rounded-md",
          textBody: "text-xs text-slate-700 leading-relaxed font-serif",
          bulletDot: "text-slate-900 shrink-0 mt-0.5",
          roleTitle: "font-extrabold text-xs text-slate-900",
          companyTitle: "text-[10px] text-blue-700 font-bold leading-none block -mt-1",
          metaText: "text-[10px] text-slate-500 font-mono",
          projTitle: "font-extrabold text-xs text-slate-900"
        };
      case 'developer':
        return {
          card: "lg:col-span-3 bg-slate-950 text-emerald-400 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl font-mono",
          headerName: "text-2xl font-bold text-white tracking-wide uppercase font-mono",
          headerLinks: "flex flex-wrap justify-start items-center gap-3 text-xs text-emerald-500 mt-2 font-mono",
          sectionHeader: "text-xs font-extrabold text-emerald-300 uppercase tracking-widest border-b border-emerald-500/30 pb-1 mb-3 font-mono mt-6",
          skillBadge: "text-[10px] font-mono bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 px-2.5 py-0.5 rounded-md",
          textBody: "text-xs text-emerald-200/90 leading-relaxed font-mono",
          bulletDot: "text-emerald-400 shrink-0 mt-0.5",
          roleTitle: "font-extrabold text-xs text-white",
          companyTitle: "text-[10px] text-emerald-400 font-bold leading-none block -mt-1",
          metaText: "text-[10px] text-emerald-500 font-mono",
          projTitle: "font-extrabold text-xs text-white"
        };
      case 'analyst':
        return {
          card: "lg:col-span-3 bg-[#0b1517] text-cyan-100 p-8 rounded-3xl border border-cyan-500/20 shadow-2xl font-sans",
          headerName: "text-2xl font-extrabold text-cyan-400 tracking-wide uppercase font-sans",
          headerLinks: "flex flex-wrap justify-start items-center gap-3 text-xs text-cyan-300 mt-2 font-mono",
          sectionHeader: "text-xs font-black text-cyan-400 uppercase tracking-widest border-l-4 border-cyan-500 pl-2 pb-0.5 mb-3 font-sans mt-6",
          skillBadge: "text-[10px] font-mono bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-md",
          textBody: "text-xs text-gray-300 leading-relaxed font-sans",
          bulletDot: "text-cyan-400 shrink-0 mt-0.5",
          roleTitle: "font-extrabold text-xs text-white",
          companyTitle: "text-[10px] text-cyan-300 font-bold leading-none block -mt-1",
          metaText: "text-[10px] text-cyan-500 font-mono",
          projTitle: "font-extrabold text-xs text-white"
        };
      case 'fresher':
        return {
          card: "lg:col-span-3 bg-[#0b132b] text-slate-100 p-8 rounded-3xl border border-blue-500/20 shadow-2xl font-sans",
          headerName: "text-2xl font-extrabold text-blue-400 tracking-wide uppercase font-sans text-center",
          headerLinks: "flex flex-wrap justify-center items-center gap-3 text-xs text-slate-400 mt-2 font-mono",
          sectionHeader: "text-xs font-bold text-blue-400 uppercase tracking-widest border-b border-blue-500/20 pb-1 mb-3 font-sans mt-6",
          skillBadge: "text-[10px] font-mono bg-blue-950/40 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-md",
          textBody: "text-xs text-slate-300 leading-relaxed font-sans",
          bulletDot: "text-blue-400 shrink-0 mt-0.5",
          roleTitle: "font-extrabold text-xs text-white",
          companyTitle: "text-[10px] text-blue-300 font-bold leading-none block -mt-1",
          metaText: "text-[10px] text-blue-500 font-mono",
          projTitle: "font-extrabold text-xs text-white"
        };
      case 'modern':
      default:
        return {
          card: "lg:col-span-3 bg-[#0c0c0e] text-gray-100 p-8 rounded-3xl border border-violet-500/20 shadow-2xl font-sans relative overflow-hidden min-h-[500px]",
          headerName: "text-2xl font-extrabold text-white tracking-wide uppercase font-sans text-center",
          headerLinks: "flex flex-wrap justify-center items-center gap-3 text-xs text-gray-400 mt-2 font-mono",
          sectionHeader: "text-xs font-black text-cyber-neon uppercase tracking-widest border-b border-white/5 pb-1 mb-3 font-sans mt-6",
          skillBadge: "text-[10px] font-mono bg-white/3 border border-white/5 text-gray-300 px-3 py-1 rounded-md",
          textBody: "text-xs text-gray-300 leading-relaxed font-sans",
          bulletDot: "text-cyber-neon shrink-0 mt-0.5",
          roleTitle: "font-extrabold text-xs text-white",
          companyTitle: "text-[10px] text-cyber-accent font-bold leading-none block -mt-1",
          metaText: "text-[10px] text-gray-500 font-mono",
          projTitle: "font-extrabold text-xs text-white"
        };
    }
  };

  // 2. Live ATS Score count-up animation trigger for standard audits
  useEffect(() => {
    if (report && report.atsScore) {
      setAnimatedScore(0);
      let start = 0;
      const end = report.atsScore;
      if (start === end) {
        setAnimatedScore(end);
        return;
      }
      const totalDuration = 800; // 0.8s
      const incrementTime = Math.max(Math.floor(totalDuration / end), 10);
      const timer = setInterval(() => {
        start += 1;
        setAnimatedScore(start);
        if (start >= end) {
          clearInterval(timer);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [report]);

  // 3. Before & After score count-up animations for AI ATS transformation
  useEffect(() => {
    if (optimizedResume) {
      setAnimatedBeforeScore(0);
      let startB = 0;
      const endB = optimizedResume.beforeScore || 0;
      const timerB = setInterval(() => {
        startB += 1;
        setAnimatedBeforeScore(startB);
        if (startB >= endB) clearInterval(timerB);
      }, 15);

      setAnimatedAfterScore(0);
      let startA = 0;
      const endA = optimizedResume.afterScore || 0;
      const timerA = setInterval(() => {
        startA += 1;
        setAnimatedAfterScore(startA);
        if (startA >= endA) clearInterval(timerA);
      }, 10);

      return () => {
        clearInterval(timerB);
        clearInterval(timerA);
      };
    }
  }, [optimizedResume]);

  // 4. Handle Persistent Premium Upgrade
  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  // 5. Printable template-based PDF exporter
  const handleExportPDF = () => {
    const activeData = editedResume || optimizedResume;
    if (!activeData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups to print or download your optimized PDF resume.');
      return;
    }

    let primaryColor = '#1f2937'; // modern gray-black
    let accentColor = '#7c3aed'; // premium violet
    let headerBg = '#f8fafc';
    let skillsBg = '#f1f5f9';
    let fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    let borderBottomStyle = '1.5px solid #e2e8f0';
    let borderLeftStyle = 'none';

    if (selectedTemplate === 'corporate') {
      primaryColor = '#000000';
      accentColor = '#1d4ed8';
      headerBg = '#ffffff';
      skillsBg = '#f8fafc';
      fontStack = 'Georgia, "Times New Roman", Times, serif';
      borderBottomStyle = '2px solid #000000';
    } else if (selectedTemplate === 'developer') {
      primaryColor = '#0f172a';
      accentColor = '#059669'; // Emerald
      headerBg = '#f0fdf4';
      skillsBg = '#e6f4ea';
      fontStack = 'Consolas, Monaco, "Lucida Console", "Liberation Mono", monospace';
      borderBottomStyle = '1.5px solid #10b981';
      borderLeftStyle = '3px solid #10b981';
    } else if (selectedTemplate === 'analyst') {
      primaryColor = '#0f766e'; // Teal
      accentColor = '#0891b2'; // Cyan
      headerBg = '#f0fdfa';
      skillsBg = '#ccfbf1';
      fontStack = '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", sans-serif';
      borderBottomStyle = '1.5px solid #0d9488';
    } else if (selectedTemplate === 'fresher') {
      primaryColor = '#1e3a8a'; // Royal Blue
      accentColor = '#2563eb';
      headerBg = '#eff6ff';
      skillsBg = '#dbeafe';
      fontStack = 'Arial, Helvetica, sans-serif';
      borderBottomStyle = '1.5px solid #3b82f6';
      borderLeftStyle = '3px solid #3b82f6';
    }

    const experienceHtml = (activeData.experience || []).map(exp => `
      <div style="margin-bottom: 12px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h3 style="margin: 0; font-size: 13px; color: ${primaryColor}; font-weight: 700; font-family: ${fontStack};">${exp.role}</h3>
          <span style="font-size: 11px; color: #6b7280; font-family: monospace;">${exp.duration}</span>
        </div>
        <div style="font-size: 11.5px; color: ${accentColor}; font-weight: 600; margin-bottom: 4px; font-family: ${fontStack};">${exp.company}</div>
        <ul style="margin: 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45; font-family: ${fontStack};">
          ${(exp.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const internshipsHtml = (activeData.internships || []).map(intern => `
      <div style="margin-bottom: 12px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h3 style="margin: 0; font-size: 13px; color: ${primaryColor}; font-weight: 700; font-family: ${fontStack};">${intern.role}</h3>
          <span style="font-size: 11px; color: #6b7280; font-family: monospace;">${intern.duration}</span>
        </div>
        <div style="font-size: 11.5px; color: ${accentColor}; font-weight: 600; margin-bottom: 4px; font-family: ${fontStack};">${intern.company}</div>
        <ul style="margin: 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45; font-family: ${fontStack};">
          ${(intern.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const projectsHtml = (activeData.projects || []).map(proj => `
      <div style="margin-bottom: 12px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h3 style="margin: 0; font-size: 13px; color: ${primaryColor}; font-weight: 700; font-family: ${fontStack};">${proj.title}</h3>
          <span style="font-size: 11px; color: #6b7280; font-family: monospace;">Tech: ${proj.tech}</span>
        </div>
        <ul style="margin: 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45; font-family: ${fontStack};">
          ${(proj.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const leadershipHtml = (activeData.leadership || []).map(lead => `
      <div style="margin-bottom: 12px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h3 style="margin: 0; font-size: 13px; color: ${primaryColor}; font-weight: 700; font-family: ${fontStack};">${lead.role}</h3>
          <span style="font-size: 11px; color: #6b7280; font-family: monospace;">${lead.duration}</span>
        </div>
        <div style="font-size: 11.5px; color: ${accentColor}; font-weight: 600; margin-bottom: 4px; font-family: ${fontStack};">${lead.organization}</div>
        <ul style="margin: 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45; font-family: ${fontStack};">
          ${(lead.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const certificationsHtml = (activeData.certifications || []).map(cert => `
      <li style="margin-bottom: 3px; font-family: ${fontStack};">${cert}</li>
    `).join('');

    const achievementsHtml = (activeData.achievements || []).map(ach => `
      <li style="margin-bottom: 3px; font-family: ${fontStack};">${ach}</li>
    `).join('');

    const extracurricularsHtml = (activeData.extracurriculars || []).map(extra => `
      <li style="margin-bottom: 3px; font-family: ${fontStack};">${extra}</li>
    `).join('');

    const educationListHtml = (activeData.educationList && activeData.educationList.length > 0)
      ? activeData.educationList.map(edu => `
          <div style="margin-bottom: 10px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <h3 style="margin: 0; font-size: 12px; color: ${primaryColor}; font-weight: 700; font-family: ${fontStack};">${edu.degree || 'Degree'}</h3>
              <span style="font-size: 11px; color: #6b7280; font-family: monospace;">${edu.duration}</span>
            </div>
            <div style="font-size: 11px; color: ${accentColor}; font-weight: 600; margin-bottom: 2px; font-family: ${fontStack};">${edu.school}</div>
            ${edu.details ? `<p style="margin: 0; font-size: 11px; color: #4b5563; font-family: ${fontStack};">${edu.details}</p>` : ''}
          </div>
        `).join('')
      : `<p style="margin-top: 6px; font-weight: 500; font-size: 11.5px; font-family: ${fontStack};">${activeData.education}</p>`;

    const skillsHtml = activeData.skills.map(s => `
      <span style="display: inline-block; font-size: 10px; font-family: monospace; background-color: ${skillsBg}; color: ${primaryColor}; padding: 3px 8px; margin: 2px; border-radius: 4px; font-weight: 600;">${s}</span>
    `).join('');

    // Dynamic section ordering for Fresher: Puts Education & Projects first!
    let bodySectionsHtml = '';
    if (selectedTemplate === 'fresher') {
      bodySectionsHtml = `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Education & Qualifications</h4>
          <div style="margin-top: 8px;">
            ${educationListHtml}
          </div>
        </div>

        ${projectsHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Technical Projects</h4>
          <div style="margin-top: 8px;">
            ${projectsHtml}
          </div>
        </div>
        ` : ''}

        ${internshipsHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Internships</h4>
          <div style="margin-top: 8px;">
            ${internshipsHtml}
          </div>
        </div>
        ` : ''}

        ${experienceHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Professional Experience</h4>
          <div style="margin-top: 8px;">
            ${experienceHtml}
          </div>
        </div>
        ` : ''}

        ${leadershipHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Leadership & Responsibility</h4>
          <div style="margin-top: 8px;">
            ${leadershipHtml}
          </div>
        </div>
        ` : ''}

        ${certificationsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Certifications</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${certificationsHtml}
          </ul>
        </div>
        ` : ''}

        ${achievementsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Key Achievements</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${achievementsHtml}
          </ul>
        </div>
        ` : ''}

        ${extracurricularsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Extracurricular Activities</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${extracurricularsHtml}
          </ul>
        </div>
        ` : ''}
      `;
    } else {
      bodySectionsHtml = `
        ${experienceHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Professional Experience</h4>
          <div style="margin-top: 8px;">
            ${experienceHtml}
          </div>
        </div>
        ` : ''}

        ${internshipsHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Internships</h4>
          <div style="margin-top: 8px;">
            ${internshipsHtml}
          </div>
        </div>
        ` : ''}

        ${projectsHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Technical Projects</h4>
          <div style="margin-top: 8px;">
            ${projectsHtml}
          </div>
        </div>
        ` : ''}

        ${leadershipHtml ? `
        <div style="margin-bottom: 18px;">
          <h4>Leadership & Responsibility</h4>
          <div style="margin-top: 8px;">
            ${leadershipHtml}
          </div>
        </div>
        ` : ''}

        ${certificationsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Certifications</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${certificationsHtml}
          </ul>
        </div>
        ` : ''}

        ${achievementsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Key Achievements</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${achievementsHtml}
          </ul>
        </div>
        ` : ''}

        ${extracurricularsHtml ? `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Extracurricular Activities</h4>
          <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 11.5px; color: #374151; line-height: 1.45;">
            ${extracurricularsHtml}
          </ul>
        </div>
        ` : ''}

        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <h4>Education & Qualifications</h4>
          <div style="margin-top: 6px;">
            ${educationListHtml}
          </div>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${activeData.name.replace(/\s+/g, '_')}_ATS_Resume</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: ${fontStack};
            color: #1f2937;
            line-height: 1.45;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-size: 11.5px;
          }
          h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: ${primaryColor};
          }
          h4 {
            margin: 0 0 6px 0;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: ${primaryColor};
            border-bottom: ${borderBottomStyle};
            border-left: ${borderLeftStyle};
            padding-bottom: 2px;
            padding-left: ${borderLeftStyle !== 'none' ? '6px' : '0'};
            font-family: ${fontStack};
          }
          p {
            margin: 0;
            font-size: 11.5px;
            color: #374151;
            line-height: 1.45;
            font-family: ${fontStack};
          }
          @media print {
            body {
              background-color: #ffffff;
              color: #000000;
            }
            h2, h4 {
              color: ${primaryColor} !important;
            }
          }
        </style>
      </head>
      <body>
        <div style="text-align: ${selectedTemplate === 'corporate' || selectedTemplate === 'modern' ? 'center' : 'left'}; margin-bottom: 16px; background-color: ${headerBg}; padding: 16px; border-radius: 6px; border-left: ${borderLeftStyle};">
          <h2>${activeData.name}</h2>
          <div style="font-size: 11px; color: #4b5563; margin-top: 6px; font-family: monospace; font-weight: 500;">
            <span>${activeData.email}</span> &bull; 
            <span>${activeData.phone}</span> &bull; 
            <span>${activeData.linkedin}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 18px;">
          <h4>Professional Summary</h4>
          <p>${activeData.summary}</p>
        </div>
        
        <div style="margin-bottom: 18px;">
          <h4>Core Technical Skills</h4>
          <div style="margin-top: 6px;">
            ${skillsHtml}
          </div>
        </div>
        
        ${bodySectionsHtml}
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 6. Clean Text-based ATS-Friendly DOCX Downloader
  const handleExportDOCX = () => {
    const activeData = editedResume || optimizedResume;
    if (!activeData) return;

    const bulletsExp = (activeData.experience || []).map(exp => `
ROLE: ${exp.role}
COMPANY: ${exp.company}
DURATION: ${exp.duration}
${(exp.bullets || []).map(b => `- ${b}`).join('\n')}
    `).join('\n');

    const bulletsIntern = (activeData.internships || []).map(intern => `
ROLE: ${intern.role}
COMPANY: ${intern.company}
DURATION: ${intern.duration}
${(intern.bullets || []).map(b => `- ${b}`).join('\n')}
    `).join('\n');

    const bulletsProj = (activeData.projects || []).map(proj => `
PROJECT: ${proj.title}
TECHNOLOGIES: ${proj.tech}
${(proj.bullets || []).map(b => `- ${b}`).join('\n')}
    `).join('\n');

    const bulletsLead = (activeData.leadership || []).map(lead => `
ROLE: ${lead.role}
ORGANIZATION: ${lead.organization}
DURATION: ${lead.duration}
${(lead.bullets || []).map(b => `- ${b}`).join('\n')}
    `).join('\n');

    const certsText = (activeData.certifications || []).map(c => `- ${c}`).join('\n');
    const achText = (activeData.achievements || []).map(a => `- ${a}`).join('\n');
    const extraText = (activeData.extracurriculars || []).map(e => `- ${e}`).join('\n');

    const eduText = (activeData.educationList && activeData.educationList.length > 0)
      ? activeData.educationList.map(edu => `
DEGREE: ${edu.degree || 'Degree'}
SCHOOL: ${edu.school}
DURATION: ${edu.duration}
DETAILS: ${edu.details || 'N/A'}
      `).join('\n')
      : activeData.education;

    const docxContent = `
${activeData.name.toUpperCase()}
Email: ${activeData.email} | Phone: ${activeData.phone || 'N/A'} | LinkedIn: ${activeData.linkedin || 'N/A'}

==================================================
PROFESSIONAL SUMMARY
==================================================
${activeData.summary}

==================================================
CORE TECHNICAL SKILLS
==================================================
${(activeData.skills || []).join(', ')}

${bulletsExp ? `
==================================================
PROFESSIONAL EXPERIENCE
==================================================
${bulletsExp}
` : ''}

${bulletsIntern ? `
==================================================
INTERNSHIPS
==================================================
${bulletsIntern}
` : ''}

${bulletsProj ? `
==================================================
TECHNICAL PROJECTS
==================================================
${bulletsProj}
` : ''}

${bulletsLead ? `
==================================================
LEADERSHIP & RESPONSIBILITY
==================================================
${bulletsLead}
` : ''}

${certsText ? `
==================================================
CERTIFICATIONS
==================================================
${certsText}
` : ''}

${achText ? `
==================================================
KEY ACHIEVEMENTS
==================================================
${achText}
` : ''}

${extraText ? `
==================================================
EXTRACURRICULAR ACTIVITIES
==================================================
${extraText}
` : ''}

==================================================
EDUCATION & QUALIFICATIONS
==================================================
${eduText}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([docxContent], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${activeData.name.replace(/\s+/g, '_')}_ATS_Resume.docx`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const [projectTech, setProjectTech] = useState('');
  const [projectTopic, setProjectTopic] = useState('');
  const [generatedProj, setGeneratedProj] = useState('');
  const [generatingProj, setGeneratingProj] = useState(false);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Java Developer',
    'Data Analyst',
    'AI Engineer',
    'DevOps Engineer',
    'Full Stack Developer'
  ];

  // Fetch past resume reviews
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resume/history');
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to load resume history:', err);
      }
    };
    fetchHistory();
  }, [report]);

  const handleFileChange = (e, isGenerator = false) => {
    setError(null);
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      if (isGenerator) {
        setGeneratorFile(selected);
      } else {
        setFile(selected);
      }
    } else {
      setError('Please select a valid PDF file. Other file types are currently not supported.');
      if (isGenerator) setGeneratorFile(null);
      else setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a resume file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReport(response.data.resume);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Resume extraction failed.');
    } finally {
      setLoading(false);
    }
  };

  // Upgraded Premium ATS Resume Generator Trigger
  const handleOptimizeResume = async (e) => {
    e.preventDefault();
    if (!generatorFile) {
      setError('Please upload your resume PDF to optimize.');
      return;
    }

    // Access control check for Free users
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setGeneratingResume(true);
    setGenerationProgress(0);
    setError(null);
    setOptimizedResume(null);

    // Dynamic progress bar updates
    let prog = 0;
    const progressTimer = setInterval(() => {
      prog += Math.floor(Math.random() * 8) + 4;
      if (prog >= 95) {
        prog = 95; // Hold at 95 until complete
        clearInterval(progressTimer);
      }
      setGenerationProgress(prog);
    }, 150);

    const formData = new FormData();
    formData.append('resume', generatorFile);
    formData.append('targetRole', targetRole);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/optimize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(progressTimer);
      setGenerationProgress(100);
      setOptimizedResume(response.data.optimizedData);
    } catch (err) {
      clearInterval(progressTimer);
      console.error(err);
      setError(err.response?.data?.message || 'ATS Optimization failed. Make sure the backend server is active.');
    } finally {
      setGeneratingResume(false);
    }
  };

  // AI Bullet Enhancer calling dynamic backend AI endpoint
  const handleEnhanceBullet = async () => {
    if (!bulletInput.trim()) return;

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setEnhancingBullet(true);
    setEnhancedBullet('');
    setAiConfidence(null);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/tools/enhance-bullet', {
        bulletText: bulletInput,
        targetRole,
        temperature: parseFloat(temperature || 0.7)
      });

      // Character-by-character typing animation
      const fullText = response.data.enhancedText;
      let currentIdx = 0;
      const interval = setInterval(() => {
        setEnhancedBullet(prev => prev + fullText.charAt(currentIdx));
        currentIdx++;
        if (currentIdx >= fullText.length) {
          clearInterval(interval);
          setAiConfidence(Math.round(85 + Math.random() * 14)); // Random 85-99% confidence score
        }
      }, 12);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to enhance bullet point. Please verify Pro workspace status.');
    } finally {
      setEnhancingBullet(false);
    }
  };

  // AI Cover Letter Generator calling dynamic backend AI endpoint
  const handleGenerateCover = async () => {
    if (!companyName.trim() || !coverRole.trim()) return;

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setGeneratingLetter(true);
    setGeneratedLetter('');

    try {
      const response = await axios.post('http://localhost:5000/api/resume/tools/generate-cover', {
        companyName,
        jobRole: coverRole,
        tone: selectedCoverTone,
        skills: report ? report.extractedSkills : ['RESTful APIs', 'Database Sharding'],
        projects: report ? [report.filename] : ['AI Assessment Dashboard'],
        temperature: parseFloat(temperature || 0.7)
      });

      const fullText = response.data.coverLetter;
      let currentIdx = 0;
      const interval = setInterval(() => {
        setGeneratedLetter(prev => prev + fullText.charAt(currentIdx));
        currentIdx++;
        if (currentIdx >= fullText.length) {
          clearInterval(interval);
        }
      }, 4);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setGeneratingLetter(false);
    }
  };

  // AI Project Description Generator calling dynamic backend AI endpoint
  const handleGenerateProject = async () => {
    if (!projectTech.trim() || !projectTopic.trim()) return;

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setGeneratingProj(true);
    setGeneratedProj('');

    try {
      const response = await axios.post('http://localhost:5000/api/resume/tools/generate-project', {
        topic: projectTopic,
        techStack: projectTech,
        targetRole,
        temperature: parseFloat(temperature || 0.7)
      });

      const bulletsList = response.data.bullets;
      const fullText = `### 💻 Project: ${projectTopic}
**Technologies Used**: ${projectTech}

` + bulletsList.map((b, idx) => `*   **STAR Deliverable ${idx+1}**: ${b}`).join('\n');

      let currentIdx = 0;
      const interval = setInterval(() => {
        setGeneratedProj(prev => prev + fullText.charAt(currentIdx));
        currentIdx++;
        if (currentIdx >= fullText.length) {
          clearInterval(interval);
        }
      }, 6);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate project descriptions.');
    } finally {
      setGeneratingProj(false);
    }
  };

  // Map Keyword match charts
  const matchChartData = report ? [
    { name: 'Keyword Match', score: report.atsKeywordMatchPercentage },
    { name: 'Readability', score: report.atsScore - 5 },
    { name: 'Interview Ready', score: report.interviewReadinessScore }
  ] : [];

  const renderExperience = (styles) => (
    resumeToShow?.experience && resumeToShow.experience.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Professional Experience</h4>
        <div className="flex flex-col gap-4">
          {resumeToShow.experience.map((exp) => (
            <div key={exp.id} className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-baseline w-full">
                <h5 className={styles.roleTitle}>{exp.role}</h5>
                <span className={styles.metaText}>{exp.duration}</span>
              </div>
              <span className={styles.companyTitle}>{exp.company}</span>
              <ul className="flex flex-col gap-1.5 mt-1">
                {exp.bullets && exp.bullets.map((b, i) => (
                  <li key={i} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
                    <span className={styles.bulletDot}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderInternships = (styles) => (
    resumeToShow?.internships && resumeToShow.internships.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Internships</h4>
        <div className="flex flex-col gap-4">
          {resumeToShow.internships.map((intern) => (
            <div key={intern.id} className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-baseline w-full">
                <h5 className={styles.roleTitle}>{intern.role}</h5>
                <span className={styles.metaText}>{intern.duration}</span>
              </div>
              <span className={styles.companyTitle}>{intern.company}</span>
              <ul className="flex flex-col gap-1.5 mt-1">
                {intern.bullets && intern.bullets.map((b, i) => (
                  <li key={i} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
                    <span className={styles.bulletDot}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderProjects = (styles) => (
    resumeToShow?.projects && resumeToShow.projects.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Technical Projects</h4>
        <div className="flex flex-col gap-4">
          {resumeToShow.projects.map((proj) => (
            <div key={proj.id} className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-baseline w-full">
                <h5 className={styles.projTitle}>{proj.title}</h5>
                <span className={styles.metaText}>Tech: {proj.tech}</span>
              </div>
              <ul className="flex flex-col gap-1.5 mt-1">
                {proj.bullets && proj.bullets.map((b, i) => (
                  <li key={i} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
                    <span className={styles.bulletDot}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderLeadership = (styles) => (
    resumeToShow?.leadership && resumeToShow.leadership.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Leadership & Responsibility</h4>
        <div className="flex flex-col gap-4">
          {resumeToShow.leadership.map((lead) => (
            <div key={lead.id} className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-baseline w-full">
                <h5 className={styles.roleTitle}>{lead.role}</h5>
                <span className={styles.metaText}>{lead.duration}</span>
              </div>
              <span className={styles.companyTitle}>{lead.organization}</span>
              <ul className="flex flex-col gap-1.5 mt-1">
                {lead.bullets && lead.bullets.map((b, i) => (
                  <li key={i} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
                    <span className={styles.bulletDot}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderCertifications = (styles) => (
    resumeToShow?.certifications && resumeToShow.certifications.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Certifications</h4>
        <ul className="flex flex-col gap-1.5">
          {resumeToShow.certifications.map((cert, idx) => (
            <li key={idx} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
              <span className={styles.bulletDot}>•</span>
              <span>{cert}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  const renderAchievements = (styles) => (
    resumeToShow?.achievements && resumeToShow.achievements.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Key Achievements</h4>
        <ul className="flex flex-col gap-1.5">
          {resumeToShow.achievements.map((ach, idx) => (
            <li key={idx} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
              <span className={styles.bulletDot}>•</span>
              <span>{ach}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  const renderExtracurriculars = (styles) => (
    resumeToShow?.extracurriculars && resumeToShow.extracurriculars.length > 0 && (
      <div className="mb-6">
        <h4 className={styles.sectionHeader}>Extracurricular Activities</h4>
        <ul className="flex flex-col gap-1.5">
          {resumeToShow.extracurriculars.map((extra, idx) => (
            <li key={idx} className={`flex gap-2 items-start leading-normal ${styles.textBody}`}>
              <span className={styles.bulletDot}>•</span>
              <span>{extra}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  const renderEducation = (styles) => (
    <div className="mb-6">
      <h4 className={styles.sectionHeader}>Education & Qualifications</h4>
      {resumeToShow?.educationList && resumeToShow.educationList.length > 0 ? (
        <div className="flex flex-col gap-3">
          {resumeToShow.educationList.map((edu) => (
            <div key={edu.id} className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-baseline w-full">
                <h5 className={styles.roleTitle}>{edu.degree || 'Degree'}</h5>
                <span className={styles.metaText}>{edu.duration}</span>
              </div>
              <span className={styles.companyTitle}>{edu.school}</span>
              {edu.details && <p className={styles.textBody + " mt-0.5"}>{edu.details}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.textBody}>
          {resumeToShow?.education}
        </p>
      )}
    </div>
  );

  console.log("Resume State Metrics:", {
    experienceCount: resumeToShow?.experience?.length || 0,
    projectsCount: resumeToShow?.projects?.length || 0,
    expandedSections: expandedSections
  });

  return (
    <PageWrapper>
      <div className={`mx-auto flex flex-col gap-6 text-left relative transition-all duration-300 w-full ${isEditing ? 'max-w-[1600px] px-4' : 'max-w-6xl'}`}>
        
        
        {/* Modular Subscription system mounted globally at page bottom */}

        {/* Pro Switcher Header */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyber-accentGlow filter blur-[80px] pointer-events-none -z-10"></div>
          <div>
            <span className="text-[10px] font-bold text-cyber-neon tracking-widest uppercase block mb-1">
              SAAS PLATFORM MEMBERSHIP STATUS
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white leading-none">
                {isPremium ? 'Pro Prep Master Cockpit' : 'Starter Prep Cockpit'}
              </h2>
              <span className={`
                text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1
                ${isPremium ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30' : 'bg-gray-600/20 text-gray-400'}
              `}>
                {isPremium ? <Crown className="w-3 h-3 text-cyber-accent shrink-0" /> : null}
                {isPremium ? 'PRO MEMBER' : 'FREE USER'}
              </span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="flex items-center gap-2 bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-xs px-5 py-3 rounded-xl hover:scale-[1.02] shadow-md shadow-cyber-accent/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {isPremium ? 'Simulate Free Basic Account' : 'Upgrade to Pro Account ($19)'}
          </button>
        </div>

        {/* Navigation Tabs split */}
        <div className="flex border-b border-white/5 pb-2 gap-2 select-none shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ats')}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-bold border transition duration-300 shrink-0
              ${activeTab === 'ats' 
                ? 'bg-cyber-neon/10 border-cyber-neon/35 text-cyber-neon' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-white'
              }
            `}
          >
            ATS Score Audit
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-2 shrink-0
              ${activeTab === 'generator' 
                ? 'bg-cyber-accent/15 border-cyber-accent/35 text-cyber-accent' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-white'
              }
            `}
          >
            AI Resume Generator
            {!isPremium && <Lock className="w-3 h-3 text-gray-600" />}
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-2 shrink-0
              ${activeTab === 'tools' 
                ? 'bg-cyber-accent/15 border-cyber-accent/35 text-cyber-accent' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-white'
              }
            `}
          >
            Pro Writing Tools
            {!isPremium && <Lock className="w-3 h-3 text-gray-600" />}
          </button>
        </div>

        {/* Tab Content 1: ATS AUDIT PANEL */}
        {activeTab === 'ats' && (
          <div className="flex flex-col gap-6">
            
            {/* Direct Uploader or showcase */}
            {!report ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Uploader Box left */}
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-6 text-left relative overflow-hidden">
                  <h3 className="font-extrabold text-lg text-white">Upload Resume PDF</h3>
                  
                  <form onSubmit={handleUpload} className="flex flex-col gap-5">
                    <div className="border-2 border-dashed border-white/10 hover:border-cyber-accent/50 hover:bg-cyber-accent/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition relative">
                      <input 
                        type="file" 
                        onChange={(e) => handleFileChange(e, false)} 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        accept="application/pdf"
                      />
                      <UploadCloud className="w-12 h-12 text-cyber-accent mb-4 animate-float" />
                      
                      {file ? (
                        <div className="flex items-center gap-2 bg-cyber-accent/15 px-4 py-2 rounded-xl border border-cyber-accent/25">
                          <FileText className="w-4 h-4 text-cyber-accent" />
                          <span className="text-sm font-bold text-white max-w-[220px] truncate">{file.name}</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-gray-300">
                            Drag and drop your PDF resume here, or click to browse
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            Only standard PDF format files up to 5MB are supported
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Target Hiring Profile
                      </label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="glass-input cursor-pointer bg-cyber-dark text-xs"
                      >
                        {roles.map(r => (
                          <option key={r} value={r} className="bg-cyber-darker text-gray-200">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !file}
                      className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-4 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Parsing PDF & Compiling ATS Audit...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 shrink-0" />
                          Compile ATS Diagnostics (Get 50 XP)
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* History list right */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
                  <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3">
                    PREVIOUS ATS ASSESSMENTS
                  </h4>
                  
                  {history.length > 0 ? (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1">
                      {history.map((h, idx) => (
                        <div 
                          key={h._id || idx} 
                          onClick={() => setReport(h)} 
                          className="bg-white/3 hover:bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer group transition"
                        >
                          <div className="overflow-hidden mr-2">
                            <h5 className="text-xs font-extrabold text-white truncate">{h.filename}</h5>
                            <span className="text-[10px] text-gray-500 font-bold block mt-1 uppercase truncate">
                              Detected: {h.detectedRole || 'MERN Stack'}
                            </span>
                            <span className="text-[9px] text-gray-600 block mt-0.5">
                              {new Date(h.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-cyber-accent/15 border border-cyber-accent/25 flex items-center justify-center text-xs font-black text-cyber-accent shrink-0 group-hover:bg-cyber-accent group-hover:text-white transition">
                            {h.atsScore}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/2 p-6 rounded-2xl text-center border border-white/5 my-auto">
                      <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-bounce" />
                      <span className="text-xs text-gray-400 font-bold block mb-1">Audit Vault Empty</span>
                      <p className="text-[10px] text-gray-600 leading-normal max-w-xs mx-auto">
                        Historical resume audits will populate here automatically.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* Upgraded Detailed ATS Showcase Dashboard */
              <div className="flex flex-col gap-6">
                
                {/* Reset button row */}
                <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-2xl shrink-0">
                  <span className="text-xs font-bold text-gray-400">
                    File: {report.filename} (Analyzed for {report.detectedRole || targetRole})
                  </span>
                  <button
                    onClick={() => { setReport(null); setFile(null); }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyber-accent hover:bg-cyber-accent/5 px-4 py-2 rounded-xl text-xs font-bold text-white transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Audit New Document
                  </button>
                </div>

                {/* Grid Split: Visual Dial, comparison bar graph, Recruiter quotes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left shrink-0">
                  
                  {/* Dynamic Radial dial */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                    <h3 className="font-extrabold text-base text-gray-400 uppercase tracking-widest mb-6">
                      ATS Readability Level
                    </h3>
                    <div className="w-32 h-32 rounded-full border-8 border-cyber-accent flex items-center justify-center mb-4 relative shadow-lg shadow-cyber-accent/15 animate-[pulse-slow_4s_infinite]">
                      <span className="text-4xl font-black text-white">{animatedScore}%</span>
                    </div>

                    {report.atsScore >= 80 ? (
                      <span className="text-xs font-bold text-cyber-jade bg-cyber-jade/10 border border-cyber-jade/20 px-3.5 py-1.5 rounded-full uppercase">
                        Excellent Readability
                      </span>
                    ) : report.atsScore >= 60 ? (
                      <span className="text-xs font-bold text-cyber-gold bg-cyber-gold/10 border border-cyber-gold/20 px-3.5 py-1.5 rounded-full uppercase">
                        Moderate Gaps Detected
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full uppercase">
                        Severe Critique Identified
                      </span>
                    )}
                  </div>

                  {/* Recharts Comparison metrics */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <h3 className="font-extrabold text-base text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3">
                      Match metrics indices
                    </h3>
                    
                    <div className="w-full h-44 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={matchChartData} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                          <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={10} tickLine={false} />
                          <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={10} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                            itemStyle={{ color: '#06b6d4', fontSize: '11px' }}
                          />
                          <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Executive recruiter impression card */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full bg-cyber-neonGlow filter blur-[35px] pointer-events-none -z-10"></div>
                    
                    <h3 className="font-extrabold text-base text-cyber-neon uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3">
                      <Brain className="w-4 h-4 shrink-0 animate-pulse" />
                      Hiring Panel Impression
                    </h3>
                    
                    <div className="bg-white/2 border border-white/5 p-4 rounded-2xl italic text-xs text-gray-300 leading-relaxed my-auto">
                      "{report.recruiterImpression || 'The candidate demonstrates robust coding competencies, but requires stronger active STAR phrasing to engage recruiters.'}"
                    </div>
                  </div>

                </div>

                {/* Split 2: Detailed Why/How */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                  
                  {/* Detailed Why/How critiques */}
                  <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
                    {!isPremium && (
                      <div className="absolute inset-0 bg-cyber-darker/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8">
                        <Lock className="w-10 h-10 text-cyber-accent mb-3 animate-float" />
                        <h4 className="font-extrabold text-white text-lg">Detailed Recruiter critiques locked</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm mb-6 leading-relaxed">
                          Upgrade to Pro Prep Master to unlock detailed section-wise why/how reports and auto rewriters!
                        </p>
                        <button
                          onClick={() => setIsPremium(true)}
                          className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:scale-105 transition"
                        >
                          Unlock Pro Audit ($19)
                        </button>
                      </div>
                    )}

                    <h3 className="font-extrabold text-lg text-white border-b border-white/5 pb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyber-jade shrink-0" />
                      Premium Granular Feedback
                    </h3>

                    {report.detailedFeedback ? (
                      <div className="flex flex-col gap-5 text-sm leading-relaxed">
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            WHY IS THE ATS SCORE LOW?
                          </span>
                          <p className="text-gray-300 bg-white/2 border border-white/5 p-4 rounded-xl font-medium">
                            {report.detailedFeedback.whyScoreIsLow}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            HOW TO BOOST SCORE Readability?
                          </span>
                          <p className="text-gray-300 bg-white/2 border border-white/5 p-4 rounded-xl font-medium">
                            {report.detailedFeedback.howToImprove}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            WHAT SECTIONS NEED IMMEDIATE REWRITING?
                          </span>
                          <p className="text-gray-300 bg-white/2 border border-white/5 p-4 rounded-xl font-medium">
                            {report.detailedFeedback.whatSectionsNeedRewriting}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Strengths & Weaknesses lists */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-5">
                    <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-3">
                      Pillars Assessment
                    </h3>

                    {/* Strengths */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[9px] font-extrabold text-cyber-jade uppercase tracking-widest block">
                        Core Strengths
                      </span>
                      <ul className="flex flex-col gap-2">
                        {report.strengths && report.strengths.map((str, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-xs text-gray-300 leading-normal">
                            <CheckCircle className="w-3.5 h-3.5 text-cyber-jade shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
                      <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest block">
                        Critical Gaps
                      </span>
                      <ul className="flex flex-col gap-2">
                        {report.weaknesses && report.weaknesses.map((wk, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-xs text-gray-300 leading-normal">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Split 3: Guiding Suggestions arrays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left shrink-0">
                  
                  {/* STAR Project descriptions & verbs */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <h4 className="font-extrabold text-base text-white border-b border-white/5 pb-3">
                      STAR Project upgrades
                    </h4>
                    <div className="flex flex-col gap-3">
                      {report.suggestions.projectDescriptions && report.suggestions.projectDescriptions.map((proj, idx) => (
                        <div key={idx} className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs text-gray-400 italic leading-relaxed">
                          {proj}
                        </div>
                      ))}
                    </div>

                    <h4 className="font-extrabold text-base text-white border-b border-white/5 pb-3 mt-4">
                      Stronger active Verbs
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {report.suggestions.actionVerbs && report.suggestions.actionVerbs.map((vb, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-gray-300">
                          <Zap className="w-3.5 h-3.5 text-cyber-neon shrink-0 mt-0.5" />
                          <span>{vb}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formatting suggestions & recommendations keywords */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <h4 className="font-extrabold text-base text-white border-b border-white/5 pb-3">
                      ATS formatting criteria
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {report.suggestions.formatting && report.suggestions.formatting.map((fmt, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-300 leading-normal">
                          <ChevronRight className="w-3.5 h-3.5 text-cyber-neon shrink-0 mt-0.5" />
                          <span>{fmt}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-extrabold text-base text-white border-b border-white/5 pb-3 mt-4">
                      Target industry-standard keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {report.recommendedKeywords && report.recommendedKeywords.map((rec, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-cyber-accent/15 border border-cyber-accent/25 text-cyber-accent px-3 py-1 rounded-full uppercase tracking-wider">
                          + {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: AI ATS RESUME GENERATOR (PREMIUM) */}
        {activeTab === 'generator' && (
          <div className="relative">
            
            {/* Free Lock Overlay */}
            {!isPremium && !optimizedResume && (
              <div className="absolute inset-0 bg-cyber-darker/95 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-white/5 min-h-[420px]">
                <Crown className="w-12 h-12 text-cyber-accent mb-4 animate-float" />
                <h3 className="text-xl font-extrabold text-white">AI ATS-Friendly Resume Generator</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm mb-6 leading-relaxed">
                  Automatically rewrite, format, and optimize your resume into a recruiter-ready, ATS-friendly digital CV.
                </p>
                <button
                  onClick={() => setIsPremium(true)}
                  className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-md shadow-cyber-accent/25"
                >
                  Unlock AI-Powered ATS Resume Generation
                </button>
              </div>
            )}

            {!optimizedResume ? (
              <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyber-accentGlow filter blur-[100px] pointer-events-none -z-10"></div>
                
                <div>
                  <span className="text-[10px] font-extrabold text-cyber-accent uppercase tracking-widest flex items-center gap-1.5">
                    <Crown className="w-3 h-3 shrink-0" />
                    Premium Resume Transformer
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">Generate Recruiter-Optimized Resume in Seconds</h3>
                  <p className="text-xs text-gray-500 leading-normal mt-1">
                    Upload your raw CV file. Our AI engine will restructure details, rewrite bullet points with quantified results, and optimize keyword density for your target job role.
                  </p>
                </div>

                <form onSubmit={handleOptimizeResume} className="flex flex-col gap-5">
                  <div className="border-2 border-dashed border-white/10 hover:border-cyber-accent/50 hover:bg-cyber-accent/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition relative">
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, true)} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      accept="application/pdf"
                    />
                    <UploadCloud className="w-12 h-12 text-cyber-accent mb-3 animate-float" />
                    
                    {generatorFile ? (
                      <div className="flex items-center gap-2 bg-cyber-accent/15 px-4 py-2 rounded-xl border border-cyber-accent/25">
                        <FileText className="w-4 h-4 text-cyber-accent" />
                        <span className="text-sm font-bold text-white max-w-[200px] truncate">{generatorFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-gray-300">
                          Select your current resume PDF to rewrite
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Only standard PDF format files up to 5MB are supported
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Target Role for Optimization
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="glass-input cursor-pointer bg-cyber-dark text-xs"
                    >
                      {roles.map(r => (
                        <option key={r} value={r} className="bg-cyber-darker text-gray-200">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic AI Model Randomness Control */}
                  <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 text-cyber-neon">
                        <Wand2 className="w-3.5 h-3.5" />
                        AI Generation Parameters
                      </span>
                      <span className="bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon font-mono px-2.5 py-0.5 rounded text-[10px]">
                        Temp: {temperature}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Strict ATS</span>
                      <input 
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="flex-1 accent-cyber-neon h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <span className="text-[9px] text-cyber-accent font-bold uppercase tracking-wider">Creative Pro</span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mt-1">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={generatingResume || !generatorFile}
                    className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-4 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingResume ? (
                      <div className="w-full flex flex-col gap-1.5 items-center justify-center py-1">
                        <div className="flex justify-between items-center w-full text-xs text-white font-mono px-4">
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyber-neon" />
                            Optimizing Keyword Descriptors...
                          </span>
                          <span className="font-bold text-cyber-neon">{generationProgress}%</span>
                        </div>
                        <div className="w-[90%] bg-white/10 h-1.5 rounded-full overflow-hidden relative">
                          <div 
                            className="bg-gradient-to-r from-cyber-accent to-cyber-neon h-full rounded-full transition-all duration-150"
                            style={{ width: `${generationProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 shrink-0" />
                        Transform CV to ATS-Optimized Resume
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Showcase: Before vs After Comparison & PDF Preview */
              <div className="flex flex-col gap-6">
                
                {/* Back / Reset Row */}
                <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-cyber-jade flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    CV Rewritten successfully for {targetRole}!
                  </span>
                  <button
                    onClick={() => { setOptimizedResume(null); setGeneratorFile(null); }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyber-accent hover:bg-cyber-accent/5 px-4 py-2 rounded-xl text-xs font-bold text-white transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Optimize Another CV
                  </button>
                </div>

                {/* Score Comparison Widget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Before score */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">
                      Original ATS Score
                    </span>
                    <div className="w-24 h-24 rounded-full border-4 border-red-500/40 flex items-center justify-center text-2xl font-black text-red-400 mb-2">
                      {animatedBeforeScore}%
                    </div>
                    <span className="text-xs text-gray-500">Poor keyword match & formatting</span>
                  </div>

                  {/* After score */}
                  <div className="glass-panel p-6 rounded-3xl border border-cyber-jade/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg shadow-cyber-jade/5">
                    <div className="absolute top-0 right-0 bg-cyber-jade text-cyber-darker font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-bl-xl">
                      ATS READY
                    </div>
                    <span className="text-[10px] font-bold text-cyber-jade uppercase tracking-widest block mb-3">
                      AI Optimized ATS Score
                    </span>
                    <div className="w-24 h-24 rounded-full border-4 border-cyber-jade flex items-center justify-center text-2xl font-black text-cyber-jade mb-2 animate-pulse">
                      {animatedAfterScore}%
                    </div>
                    <span className="text-xs text-cyber-jade font-semibold">Matched all target criteria!</span>
                  </div>

                  {/* Key Highlights list */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-3 text-left justify-center">
                    <span className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest block mb-1">
                      AI Improvement Highlights
                    </span>
                    <ul className="flex flex-col gap-2">
                      {optimizedResume.highlights && optimizedResume.highlights.map((hl, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-cyber-neon shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Split: Template Selection Carousel & Interactive Resume Preview */}
                <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-[55%_45%] lg:h-[75vh] lg:overflow-hidden' : 'lg:grid-cols-[25%_75%]'} gap-6 text-left items-stretch w-full`}>
                  
                  {isEditing ? (
                    /* Form Editor Pane - Left Column */
                    <div className="w-full flex flex-col gap-5 lg:overflow-y-auto lg:h-full pr-3 custom-scrollbar pb-12">
                      
                      {/* 1. Header Details Section */}
                      <ResumeSection
                        title="Header Details"
                        isOpen={expandedSections.header}
                        onToggle={() => toggleSection('header')}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Full Name</label>
                            <input
                              type="text"
                              value={resumeToShow?.name || ''}
                              onChange={(e) => handleBaseFieldChange('name', e.target.value)}
                              className="glass-input text-xs"
                              placeholder="Full Name"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Email</label>
                              <input
                                type="email"
                                value={resumeToShow?.email || ''}
                                onChange={(e) => handleBaseFieldChange('email', e.target.value)}
                                className="glass-input text-xs font-mono"
                                placeholder="email@example.com"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Phone</label>
                              <input
                                type="text"
                                value={resumeToShow?.phone || ''}
                                onChange={(e) => handleBaseFieldChange('phone', e.target.value)}
                                className="glass-input text-xs font-mono"
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">LinkedIn</label>
                              <input
                                type="text"
                                value={resumeToShow?.linkedin || ''}
                                onChange={(e) => handleBaseFieldChange('linkedin', e.target.value)}
                                className="glass-input text-xs font-mono"
                                placeholder="linkedin.com/in/username"
                              />
                            </div>
                          </div>
                        </div>
                      </ResumeSection>

                      {/* 2. Professional Summary Section */}
                      <ResumeSection
                        title="Professional Summary"
                        isOpen={expandedSections.summary}
                        onToggle={() => toggleSection('summary')}
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Summary Statement</label>
                          <textarea
                            value={resumeToShow?.summary || ''}
                            onChange={(e) => handleBaseFieldChange('summary', e.target.value)}
                            className="glass-input text-xs min-h-[100px] leading-relaxed resize-y"
                            placeholder="Write a powerful executive summary..."
                          />
                        </div>
                      </ResumeSection>

                      {/* 3. Core Tech Skills Section */}
                      <ResumeSection
                        title="Core Technical Skills"
                        isOpen={expandedSections.skills}
                        onToggle={() => toggleSection('skills')}
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                          <input
                            type="text"
                            value={resumeToShow?.skills ? resumeToShow.skills.join(', ') : ''}
                            onChange={(e) => handleSkillChange(e.target.value)}
                            className="glass-input text-xs font-mono"
                            placeholder="React, Node.js, Express, MongoDB..."
                          />
                        </div>
                      </ResumeSection>

                      {/* 4. Experience Section */}
                      <ResumeSection
                        title="Work Experience"
                        isOpen={expandedSections.experience}
                        onToggle={() => toggleSection('experience')}
                        onAddEntry={handleAddExpEntry}
                        addLabel="Add Experience"
                      >
                        {resumeToShow?.experience && resumeToShow.experience.map((exp, idx) => (
                          <div key={exp.id} className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] p-5 space-y-5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest">
                                Work Experience #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleRemoveExpEntry(exp.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Remove Experience Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Job Role</label>
                                <input
                                  type="text"
                                  value={exp.role || ''}
                                  onChange={(e) => handleExpFieldChange(exp.id, 'role', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Senior Software Engineer"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Company</label>
                                <input
                                  type="text"
                                  value={exp.company || ''}
                                  onChange={(e) => handleExpFieldChange(exp.id, 'company', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Acme Corp"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Duration</label>
                                <input
                                  type="text"
                                  value={exp.duration || ''}
                                  onChange={(e) => handleExpFieldChange(exp.id, 'duration', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. 2024 - Present"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">STAR Achievement Bullets</label>
                              <DynamicBulletInput
                                bullets={exp.bullets}
                                onChange={(newBullets) => handleExpBulletsChange(exp.id, newBullets)}
                                onEnhance={handleEnhanceBulletText}
                                sectionName={`exp-${exp.id}`}
                              />
                            </div>
                          </div>
                        ))}
                        {(!resumeToShow?.experience || resumeToShow.experience.length === 0) && (
                          <p className="text-xs text-gray-500 text-center py-2">No experience entries. Click "Add Experience" to add one.</p>
                        )}
                      </ResumeSection>

                      {/* 5. Internships Section */}
                      <ResumeSection
                        title="Internships"
                        isOpen={expandedSections.internships}
                        onToggle={() => toggleSection('internships')}
                        onAddEntry={handleAddInternshipEntry}
                        addLabel="Add Internship"
                      >
                        {resumeToShow?.internships && resumeToShow.internships.map((intern, idx) => (
                          <div key={intern.id} className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] p-5 space-y-5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest">
                                Internship Entry #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleRemoveInternshipEntry(intern.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Remove Internship Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Intern Role</label>
                                <input
                                  type="text"
                                  value={intern.role || ''}
                                  onChange={(e) => handleInternshipFieldChange(intern.id, 'role', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Backend Developer Intern"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Company</label>
                                <input
                                  type="text"
                                  value={intern.company || ''}
                                  onChange={(e) => handleInternshipFieldChange(intern.id, 'company', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Tech Solutions"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Duration</label>
                                <input
                                  type="text"
                                  value={intern.duration || ''}
                                  onChange={(e) => handleInternshipFieldChange(intern.id, 'duration', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Summer 2024"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">STAR Internship Bullets</label>
                              <DynamicBulletInput
                                bullets={intern.bullets}
                                onChange={(newBullets) => handleInternshipBulletsChange(intern.id, newBullets)}
                                onEnhance={handleEnhanceBulletText}
                                sectionName={`intern-${intern.id}`}
                              />
                            </div>
                          </div>
                        ))}
                        {(!resumeToShow?.internships || resumeToShow.internships.length === 0) && (
                          <p className="text-xs text-gray-500 text-center py-2">No internship entries. Click "Add Internship" to add one.</p>
                        )}
                      </ResumeSection>

                      {/* 6. Projects Section */}
                      <ResumeSection
                        title="Technical Projects"
                        isOpen={expandedSections.projects}
                        onToggle={() => toggleSection('projects')}
                        onAddEntry={handleAddProjEntry}
                        addLabel="Add Project"
                      >
                        {resumeToShow?.projects && resumeToShow.projects.map((proj, idx) => (
                          <div key={proj.id} className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] p-5 space-y-5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest">
                                Technical Project #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleRemoveProjEntry(proj.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Remove Project Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Project Title</label>
                                <input
                                  type="text"
                                  value={proj.title || ''}
                                  onChange={(e) => handleProjFieldChange(proj.id, 'title', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. AI-powered Chat Application"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Technologies Used</label>
                                <input
                                  type="text"
                                  value={proj.tech || ''}
                                  onChange={(e) => handleProjFieldChange(proj.id, 'tech', e.target.value)}
                                  className="glass-input text-xs font-mono"
                                  placeholder="e.g. React, Node.js, Socket.io"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">STAR Project Bullets</label>
                              <DynamicBulletInput
                                bullets={proj.bullets}
                                onChange={(newBullets) => handleProjBulletsChange(proj.id, newBullets)}
                                onEnhance={handleEnhanceBulletText}
                                sectionName={`proj-${proj.id}`}
                              />
                            </div>
                          </div>
                        ))}
                        {(!resumeToShow?.projects || resumeToShow.projects.length === 0) && (
                          <p className="text-xs text-gray-500 text-center py-2">No project entries. Click "Add Project" to add one.</p>
                        )}
                      </ResumeSection>

                      {/* 7. Leadership Section */}
                      <ResumeSection
                        title="Leadership & Responsibility"
                        isOpen={expandedSections.leadership}
                        onToggle={() => toggleSection('leadership')}
                        onAddEntry={handleAddLeadershipEntry}
                        addLabel="Add Entry"
                      >
                        {resumeToShow?.leadership && resumeToShow.leadership.map((lead, idx) => (
                          <div key={lead.id} className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] p-5 space-y-5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest">
                                Leadership Entry #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleRemoveLeadershipEntry(lead.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Remove Leadership Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Role</label>
                                <input
                                  type="text"
                                  value={lead.role || ''}
                                  onChange={(e) => handleLeadershipFieldChange(lead.id, 'role', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Lead Organizer"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Organization / Club</label>
                                <input
                                  type="text"
                                  value={lead.organization || ''}
                                  onChange={(e) => handleLeadershipFieldChange(lead.id, 'organization', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. ACM Student Chapter"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Duration</label>
                                <input
                                  type="text"
                                  value={lead.duration || ''}
                                  onChange={(e) => handleLeadershipFieldChange(lead.id, 'duration', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. 2023 - 2024"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">STAR Leadership Bullets</label>
                              <DynamicBulletInput
                                bullets={lead.bullets}
                                onChange={(newBullets) => handleLeadershipBulletsChange(lead.id, newBullets)}
                                onEnhance={handleEnhanceBulletText}
                                sectionName={`lead-${lead.id}`}
                              />
                            </div>
                          </div>
                        ))}
                        {(!resumeToShow?.leadership || resumeToShow.leadership.length === 0) && (
                          <p className="text-xs text-gray-500 text-center py-2">No leadership entries. Click "Add Entry" to add one.</p>
                        )}
                      </ResumeSection>

                      {/* 8. Certifications Section */}
                      <ResumeSection
                        title="Certifications"
                        isOpen={expandedSections.certifications}
                        onToggle={() => toggleSection('certifications')}
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Certifications & Training</label>
                          <DynamicBulletInput
                            bullets={resumeToShow?.certifications || []}
                            onChange={handleCertificationsChange}
                            onEnhance={handleEnhanceBulletText}
                            sectionName="certs"
                          />
                        </div>
                      </ResumeSection>

                      {/* 9. Achievements Section */}
                      <ResumeSection
                        title="Achievements"
                        isOpen={expandedSections.achievements}
                        onToggle={() => toggleSection('achievements')}
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Honors, Awards & Achievements</label>
                          <DynamicBulletInput
                            bullets={resumeToShow?.achievements || []}
                            onChange={handleAchievementsChange}
                            onEnhance={handleEnhanceBulletText}
                            sectionName="achievements"
                          />
                        </div>
                      </ResumeSection>

                      {/* 10. Extracurriculars Section */}
                      <ResumeSection
                        title="Extracurricular Activities"
                        isOpen={expandedSections.extracurriculars}
                        onToggle={() => toggleSection('extracurriculars')}
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Extracurricular Activities</label>
                          <DynamicBulletInput
                            bullets={resumeToShow?.extracurriculars || []}
                            onChange={handleExtracurricularsChange}
                            onEnhance={handleEnhanceBulletText}
                            sectionName="extracurriculars"
                          />
                        </div>
                      </ResumeSection>

                      {/* 11. Education Section */}
                      <ResumeSection
                        title="Education List"
                        isOpen={expandedSections.education}
                        onToggle={() => toggleSection('education')}
                        onAddEntry={handleAddEduEntry}
                        addLabel="Add Education"
                      >
                        {resumeToShow?.educationList && resumeToShow.educationList.map((edu, idx) => (
                          <div key={edu.id} className="rounded-2xl border border-cyan-500/10 bg-[#0b1220] p-5 space-y-5">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest">
                                Education Entry #{idx + 1}
                              </span>
                              <button
                                onClick={() => handleRemoveEduEntry(edu.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Remove Education Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Degree / Program</label>
                                <input
                                  type="text"
                                  value={edu.degree || ''}
                                  onChange={(e) => handleEduFieldChange(edu.id, 'degree', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. B.Tech in Computer Science"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">School / University</label>
                                <input
                                  type="text"
                                  value={edu.school || ''}
                                  onChange={(e) => handleEduFieldChange(edu.id, 'school', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. Stanford University"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Duration</label>
                                <input
                                  type="text"
                                  value={edu.duration || ''}
                                  onChange={(e) => handleEduFieldChange(edu.id, 'duration', e.target.value)}
                                  className="glass-input text-xs"
                                  placeholder="e.g. 2021 - 2025"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">GPA / Minor Details</label>
                              <input
                                type="text"
                                value={edu.details || ''}
                                onChange={(e) => handleEduFieldChange(edu.id, 'details', e.target.value)}
                                className="glass-input text-xs"
                                placeholder="e.g. GPA 3.9/4.0, Specialization in AI"
                              />
                            </div>
                          </div>
                        ))}
                        {(!resumeToShow?.educationList || resumeToShow.educationList.length === 0) && (
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Single Education Field (Older Format)</label>
                            <textarea
                              value={resumeToShow?.education || ''}
                              onChange={(e) => handleBaseFieldChange('education', e.target.value)}
                              className="glass-input text-xs min-h-[80px]"
                              placeholder="e.g. Stanford University, B.Tech CS (GPA 3.9)"
                            />
                          </div>
                        )}
                      </ResumeSection>

                    </div>
                  ) : (
                    /* Template selector left column */
                    <div className="w-full glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
                      <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        Select Template
                      </h4>
                      
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => setSelectedTemplate('modern')}
                          className={`
                            p-4 rounded-2xl border text-left flex flex-col gap-1 transition duration-300
                            ${selectedTemplate === 'modern' 
                              ? 'bg-cyber-accent/15 border-cyber-accent/45 text-white' 
                              : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <span className="font-bold text-xs block">Modern ATS</span>
                          <span className="text-[9px] text-gray-500 leading-none">Single-column developer layout</span>
                        </button>

                        <button
                          onClick={() => setSelectedTemplate('corporate')}
                          className={`
                            p-4 rounded-2xl border text-left flex flex-col gap-1 transition duration-300
                            ${selectedTemplate === 'corporate' 
                              ? 'bg-cyber-accent/15 border-cyber-accent/45 text-white' 
                              : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <span className="font-bold text-xs block">Minimal Corporate</span>
                          <span className="text-[9px] text-gray-500 leading-none"> Georgia serif centered style</span>
                        </button>

                        <button
                          onClick={() => setSelectedTemplate('developer')}
                          className={`
                            p-4 rounded-2xl border text-left flex flex-col gap-1 transition duration-300
                            ${selectedTemplate === 'developer' 
                              ? 'bg-cyber-accent/15 border-cyber-accent/45 text-white' 
                              : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <span className="font-bold text-xs block">Premium Developer</span>
                          <span className="text-[9px] text-gray-500 leading-none">Obsidian terminal monospace theme</span>
                        </button>

                        <button
                          onClick={() => setSelectedTemplate('analyst')}
                          className={`
                            p-4 rounded-2xl border text-left flex flex-col gap-1 transition duration-300
                            ${selectedTemplate === 'analyst' 
                              ? 'bg-cyber-accent/15 border-cyber-accent/45 text-white' 
                              : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <span className="font-bold text-xs block">Data Analyst</span>
                          <span className="text-[9px] text-gray-500 leading-none">Ocean teal analytics theme</span>
                        </button>

                        <button
                          onClick={() => setSelectedTemplate('fresher')}
                          className={`
                            p-4 rounded-2xl border text-left flex flex-col gap-1 transition duration-300
                            ${selectedTemplate === 'fresher' 
                              ? 'bg-cyber-accent/15 border-cyber-accent/45 text-white' 
                              : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <span className="font-bold text-xs block">Fresher Elite</span>
                          <span className="text-[9px] text-gray-500 leading-none">Education & projects listed first</span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
                        <button 
                          onClick={handleExportPDF}
                          className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          Export PDF
                        </button>
                        <button 
                          onClick={handleExportDOCX}
                          className="w-full bg-white/5 border border-white/10 hover:border-cyber-accent text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          Export DOCX
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Resume HTML Preview right column */}
                  {(() => {
                    const styles = getTemplateStyles();
                    const cardClassName = isEditing ? styles.card.replace('lg:col-span-3', 'lg:col-span-2 w-full') : styles.card;
                    const scaleValue = zoomLevel !== null ? zoomLevel : Math.max(Math.min((containerWidth - 48) / 794, 1), 0.2);
                    const scaledHeight = a4Height * scaleValue;
                    const cleanedCardClass = cardClassName
                      .replace('lg:col-span-3', '')
                      .replace('lg:col-span-2', '')
                      .replace('w-full', '')
                      .trim();

                    return (
                      <div 
                        ref={previewContainerRef}
                        className={`w-full flex flex-col gap-5 bg-[#07111f] border border-white/5 p-6 rounded-3xl overflow-hidden relative ${
                          isEditing ? 'lg:h-full lg:overflow-y-auto custom-scrollbar' : ''
                        }`}
                      >
                        {/* Edit Control Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4 w-full shrink-0">
                          <span className="text-[10px] font-extrabold text-cyber-neon uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
                            Live ATS Preview ({selectedTemplate.toUpperCase()})
                          </span>
                          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Zoom Controls */}
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs shrink-0 select-none">
                              <button 
                                type="button"
                                onClick={() => setZoomLevel(prev => Math.max((prev !== null ? prev : scaleValue) - 0.1, 0.4))}
                                className="p-1 text-gray-400 hover:text-white transition cursor-pointer"
                                title="Zoom Out"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold text-[9px] text-gray-300 w-12 text-center">
                                {Math.round(scaleValue * 100)}%
                              </span>
                              <button 
                                type="button"
                                onClick={() => setZoomLevel(prev => Math.min((prev !== null ? prev : scaleValue) + 0.1, 1.5))}
                                className="p-1 text-gray-400 hover:text-white transition cursor-pointer"
                                title="Zoom In"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <div className="w-px h-3 bg-white/10 mx-1"></div>
                              <button 
                                type="button"
                                onClick={() => setZoomLevel(null)}
                                className="px-1.5 py-0.5 bg-white/5 text-[9px] font-extrabold text-cyber-neon hover:text-white rounded border border-cyber-neon/20 hover:border-cyber-neon/40 transition cursor-pointer uppercase tracking-wider"
                                title="Auto Fit Container Width"
                              >
                                Auto
                              </button>
                            </div>

                            <button
                              onClick={() => setIsEditing(!isEditing)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition duration-300 flex items-center gap-1.5 border uppercase tracking-wider
                                ${isEditing 
                                  ? 'bg-cyber-jade/10 border-cyber-jade/30 text-cyber-jade hover:bg-cyber-jade/20 shadow-lg shadow-cyber-jade/10' 
                                  : 'bg-cyber-accent/15 border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/30'
                                }
                              `}
                            >
                              <span>{isEditing ? '💾 Save & View' : '✏️ Edit Content'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Scaling viewport wrapper */}
                        <div 
                          className="w-full flex justify-center overflow-auto custom-scrollbar transition-all duration-300 rounded-2xl bg-cyber-darker/10 p-4 border border-white/3"
                          style={{ 
                            height: `${scaledHeight + 32}px`, 
                            minHeight: `${scaledHeight + 32}px` 
                          }}
                        >
                          <div 
                            style={{ 
                              transform: `scale(${scaleValue})`, 
                              transformOrigin: 'top center', 
                              width: '794px', 
                              minHeight: `${a4Height}px`,
                              height: 'fit-content'
                            }}
                            className="flex flex-col text-left shrink-0"
                          >
                            <div 
                              ref={previewA4Ref}
                              className={`${cleanedCardClass} w-full h-full min-h-[1123px] rounded-2xl`}
                            >
                              
                              {/* Preview Header Details */}
                              <div className="text-center border-b border-white/10 pb-6 mb-6">
                                <h2 className={styles.headerName}>
                                  {resumeToShow?.name || 'CANDIDATE NAME'}
                                </h2>
                                <div className={styles.headerLinks}>
                                  <span>{resumeToShow?.email || 'email@example.com'}</span>
                                  {resumeToShow?.phone && (
                                    <>
                                      <span>•</span>
                                      <span>{resumeToShow.phone}</span>
                                    </>
                                  )}
                                  {resumeToShow?.linkedin && (
                                    <>
                                      <span>•</span>
                                      <span>{resumeToShow.linkedin}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Summary */}
                              {resumeToShow?.summary && (
                                <div className="mb-6">
                                  <h4 className={styles.sectionHeader}>
                                    Professional Summary
                                  </h4>
                                  <p className={styles.textBody}>
                                    {resumeToShow.summary}
                                  </p>
                                </div>
                              )}

                              {/* Tech Skills */}
                              {resumeToShow?.skills && resumeToShow.skills.length > 0 && (
                                <div className="mb-6">
                                  <h4 className={styles.sectionHeader}>
                                    Core Tech Skills
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {resumeToShow.skills.map((s, i) => (
                                      <span key={i} className={styles.skillBadge}>
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Render all 8 body sections dynamically */}
                              {selectedTemplate === 'fresher' ? (
                                <>
                                  {renderEducation(styles)}
                                  {renderProjects(styles)}
                                  {renderInternships(styles)}
                                  {renderExperience(styles)}
                                  {renderLeadership(styles)}
                                  {renderCertifications(styles)}
                                  {renderAchievements(styles)}
                                  {renderExtracurriculars(styles)}
                                </>
                              ) : (
                                <>
                                  {renderExperience(styles)}
                                  {renderInternships(styles)}
                                  {renderProjects(styles)}
                                  {renderLeadership(styles)}
                                  {renderCertifications(styles)}
                                  {renderAchievements(styles)}
                                  {renderExtracurriculars(styles)}
                                  {renderEducation(styles)}
                                </>
                              )}

                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>
            )}

          </div>
        )}

        {/* Tab Content 3: PRO WRITING TOOLS */}
        {activeTab === 'tools' && (
          <div className="relative">
            {!isPremium && (
              <div className="absolute inset-0 bg-cyber-darker/95 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-white/5 min-h-[400px]">
                <Lock className="w-12 h-12 text-cyber-accent mb-4 animate-float" />
                <h3 className="text-xl font-extrabold text-white">AI Writing Tools Locked</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm mb-6 leading-relaxed">
                  Upgrade to Pro Prep Master to unlock AI bullet enhancements, auto cover letters, and PDF export templates!
                </p>
                <button
                  onClick={() => setIsPremium(true)}
                  className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-md shadow-cyber-accent/25"
                >
                  Unlock Pro Workspace ($19)
                </button>
              </div>
            )}

            {/* Writing Tools Global Parameter Override */}
            <div className="bg-white/2 border border-white/5 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-cyber-accentGlow filter blur-[80px] pointer-events-none -z-10"></div>
              <div>
                <span className="text-[10px] font-bold text-cyber-neon tracking-widest uppercase block mb-1">
                  AI Model Parameter Control
                </span>
                <h4 className="text-sm font-extrabold text-white leading-none">
                  Adjust Generation Entropy (Randomness)
                </h4>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto max-w-sm">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider shrink-0">Compliance</span>
                <input 
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-32 sm:w-40 accent-cyber-neon h-1 bg-white/10 rounded-full appearance-none cursor-pointer shrink-0"
                />
                <span className="text-[9px] text-cyber-accent font-bold uppercase tracking-wider shrink-0">Creativity</span>
                <span className="bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon font-mono px-2 py-0.5 rounded text-[10px] shrink-0">
                  {temperature}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Bullet Enhancer & Cover Letter Builder */}
              <div className="flex flex-col gap-6">
                
                {/* AI Bullet Enhancer */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <Wand2 className="w-4 h-4 text-cyber-accent animate-pulse" />
                    AI Bullet Point Enhancer
                  </h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    Input a passive achievement bullet point (e.g., "wrote frontend javascript code") and let the AI rewrite it using active power verbs and the STAR structure.
                  </p>

                  <div className="flex flex-col gap-3 mt-1">
                    <textarea
                      placeholder="e.g. Worked on database migrations..."
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      className="glass-input min-h-[80px] text-xs resize-none"
                    />
                    
                    <button
                      onClick={handleEnhanceBullet}
                      disabled={enhancingBullet || !bulletInput.trim()}
                      className="bg-cyber-accent/15 border border-cyber-accent/25 hover:bg-cyber-accent hover:text-white text-cyber-accent font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {enhancingBullet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      Enhance Bullet Point
                    </button>
                  </div>

                  {enhancedBullet && (
                    <div className="bg-white/2 border border-cyber-accent/20 p-4 rounded-xl text-xs leading-relaxed text-gray-300 relative mt-2 flex flex-col gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-cyber-accent block uppercase mb-1">
                          AI OPTIMIZED STAR STATEMENT:
                        </span>
                        <p className="font-medium text-gray-200">{enhancedBullet}</p>
                      </div>

                      {aiConfidence && (
                        <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-1">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">AI Quality Assured</span>
                          <span className="text-[10px] text-cyber-jade font-black font-mono bg-cyber-jade/10 px-2 py-0.5 rounded border border-cyber-jade/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-cyber-jade shrink-0" />
                            {aiConfidence}% Match
                          </span>
                        </div>
                      )}

                      <button 
                        onClick={() => { navigator.clipboard.writeText(enhancedBullet); alert('Copied to clipboard!'); }}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white"
                        title="Copy Statement"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Cover Letter Generator */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <FileText className="w-4 h-4 text-cyber-neon shrink-0" />
                    Cover Letter Generator
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Google"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="glass-input py-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        Target Job Title
                      </label>
                      <input
                        type="text"
                        placeholder={targetRole}
                        value={coverRole}
                        onChange={(e) => setCoverRole(e.target.value)}
                        className="glass-input py-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        Writing Tone
                      </label>
                      <select
                        value={selectedCoverTone}
                        onChange={(e) => setSelectedCoverTone(e.target.value)}
                        className="glass-input py-2 text-xs cursor-pointer bg-cyber-dark"
                      >
                        <option value="Professional" className="bg-cyber-darker text-gray-200">Professional</option>
                        <option value="Corporate" className="bg-cyber-darker text-gray-200">Corporate</option>
                        <option value="Friendly" className="bg-cyber-darker text-gray-200">Friendly</option>
                        <option value="Startup" className="bg-cyber-darker text-gray-200">Startup</option>
                        <option value="Formal" className="bg-cyber-darker text-gray-200">Formal</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateCover}
                    disabled={generatingLetter || !companyName.trim() || !coverRole.trim()}
                    className="bg-cyber-neon/15 border border-cyber-neon/25 hover:bg-cyber-neon hover:text-cyber-darker text-cyber-neon font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                  >
                    {generatingLetter ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Generate Cover Letter
                  </button>

                  {generatedLetter && (
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs font-mono leading-relaxed text-gray-400 relative whitespace-pre-wrap">
                        <p>{generatedLetter}</p>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button 
                            onClick={() => { navigator.clipboard.writeText(generatedLetter); alert('Copied Cover Letter!'); }}
                            className="p-1 text-gray-500 hover:text-white transition"
                            title="Copy Cover Letter"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={handlePrintCoverLetter}
                            className="p-1 text-gray-500 hover:text-white transition"
                            title="Print Cover Letter"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handlePrintCoverLetter}
                        className="w-full bg-white/5 border border-white/10 hover:border-cyber-accent text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        Print & Save PDF Cover Letter
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Auto Project description */}
              <div className="flex flex-col gap-6">
                
                {/* Auto Project Builder */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <FileSpreadsheet className="w-4 h-4 text-cyber-jade shrink-0" />
                    Auto Project Desc Generator
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        Project Topic
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chat App"
                        value={projectTopic}
                        onChange={(e) => setProjectTopic(e.target.value)}
                        className="glass-input py-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        Tech Stack
                      </label>
                      <input
                        type="text"
                        placeholder="React, Socket.io"
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        className="glass-input py-2 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateProject}
                    disabled={generatingProj || !projectTopic.trim() || !projectTech.trim()}
                    className="bg-cyber-jade/15 border border-cyber-jade/25 hover:bg-cyber-jade hover:text-white text-cyber-jade font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                  >
                    {generatingProj ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Generate Project Bullet Points
                  </button>

                  {generatedProj && (
                    <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs font-mono leading-relaxed text-gray-400 relative mt-2 whitespace-pre-wrap">
                      <p>{generatedProj}</p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(generatedProj); alert('Copied Project Description!'); }}
                        className="absolute top-2 right-2 p-1 text-gray-600 hover:text-white"
                        title="Copy project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
      <SubscriptionModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        initialTab="resume" 
      />
    </PageWrapper>
  );
}

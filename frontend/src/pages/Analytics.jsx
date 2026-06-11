import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  LineChart, 
  Award, 
  Mic, 
  AlertTriangle, 
  Briefcase, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  FileText,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accordion toggle
  const [openSession, setOpenSession] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const [statsRes, historyRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/user`, config),
          axios.get(`${API_URL}/interview/history`, config)
        ]);
        
        setStats(statsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error('Failed to load performance metrics:', err);
        setError('System database sync failed. Verify your server node is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <Loader2 className="w-12 h-12 text-cyber-accent animate-spin" />
        <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
          Loading preparation metrics console...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-red-500/20 text-center my-12 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-white">Metrics Database Offline</h3>
          <p className="text-gray-400 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-white/5 border border-white/10 hover:border-cyber-accent hover:bg-cyber-accent/5 px-6 py-2 rounded-xl text-gray-300 font-semibold transition">
            Retry Connection
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Fallback metrics for Radar visualization if no mock interviews exist
  const defaultRadarData = [
    { subject: 'Technical Depth', A: 70, fullMark: 100 },
    { subject: 'Communication', A: 65, fullMark: 100 },
    { subject: 'Vocal Clarity', A: 60, fullMark: 100 },
    { subject: 'Confidence', A: 75, fullMark: 100 },
    { subject: 'Grammar', A: 80, fullMark: 100 },
    { subject: 'Behavioral', A: 68, fullMark: 100 },
  ];

  // Map category ratings for Bar Chart
  const categoryData = stats.categoryAverages.map(c => ({
    name: c.category,
    Score: c.score
  }));

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="text-left">
          <span className="text-xs font-bold text-cyber-neon tracking-widest uppercase block mb-2">
            Placement readiness indicators
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Performance logs & matrices
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Deep-dive audits into your vocal accuracy, behavioral structure, and interview question history transcripts.
          </p>
        </div>

        {/* Visual split: Radar & Category bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Radar skill matrix */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white text-left">Pillar Skill metrics</h3>
            
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={defaultRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.03)" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" fontSize={9} />
                  <Radar name="Hiring Readiness" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category score averages bar chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-lg text-white text-left">Category score averages</h3>
            
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '13px' }}
                  />
                  <Bar dataKey="Score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Lower block: Historic Session transcripts accordions */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 text-left">
          <h3 className="font-extrabold text-lg text-white border-b border-white/5 pb-4 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cyber-neon" />
            Completed transcripts archives
          </h3>

          {history.length > 0 ? (
            <div className="flex flex-col gap-4">
              {history.map((session, sIdx) => {
                const isOpen = openSession === session._id;
                return (
                  <div key={session._id} className="border border-white/5 rounded-2xl overflow-hidden bg-white/2">
                    
                    {/* Header trigger */}
                    <div 
                      onClick={() => setOpenSession(isOpen ? null : session._id)}
                      className="p-5 flex justify-between items-center cursor-pointer select-none bg-white/2 hover:bg-white/5 transition"
                    >
                      <div className="overflow-hidden mr-2">
                        <h4 className="font-bold text-white text-sm truncate">
                          {session.jobRole} ({session.difficulty})
                        </h4>
                        <span className="text-[10px] text-gray-500 font-bold block mt-1 uppercase">
                          Type: {session.interviewType} • {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="bg-cyber-accent/15 border border-cyber-accent/25 text-cyber-accent font-black text-sm w-10 h-10 rounded-full flex items-center justify-center">
                          {session.overallScore}
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {/* Accordioned Content block */}
                    {isOpen && (
                      <div className="p-6 border-t border-white/5 flex flex-col gap-6 text-left bg-black/20">
                        
                        {/* Summary breakdown logs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-3">
                            <div>
                              <span className="text-[10px] font-bold text-gray-500 block uppercase">Vocal Communication Clarity</span>
                              <p className="text-xs text-gray-300 bg-white/2 p-3 rounded-xl border border-white/5 mt-1">{session.evaluationSummary.communication}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-500 block uppercase">Technical Depth</span>
                              <p className="text-xs text-gray-300 bg-white/2 p-3 rounded-xl border border-white/5 mt-1">{session.evaluationSummary.technicalAccuracy}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div>
                              <span className="text-[10px] font-bold text-gray-500 block uppercase">Grammar & Phrasings fixes</span>
                              <p className="text-xs text-gray-300 bg-white/2 p-3 rounded-xl border border-white/5 mt-1">{session.evaluationSummary.grammarSuggestions}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-500 block uppercase">Behavioral Guidelines</span>
                              <p className="text-xs text-gray-300 bg-white/2 p-3 rounded-xl border border-white/5 mt-1">{session.evaluationSummary.behavioralTips}</p>
                            </div>
                          </div>
                        </div>

                        {/* Individual Questions transcript loops */}
                        <div className="border-t border-white/5 pt-5">
                          <span className="text-[10px] font-bold text-cyber-neon uppercase tracking-widest block mb-4">
                            Step Conversational Transcripts
                          </span>
                          
                          <div className="flex flex-col gap-4">
                            {session.questions.map((q, qIdx) => (
                              <div key={qIdx} className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
                                <div>
                                  <span className="text-[9px] font-black text-cyber-accent block uppercase">Interviewer Q{qIdx + 1}:</span>
                                  <p className="text-xs text-white font-semibold leading-relaxed mt-0.5">{q.questionText}</p>
                                </div>
                                <div className="bg-cyber-darker p-3 rounded-xl border border-white/5">
                                  <span className="text-[9px] font-black text-cyber-neon block uppercase">My Answer:</span>
                                  <p className="text-xs text-gray-400 italic leading-relaxed mt-0.5">"{q.userAnswer}"</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                                  <div className="bg-cyber-jade/5 p-3 rounded-xl border border-cyber-jade/10">
                                    <span className="text-[9px] font-black text-cyber-jade uppercase block">AI ideal response:</span>
                                    <p className="text-gray-300 mt-0.5">{q.idealAnswer}</p>
                                  </div>
                                  <div className="bg-white/2 p-3 rounded-xl border border-white/5">
                                    <span className="text-[9px] font-black text-cyber-gold uppercase block">AI response critiques (Score: {q.score}/10):</span>
                                    <p className="text-gray-400 mt-0.5">{q.feedback}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/2 p-10 rounded-2xl text-center border border-white/5">
              <History className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <span className="text-sm text-gray-400 font-bold block mb-1">No completed transcripts found</span>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-normal mt-1">
                Complete a mock session setup to compile full AI score evaluations!
              </p>
            </div>
          )}

        </div>

      </div>
    </PageWrapper>
  );
}

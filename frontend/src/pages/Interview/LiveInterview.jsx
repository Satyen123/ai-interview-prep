import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../../store/interviewStore';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Clock, 
  AlertCircle, 
  Loader2, 
  FileText,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  LogOut,
  Infinity,
  Activity,
  Download,
  Copy,
  Check
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

// Real-Time Collapsible AI Feedback Card Component
function FeedbackCard({ question }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!question.userAnswer || question.userAnswer === 'Skipped' || question.score === undefined || question.score === 0) return null;

  return (
    <div className="mt-3.5 bg-black/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none bg-white/2 hover:bg-white/5 px-4 py-3 border-b border-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
            question.score >= 8 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            question.score >= 5 ? 'bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            Score: {question.score.toFixed(1)} / 10
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyber-neon flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
            AI Real-Time Evaluation
          </span>
        </div>
        <span className="text-xs font-bold text-gray-500 hover:text-gray-300 transition flex items-center gap-1">
          {isOpen ? (
            <>Collapse Critique <ChevronUp className="w-4 h-4 shrink-0" /></>
          ) : (
            <>Expand Critique <ChevronDown className="w-4 h-4 shrink-0" /></>
          )}
        </span>
      </div>

      {isOpen && (
        <div className="p-4 flex flex-col gap-4 text-xs md:text-sm animate-fadeIn">
          {/* Feedback Description */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Recruiter Impression</span>
            <p className="text-gray-300 leading-relaxed font-sans">{question.feedback}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Strengths */}
            {question.strengths && question.strengths.length > 0 ? (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl flex flex-col gap-2 text-left">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> Key Strengths
                </span>
                <ul className="flex flex-col gap-1.5 pl-0">
                  {question.strengths.map((str, idx) => (
                    <li key={idx} className="text-gray-300 text-xs pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-500">
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl text-left">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Key Strengths
                </span>
                <p className="text-gray-400 text-xs mt-1">Foundational conceptual alignment verified.</p>
              </div>
            )}

            {/* Weaknesses */}
            {question.weaknesses && question.weaknesses.length > 0 ? (
              <div className="bg-red-500/5 border border-red-500/10 p-3.5 rounded-xl flex flex-col gap-2 text-left">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" /> Areas to Improve
                </span>
                <ul className="flex flex-col gap-1.5 pl-0">
                  {question.weaknesses.map((wk, idx) => (
                    <li key={idx} className="text-gray-300 text-xs pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
                      {wk}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 p-3.5 rounded-xl text-left">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 shrink-0" /> Areas to Improve
                </span>
                <p className="text-gray-400 text-xs mt-1">Response outlines basic metrics adequately.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Suggestions */}
            {question.suggestions && question.suggestions.length > 0 ? (
              <div className="bg-cyber-gold/5 border border-cyber-gold/10 p-3.5 rounded-xl flex flex-col gap-2 text-left">
                <span className="text-[10px] font-extrabold text-cyber-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 text-cyber-gold" /> Formulate Better Response
                </span>
                <ul className="flex flex-col gap-1.5 pl-0">
                  {question.suggestions.map((sug, idx) => (
                    <li key={idx} className="text-gray-300 text-xs pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-cyber-gold">
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-cyber-gold/5 border border-cyber-gold/10 p-3.5 rounded-xl text-left">
                <span className="text-[10px] font-extrabold text-cyber-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" /> Formulate Better Response
                </span>
                <p className="text-gray-400 text-xs mt-1">Structure answers using STAR metrics.</p>
              </div>
            )}

            {/* Recommended/Missing keywords pills */}
            {question.missingConcepts && question.missingConcepts.length > 0 && (
              <div className="bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl flex flex-col gap-2 text-left">
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-400" /> Recommended Keywords
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {question.missingConcepts.map((con, idx) => (
                    <span key={idx} className="bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {con}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Model Ideal Answer */}
          {question.idealAnswer && (
            <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-left">
              <span className="text-[10px] font-extrabold text-cyber-neon uppercase tracking-widest block mb-1">Model High-Impact Answer</span>
              <p className="text-gray-300 italic leading-relaxed text-xs font-sans">{question.idealAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LiveInterview() {
  const { 
    activeInterview, 
    submitUserAnswer, 
    loading, 
    error, 
    successSynthesis, 
    resumeSession, 
    endSessionImmediately,
    resetStore
  } = useInterviewStore();
  
  const navigate = useNavigate();

  const [answerText, setAnswerText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState(0);
  const [ttsReading, setTtsReading] = useState(false);
  const [micError, setMicError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const timelineEndRef = useRef(null);

  // Markdown Export Report Helper
  const generateMarkdownReport = (synthesis) => {
    if (!synthesis) return '';
    let md = `# AI Interview Evaluation Report\n\n`;
    md += `**Role:** ${synthesis.jobRole}\n`;
    md += `**Difficulty:** ${synthesis.difficulty}\n`;
    md += `**Type:** ${synthesis.interviewType}\n`;
    md += `**Overall Score:** ${synthesis.overallScore} / 10\n\n`;
    
    md += `## Evaluation Summary\n\n`;
    md += `### Communication & Clarity\n${synthesis.evaluationSummary?.communication || 'N/A'}\n\n`;
    md += `### Technical Accuracy & Depth\n${synthesis.evaluationSummary?.technicalAccuracy || 'N/A'}\n\n`;
    md += `### Grammar & Phrasings\n${synthesis.evaluationSummary?.grammarSuggestions || 'N/A'}\n\n`;
    md += `### Behavioral & Strategic Alignment\n${synthesis.evaluationSummary?.behavioralTips || 'N/A'}\n\n`;
    
    md += `## Question & Answer Transcripts\n\n`;
    synthesis.questions.forEach((q, idx) => {
      md += `### Question ${idx + 1}: ${q.questionText}\n`;
      md += `**Your Answer:** *${q.userAnswer || 'Skipped'}*\n\n`;
      md += `**AI Response Critique (Score: ${q.score || 0}/10):**\n${q.feedback || 'N/A'}\n\n`;
      if (q.strengths && q.strengths.length > 0) {
        md += `*Key Strengths:*\n`;
        q.strengths.forEach(str => md += `- ${str}\n`);
        md += `\n`;
      }
      if (q.weaknesses && q.weaknesses.length > 0) {
        md += `*Areas to Improve:*\n`;
        q.weaknesses.forEach(wk => md += `- ${wk}\n`);
        md += `\n`;
      }
      if (q.idealAnswer) {
        md += `**AI High-Impact Ideal Answer:**\n> ${q.idealAnswer}\n\n`;
      }
      md += `---\n\n`;
    });
    return md;
  };

  const handleDownloadMarkdown = () => {
    if (!successSynthesis) return;
    const mdText = generateMarkdownReport(successSynthesis);
    const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_report_${successSynthesis.jobRole.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    if (!successSynthesis) return;
    const mdText = generateMarkdownReport(successSynthesis);
    navigator.clipboard.writeText(mdText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Session Persistence: Attempt Auto-Resume on Mount
  useEffect(() => {
    const initSession = async () => {
      if (!activeInterview && !successSynthesis) {
        const resumed = await resumeSession();
        if (!resumed) {
          navigate('/interview-setup');
        }
      }
    };
    initSession();
  }, []);

  // Update current active index based on questions length
  useEffect(() => {
    if (activeInterview) {
      setCurrentQuestionIndex(activeInterview.questions.length - 1);
    }
  }, [activeInterview]);

  // Handle Question timers
  useEffect(() => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    // Auto-read question on load
    if (activeInterview) {
      const activeQ = activeInterview.questions[activeInterview.questions.length - 1];
      if (activeQ) {
        handleSpeak(activeQ.questionText);
      }
    }

    // Scroll timeline to bottom
    scrollToBottom();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!activeInterview) {
    if (loading) {
      return (
        <PageWrapper>
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyber-neon" />
            <p className="text-gray-400 text-sm font-bold animate-pulse">Launching virtual mock assessment session...</p>
          </div>
        </PageWrapper>
      );
    }
    return null;
  }

  const activeQuestion = activeInterview.questions[currentQuestionIndex];

  // 2. Browser Text-to-Speech (TTS)
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Stop any active speaker
    const cleanText = text.replace(/\(Simulated.*\)/g, '').replace(/\[.*\]/g, ''); // strip meta
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Natural'));
    if (googleVoice) utterance.voice = googleVoice;
    
    utterance.onstart = () => setTtsReading(true);
    utterance.onend = () => setTtsReading(false);
    utterance.onerror = () => setTtsReading(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeakingText = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTtsReading(false);
    }
  };

  // 3. Browser Speech-to-Text (STT) - Web Speech API
  const handleToggleListening = () => {
    setMicError('');

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Speech Recognition is not supported by your current browser. Try Chrome or Safari.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        handleStopSpeakingText();
      };

      rec.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setAnswerText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript.trim());
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please check your browser Settings.');
        } else {
          setMicError(`Mic Error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setMicError('Failed to initialize speech engine.');
      setIsListening(false);
    }
  };

  // 4. Submit Question Response (standard progression)
  const handleSubmit = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (!answerText.trim()) {
      setMicError('Please record or type an answer before submitting.');
      return;
    }

    handleStopSpeakingText();

    const result = await submitUserAnswer(answerText, timer, false);
    
    if (result === 'completed') {
      // Stay on page to display synthesis evaluation report details
    } else if (result === 'next') {
      setAnswerText('');
      scrollToBottom();
    }
  };

  // 5. Complete Interview Synthesis immediately
  const handleEndInterview = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    handleStopSpeakingText();

    // Check if user has text written. If so, evaluate that final response, otherwise just end.
    let result;
    if (answerText.trim() !== '') {
      result = await submitUserAnswer(answerText, timer, true);
    } else {
      result = await endSessionImmediately();
    }

    if (result === 'completed') {
      // Stay on page to display synthesis evaluation report details
    }
  };

  // 6. In-Session Hot controls
  const handleDifficultyAdjust = async (direction) => {
    let newDiff = activeInterview.difficulty;
    const tiers = ['Beginner', 'Intermediate', 'Advanced', 'FAANG', 'Expert'];
    const idx = tiers.indexOf(newDiff);
    
    if (direction === 'up' && idx < tiers.length - 1) {
      newDiff = tiers[idx + 1];
    } else if (direction === 'down' && idx > 0) {
      newDiff = tiers[idx - 1];
    } else {
      return; // Already at bounds
    }

    activeInterview.difficulty = newDiff;
    setMicError(`Difficulty adjusted to [${newDiff}] for the upcoming question!`);
    setTimeout(() => setMicError(''), 4000);
  };

  const handleSwitchTopic = () => {
    if (window.confirm("Switching topic will reset your active interview history. Do you want to return to Setup?")) {
      handleStopSpeakingText();
      localStorage.removeItem('active_interview_id');
      navigate('/interview-setup');
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // RENDER EVALUATION SUMMARY ON SUCCESS SYNTHESIS
  if (successSynthesis) {
    return (
      <PageWrapper>
        <div className="w-full max-w-none flex flex-col gap-6 pb-20 px-4 md:px-8 xl:px-12 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/2 border border-white/5 px-6 py-6 rounded-2xl gap-4">
            <div>
              <span className="text-xs font-black bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full tracking-widest uppercase border border-emerald-500/20">
                Evaluation Complete
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">
                Session Performance Synthesis
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {successSynthesis.interviewType} • {successSynthesis.jobRole} ({successSynthesis.difficulty})
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center bg-cyber-accent/15 border border-cyber-accent/25 px-5 py-3 rounded-2xl">
                <span className="text-[10px] font-black text-cyber-accent uppercase tracking-wider">Overall Score</span>
                <span className="text-3xl font-black text-white">{successSynthesis.overallScore} <span className="text-xs text-gray-400">/ 10</span></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-extrabold text-sm text-cyber-neon uppercase tracking-wider">Communication & Technical Depth</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Communication Clarity</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{successSynthesis.evaluationSummary?.communication}</p>
                </div>
                <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Technical Accuracy</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{successSynthesis.evaluationSummary?.technicalAccuracy}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-extrabold text-sm text-cyber-neon uppercase tracking-wider">Phrasing Suggestions & Behavioral Alignment</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Grammar & Phrasings</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{successSynthesis.evaluationSummary?.grammarSuggestions}</p>
                </div>
                <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Behavioral Tips</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{successSynthesis.evaluationSummary?.behavioralTips}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-cyber-neon uppercase tracking-wider border-b border-white/5 pb-3">Detailed Question Breakdown</h3>
            <div className="flex flex-col gap-4">
              {successSynthesis.questions.map((q, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-black text-purple-400 block uppercase">Question {idx + 1}:</span>
                    <p className="text-xs text-white font-semibold leading-relaxed mt-0.5">{q.questionText}</p>
                  </div>
                  <div className="bg-cyber-darker p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black text-cyan-400 block uppercase">Your Answer:</span>
                    <p className="text-xs text-gray-400 italic leading-relaxed mt-0.5">"{q.userAnswer}"</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      <span className="text-[10px] font-black text-emerald-400 uppercase block">AI Recommended Response:</span>
                      <p className="text-gray-300 mt-1">{q.idealAnswer}</p>
                    </div>
                    <div className="bg-white/2 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-black text-cyber-gold uppercase block">AI Critique (Score: {q.score}/10):</span>
                      <p className="text-gray-400 mt-1">{q.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Markdown Export & Navigation Panel */}
          <div className="bg-cyber-card/65 border border-white/5 backdrop-blur-md p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-left">
              <h4 className="font-extrabold text-sm text-white">Save Evaluation Report</h4>
              <p className="text-xs text-gray-400">Download the complete assessment transcript as formatted Markdown.</p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleCopyMarkdown}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/2 hover:bg-white/5 border border-white/10 text-white font-bold px-5 py-3 rounded-xl text-xs transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-gray-400 shrink-0" />}
                {copied ? 'Copied Markdown!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/20 text-cyan-400 hover:text-white font-bold px-5 py-3 rounded-xl text-xs transition"
              >
                <Download className="w-4 h-4 shrink-0" />
                Download Markdown (.md)
              </button>
              <button
                onClick={() => {
                  resetStore();
                  navigate('/analytics');
                }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-accent to-purple-600 text-white font-black px-6 py-3 rounded-xl text-xs transition"
              >
                Practice Again
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // STANDARD MOCK ASSESSMENT SCREEN
  const totalQuestions = 5;
  const currentCount = activeInterview.questions.length;
  const progressPercent = Math.min((currentCount / totalQuestions) * 100, 100);
  const estRemainingMin = Math.max((totalQuestions - currentCount) * 5, 0);

  return (
    <PageWrapper>
      <div className="w-full max-w-none flex flex-col gap-6 pb-20 px-4 md:px-8 xl:px-12">
        
        {/* Cockpit Stats Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/2 border border-white/5 px-6 py-4 rounded-2xl gap-3">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black bg-cyber-neon/15 text-cyber-neon px-3 py-1 rounded-full tracking-widest uppercase flex items-center gap-1.5 border border-cyber-neon/20">
                <Infinity className="w-3.5 h-3.5 shrink-0 text-cyber-neon animate-pulse" />
                Continuous Mode
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase">
                Question #{activeInterview.questions.length}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-bold uppercase truncate max-w-sm">
              {activeInterview.interviewType} • {activeInterview.jobRole} ({activeInterview.difficulty})
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Personality style badge */}
            <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              Interviewer: {activeInterview.interviewerStyle || 'Friendly'}
            </span>

            {/* Remaining Time Badge */}
            <div className="flex items-center gap-2 text-cyber-gold font-bold text-sm bg-cyber-gold/5 border border-cyber-gold/20 px-3.5 py-1.5 rounded-xl" title="Estimated time to complete remaining questions">
              <Clock className="w-4 h-4 shrink-0 animate-pulse" />
              <span>Est. Remaining: ~{estRemainingMin}m</span>
            </div>

            {/* Timer clock */}
            <div className="flex items-center gap-2 text-white/70 font-bold text-sm bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTimer(timer)}</span>
            </div>
          </div>
        </div>

        {/* Elegant Progress bar & indicators */}
        <div className="flex flex-col gap-2 bg-white/2 border border-white/5 px-6 py-4.5 rounded-2xl text-left">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
            <span>Progress track</span>
            <span>Question {currentCount} of {totalQuestions}</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className="h-full bg-gradient-to-r from-cyber-accent to-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Q&A Chat Timeline */}
        <div className="glass-panel p-4 md:p-6 rounded-3xl border border-white/5 min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col gap-6 custom-scrollbar">
          {activeInterview.questions.map((q, idx) => {
            const isAnswered = q.userAnswer && q.userAnswer.trim() !== '';
            const isQActive = idx === currentQuestionIndex;

            return (
              <div key={idx} className="flex flex-col gap-4">
                
                {/* AI Question Bubble */}
                <div className="flex items-start gap-3 text-left">
                  <div className="bg-purple-500/20 text-purple-300 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border border-purple-500/20 shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="bg-purple-950/20 border border-purple-500/10 rounded-2xl rounded-tl-none p-4 max-w-[85%] text-gray-200 shadow-md">
                    <p className="leading-relaxed font-sans text-xs md:text-sm">{q.questionText}</p>
                    
                    {/* Speak question trigger (only for active question or standard reading) */}
                    <div className="mt-2.5 flex items-center">
                      <button
                        onClick={() => handleSpeak(q.questionText)}
                        className="text-[10px] text-purple-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" /> Play Sound
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Answer Bubble */}
                {isAnswered && (
                  <div className="flex items-start gap-3 justify-end text-right">
                    <div className="bg-cyber-neon/15 border border-cyber-neon/15 rounded-2xl rounded-tr-none p-4 max-w-[85%] text-left text-gray-200 shadow-md">
                      <span className="text-[9px] font-black text-cyber-neon uppercase tracking-wider block mb-1">Your response</span>
                      <p className="leading-relaxed font-sans text-xs md:text-sm">{q.userAnswer}</p>
                      
                      {/* Mount Instant collapsible AI feedback cards under bubble */}
                      <FeedbackCard question={q} />
                    </div>
                    <div className="bg-cyber-neon/20 text-cyber-neon w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border border-cyber-neon/25 shrink-0 mt-0.5">
                      ME
                    </div>
                  </div>
                )}

              </div>
            );
          })}

          {/* Blinking loader typing indicator when formulating questions */}
          {loading && (
            <div className="flex items-start gap-3 text-left animate-pulse">
              <div className="bg-purple-500/20 text-purple-300 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border border-purple-500/20 shrink-0">
                AI
              </div>
              <div className="bg-purple-950/15 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-300"></span>
                <span className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">AI Recruiter is thinking...</span>
              </div>
            </div>
          )}

          <div ref={timelineEndRef} />
        </div>

        {/* Dynamic User Recording Cockpit Input Box */}
        <div className="glass-panel p-5 md:p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left relative shadow-2xl">
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-cyber-neon uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
              Active Response Console
            </span>
            <span className="text-xs text-gray-500 font-bold">
              Speech-to-Text or Type manually
            </span>
          </div>

          {/* Visual Voice Waveform when speaking */}
          {isListening && (
            <div className="flex items-center gap-1.5 justify-center py-4 bg-cyber-neon/5 rounded-2xl border border-cyber-neon/20 animate-pulse">
              <span className="w-1.5 h-6 rounded-full bg-cyber-neon animate-[pulse_1s_infinite] delay-100"></span>
              <span className="w-1.5 h-10 rounded-full bg-cyber-neon animate-[pulse_1s_infinite] delay-200"></span>
              <span className="w-1.5 h-12 rounded-full bg-cyber-neon animate-[pulse_1s_infinite] delay-300"></span>
              <span className="w-1.5 h-8 rounded-full bg-cyber-neon animate-[pulse_1s_infinite] delay-400"></span>
              <span className="w-1.5 h-4 rounded-full bg-cyber-neon animate-[pulse_1s_infinite] delay-500"></span>
              <span className="text-xs font-bold text-cyber-neon tracking-wider uppercase ml-3 animate-pulse">
                STT Transcription Engine Listening...
              </span>
            </div>
          )}

          {/* Core Text Input */}
          <div className="relative">
            <textarea
              placeholder="Record your voice or start typing your answer here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full min-h-[120px] bg-cyber-darker text-white p-4 rounded-2xl border border-white/10 outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent/30 transition-all duration-300 resize-none font-sans leading-relaxed text-xs md:text-sm placeholder-gray-600"
            />
          </div>

          {/* Interactive alert / feedback box */}
          {micError && (
            <div className="flex items-center gap-3 bg-cyber-neon/5 border border-cyber-neon/20 text-cyber-neon p-4 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-4">
            
            {/* Mic trigger */}
            <button
              onClick={handleToggleListening}
              className={`
                w-full sm:w-auto flex items-center justify-center gap-2 border px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 select-none
                ${isListening 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
                  : 'bg-cyber-neon/15 border-cyber-neon/25 text-cyber-neon hover:bg-cyber-neon hover:text-cyber-darker shadow-md shadow-cyber-neon/10'
                }
              `}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 shrink-0 animate-pulse" />
                  Stop Voice Capture
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 shrink-0" />
                  Capture My Voice
                </>
              )}
            </button>

            {/* Standard Progression & Submit */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Skip or Generate next */}
              <button
                onClick={handleSubmit}
                disabled={loading || !answerText.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-accent to-purple-600 text-white font-bold px-6 py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/25 transition-all disabled:opacity-50 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Answer...
                  </>
                ) : (
                  <>
                    <span>Submit & Get Next Question</span>
                    <Send className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Floating Quick Continuous Mock Controllers Panel */}
        <div className="bg-cyber-card/65 border border-white/5 backdrop-blur-md p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          
          {/* Left section: Switch topic */}
          <button
            onClick={handleSwitchTopic}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/2 hover:bg-white/5 border border-white/5 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition"
          >
            <Compass className="w-4 h-4 text-cyber-accent shrink-0" />
            Switch Topic
          </button>

          {/* Middle section: adjust difficulty in place */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-black/45 px-4 py-2 rounded-xl border border-white/5 w-full sm:w-auto select-none">
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider shrink-0">Difficulty:</span>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => handleDifficultyAdjust('down')}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-xs font-black text-gray-300 transition cursor-pointer"
                title="Decrease Difficulty"
              >
                ◀
              </button>
              <span className="text-xs font-black text-cyber-jade uppercase tracking-widest min-w-[50px] text-center">{activeInterview.difficulty}</span>
              <button 
                onClick={() => handleDifficultyAdjust('up')}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-xs font-black text-gray-300 transition cursor-pointer"
                title="Increase Difficulty"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Right section: End Interview synthesis trigger */}
          <button
            onClick={handleEndInterview}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/25 px-5 py-3 rounded-xl text-xs font-extrabold text-red-400 hover:text-white transition shadow-lg shadow-red-500/5 hover:shadow-red-500/20 hover:scale-[1.01] shrink-0"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            End & Analyze Session
          </button>

        </div>

      </div>
    </PageWrapper>
  );
}

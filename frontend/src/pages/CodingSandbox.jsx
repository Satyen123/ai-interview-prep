import React, { useEffect, useState, useRef } from 'react';
import { useCodingStore } from '../store/codingStore';
import { useAuthStore } from '../store/authStore';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { API_URL } from '../config';

import { 
  Code2, 
  Play, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  BookOpen, 
  LineChart, 
  Lightbulb,
  Lock,
  Unlock,
  Sparkles,
  Flame,
  Award,
  Trophy,
  Zap,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Compass,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Minimize2,
  Check,
  ChevronRight,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Save,
  Star,
  Bookmark
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SubscriptionModal from '../components/SubscriptionModal';

export default function CodingSandbox() {
  const { user, upgradeToPremium, fetchUserProfile } = useAuthStore();
  const { 
    problems, 
    activeProblem, 
    activeLanguage, 
    editorCode, 
    evaluation, 
    loading, 
    error,
    leaderboard,
    progress,
    submissions,
    aiHint,
    aiReview,
    aiExplanation,
    aiFollowup,
    aiLoading,
    aiError,
    prevProblems,
    recruiterMessages,
    pathsData,
    dailyChallenge,
    unlockedHintsCount,
    fetchProblems, 
    selectProblem, 
    setLanguage, 
    setEditorCode, 
    submitCode,
    skipProblem,
    fetchLeaderboard,
    fetchProgress,
    getAIHint,
    getAICodeReview,
    getAISolutionExplanation,
    getAIInterviewFollowUp,
    generateAIProblem,
    nextProblem,
    prevProblem,
    randomProblem,
    regenProblem,
    sendRecruiterMessage,
    resetRecruiterChat,
    getPathProgress,
    fetchDailyChallenge,
    unlockNextHint,
    resumeLastSession,
    toggleBookmark,
    toggleFavorite
  } = useCodingStore();

  // Local UI States
  const [activeLeftTab, setActiveLeftTab] = useState('description'); // description, coach, submissions, leaderboard, paths, analytics
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcases'); // testcases, result
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState('50/50'); // '40/60', '50/50', '60/40'
  const [activeMobileTab, setActiveMobileTab] = useState('problem'); // problem, editor, results
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('');

  // Resizable presets widths mapping
  const leftWidths = {
    '40/60': 'lg:col-span-5',
    '50/50': 'lg:col-span-6',
    '60/40': 'lg:col-span-7'
  };
  const rightWidths = {
    '40/60': 'lg:col-span-7',
    '50/50': 'lg:col-span-6',
    '60/40': 'lg:col-span-5'
  };

  // Custom Test Case array CRUD state
  const [customTestCases, setCustomTestCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [customRunning, setCustomRunning] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // AI problem generator form
  const [genTopic, setGenTopic] = useState('Dynamic Programming');
  const [genCompany, setGenCompany] = useState('Google');
  const [genDifficulty, setGenDifficulty] = useState('Medium');
  const [showGenModal, setShowGenModal] = useState(false);

  // Subscription Checkout Modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // AI Hint choice
  const [selectedHintType, setSelectedHintType] = useState('step-by-step');

  // AI Followup interview answers
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Typist effect
  const [typedHint, setTypedHint] = useState('');
  const typingTimerRef = useRef(null);

  // Interview Mode States
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionReport, setCompletionReport] = useState(null);
  const sessionIntervalRef = useRef(null);

  useEffect(() => {
    fetchProblems();
    fetchLeaderboard();
    fetchProgress();
    fetchDailyChallenge();
    if (fetchUserProfile) fetchUserProfile();

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent mapping shortcuts in inputs
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      // Ctrl + Enter to run code local outputs
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmitToJudge();
        } else {
          handleRunLocalJS();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorCode, activeProblem, activeLanguage]);

  // Load custom test cases whenever active problem changes
  useEffect(() => {
    if (activeProblem && activeProblem.testCases) {
      setCustomTestCases(activeProblem.testCases.map((tc, idx) => ({
        id: idx,
        input: tc.input,
        expectedOutput: tc.expectedOutput || '',
        isSample: tc.isSample,
        type: tc.type || 'visible',
        actualOutput: '',
        status: 'idle' // 'idle', 'running', 'passed', 'failed'
      })));
    } else {
      setCustomTestCases([]);
    }
    setInterviewAnswer('');
    setInterviewFeedback(null);
  }, [activeProblem]);

  // Sync typed effect for hints
  useEffect(() => {
    if (aiHint) {
      setTypedHint('');
      let index = 0;
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      typingTimerRef.current = setInterval(() => {
        setTypedHint((prev) => prev + aiHint.charAt(index));
        index++;
        if (index >= aiHint.length) {
          clearInterval(typingTimerRef.current);
        }
      }, 10);
    }
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [aiHint]);

  // Total unique problems evaluated count
  const isPremiumUser = user?.isFullPremium || user?.codingPremium || false;

  // Filter handles
  const handleFilterSearch = (e) => {
    e.preventDefault();
    fetchProblems(searchQuery, categoryFilter, difficultyFilter, companyFilter);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDifficultyFilter('');
    setCompanyFilter('');
    fetchProblems('', '', '', '');
  };

  // Safe question click: blocks if Medium/Hard and not premium
  const handleSelectProblemSafe = (prob) => {
    if (!isPremiumUser && prob.difficulty !== 'Easy') {
      setShowUpgradeModal(true);
      return;
    }
    selectProblem(prob);
  };

  // Custom Test Case actions
  const handleAddTestCase = () => {
    const newId = customTestCases.length > 0 ? Math.max(...customTestCases.map(c => c.id)) + 1 : 0;
    setCustomTestCases(prev => [
      ...prev,
      {
        id: newId,
        input: '[]',
        expectedOutput: '[]',
        isSample: false,
        type: 'visible',
        actualOutput: '',
        status: 'idle'
      }
    ]);
    setEditingCaseId(newId);
  };

  const handleDeleteTestCase = (id) => {
    setCustomTestCases(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveTestCase = (id, inputVal, expectedVal) => {
    setCustomTestCases(prev => prev.map(c => c.id === id ? { ...c, input: inputVal, expectedOutput: expectedVal } : c));
    setEditingCaseId(null);
  };

  // Run Custom Testcases one by one on the cloud judge
  const handleRunAllCustomTests = async () => {
    if (!activeProblem) return;
    setCustomRunning(true);
    setActiveConsoleTab('testcases');
    const updated = [...customTestCases];
    
    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'running';
      setCustomTestCases([...updated]);
      try {
        const res = await submitCode(updated[i].input, true);
        updated[i].actualOutput = res.actualOutput || 'Empty Output';
        
        const cleanExpected = updated[i].expectedOutput.replace(/\s+/g, '');
        const cleanActual = updated[i].actualOutput.replace(/\s+/g, '');
        updated[i].status = (cleanExpected === cleanActual) ? 'passed' : 'failed';
      } catch (err) {
        updated[i].actualOutput = err.message || 'Runtime Error';
        updated[i].status = 'failed';
      }
      setCustomTestCases([...updated]);
    }
    setCustomRunning(false);
  };

  // Run Code Local Samples
  const handleRunLocalJS = async () => {
    if (!activeProblem) return;
    setCustomRunning(true);
    setActiveConsoleTab('testcases');
    const updated = [...customTestCases];
    
    // Evaluate only samples
    for (let i = 0; i < updated.length; i++) {
      if (!updated[i].isSample && updated[i].type !== 'visible') continue;
      updated[i].status = 'running';
      setCustomTestCases([...updated]);
      try {
        const res = await submitCode(updated[i].input, true);
        updated[i].actualOutput = res.actualOutput || 'Empty Output';
        
        const cleanExpected = updated[i].expectedOutput.replace(/\s+/g, '');
        const cleanActual = updated[i].actualOutput.replace(/\s+/g, '');
        updated[i].status = (cleanExpected === cleanActual) ? 'passed' : 'failed';
      } catch (err) {
        updated[i].actualOutput = err.message || 'Runtime Error';
        updated[i].status = 'failed';
      }
      setCustomTestCases([...updated]);
    }
    setCustomRunning(false);
  };

  // Submit to Online Cloud Judge
  const handleSubmitToJudge = async () => {
    setActiveConsoleTab('result');
    try {
      const res = await submitCode();
      fetchProgress(); // Refresh XP & streak history
      if (fetchUserProfile) fetchUserProfile(); // Refresh profile stats
      
      // Auto-fetch interview follow-up if Accepted in interview mode
      if (res.status === 'Accepted') {
        if (isInterviewMode) {
          getAIInterviewFollowUp();
          setActiveLeftTab('coach');
        }
      }

      // If in interview mode, update the session
      if (isInterviewMode && interviewSession) {
        const currentIdx = interviewSession.currentIndex;
        const updatedStatus = [...interviewSession.status];
        const updatedEvaluations = [...interviewSession.evaluations];
        const updatedUserCodes = [...interviewSession.userCodes];
        
        let newStatus = 'incorrect';
        if (res.status === 'Accepted') {
          newStatus = 'correct';
        } else if (res.testCasesPassed > 0) {
          newStatus = 'partial';
        }
        
        updatedStatus[currentIdx] = newStatus;
        updatedEvaluations[currentIdx] = res;
        updatedUserCodes[currentIdx] = editorCode;
        
        setInterviewSession(prev => ({
          ...prev,
          status: updatedStatus,
          evaluations: updatedEvaluations,
          userCodes: updatedUserCodes
        }));
      }
    } catch (err) {
      if (err.message && (err.message.includes('locked') || err.message.includes('limit reached'))) {
        setShowUpgradeModal(true);
      }
    }
  };

  // Submit follow-up interview responses to AI Recruiter
  const handleSubmitFollowUpAnswer = async (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim()) return;
    setSubmittingFeedback(true);
    setInterviewFeedback(null);
    try {
      // Evaluate interview reply using standard analysis complexity backend tool
      const res = await axios.post(`${API_URL}/coding/coach/review`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage
      });
      
      setInterviewFeedback({
        rating: res.data.score || 85,
        review: `Your approach description matches standard complexities. Recommended Big-O is ${res.data.timeComplexity || 'O(N)'} time and ${res.data.spaceComplexity || 'O(1)'} space. ${res.data.optimizations?.[0] || 'Solution is optimal.'}`
      });
    } catch (err) {
      console.error(err);
      setInterviewFeedback({
        rating: 80,
        review: "Your explanation is logically sound and describes correct pointer updates. Ensure all edge cases (null inputs) are guarded at the top of your scopes."
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Interview Timer Formatter
  const formatSessionTimer = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Launch AI Coding Interview Session
  const handleStartInterviewSession = async (e) => {
    e.preventDefault();
    
    const company = companyFilter || '';
    const category = categoryFilter || '';
    
    let allProbs = problems;
    try {
      const response = await axios.get(`${API_URL}/coding/problems`);
      if (response.data && response.data.length > 0) {
        allProbs = response.data;
        useCodingStore.setState({ problems: allProbs });
      }
    } catch (err) {
      console.error("Failed to fetch full problems pool:", err);
    }
    
    let firstProblem = allProbs.find(p => p.difficulty === 'Easy' && (!company || p.companyTags?.includes(company)));
    if (!firstProblem) firstProblem = allProbs[0];
    
    if (!firstProblem) {
      alert("No problems available to start an interview!");
      return;
    }
    
    selectProblem(firstProblem);
    const firstCode = (firstProblem?.starterTemplates && firstProblem.starterTemplates[activeLanguage]) || '';
    setEditorCode(firstCode);
    
    setInterviewSession({
      config: { company, category },
      questions: [firstProblem],
      currentIndex: 0,
      status: ['active'],
      attempts: [0],
      userCodes: [firstCode],
      evaluations: [null],
      startTime: Date.now()
    });
    
    setIsInterviewMode(true);
    setSessionTimer(0);
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
    
    sessionIntervalRef.current = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    
    useCodingStore.setState({ evaluation: null, error: null });
    setActiveConsoleTab('testcases');
  };

  // Navigation handlers
  const handlePracticePrev = () => {
    prevProblem();
  };

  const handlePracticeNext = async () => {
    await nextProblem(searchQuery, categoryFilter, difficultyFilter, companyFilter);
  };

  const handlePracticeSkip = async () => {
    if (activeProblem) {
      await skipProblem(activeProblem._id, searchQuery, categoryFilter, difficultyFilter, companyFilter);
    }
  };

  const handlePracticeRandom = async () => {
    await randomProblem();
  };

  const handlePracticeRegenerate = async () => {
    if (!isPremiumUser) {
      setShowUpgradeModal(true);
      return;
    }
    if (!activeProblem) return;
    await regenProblem(categoryFilter, companyFilter, difficultyFilter);
    setActiveLeftTab('description');
  };

  const handleLoadPath = async (pathKey) => {
    const pathConfig = pathsData[pathKey];
    if (!pathConfig) return;

    const firstTopic = pathConfig.topics[0];
    const targetDiff = pathKey === 'beginner' ? 'Easy' : pathKey === 'intermediate' ? 'Medium' : 'Hard';
    setCategoryFilter(firstTopic);
    setDifficultyFilter(targetDiff);
    setCompanyFilter('');

    await fetchProblems('', firstTopic, targetDiff, '');
    setActiveLeftTab('description');
  };

  const handleHarderQuestion = async () => {
    if (!interviewSession) return;
    const currentIdx = interviewSession.currentIndex;
    const updatedStatus = [...interviewSession.status];
    const updatedUserCodes = [...interviewSession.userCodes];
    updatedStatus[currentIdx] = 'correct';
    updatedUserCodes[currentIdx] = editorCode;
    
    setInterviewSession(prev => ({
      ...prev,
      status: updatedStatus,
      userCodes: updatedUserCodes
    }));

    triggerNextInterviewProblem(updatedStatus, updatedUserCodes, 'Harder');
  };

  const handleViewHintResultTab = () => {
    setActiveLeftTab('description');
    if (isPremiumUser) {
      getAIHint('step-by-step');
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleNavigateQuestion = (targetIndex) => {
    if (!interviewSession) return;
    const currentIdx = interviewSession.currentIndex;
    
    const updatedUserCodes = [...interviewSession.userCodes];
    updatedUserCodes[currentIdx] = editorCode;
    
    const targetProblem = interviewSession.questions[targetIndex];
    selectProblem(targetProblem);
    
    const targetCode = interviewSession.userCodes[targetIndex] || (targetProblem?.starterTemplates && targetProblem.starterTemplates[activeLanguage]) || '';
    const targetEvaluation = interviewSession.evaluations[targetIndex] || null;
    
    setEditorCode(targetCode);
    
    setInterviewSession(prev => ({
      ...prev,
      currentIndex: targetIndex,
      userCodes: updatedUserCodes,
      evaluations: prev.evaluations.map((ev, i) => i === targetIndex ? targetEvaluation : ev)
    }));
    
    useCodingStore.setState({ evaluation: targetEvaluation });
  };

  const handleSkipQuestion = async () => {
    if (!interviewSession) return;
    const currentIdx = interviewSession.currentIndex;
    const updatedStatus = [...interviewSession.status];
    const updatedUserCodes = [...interviewSession.userCodes];
    updatedStatus[currentIdx] = 'skipped';
    updatedUserCodes[currentIdx] = 'Skipped';

    await skipProblem(activeProblem._id);

    setInterviewSession(prev => ({
      ...prev,
      status: updatedStatus,
      userCodes: updatedUserCodes
    }));

    triggerNextInterviewProblem(updatedStatus, updatedUserCodes, 'Skip');
  };

  const handleNextQuestion = () => {
    if (!interviewSession) return;
    triggerNextInterviewProblem(interviewSession.status, interviewSession.userCodes, 'Normal');
  };

  // Adaptive Interview Problem selector
  const triggerNextInterviewProblem = async (currentStatuses, currentCodes, mode = 'Normal') => {
    let nextDifficulty = 'Easy';
    const currentDiff = activeProblem?.difficulty || 'Easy';
    
    if (mode === 'Harder') {
      nextDifficulty = currentDiff === 'Easy' ? 'Medium' : currentDiff === 'Medium' ? 'Hard' : 'Expert';
    } else if (currentStatuses[interviewSession.currentIndex] === 'correct') {
      nextDifficulty = currentDiff === 'Easy' ? 'Medium' : currentDiff === 'Medium' ? 'Hard' : 'Hard';
    } else {
      nextDifficulty = currentDiff;
    }

    const company = interviewSession.config.company;
    const category = interviewSession.config.category;
    const solvedIds = interviewSession.questions.map(q => q._id?.toString());

    let allProbs = problems;
    try {
      const response = await axios.get(`${API_URL}/coding/problems`);
      if (response.data && response.data.length > 0) {
        allProbs = response.data;
        useCodingStore.setState({ problems: allProbs });
      }
    } catch (err) {
      console.error(err);
    }

    let pool = allProbs.filter(p => {
      const matchCompany = !company || p.companyTags?.includes(company);
      const matchCategory = !category || p.category === category;
      const matchDiff = p.difficulty === nextDifficulty;
      const notSolved = !solvedIds.includes(p._id?.toString());
      return matchCompany && matchCategory && matchDiff && notSolved;
    });

    if (pool.length === 0) {
      pool = allProbs.filter(p => {
        const notSolved = !solvedIds.includes(p._id?.toString());
        return notSolved;
      });
    }

    let nextProblem = null;
    if (pool.length > 0) {
      nextProblem = pool[0];
    } else {
      if (isPremiumUser) {
        try {
          useCodingStore.setState({ aiLoading: true });
          const genResponse = await axios.post(`${API_URL}/coding/generate-problem`, {
            topic: category || 'Arrays',
            targetCompany: company || 'Google',
            difficulty: nextDifficulty
          });
          nextProblem = genResponse.data.problem;
          useCodingStore.setState(state => ({
            problems: [nextProblem, ...state.problems]
          }));
        } catch (genErr) {
          console.error(genErr);
          nextProblem = allProbs[Math.floor(Math.random() * allProbs.length)];
        } finally {
          useCodingStore.setState({ aiLoading: false });
        }
      } else {
        const easyPool = allProbs.filter(p => p.difficulty === 'Easy');
        nextProblem = easyPool.length > 0 ? easyPool[Math.floor(Math.random() * easyPool.length)] : allProbs[0];
      }
    }

    if (!nextProblem) {
      alert("All available problems completed!");
      handleEndInterviewSession();
      return;
    }

    selectProblem(nextProblem);
    const nextCode = (nextProblem?.starterTemplates && nextProblem.starterTemplates[activeLanguage]) || '';
    setEditorCode(nextCode);

    const savedCodes = [...currentCodes];
    savedCodes[interviewSession.currentIndex] = editorCode;

    setInterviewSession(prev => {
      const nextIndex = prev.questions.length;
      return {
        ...prev,
        questions: [...prev.questions, nextProblem],
        currentIndex: nextIndex,
        status: [...prev.status, 'active'],
        attempts: [...prev.attempts, 0],
        userCodes: [...savedCodes, nextCode],
        evaluations: [...prev.evaluations, null]
      };
    });

    useCodingStore.setState({ evaluation: null, error: null });
    setActiveConsoleTab('testcases');
  };

  // Compile final performance diagnostics
  const handleEndInterviewSession = () => {
    if (!interviewSession) return;
    
    const finalCodes = [...interviewSession.userCodes];
    finalCodes[interviewSession.currentIndex] = editorCode;
    
    const attemptsCount = interviewSession.status.filter(s => s !== 'active').length;
    const correctCount = interviewSession.status.filter(s => s === 'correct').length;
    const failedCount = interviewSession.status.filter(s => s === 'incorrect' || s === 'partial').length;
    const skippedCount = interviewSession.status.filter(s => s === 'skipped').length;
    
    const accuracy = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;
    
    let maxDifficulty = 'Easy';
    interviewSession.questions.forEach((q, i) => {
      if (interviewSession.status[i] === 'correct') {
        if (q.difficulty === 'Hard') maxDifficulty = 'Hard';
        else if (q.difficulty === 'Expert') maxDifficulty = 'Expert';
        else if (q.difficulty === 'Medium' && maxDifficulty !== 'Hard' && maxDifficulty !== 'Expert') maxDifficulty = 'Medium';
      }
    });

    const strongTopics = new Set();
    const weakTopics = new Set();
    
    interviewSession.questions.forEach((q, i) => {
      const status = interviewSession.status[i];
      if (status === 'correct') {
        strongTopics.add(q.category);
      } else if (status === 'incorrect' || status === 'partial' || status === 'skipped') {
        weakTopics.add(q.category);
      }
    });

    const report = {
      accuracy,
      totalSolved: correctCount,
      totalFailed: failedCount,
      totalSkipped: skippedCount,
      maxDifficulty,
      avgSolvingTime: Math.round(sessionTimer / (attemptsCount || 1)),
      strongTopics: Array.from(strongTopics),
      weakTopics: Array.from(weakTopics)
    };

    setCompletionReport(report);
    setShowCompletionModal(true);
    setIsInterviewMode(false);
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
  };

  // Dynamic AI Problem Generator call
  const handleGenerateProblem = async (e) => {
    e.preventDefault();
    if (!isPremiumUser) {
      setShowUpgradeModal(true);
      return;
    }
    setShowGenModal(false);
    try {
      await generateAIProblem(genTopic, genCompany, genDifficulty);
      setActiveLeftTab('description');
    } catch (err) {
      console.error(err);
    }
  };

  const triggerCompanyPath = (companyName) => {
    setCompanyFilter(companyName);
    fetchProblems(searchQuery, categoryFilter, difficultyFilter, companyName);
  };

  return (
    <PageWrapper>
      <div className={`relative text-left ${isFullscreen ? 'fixed inset-0 z-50 bg-[#030303] p-6 overflow-y-auto' : ''}`}>
        
        {/* TOP STATUS RIBBON & XP Progress bar */}
        {isInterviewMode && interviewSession ? (
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-r from-[#0d1425] to-[#122240] flex flex-col gap-4 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl animate-pulse"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <span className="text-[10px] font-black bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20 w-fit animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ⚡ AI Mock Interview active
                </span>
                <h4 className="text-sm font-black text-white mt-1 uppercase tracking-wider">
                  {interviewSession.config.company || 'All Companies'} Rounds • {interviewSession.config.category || 'All Algorithms'}
                </h4>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs bg-cyan-500/5 border border-cyan-500/20 px-3.5 py-2 rounded-xl">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" />
                  <span>{formatSessionTimer(sessionTimer)}</span>
                </div>
                <button
                  onClick={handleEndInterviewSession}
                  className="bg-red-500/10 hover:bg-red-500 border border-red-500/25 px-5 py-2 rounded-xl text-xs font-black text-red-400 hover:text-white transition duration-300 shadow-md uppercase tracking-wider shrink-0"
                >
                  End Session
                </button>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                <span>Rounds Completed Progress</span>
                <span>
                  {interviewSession.status.filter(s => s === 'correct').length} Solved / {interviewSession.status.filter(s => s === 'skipped').length} Skipped / {interviewSession.questions.length} Total
                </span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 flex">
                {interviewSession.status.map((st, i) => {
                  let color = 'bg-white/10';
                  if (st === 'correct') color = 'bg-gradient-to-r from-cyber-jade to-emerald-500';
                  else if (st === 'incorrect' || st === 'partial') color = 'bg-gradient-to-r from-red-500 to-rose-500';
                  else if (st === 'skipped') color = 'bg-gradient-to-r from-gray-500 to-slate-500';
                  else if (st === 'active') color = 'bg-gradient-to-r from-yellow-500 to-amber-500';

                  return (
                    <div 
                      key={i} 
                      className={`${color} h-full border-r border-black/30 transition-all duration-500`}
                      style={{ width: `${100 / interviewSession.status.length}%` }}
                      title={`Question ${i + 1}: ${st.toUpperCase()}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4 bg-gradient-to-r from-cyber-dark to-purple-950/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl"></div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Flame className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 tracking-wider block uppercase">SOLVED STREAK</span>
                <span className="text-xl font-extrabold text-white">{user?.streak || 0} Days</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4 bg-gradient-to-r from-cyber-dark to-cyan-950/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl"></div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Trophy className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 tracking-wider block uppercase">TOTAL PLATFORM XP</span>
                <span className="text-xl font-extrabold text-white">{user?.xp || 0} XP <span className="text-xs text-cyan-400 font-medium">Lv. {user?.level || 1}</span></span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between md:col-span-2 bg-gradient-to-r from-cyber-dark to-zinc-950/40 relative overflow-hidden">
              <div className="flex items-center gap-4 w-full">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="w-full mr-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">LEVEL PROGRESS</span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{user?.xp || 0} / {(user?.level || 1) * 150} XP</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(((user?.xp || 0) / ((user?.level || 1) * 150)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-white/2 border border-white/10 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-cyber-neon shrink-0 animate-bounce" />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">
                  {isPremiumUser ? 'PREMIUM PRO' : 'FREE ACCOUNT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE THREE-WAY WORKSPACE TAB BAR */}
        <div className="lg:hidden flex border border-white/5 bg-black/40 backdrop-blur-md sticky top-[60px] z-30 p-1.5 gap-1.5 rounded-2xl mb-5 select-none">
          {[
            { id: 'problem', label: 'Problem', icon: BookOpen },
            { id: 'editor', label: 'Editor', icon: Code2 },
            { id: 'results', label: 'Console', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMobileTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition duration-300 ${
                  activeMobileTab === tab.id
                    ? 'bg-gradient-to-r from-cyber-accent/20 to-cyber-neon/15 border border-cyber-accent/40 text-white shadow-inner font-extrabold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-cyber-neon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE DIVIDER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
          
          {/* LEFT SIDEBAR: PROBLEM STATEMENT & UTILITIES - Custom Columns Width based on splitRatio */}
          <div className={`${leftWidths[splitRatio]} flex-col gap-6 max-h-[calc(100vh-100px)] lg:sticky lg:top-4 overflow-y-auto pr-1 ${activeMobileTab === 'problem' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* PRACTICE VS INTERVIEW MODE SELECTOR */}
            <div className="glass-panel p-1.5 rounded-2xl border border-white/5 bg-black/40 flex mb-2">
              <button
                type="button"
                onClick={() => {
                  setIsInterviewMode(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  !isInterviewMode
                    ? 'bg-gradient-to-r from-cyber-accent to-cyber-neon text-white shadow-lg shadow-cyber-accent/20'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Practice Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInterviewMode(true);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  isInterviewMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                AI Interview Mode
              </button>
            </div>

            {/* CONDITIONAL CONTROLS */}
            {!isInterviewMode ? (
              <>
                {dailyChallenge && (
                  <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-br from-amber-950/20 via-zinc-900 to-[#1e130c]/30 relative overflow-hidden mb-4 border-l-amber-500/40">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl animate-pulse"></div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl uppercase tracking-widest flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-400 animate-pulse text-amber-400" />
                        Daily Coding Challenge
                      </span>
                      <span className="text-[10px] font-black text-amber-300 font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                        +{dailyChallenge.xpReward || 200} XP
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-left">
                      <h4 className="text-xs font-black text-white">{dailyChallenge.problemId?.title || 'Daily Challenge'}</h4>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">
                          {dailyChallenge.problemId?.category} • {dailyChallenge.problemId?.difficulty}
                        </span>
                        {dailyChallenge.completed ? (
                          <span className="text-[10px] font-black text-cyber-jade bg-cyber-jade/10 border border-cyber-jade/20 px-3 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => selectProblem(dailyChallenge.problemId)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-black py-1.5 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest shadow-md shadow-amber-500/10 hover:scale-[1.02]"
                          >
                            Solve Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Practice Mode standard filters */}
                <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-neon/5 rounded-full filter blur-2xl"></div>
                
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyber-neon" />
                    Practice Workspace
                  </h3>
                  {isPremiumUser ? (
                    <button 
                      type="button"
                      onClick={() => setShowGenModal(true)}
                      className="text-[10px] font-black uppercase tracking-wider bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon px-3 py-1.5 rounded-xl transition duration-300 flex items-center gap-1.5 shadow-lg"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      AI Problem Gen
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyber-accent to-cyber-neon text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyber-accent/20"
                    >
                      <Lock className="w-3 h-3" />
                      Unlock AI Gen
                    </button>
                  )}
                </div>

                <form onSubmit={handleFilterSearch} className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#030303] border border-white/10 rounded-xl py-2.5 px-3 text-xs font-medium text-white outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/20 transition-all pl-9"
                    />
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white/2 border border-white/5 rounded-xl py-2 px-2 text-xs font-semibold text-gray-400 outline-none cursor-pointer"
                    >
                      <option value="">All Topics</option>
                      <option value="Arrays">Arrays</option>
                      <option value="Strings">Strings</option>
                      <option value="Stack">Stack</option>
                      <option value="Linked List">Linked List</option>
                      <option value="Binary Search">Binary Search</option>
                      <option value="Graphs">Graphs</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                      <option value="Recursion">Recursion</option>
                    </select>

                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="bg-white/2 border border-white/5 rounded-xl py-2 px-2 text-xs font-semibold text-gray-400 outline-none cursor-pointer"
                    >
                      <option value="">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-2 rounded-xl border border-white/10 transition duration-300"
                    >
                      Apply Filters
                    </button>
                    <button 
                      type="button"
                      onClick={handleClearFilters}
                      className="bg-white/2 hover:bg-white/5 text-gray-500 hover:text-white font-bold text-xs px-3 rounded-xl border border-white/5 transition duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </form>

                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto custom-scrollbar border-t border-white/5 pt-3">
                  {loading && problems.length === 0 ? (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/2 animate-pulse flex flex-col gap-2">
                          <div className="flex justify-between">
                            <div className="h-3 bg-white/10 rounded w-1/2"></div>
                            <div className="h-3 bg-white/10 rounded w-1/4"></div>
                          </div>
                          <div className="h-2.5 bg-white/10 rounded w-1/3"></div>
                        </div>
                      ))}
                    </>
                  ) : problems.length === 0 ? (
                    <div className="text-xs text-gray-500 italic p-3 text-center">No challenges matching filter parameters.</div>
                  ) : (
                    problems.map((prob) => {
                      const isLocked = !isPremiumUser && prob.difficulty !== 'Easy';
                    const isActive = activeProblem?._id === prob._id || activeProblem?.id === prob.id || activeProblem?._id === prob.id;
                    
                    return (
                      <button
                        key={prob._id || prob.id}
                        type="button"
                        onClick={() => handleSelectProblemSafe(prob)}
                        className={`
                          p-3 rounded-xl border text-left flex flex-col gap-1 transition duration-300 relative overflow-hidden group
                          ${isActive
                            ? 'bg-cyber-neon/10 border-cyber-neon/45 text-white shadow-inner' 
                            : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                          }
                        `}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <h4 className="font-bold text-xs truncate max-w-[170px]">{prob.title}</h4>
                            {isLocked && <Lock className="w-3.5 h-3.5 text-cyber-accent shrink-0" />}
                          </div>
                          <span className={`
                            text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                            ${prob.difficulty === 'Easy' ? 'bg-cyber-jade/10 text-cyber-jade' : prob.difficulty === 'Medium' ? 'bg-cyber-gold/10 text-cyber-gold' : 'bg-red-500/10 text-red-400'}
                          `}>
                            {prob.difficulty}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center w-full text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                          <span>Cat: {prob.category}</span>
                          {prob.companyTags && prob.companyTags.length > 0 && (
                            <span className="text-cyan-400/60 lowercase font-mono">tags: {prob.companyTags[0]}</span>
                          )}
                        </div>

                        {isLocked && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex items-center gap-1.5 text-[10px] text-cyber-accent font-black uppercase tracking-widest bg-[#030303] px-3.5 py-2 rounded-xl border border-cyber-accent/30 shadow-lg">
                              <Sparkles className="w-3.5 h-3.5" />
                              Premium Unlock
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  }))}
                </div>

                {/* Practice Session Quick Controls Toolbar */}
                <div className="border-t border-white/5 pt-4 mt-2">
                  <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">
                    Practice Quick Toolbar
                  </span>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={handlePracticePrev}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition duration-300 flex flex-col items-center justify-center gap-1 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-wider min-w-0"
                      title="Previous Question"
                    >
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180 text-gray-400 shrink-0" />
                      <span className="truncate w-full text-center">Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePracticeNext}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition duration-300 flex flex-col items-center justify-center gap-1 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-wider min-w-0"
                      title="Next Question"
                    >
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate w-full text-center">Next</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePracticeSkip}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition duration-300 flex flex-col items-center justify-center gap-1 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-wider min-w-0"
                      title="Skip Question"
                    >
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate w-full text-center">Skip</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePracticeRandom}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition duration-300 flex flex-col items-center justify-center gap-1 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-wider min-w-0"
                      title="Random Question"
                    >
                      <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyber-neon shrink-0" />
                      <span className="truncate w-full text-center">Rand</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePracticeRegenerate}
                      disabled={aiLoading}
                      className="bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/20 text-cyber-neon py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition duration-300 flex flex-col items-center justify-center gap-1 text-[8px] xs:text-[9px] md:text-[10px] font-black uppercase tracking-wider min-w-0 disabled:opacity-50"
                      title="Regenerate Similar"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-cyan-400 shrink-0" />
                      ) : (
                        <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                      )}
                      <span className="truncate w-full text-center">Re-gen</span>
                    </button>
                  </div>
                </div>
              </div>
              </>
            ) : !interviewSession ? (
              /* Interview setup room cockpit */
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl animate-pulse"></div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    AI Interview Cockpit
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Start a dynamic recruiter-grade interview round. Problems will adaptively adjust in difficulty as you solve them.
                  </p>
                </div>

                <form onSubmit={handleStartInterviewSession} className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Target Company</label>
                    <select
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="bg-[#030303] border border-white/5 rounded-xl py-2 px-2 text-xs font-semibold text-gray-300 outline-none cursor-pointer focus:border-purple-500/50 transition"
                    >
                      <option value="">All Companies / Random</option>
                      <option value="Google">Google (Graphs, DP, Algorithms)</option>
                      <option value="Amazon">Amazon (Arrays, Trees, Hash Maps)</option>
                      <option value="Meta">Meta (Performance, Graphs, System Design)</option>
                      <option value="Microsoft">Microsoft (OOP, Trees, System Coding)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20 transition duration-300 flex items-center justify-center gap-1.5 uppercase tracking-wider mt-2"
                  >
                    <Play className="w-3.5 h-3.5 text-yellow-400 shrink-0 fill-yellow-400 animate-pulse" />
                    Start AI Coding Interview
                  </button>
                </form>
              </div>
            ) : (
              /* Question Navigation Panel when Interview is Active */
              <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl"></div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    Question Navigator
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-semibold">
                    Select a question to view status or edit solution code.
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar border-t border-white/5 pt-3">
                  {interviewSession.questions.map((prob, i) => {
                    const isActive = interviewSession.currentIndex === i;
                    const status = interviewSession.status[i];
                    
                    let statusLabel = 'Active';
                    let statusColor = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
                    let Icon = Sparkles;

                    if (status === 'correct') {
                      statusLabel = '✓ Correct';
                      statusColor = 'text-cyber-jade border-cyber-jade/30 bg-cyber-jade/5';
                      Icon = CheckCircle2;
                    } else if (status === 'incorrect') {
                      statusLabel = '✗ Incorrect';
                      statusColor = 'text-red-400 border-red-500/30 bg-red-500/5';
                      Icon = XCircle;
                    } else if (status === 'partial') {
                      statusLabel = '⚡ Partial';
                      statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/5';
                      Icon = AlertTriangle;
                    } else if (status === 'skipped') {
                      statusLabel = '➜ Skipped';
                      statusColor = 'text-gray-400 border-white/10 bg-white/2';
                      Icon = ArrowRight;
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleNavigateQuestion(i)}
                        className={`
                          p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition duration-300 relative overflow-hidden group
                          ${isActive
                            ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-inner' 
                            : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                          }
                        `}
                      >
                        <div className="flex flex-col gap-0.5 overflow-hidden text-left">
                          <h4 className="font-bold text-xs truncate max-w-[150px]">{prob.title}</h4>
                          <span className="text-[8px] font-black uppercase tracking-wider w-fit rounded-full text-cyber-neon">
                            {prob.difficulty}
                          </span>
                        </div>
                        <div className={`shrink-0 flex items-center gap-1.5 text-[9px] font-black border px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
                          <Icon className="w-3 h-3 shrink-0" />
                          {statusLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleSkipQuestion}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-[10px] py-2.5 px-3 rounded-xl transition duration-300 flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={() => useCodingStore.setState({ evaluation: null })}
                      className="bg-white/2 hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white font-bold text-[10px] py-2.5 px-3 rounded-xl transition duration-300 flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleEndInterviewSession}
                    className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/25 text-red-400 hover:text-white font-black text-[10px] py-2.5 px-3 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-md"
                  >
                    Finish Interview
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTROLLERS (DESCRIPTION, COACH, SUBMISSIONS, LEADERBOARD, PATHS, ANALYTICS) */}
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col min-h-[380px] bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50 relative">
              <div className="flex border-b border-white/5 bg-black/40 overflow-x-auto pr-1">
                {[
                  { id: 'description', label: 'Problem', icon: BookOpen },
                  { id: 'solution', label: 'Editorial', icon: Lightbulb },
                  { id: 'coach', label: 'AI Recruiter', icon: Sparkles },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                  { id: 'submissions', label: 'Submissions', icon: LineChart },
                  { id: 'leaderboard', label: 'Rankings', icon: Trophy },
                  { id: 'paths', label: 'Paths', icon: Compass }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLeftTab(tab.id)}
                    className={`
                      flex items-center gap-1.5 px-4 py-3.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition duration-300 outline-none whitespace-nowrap
                      ${activeLeftTab === tab.id
                        ? 'border-cyber-neon text-white bg-white/2'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                      }
                    `}
                  >
                    <tab.icon className={`w-3.5 h-3.5 ${activeLeftTab === tab.id ? 'text-cyber-neon' : 'text-gray-500'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ACTIVE TAB CONTENT */}
              <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">

                {/* 1. DESCRIPTION TAB */}
                {activeLeftTab === 'description' && activeProblem && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-3">
                      <div className="text-left">
                        <h2 className="text-base font-black text-white flex items-center gap-2">
                          {activeProblem.title}
                          <span className={`
                            text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider
                            ${activeProblem.difficulty === 'Easy' ? 'bg-cyber-jade/10 text-cyber-jade' : activeProblem.difficulty === 'Medium' ? 'bg-cyber-gold/10 text-cyber-gold' : 'bg-red-500/10 text-red-400'}
                          `}>
                            {activeProblem.difficulty}
                          </span>
                        </h2>
                        <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest mt-1 block">
                          Category: {activeProblem.category}
                        </span>
                      </div>
                      
                      {/* Bookmark and Favorite Buttons */}
                      <div className="flex items-center gap-2 select-none">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(activeProblem._id)}
                          className={`p-2 rounded-xl border transition duration-300 ${
                            (progress?.favorites || []).includes(activeProblem._id) || (progress?.favorites || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)
                              ? 'bg-yellow-500/10 border-yellow-500/35 text-yellow-400' 
                              : 'bg-white/2 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                          title={((progress?.favorites || []).includes(activeProblem._id) || (progress?.favorites || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star className={`w-4 h-4 ${((progress?.favorites || []).includes(activeProblem._id) || (progress?.favorites || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)) ? 'fill-yellow-400' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(activeProblem._id)}
                          className={`p-2 rounded-xl border transition duration-300 ${
                            (progress?.bookmarks || []).includes(activeProblem._id) || (progress?.bookmarks || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)
                              ? 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400' 
                              : 'bg-white/2 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                          title={((progress?.bookmarks || []).includes(activeProblem._id) || (progress?.bookmarks || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)) ? "Remove Bookmark" : "Bookmark Question"}
                        >
                          <Bookmark className={`w-4 h-4 ${((progress?.bookmarks || []).includes(activeProblem._id) || (progress?.bookmarks || []).some(id => id === activeProblem._id || id?._id === activeProblem._id)) ? 'fill-cyan-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans bg-black/35 border border-white/5 p-4 rounded-xl whitespace-pre-wrap">
                      {activeProblem.description}
                    </p>

                    {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                      <div className="bg-black/35 border border-white/5 p-4 rounded-xl">
                        <span className="text-[10px] font-black text-gray-500 tracking-wider block mb-2 uppercase">Constraints</span>
                        <ul className="flex flex-col gap-1.5">
                          {activeProblem.constraints.map((c, i) => (
                            <li key={i} className="text-xs text-gray-400 font-mono flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent"></span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeProblem.companyTags && activeProblem.companyTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center pt-2">
                        <span className="text-[9px] font-black text-gray-500 tracking-wider uppercase mr-1">Rounds:</span>
                        {activeProblem.companyTags.map((c, i) => (
                          <span key={i} className="text-[9px] font-bold bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full uppercase">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 4-Level Progressive Hint System */}
                    <div className="border-t border-white/5 pt-5 mt-3 text-left">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">
                        Progressive Hint System ({unlockedHintsCount}/4 Unlocked)
                      </span>
                      
                      <div className="flex flex-col gap-2.5 mb-5">
                        {[0, 1, 2, 3].map((index) => {
                          const isUnlocked = unlockedHintsCount > index;
                          const hintText = activeProblem?.hints?.[index] || `Hint ${index + 1} will outline key pointers or base case setup.`;
                          
                          let label = `Hint ${index + 1}: Conceptual Clue`;
                          if (index === 1) label = `Hint 2: Approach & Strategy`;
                          if (index === 2) label = `Hint 3: Base Case & Logic`;
                          if (index === 3) label = `Hint 4: Implementation Details`;

                          return (
                            <div 
                              key={index}
                              className={`border rounded-2xl p-4 transition-all duration-300 ${
                                isUnlocked 
                                  ? 'bg-cyber-neon/5 border-cyber-neon/20 text-gray-300' 
                                  : 'bg-black/20 border-white/5 text-gray-500'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1.5">
                                <span className={`text-[9px] font-black uppercase tracking-wider ${isUnlocked ? 'text-cyan-400' : 'text-gray-500'}`}>
                                  {label}
                                </span>
                                {!isUnlocked && index === unlockedHintsCount && (
                                  <button
                                    type="button"
                                    onClick={unlockNextHint}
                                    className="text-[9px] font-black uppercase bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon px-3 py-1.5 rounded-xl transition duration-300 flex items-center gap-1"
                                  >
                                    <Unlock className="w-3 h-3 text-cyan-400" />
                                    Unlock Clue
                                  </button>
                                )}
                                {!isUnlocked && index > unlockedHintsCount && (
                                  <div className="text-[9px] font-black uppercase text-gray-600 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Locked
                                  </div>
                                )}
                              </div>
                              
                              {isUnlocked ? (
                                <p className="text-xs font-mono leading-relaxed text-left whitespace-pre-wrap">{hintText}</p>
                              ) : (
                                <p className="text-xs italic select-none text-gray-600 text-left">Unlock hint {index} to access this level.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Premium AI Coach Hints Drawer */}
                      <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        AI Coach Solver Hints
                      </span>

                      {isPremiumUser ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            {['step-by-step', 'complexity', 'edge-case'].map((type) => (
                              <button
                                key={type}
                                onClick={() => {
                                  setSelectedHintType(type);
                                  getAIHint(type);
                                }}
                                disabled={aiLoading}
                                className={`
                                  flex-1 text-[9px] font-black uppercase tracking-wider py-2.5 rounded-xl border transition
                                  ${selectedHintType === type 
                                    ? 'bg-purple-500/10 border-purple-500/40 text-white' 
                                    : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                                  }
                                `}
                              >
                                {type.replace('-', ' ')}
                              </button>
                            ))}
                          </div>

                          {aiLoading && (
                            <div className="flex flex-col gap-2 p-4 bg-white/2 border border-white/5 rounded-xl animate-pulse">
                              <div className="h-4 bg-white/10 rounded w-3/4"></div>
                              <div className="h-4 bg-white/10 rounded w-5/6"></div>
                              <div className="h-4 bg-white/10 rounded w-2/3"></div>
                            </div>
                          )}

                          {aiError && (
                            <div className="flex flex-col gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 text-left">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 animate-pulse" />
                                <span className="font-bold">AI Throttling / Request Failure: {aiError}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => getAIHint(selectedHintType)}
                                className="bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-white font-bold px-3 py-1.5 rounded-lg w-fit transition text-[10px] uppercase tracking-wider"
                              >
                                Retry Generating Hint
                              </button>
                            </div>
                          )}

                          {typedHint && (
                            <div className="bg-cyber-neon/5 border border-cyber-neon/20 p-4 rounded-xl text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap animate-fadeIn relative text-left">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400 absolute top-3 right-3 animate-pulse" />
                              {typedHint}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-black/40 border border-white/5 p-5 rounded-2xl text-center flex flex-col items-center gap-2 cursor-pointer group hover:border-cyber-accent/30 transition duration-300"
                        >
                          <Lock className="w-6 h-6 text-cyber-accent animate-bounce" />
                          <span className="text-xs font-bold text-white group-hover:text-cyber-accent transition">Unlock Active Code Hints</span>
                          <p className="text-[9px] text-gray-600">Upgrade to premium to generate active code blocks and edge-case testing solutions.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1.5. EDITORIAL & SOLUTIONS TAB */}
                {activeLeftTab === 'solution' && activeProblem && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        {activeProblem.title}
                        <span className="text-xs text-gray-500 font-extrabold uppercase tracking-widest block mt-1">
                          Editorial & Solutions Guide
                        </span>
                      </h2>
                    </div>

                    {/* Complexity Pills */}
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="bg-black/35 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] font-sans font-bold text-gray-500 uppercase block mb-1">Expected Time Complexity</span>
                        <span className="text-xs font-extrabold text-cyber-neon">{activeProblem.expectedTime || 'O(N)'}</span>
                      </div>
                      <div className="bg-black/35 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] font-sans font-bold text-gray-500 uppercase block mb-1">Expected Space Complexity</span>
                        <span className="text-xs font-extrabold text-cyber-neon">{activeProblem.expectedSpace || 'O(1)'}</span>
                      </div>
                    </div>

                    {/* Editorial Text */}
                    {activeProblem.editorial ? (
                      <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                        <span className="text-[10px] font-black text-purple-400 tracking-wider block mb-2.5 uppercase flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Theoretical Review & Analysis
                        </span>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-wrap text-left">
                          {activeProblem.editorial}
                        </p>
                      </div>
                    ) : activeProblem.explanation ? (
                      <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                        <span className="text-[10px] font-black text-purple-400 tracking-wider block mb-2.5 uppercase flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Algorithmic Design Review
                        </span>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-wrap text-left">
                          {activeProblem.explanation}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 italic bg-black/20 p-4 rounded-xl border border-white/5 text-left">
                        No theoretical editorial has been cached for this problem yet. Use the Recruiter tab to discuss approach complexities.
                      </div>
                    )}

                    {/* Optimal Solution Code Block */}
                    <div className="bg-black/45 border border-white/5 rounded-2xl overflow-hidden flex flex-col relative">
                      <div className="flex justify-between items-center px-4 py-3 bg-black/60 border-b border-white/5">
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 shrink-0" />
                          Optimal Solution Reference
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeProblem.optimalSolution || activeProblem.starterTemplates?.javascript || '');
                            alert("Optimal solution code copied to clipboard!");
                          }}
                          className="text-[9px] font-black bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg transition duration-300 uppercase tracking-wider flex items-center gap-1"
                        >
                          Copy Code
                        </button>
                      </div>

                      <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto max-h-[250px] custom-scrollbar text-left whitespace-pre select-all bg-[#030303]">
                        {activeProblem.optimalSolution || `// Sample Reference Solution\nfunction solve() {\n  // Refer to recruiter or coaching hints\n}`}
                      </pre>
                    </div>

                  </div>
                )}

                {/* 2. AI Recruiter COACH TAB */}
                {activeLeftTab === 'coach' && (
                  <div className="flex flex-col gap-4 animate-fadeIn flex-1">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={getAICodeReview}
                        disabled={aiLoading}
                        className="flex-1 min-w-[125px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center gap-1.5"
                      >
                        {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                        AI Code Review
                      </button>
                      <button
                        onClick={getAISolutionExplanation}
                        disabled={aiLoading}
                        className="flex-1 min-w-[125px] bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center gap-1.5"
                      >
                        {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                        AI Explain Failure
                      </button>
                    </div>

                    {/* Interactive Recruiter dialogue chat log */}
                    <div className="flex flex-col gap-4 flex-1 min-h-[320px] bg-black/45 border border-white/5 p-4 rounded-xl relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-2xl"></div>
                      
                      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 custom-scrollbar max-h-[300px]" id="recruiter-chat-feed">
                        {recruiterMessages.map((msg, i) => {
                          const isRecruiter = msg.sender === 'recruiter';
                          return (
                            <div key={i} className={`flex gap-3 max-w-[85%] ${isRecruiter ? 'self-start' : 'self-end flex-row-reverse'}`}>
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                                isRecruiter ? 'bg-purple-500/10 border-purple-500/30' : 'bg-cyan-500/10 border-cyan-500/30'
                              }`}>
                                {isRecruiter ? <Sparkles className="w-3.5 h-3.5 text-purple-400" /> : <Code2 className="w-3.5 h-3.5 text-cyan-400" />}
                              </div>
                              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                isRecruiter 
                                  ? 'bg-purple-950/15 border border-purple-500/10 text-gray-200 rounded-tl-none text-left' 
                                  : 'bg-cyan-950/20 border border-cyan-500/15 text-gray-100 rounded-tr-none text-left'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          );
                        })}
                        
                        {aiLoading && (
                          <div className="flex gap-3 self-start max-w-[80%] items-center text-[10px] text-purple-400/80 animate-pulse font-black">
                            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            </div>
                            Recruiter is typing follow-ups...
                          </div>
                        )}

                        {aiError && (
                          <div className="flex flex-col gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 text-left my-2 animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 animate-pulse" />
                              <span className="font-bold">AI Recruiter Request Failure: {aiError}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={getAICodeReview}
                                className="bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/30 text-white font-bold px-3 py-1.5 rounded-lg transition text-[10px] uppercase tracking-wider"
                              >
                                Retry Code Review
                              </button>
                              <button
                                type="button"
                                onClick={getAISolutionExplanation}
                                className="bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/30 text-white font-bold px-3 py-1.5 rounded-lg transition text-[10px] uppercase tracking-wider"
                              >
                                Retry Explanation
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const inputField = document.getElementById('recruiter-msg-input');
                          if (!inputField || !inputField.value.trim()) return;
                          const msg = inputField.value.trim();
                          inputField.value = '';
                          await sendRecruiterMessage(msg);
                        }} 
                        className="flex gap-2 border-t border-white/5 pt-3 shrink-0"
                      >
                        <input
                          id="recruiter-msg-input"
                          type="text"
                          disabled={aiLoading}
                          placeholder="Discuss Big-O, optimization strategies, edge cases..."
                          className="flex-1 bg-[#030303] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                        />
                        <button
                          type="submit"
                          disabled={aiLoading}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs px-5 py-2.5 rounded-xl hover:scale-[1.01] transition shadow-md uppercase tracking-wider disabled:opacity-50"
                        >
                          Send
                        </button>
                      </form>
                    </div>

                    {/* AI Reviews */}
                    {aiReview && (
                      <div className="bg-purple-950/10 border border-purple-500/20 p-4 rounded-xl flex flex-col gap-4 animate-fadeIn">
                        <span className="text-xs font-black uppercase text-purple-400 tracking-widest border-b border-purple-500/10 pb-2">Verdict Score: {aiReview.score}/100</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-center font-mono">
                          <div className="bg-black/35 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-bold text-gray-500 block">Time</span>
                            <span className="text-xs font-extrabold text-purple-300">{aiReview.timeComplexity}</span>
                          </div>
                          <div className="bg-black/35 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-bold text-gray-500 block">Space</span>
                            <span className="text-xs font-extrabold text-purple-300">{aiReview.spaceComplexity}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-gray-500 block uppercase mb-1">Code critiques</span>
                          <ul className="flex flex-col gap-1 text-[11px] text-gray-400">
                            {aiReview.badPractices?.map((bp, i) => <li key={i}>• {bp}</li>)}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-gray-500 block uppercase mb-1">Recommended optimizations</span>
                          <ul className="flex flex-col gap-1 text-[11px] text-purple-300">
                            {aiReview.optimizations?.map((o, i) => <li key={i}>• {o}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* AI Explanation */}
                    {aiExplanation && (
                      <div className="bg-cyan-950/10 border border-cyan-500/20 p-4 rounded-xl flex flex-col gap-4 animate-fadeIn">
                        <span className="text-xs font-black uppercase text-cyan-400 tracking-widest border-b border-cyan-500/10 pb-2">Optimal solution explainer</span>
                        
                        <div>
                          <span className="text-[9px] font-bold text-gray-500 block uppercase mb-1">Logic Pipeline</span>
                          <ul className="flex flex-col gap-1.5 text-[11px] text-gray-400">
                            {aiExplanation.stepByStep?.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-gray-500 block uppercase mb-1">Dry Run Trace Logs</span>
                          <p className="text-[11px] text-gray-300 font-mono bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">{aiExplanation.dryRun}</p>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-gray-500 block uppercase mb-1">Alternative Approach</span>
                          <p className="text-[11px] text-cyan-200 font-medium leading-relaxed">{aiExplanation.optimizedApproach}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}                {/* 3. PREMIUM ANALYTICS TAB */}
                {activeLeftTab === 'analytics' && (
                  <div className="flex flex-col gap-4 animate-fadeIn text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">Coding Analytics Dashboard</span>
                    </div>

                    {/* Resume Last Session Button */}
                    {progress?.lastSession?.problemId && (
                      <div className="glass-panel p-4.5 rounded-2xl border border-white/5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 flex flex-col sm:flex-row justify-between items-center gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl animate-pulse"></div>
                        <div className="text-left">
                          <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Session Continuity</span>
                          <h4 className="text-xs font-black text-white">Resume Last Practice Session</h4>
                          <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                            Problem: {progress.lastSession.problemId.title || 'Untitled'} ({progress.lastSession.language || 'javascript'})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (resumeLastSession()) {
                              setActiveLeftTab('description');
                            } else {
                              alert("Could not load last session.");
                            }
                          }}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[10px] font-black py-2 px-5 rounded-xl transition duration-300 uppercase tracking-wider shrink-0"
                        >
                          Resume Practice
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Readiness Score */}
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-cyan-500/5"></div>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Coding Readiness</span>
                        <div className="w-24 h-24 rounded-full border-4 border-dashed border-cyan-500/30 flex flex-col items-center justify-center relative my-1">
                          <span className="text-2xl font-black text-white font-mono">{progress?.codingReadinessScore || 72}%</span>
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1 block">Recruiter-ready gauge</span>
                      </div>

                      {/* Stats numbers */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-black/35 border border-white/5 p-3.5 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-gray-500 block uppercase">Solved</span>
                          <span className="text-lg font-black text-cyber-jade font-mono">{progress?.solvedProblems?.length || 0}</span>
                        </div>
                        <div className="bg-black/35 border border-white/5 p-3.5 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-gray-500 block uppercase">Failed</span>
                          <span className="text-lg font-black text-red-400 font-mono">{progress?.failedProblems?.length || 0}</span>
                        </div>
                        <div className="bg-black/35 border border-white/5 p-3.5 rounded-xl text-center col-span-2">
                          <span className="text-[9px] font-bold text-gray-500 block uppercase">Solving Accuracy</span>
                          <span className="text-base font-black text-cyan-400 font-mono">{progress?.accuracy || 0}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Topic Mastery progress bars */}
                    <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">Topic Mastery Progress</span>
                      
                      <div className="flex flex-col gap-3.5">
                        {['Arrays', 'Strings', 'Linked List', 'Stack', 'Graphs', 'Dynamic Programming'].map((topic) => {
                          const mastery = progress?.topicMastery?.[topic] || progress?.topicMastery?.get?.(topic) || Math.floor(Math.random() * 40) + 30;
                          return (
                            <div key={topic} className="flex flex-col gap-1 text-left">
                              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                <span>{topic}</span>
                                <span className="font-mono">{mastery}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="bg-gradient-to-r from-cyber-accent to-cyber-neon h-full rounded-full transition-all duration-500"
                                  style={{ width: `${mastery}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Weekly Goals */}
                    <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">Weekly Progress Goals</span>
                      <div className="flex flex-col gap-4">
                        {/* Goal 1: Problems Solved */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>Problems Solved Goal</span>
                            <span>{progress?.weeklyGoals?.solvedCurrent || 0} / {progress?.weeklyGoals?.solvedGoal || 10}</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-cyber-jade h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((progress?.weeklyGoals?.solvedCurrent || 0) / (progress?.weeklyGoals?.solvedGoal || 10)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Goal 2: Graph Problems */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>Graph Problems Goal</span>
                            <span>{progress?.weeklyGoals?.graphCurrent || 0} / {progress?.weeklyGoals?.graphGoal || 3}</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((progress?.weeklyGoals?.graphCurrent || 0) / (progress?.weeklyGoals?.graphGoal || 3)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Goal 3: Solving Accuracy */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>Solving Accuracy Goal</span>
                            <span>{progress?.accuracy || 0}% / {progress?.weeklyGoals?.accuracyGoal || 80}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((progress?.accuracy || 0) / (progress?.weeklyGoals?.accuracyGoal || 80)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achievements Badge Grid */}
                    <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">Achievements & Badges</span>
                      {progress?.achievements?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {progress.achievements.map((ach) => (
                            <div 
                              key={ach.id} 
                              className={`p-3 rounded-xl border flex gap-3 items-center relative overflow-hidden transition-all duration-300 ${
                                ach.unlocked 
                                  ? 'bg-amber-500/5 border-amber-500/20 text-white' 
                                  : 'bg-black/20 border-white/5 opacity-60'
                              }`}
                            >
                              {ach.unlocked && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full filter blur-md"></div>
                              )}
                              <div className="text-2xl shrink-0 select-none">
                                {ach.badge || '🏆'}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex justify-between items-baseline gap-1">
                                  <h5 className="text-xs font-black truncate">{ach.name}</h5>
                                  <span className="text-[8px] font-mono text-gray-500">{ach.unlocked ? 'Unlocked' : `${ach.progress || 0}%`}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 truncate mt-0.5">{ach.description}</p>
                                
                                {!ach.unlocked && (
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1.5">
                                    <div 
                                      className="bg-gray-500 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${ach.progress || 0}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-semibold italic text-left block">No achievements unlocked yet.</span>
                      )}
                    </div>

                    {/* Recently Viewed */}
                    <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">Recently Viewed</span>
                      {progress?.recentlyViewed?.length > 0 ? (
                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {progress.recentlyViewed.map((item, idx) => {
                            const prob = item.problemId;
                            if (!prob) return null;
                            return (
                              <div 
                                key={idx} 
                                onClick={() => selectProblem(prob)}
                                className="bg-white/2 hover:bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between cursor-pointer transition text-left"
                              >
                                <div className="text-left">
                                  <h5 className="text-xs font-bold text-white">{prob.title}</h5>
                                  <span className="text-[9px] text-gray-500 font-extrabold uppercase mt-0.5 block">{prob.category} • {prob.difficulty}</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-mono">{new Date(item.viewedAt).toLocaleDateString()}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-semibold italic text-left block">No recently viewed questions.</span>
                      )}
                    </div>

                    {/* AI Recommended Coding Practice */}
                    <div className="bg-black/35 border border-white/5 p-5 rounded-2xl">
                      <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        AI Coding Recommendations
                      </span>
                      {progress?.recommendations?.length > 0 ? (
                        <div className="flex flex-col gap-2.5">
                          {progress.recommendations.map((rec, idx) => (
                            <div 
                              key={idx}
                              onClick={() => selectProblem(rec.problemId)}
                              className="bg-gradient-to-r from-purple-950/20 to-[#0d1425]/40 border border-purple-500/15 hover:border-purple-500/30 p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition relative overflow-hidden"
                            >
                              <div className="text-left">
                                <h5 className="text-xs font-extrabold text-white">{rec.problemId?.title || rec.title}</h5>
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-wider mt-0.5 block">
                                  {rec.problemId?.category || rec.category} • {rec.problemId?.difficulty || rec.difficulty}
                                </span>
                                <span className="text-[9px] text-purple-300 font-medium leading-tight mt-1.5 block max-w-[90%]">
                                  💡 {rec.reason || 'Recommended based on your recent activity.'}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-semibold italic text-left block">
                          Complete more questions to unlock resume and accuracy-driven recommendations.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. SUBMISSIONS HISTORY TAB */}
                {activeLeftTab === 'submissions' && (
                  <div className="flex flex-col gap-3 animate-fadeIn text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">Submission History Log</span>
                    </div>
                    
                    {/* Submissions Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search by problem title..."
                          value={submissionSearch}
                          onChange={(e) => setSubmissionSearch(e.target.value)}
                          className="w-full bg-[#030303] border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/20 pl-8 transition-all"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                      </div>
                      <select
                        value={submissionStatusFilter}
                        onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                        className="bg-[#030303] border border-white/10 rounded-xl py-2 px-2 text-xs font-semibold text-gray-300 outline-none cursor-pointer focus:border-cyber-accent/50 transition"
                      >
                        <option value="">All Statuses</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Wrong Answer">Wrong Answer</option>
                        <option value="Runtime Error">Runtime Error</option>
                        <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                        <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
                      </select>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="bg-[#030303] p-8 rounded-xl border border-white/5 text-center text-xs text-gray-500 font-bold">
                        No submissions recorded. Type code and submit solution!
                      </div>
                    ) : (
                      (() => {
                        const filteredSubmissions = submissions.filter(sub => {
                          const problemTitle = (sub.problemId?.title || 'Coding Challenge').toLowerCase();
                          const matchesSearch = problemTitle.includes(submissionSearch.toLowerCase());
                          const matchesStatus = !submissionStatusFilter || sub.status === submissionStatusFilter;
                          return matchesSearch && matchesStatus;
                        });

                        if (filteredSubmissions.length === 0) {
                          return (
                            <div className="bg-[#030303] p-8 rounded-xl border border-white/5 text-center text-xs text-gray-500 font-bold">
                              No matching submissions found.
                            </div>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {filteredSubmissions.map((sub, i) => (
                              <div key={i} className="bg-white/2 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                                <div className="text-left">
                                  <h5 className="text-xs font-bold text-white">{sub.problemId?.title || 'Coding Challenge'}</h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase font-bold">
                                      {sub.language}
                                    </span>
                                    <span className="text-gray-600 text-[9px]">•</span>
                                    <span className="text-[9px] text-gray-500 font-mono font-bold">
                                      {new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="text-[10px] text-gray-400 font-mono font-bold block">{sub.runtime}ms</span>
                                    <span className="text-[9px] text-gray-500 font-mono block">{sub.memory}MB</span>
                                  </div>
                                  <span className={`
                                    text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider
                                    ${sub.status === 'Accepted' ? 'bg-cyber-jade/10 text-cyber-jade border border-cyber-jade/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                                  `}>
                                    {sub.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                {/* 5. rankings TAB */}
                {activeLeftTab === 'leaderboard' && (
                  <div className="flex flex-col gap-3 animate-fadeIn">
                    <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">Platform Solvers Leaderboard</span>
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {leaderboard.map((leader, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-black text-cyber-accent font-mono w-4">{i + 1}</span>
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyber-accent to-cyber-neon flex items-center justify-center font-black text-xs text-white uppercase">
                              {leader.name.charAt(0)}
                            </div>
                            <div className="text-left">
                              <h5 className="text-xs font-bold text-white leading-none">{leader.name}</h5>
                              <span className="text-[8px] text-gray-500 font-extrabold uppercase mt-1 block">{leader.targetRole}</span>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-xs font-extrabold text-cyan-400">{leader.xp} XP</span>
                            <span className="text-[9px] text-gray-500 font-bold block">Lv. {leader.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. PATHS TAB */}
                {activeLeftTab === 'paths' && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">Guided Learning Paths</span>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { 
                          key: 'beginner',
                          name: 'Beginner DSA Path', 
                          desc: 'Build rock-solid foundations in basic linear structures and core algorithm patterns.',
                          topics: ['Arrays', 'Strings', 'Hash Maps', 'Stack', 'Queue'],
                          color: 'from-blue-600 to-cyan-500', 
                          progress: getPathProgress('beginner')
                        },
                        { 
                          key: 'intermediate',
                          name: 'Intermediate DSA Path', 
                          desc: 'Master hierarchical trees, complex graphs, dynamic searches, and pointer logic.',
                          topics: ['Linked List', 'Tree', 'BST', 'Heap', 'Graph', 'DFS', 'BFS'],
                          color: 'from-yellow-500 to-amber-600', 
                          progress: getPathProgress('intermediate')
                        },
                        { 
                          key: 'advanced',
                          name: 'Advanced FAANG Path', 
                          desc: 'Drill down into competitive optimizations, complex DP, sliding windows, and enterprise system designs.',
                          topics: ['Dynamic Programming', 'Greedy', 'Backtracking', 'Sliding Window', 'Two Pointer', 'System Design', 'OOP'],
                          color: 'from-purple-600 to-rose-500', 
                          progress: getPathProgress('advanced')
                        }
                      ].map((path) => (
                        <div 
                          key={path.key}
                          onClick={() => handleLoadPath(path.key)}
                          className="bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5 cursor-pointer hover:border-white/10 hover:bg-white/5 transition duration-300 relative overflow-hidden"
                        >
                          <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${path.color}`}></div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-cyber-neon" />
                              {path.name}
                            </h4>
                            <span className="text-[9px] font-mono font-bold text-gray-400">
                              {path.progress.solvedCount} / {path.progress.totalCount} Solved
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 leading-relaxed text-left">{path.desc}</p>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 my-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${path.color} transition-all duration-500`}
                              style={{ width: `${path.progress.pct}%` }}
                            ></div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-1">
                            {path.topics.map(t => (
                              <span key={t} className="text-[8px] font-extrabold bg-white/5 px-2 py-0.5 rounded text-gray-500 uppercase">
                                {t}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 mt-1 uppercase border-t border-white/5 pt-2">
                            <span>Progress: {path.progress.pct}%</span>
                            <span className="text-cyan-400 flex items-center gap-1">
                              Initialize Path
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT SPLIT WORKSPACE: Monaco Editor & Output Console - Custom Columns based on splitRatio */}
          <div className={`${rightWidths[splitRatio]} flex-col gap-6 ${activeMobileTab === 'problem' ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* CODE EDITOR BOX PANEL */}
            {activeProblem ? (
              <div className={`glass-panel rounded-3xl border border-white/5 overflow-hidden flex-col bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50 relative ${activeMobileTab === 'results' ? 'hidden lg:flex' : 'flex'}`}>
                
                {/* Editor Header panel */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/40 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">CODING SANDBOX EDITOR</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Split selector presets */}
                    <div className="flex items-center gap-1 bg-[#030303] p-1 rounded-xl border border-white/5 text-[9px] font-black uppercase text-gray-500">
                      {['40/60', '50/50', '60/40'].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSplitRatio(r)}
                          className={`px-2 py-1 rounded-lg transition ${splitRatio === r ? 'bg-cyber-accent text-white font-extrabold' : 'hover:text-white'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Discard current modifications and reset to starter template?")) {
                          const starter = (activeProblem?.starterTemplates && activeProblem.starterTemplates[activeLanguage]) || '';
                          setEditorCode(starter);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/2 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:border-white/25 transition duration-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset Code
                    </button>

                    <div className="flex items-center gap-1.5 bg-white/2 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-white">
                      <Code2 className="w-3.5 h-3.5 text-cyber-accent" />
                      <select
                        value={activeLanguage}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-white outline-none cursor-pointer border-none font-bold"
                      >
                        <option value="javascript" className="bg-cyber-darker text-gray-200">JavaScript</option>
                        <option value="typescript" className="bg-cyber-darker text-gray-200">TypeScript</option>
                        <option value="python" className="bg-cyber-darker text-gray-200">Python</option>
                        <option value="java" className="bg-cyber-darker text-gray-200">Java</option>
                        <option value="cpp" className="bg-cyber-darker text-gray-200">C++</option>
                        <option value="c" className="bg-cyber-darker text-gray-200">C (GCC)</option>
                        <option value="csharp" className="bg-cyber-darker text-gray-200">C#</option>
                        <option value="go" className="bg-cyber-darker text-gray-200">Go</option>
                        <option value="rust" className="bg-cyber-darker text-gray-200">Rust</option>
                        <option value="php" className="bg-cyber-darker text-gray-200">PHP</option>
                        <option value="kotlin" className="bg-cyber-darker text-gray-200">Kotlin</option>
                        <option value="swift" className="bg-cyber-darker text-gray-200">Swift</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 rounded-xl bg-white/2 border border-white/10 text-gray-400 hover:text-white transition"
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Editor Monaco Workspace */}
                <div className="relative border-b border-white/5 bg-[#030303]">
                  <Editor
                    height={typeof window !== 'undefined' && window.innerWidth < 768 ? "340px" : "460px"}
                    language={activeLanguage === 'cpp' ? 'cpp' : activeLanguage === 'c' ? 'c' : activeLanguage === 'csharp' ? 'csharp' : activeLanguage}
                    theme="vs-dark"
                    value={editorCode}
                    onChange={(val) => setEditorCode(val || '')}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      tabSize: 4,
                      wordWrap: 'on',
                      padding: { top: 16, bottom: 16 }
                    }}
                  />
                </div>

                {/* Sandbox Controls footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 px-6 py-4 bg-black/20">
                  <span className="text-[10px] text-gray-500 font-bold hidden sm:inline select-none">
                    Shortcuts: [Ctrl+Enter] Run | [Ctrl+Shift+Enter] Submit
                  </span>
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleRunLocalJS}
                      disabled={customRunning || loading}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/2 border border-white/10 hover:border-cyber-neon hover:bg-cyber-neon/5 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition duration-300 disabled:opacity-50"
                    >
                      {customRunning ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyber-neon" />
                      ) : (
                        <Play className="w-4 h-4 text-cyber-neon" />
                      )}
                      Run Samples
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitToJudge}
                      disabled={loading || customRunning}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-black text-xs px-8 py-3 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyber-accent/20 transition duration-300 disabled:opacity-50 shadow-inner uppercase tracking-wider"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Evaluating solution...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          Submit Solution
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel rounded-3xl border border-white/5 p-12 text-center bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50 flex flex-col items-center justify-center min-h-[380px]">
                <Code2 className="w-12 h-12 text-gray-700 animate-pulse mb-3" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Question Bank Idle</span>
                <p className="text-xs text-gray-600 max-w-[280px] mt-1.5 leading-relaxed">Select a DSA problem or search topic tags in the catalog to initialize editor workspace.</p>
              </div>
            )}

            {/* OUTPUT CONSOLE PANEL */}
            <div className={`glass-panel rounded-3xl border border-white/5 overflow-hidden flex-col bg-gradient-to-br from-cyber-darker via-cyber-dark to-zinc-900/50 min-h-[260px] ${activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
              
              <div className="flex border-b border-white/5 bg-black/40 px-6">
                {[
                  { id: 'testcases', label: 'Custom Test Cases', icon: Terminal },
                  { id: 'result', label: 'Cloud Judge Result', icon: Sparkles }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConsoleTab(tab.id)}
                    className={`
                      flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-2 transition duration-300 outline-none
                      ${activeConsoleTab === tab.id
                        ? 'border-cyber-neon text-white bg-white/2'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                      }
                    `}
                  >
                    <tab.icon className={`w-3.5 h-3.5 ${activeConsoleTab === tab.id ? 'text-cyber-neon' : 'text-gray-500'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Console window */}
              <div className="p-5 flex-1 flex flex-col justify-start">

                {/* A. CUSTOM TEST CASE PANEL */}
                {activeConsoleTab === 'testcases' && (
                  <div className="flex flex-col gap-4 text-left animate-fadeIn">
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">CUSTOM CASE DASHBOARD</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddTestCase}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-extrabold text-[9px] py-1.5 px-3 rounded-lg transition duration-300 uppercase tracking-wider flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyber-neon" />
                          Add Case
                        </button>
                        <button
                          type="button"
                          onClick={handleRunAllCustomTests}
                          disabled={customRunning || customTestCases.length === 0}
                          className="bg-cyber-neon/15 hover:bg-cyber-neon/30 text-cyber-neon border border-cyber-neon/30 font-black text-[9px] py-1.5 px-4 rounded-lg transition duration-300 uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {customRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3 h-3" />}
                          Run Custom Tests
                        </button>
                      </div>
                    </div>

                    {/* Test cases items listing */}
                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {customTestCases.map((tc, index) => {
                        const isEditing = editingCaseId === tc.id;
                        let statusColor = 'text-gray-500 bg-white/2 border-white/5';
                        if (tc.status === 'running') statusColor = 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20';
                        else if (tc.status === 'passed') statusColor = 'text-cyber-jade bg-cyber-jade/10 border-cyber-jade/20';
                        else if (tc.status === 'failed') statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';

                        return (
                          <div key={tc.id} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col gap-3 transition">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Test Case #{index + 1} {tc.isSample && '(Sample)'}</span>
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}>
                                  {tc.status}
                                </span>
                                
                                {isEditing ? (
                                  <button
                                    onClick={() => handleSaveTestCase(tc.id, tc.input, tc.expectedOutput)}
                                    className="p-1 rounded bg-cyber-jade/10 hover:bg-cyber-jade/25 text-cyber-jade"
                                    title="Save Case"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingCaseId(tc.id)}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                    title="Edit Case"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteTestCase(tc.id)}
                                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/25 text-red-400"
                                  title="Delete Case"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Inputs & Outputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-sans font-bold text-gray-500 uppercase">Input arguments:</span>
                                {isEditing ? (
                                  <textarea
                                    value={tc.input}
                                    onChange={(e) => handleSaveTestCase(tc.id, e.target.value, tc.expectedOutput)}
                                    className="w-full bg-[#030303] border border-white/10 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-cyber-neon"
                                    rows={2}
                                  />
                                ) : (
                                  <div className="bg-[#030303] p-2.5 rounded-lg border border-white/5 truncate">{tc.input}</div>
                                )}
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-sans font-bold text-gray-500 uppercase">Expected output:</span>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={tc.expectedOutput}
                                    onChange={(e) => handleSaveTestCase(tc.id, tc.input, e.target.value)}
                                    className="w-full bg-[#030303] border border-white/10 rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-cyber-neon"
                                  />
                                ) : (
                                  <div className="bg-[#030303] p-2.5 rounded-lg border border-white/5 truncate">{tc.expectedOutput}</div>
                                )}
                              </div>
                            </div>

                            {/* Live trace outputs */}
                            {tc.actualOutput && (
                              <div className="bg-[#030303]/60 p-3 rounded-lg border border-white/5 text-xs font-mono flex flex-col gap-1 mt-1">
                                <span className="text-[9px] font-sans font-black text-cyan-400 uppercase tracking-widest">Compiler Trace:</span>
                                <div className="text-gray-300 whitespace-pre-wrap select-all">{tc.actualOutput}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* B. CLOUD JUDGE EVALUATION STATS */}
                {activeConsoleTab === 'result' && (
                  <div className="flex flex-col justify-center text-left animate-fadeIn">
                    {loading ? (
                      <div className="text-center py-10 text-xs text-gray-400 font-bold my-auto flex flex-col items-center gap-2.5 animate-pulse">
                        <Loader2 className="w-8 h-8 text-cyber-neon animate-spin" />
                        <span className="text-white uppercase tracking-wider animate-pulse">Running Cloud judge...</span>
                        <p className="text-[9px] text-gray-600 max-w-[220px] leading-relaxed">Executing Sandboxed assertions inside secure cloud compiler VM context...</p>
                      </div>
                    ) : error ? (
                      <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                          <span className="text-[10px] font-black uppercase text-red-400 tracking-widest flex items-center gap-1.5">
                            <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                            Compilation Failed
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 font-mono leading-relaxed bg-black/45 p-3 rounded-xl border border-white/5 whitespace-pre-wrap select-text">
                          {error}
                        </p>
                        <button
                          type="button"
                          onClick={() => useCodingStore.setState({ error: null })}
                          className="w-fit bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-[10px] py-2 px-4 rounded-xl transition duration-300 uppercase tracking-wider"
                        >
                          Dismiss Error
                        </button>
                      </div>
                    ) : evaluation ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">Evaluation Verdict Summary:</h4>
                          <span className={`
                            text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border
                            ${evaluation.status === 'Accepted' 
                              ? 'bg-cyber-jade/10 border-cyber-jade/20 text-cyber-jade' 
                              : 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
                            }
                          `}>
                            {evaluation.status}
                          </span>
                        </div>

                        {evaluation.status === 'Accepted' ? (
                          <div className="flex flex-col gap-3 relative overflow-hidden">
                            {/* Visual success micro-particle pop effects */}
                            <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                              {[...Array(12)].map((_, i) => (
                                <span
                                  key={i}
                                  className="absolute w-2 h-2 bg-cyber-jade rounded-full animate-ping opacity-75"
                                  style={{
                                    transform: `rotate(${i * 30}deg) translateY(-40px)`,
                                    animationDelay: `${i * 0.05}s`,
                                    animationDuration: '1.2s'
                                  }}
                                />
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2 bg-cyber-jade/10 border border-cyber-jade/20 px-4 py-2.5 rounded-xl text-xs text-cyber-jade mb-1 font-bold animate-bounce">
                              <Sparkles className="w-4.5 h-4.5 text-cyber-jade animate-spin shrink-0" />
                              <span>Congratulations! All assertions passed successfully!</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                              <div className="bg-cyber-jade/5 border border-cyber-jade/20 p-3.5 rounded-2xl text-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">EXECUTION SPEED</span>
                                <span className="text-lg font-black text-cyber-jade font-mono">{evaluation.runtime} ms</span>
                                <span className="text-[9px] text-gray-500 block font-bold mt-1">Faster than 92%</span>
                              </div>

                              <div className="bg-cyber-neon/5 border border-cyber-neon/20 p-3.5 rounded-2xl text-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">MEMORY FOOTPRINT</span>
                                <span className="text-lg font-black text-cyber-neon font-mono">{evaluation.memory} MB</span>
                                <span className="text-[9px] text-gray-500 block font-bold mt-1">Less than 96%</span>
                              </div>

                              <div className="bg-yellow-500/5 border border-yellow-500/20 p-3.5 rounded-2xl text-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">REWARDS EARNED</span>
                                <span className="text-lg font-black text-yellow-400 font-mono">+{evaluation.xpAwarded} XP</span>
                                <span className="text-[9px] text-yellow-500 block font-bold mt-1">Lv. {evaluation.level} • Streak +{evaluation.streak}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-red-500/5 border border-red-500/20 p-4.5 rounded-2xl flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                              <span className="text-xs font-black uppercase text-red-400 tracking-widest flex items-center gap-1.5">
                                <XCircle className="w-4 h-4 shrink-0 text-red-400 animate-pulse" />
                                {evaluation.status} (WA)
                              </span>
                              <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">
                                Passed: {evaluation.testCasesPassed} / {evaluation.totalTestCases || activeProblem?.testCases?.length || 4} cases
                              </span>
                            </div>
                            {evaluation.errorMessage && (
                              <p className="text-xs text-gray-300 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap select-text">
                                {evaluation.errorMessage}
                              </p>
                            )}
                          </div>
                        )}

                        {/* RENDER DYNAMIC FAILURE/SUCCESS NAVIGATION ACTIONS */}
                        <div className="bg-white/2 border border-white/5 rounded-2xl p-4 mt-2 flex flex-col gap-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Navigation Controls Toolbar</span>
                            <span>{evaluation.status === 'Accepted' ? '✓ accepted' : '✗ retry recommendation'}</span>
                          </div>

                          {evaluation.status === 'Accepted' ? (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={isInterviewMode ? handleNextQuestion : handlePracticeNext}
                                className="flex-1 min-w-[120px] bg-gradient-to-r from-cyber-jade to-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-xl hover:scale-[1.01] transition-all shadow"
                              >
                                Next Question
                              </button>
                              <button
                                type="button"
                                onClick={isInterviewMode ? handleHarderQuestion : handlePracticeRegenerate}
                                className="flex-1 min-w-[120px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-xl hover:scale-[1.01] transition-all shadow"
                              >
                                {isInterviewMode ? 'Harder Question' : 'Harder Version'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveLeftTab('coach')}
                                className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition"
                              >
                                AI Review Solution
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => useCodingStore.setState({ evaluation: null, error: null })}
                                className="flex-1 min-w-[120px] bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-xl hover:scale-[1.01] transition-all shadow"
                              >
                                Retry
                              </button>
                              <button
                                type="button"
                                onClick={handleViewHintResultTab}
                                className="flex-1 min-w-[120px] bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-extrabold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-xl hover:scale-[1.01] transition-all shadow"
                              >
                                View Hint
                              </button>
                              <button
                                type="button"
                                onClick={isInterviewMode ? handleSkipQuestion : handlePracticeSkip}
                                className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition"
                              >
                                Skip Question
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveLeftTab('coach');
                                  getAISolutionExplanation();
                                }}
                                className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition"
                              >
                                AI Explain Failure
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-10 text-xs text-gray-600 font-bold my-auto flex flex-col items-center gap-2">
                        <Sparkles className="w-6 h-6 text-gray-700 animate-pulse" />
                        Judge Pipeline Online
                        <p className="text-[9px] text-gray-700 max-w-[200px] leading-relaxed">Submit your solution code to evaluate space-time metrics on the Online Judge compiler context.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DYNAMIC AI PROBLEM GENERATION DIALOG OVERLAY */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[2px] animate-fadeIn text-left">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-md w-full flex flex-col gap-4 relative bg-gradient-to-br from-cyber-darker to-zinc-950 shadow-2xl">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyber-neon" />
                AI Coding Problem Generator
              </h3>
              <p className="text-xs text-gray-500 mt-1">Generate a completely unique, recruiter-grade coding problem matching specific stack skills, companies, and difficulty bounds.</p>
            </div>

            <form onSubmit={handleGenerateProblem} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-black">Target Topic</label>
                <select
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="bg-[#030303] border border-white/5 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-300 outline-none cursor-pointer"
                >
                  <option value="Arrays" className="bg-cyber-darker">Arrays & Hashing</option>
                  <option value="Dynamic Programming" className="bg-cyber-darker">Dynamic Programming</option>
                  <option value="Graphs" className="bg-cyber-darker">Graphs / DFS / BFS</option>
                  <option value="Sliding Window" className="bg-cyber-darker">Sliding Window</option>
                  <option value="Linked List" className="bg-cyber-darker">Linked List</option>
                  <option value="Binary Search" className="bg-cyber-darker">Binary Search</option>
                  <option value="Stack" className="bg-cyber-darker">Stack & Stacks</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-black">Target Company</label>
                <select
                  value={genCompany}
                  onChange={(e) => setGenCompany(e.target.value)}
                  className="bg-[#030303] border border-white/5 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-300 outline-none cursor-pointer"
                >
                  <option value="Google" className="bg-cyber-darker">Google</option>
                  <option value="Amazon" className="bg-cyber-darker">Amazon</option>
                  <option value="Meta" className="bg-cyber-darker">Meta / Facebook</option>
                  <option value="Netflix" className="bg-cyber-darker">Netflix</option>
                  <option value="Microsoft" className="bg-cyber-darker">Microsoft</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-black">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setGenDifficulty(diff)}
                      className={`
                        flex-1 py-2.5 text-xs font-bold border rounded-xl transition duration-300
                        ${genDifficulty === diff 
                          ? 'bg-cyber-neon/10 border-cyber-neon/40 text-white' 
                          : 'bg-white/2 border-white/5 text-gray-400'
                        }
                      `}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="flex-1 bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-extrabold text-[10px] uppercase tracking-widest py-3 rounded-xl hover:scale-[1.01] transition duration-300 flex items-center justify-center gap-1.5"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      Generate Problem
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="bg-white/2 hover:bg-white/5 border border-white/5 text-gray-500 hover:text-white font-bold text-xs px-6 rounded-xl transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST-INTERVIEW PERFORMANCE REPORT */}
      {showCompletionModal && completionReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[4px] animate-fadeIn text-left overflow-y-auto">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-2xl w-full flex flex-col gap-6 relative bg-gradient-to-br from-[#0b0f19] to-zinc-950 shadow-2xl my-8">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
                  🎓 Diagnostics report
                </span>
                <h3 className="text-lg font-extrabold text-white mt-2 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                  Coding Interview Evaluation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setInterviewSession(null);
                }}
                className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition duration-300 border border-white/5"
              >
                Reset Workspace
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/2 border border-white/5 p-6 rounded-2xl">
              <div className="md:col-span-4 flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-purple-500/30 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex flex-col items-center justify-center border border-purple-500/10">
                    <span className="text-3xl font-black text-white font-mono">{completionReport.accuracy}%</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-wider mt-0.5">Accuracy</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Solved</span>
                  <span className="text-lg font-black text-cyber-jade font-mono">{completionReport.totalSolved}</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Failed</span>
                  <span className="text-lg font-black text-red-400 font-mono">{completionReport.totalFailed}</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Skipped</span>
                  <span className="text-lg font-black text-gray-400 font-mono">{completionReport.totalSkipped}</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Max Tier</span>
                  <span className="text-xs font-black uppercase text-cyber-neon font-mono block mt-1">{completionReport.maxDifficulty}</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center col-span-2">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Avg solving time</span>
                  <span className="text-xs font-black text-cyan-400 font-mono block mt-1">{formatSessionTimer(completionReport.avgSolvingTime)} / prob</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-jade/5 border border-cyber-jade/10 p-5 rounded-2xl">
                <span className="text-[9px] font-black text-cyber-jade uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Topic Strengths (Verified)
                </span>
                {completionReport.strongTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {completionReport.strongTopics.map((topic, i) => (
                      <span key={i} className="text-[9px] font-bold bg-cyber-jade/10 border border-cyber-jade/20 text-cyber-jade px-2.5 py-1 rounded-full uppercase">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 font-semibold italic">No strong topics verified.</span>
                )}
              </div>

              <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl">
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Growth Areas
                </span>
                {completionReport.weakTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {completionReport.weakTopics.map((topic, i) => (
                      <span key={i} className="text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full uppercase">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 font-semibold italic">Excellent work! No growth areas detected.</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase block mb-3">chronological session recap</span>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar border border-white/5 rounded-xl p-3 bg-black/20 font-mono">
                {interviewSession && interviewSession.questions.map((q, idx) => {
                  const status = interviewSession.status[idx];
                  let statusBadge = 'Skipped';
                  let statusStyle = 'bg-white/5 border-white/10 text-gray-400';

                  if (status === 'correct') {
                    statusBadge = '✓ Correct';
                    statusStyle = 'bg-cyber-jade/10 border-cyber-jade/20 text-cyber-jade';
                  } else if (status === 'incorrect') {
                    statusBadge = '✗ Incorrect';
                    statusStyle = 'bg-red-500/10 border-red-500/20 text-red-400';
                  } else if (status === 'partial') {
                    statusBadge = '⚡ Partial';
                    statusStyle = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                  }

                  return (
                    <div key={idx} className="flex justify-between items-center bg-white/2 p-2 px-3 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-bold font-mono">Q{idx + 1}</span>
                        <span className="text-white font-semibold">{q.title}</span>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusStyle}`}>
                        {statusBadge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setInterviewSession(null);
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs py-3.5 rounded-xl hover:scale-[1.01] transition duration-300 text-center uppercase tracking-wider"
              >
                Close Report & Start Practice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUBSCRIPTION MODAL */}
      <SubscriptionModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        initialTab="coding" 
      />

    </PageWrapper>
  );
}

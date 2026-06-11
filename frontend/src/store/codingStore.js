import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

export const useCodingStore = create((set, get) => ({
  problems: [],
  activeProblem: null,
  activeLanguage: 'javascript',
  editorCode: '',
  evaluation: null,
  loading: false,
  error: null,

  // Navigation History Stacks
  prevProblems: [],

  // Premium & Gamification States
  leaderboard: [],
  progress: null,
  submissions: [],
  aiHint: null,
  aiReview: null,
  aiExplanation: null,
  aiFollowup: null,
  aiLoading: false,
  aiError: null,
  
  // Daily challenge and progressive hints
  dailyChallenge: null,
  unlockedHintsCount: 0,

  // Recruiter Chat Dialogue Stack
  recruiterMessages: [],

  // Static Guided Paths Configurations
  pathsData: {
    beginner: {
      name: "Beginner DSA Path",
      topics: ["Arrays", "Strings", "Hash Maps", "Stack", "Queue"],
      totalCount: 5
    },
    intermediate: {
      name: "Intermediate DSA Path",
      topics: ["Linked List", "Tree", "BST", "Heap", "Graph", "DFS", "BFS"],
      totalCount: 7
    },
    advanced: {
      name: "Advanced FAANG Path",
      topics: ["Dynamic Programming", "Greedy", "Backtracking", "Sliding Window", "Two Pointer", "System Design", "OOP"],
      totalCount: 7
    }
  },

  fetchProblems: async (search = '', category = '', difficulty = '', company = '') => {
    set({ loading: true, error: null });
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (company) params.company = company;

      const response = await axios.get(`${API_URL}/coding/problems`, { params });
      set({ problems: response.data, loading: false });
      
      if (response.data.length > 0) {
        const currentActive = get().activeProblem;
        const exists = response.data.some(p => p._id === currentActive?._id);
        if (!currentActive || !exists) {
          get().selectProblem(response.data[0]);
        }
      } else {
        set({ activeProblem: null, editorCode: '' });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch coding problems.', 
        loading: false 
      });
    }
  },

  selectProblem: async (problem) => {
    if (!problem) return;
    const lang = get().activeLanguage;
    const code = (problem?.starterTemplates && problem.starterTemplates[lang]) || '';
    
    set({
      activeProblem: problem,
      editorCode: code,
      evaluation: null,
      error: null,
      aiHint: null,
      aiReview: null,
      aiExplanation: null,
      aiFollowup: null,
      aiError: null,
      unlockedHintsCount: 0,
      recruiterMessages: [
        {
          sender: 'recruiter',
          text: `Hello! I am your AI Recruiter. I see you are working on "${problem.title}". Let's discuss your implementation details. Once you submit a successful solution, we'll talk about your design decisions, Big-O complexities, and optimizations!`
        }
      ]
    });

    try {
      await axios.post(`${API_URL}/coding/session`, {
        problemId: problem._id,
        language: lang,
        code
      });
      get().fetchProgress();
    } catch (err) {
      console.error('Failed to auto-save session:', err);
    }
  },

  setLanguage: async (lang) => {
    const { activeProblem } = get();
    if (!activeProblem) return;
    const code = (activeProblem?.starterTemplates && activeProblem.starterTemplates[lang]) || '';
    
    set({
      activeLanguage: lang,
      editorCode: code,
      evaluation: null
    });

    try {
      await axios.post(`${API_URL}/coding/session`, {
        problemId: activeProblem._id,
        language: lang,
        code
      });
    } catch (err) {}
  },

  setEditorCode: (code) => {
    set({ editorCode: code });
  },

  submitCode: async (customInput = null, isRunOnly = false) => {
    const { activeProblem, editorCode, activeLanguage } = get();
    if (!activeProblem) return;

    set({ loading: true, error: null, evaluation: null });
    try {
      const response = await axios.post(`${API_URL}/coding/submit`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage,
        customInput,
        isRunOnly
      });

      if (!customInput && !isRunOnly) {
        set({ evaluation: response.data, loading: false });
        get().fetchProgress();

        if (response.data.status === 'Accepted') {
          try {
            const followResponse = await axios.post(`${API_URL}/coding/coach/followup`, {
              problemId: activeProblem._id,
              code: editorCode,
              language: activeLanguage,
              chatHistory: [],
              userMessage: 'I successfully solved the problem.'
            });

            const recruiterMsg = {
              sender: 'recruiter',
              text: followResponse.data.followUpQuestion || `Excellent job solving "${activeProblem.title}"! Your solution successfully passed all test cases. What is the time and space complexity of your solution, and how would you optimize it if the input array scaled 100x?`
            };

            set((state) => ({
              recruiterMessages: [...state.recruiterMessages, recruiterMsg]
            }));
          } catch (followErr) {
            console.error('Failed to trigger recruiter followup:', followErr);
          }
        }
      } else {
        set({ loading: false });
      }

      // Sync the code state to DB session
      try {
        await axios.post(`${API_URL}/coding/session`, {
          problemId: activeProblem._id,
          language: activeLanguage,
          code: editorCode
        });
      } catch (err) {}

      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to evaluate solution.';
      set({ 
        error: errMsg, 
        loading: false 
      });
      throw new Error(errMsg);
    }
  },

  skipProblem: async (problemId, search = '', category = '', difficulty = '', company = '') => {
    try {
      await axios.post(`${API_URL}/coding/problems/${problemId}/action`, { action: 'skip' });
      await get().fetchProgress();
      await get().nextProblem(search, category, difficulty, company);
    } catch (error) {
      console.error('Failed to skip problem:', error);
    }
  },

  nextProblem: async (search = '', category = '', difficulty = '', company = '') => {
    const { problems, activeProblem } = get();
    if (problems.length > 0 && activeProblem) {
      const idx = problems.findIndex(p => p._id === activeProblem._id);
      if (idx !== -1 && idx < problems.length - 1) {
        set((state) => ({
          prevProblems: [...state.prevProblems, activeProblem]
        }));
        get().selectProblem(problems[idx + 1]);
        return;
      }
    }
    
    if (activeProblem) {
      set((state) => ({
        prevProblems: [...state.prevProblems, activeProblem]
      }));
    }
    await get().fetchProblems(search, category, difficulty, company);
  },

  prevProblem: () => {
    const { prevProblems } = get();
    if (prevProblems.length === 0) return;

    const newPrev = [...prevProblems];
    const previous = newPrev.pop();

    set({
      prevProblems: newPrev,
      activeProblem: previous,
      editorCode: (previous?.starterTemplates && previous.starterTemplates[get().activeLanguage]) || '',
      evaluation: null,
      aiHint: null,
      aiReview: null,
      aiExplanation: null,
      aiFollowup: null,
      unlockedHintsCount: 0
    });
  },

  randomProblem: async () => {
    const topics = [
      "Arrays", "Strings", "Hash Maps", "Stack", "Queue", "Linked List", "Tree", "BST", "Heap", 
      "Graph", "DFS", "BFS", "Dynamic Programming", "Greedy", "Backtracking", "Sliding Window", 
      "Two Pointer", "Bit Manipulation", "Recursion", "Trie", "Segment Tree", "SQL", 
      "JavaScript", "React", "Node.js", "MongoDB", "System Design", "OOP"
    ];
    const difficulties = ["Easy", "Medium", "Hard"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomDiff = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    await get().nextProblem('', randomTopic, randomDiff, '');
  },

  regenProblem: async (category = '', company = '', difficulty = '') => {
    const targetTopic = category || "Arrays";
    const targetCompany = company || "Google";
    const targetDifficulty = difficulty || "Medium";
    await get().generateAIProblem(targetTopic, targetCompany, targetDifficulty);
  },

  fetchLeaderboard: async () => {
    try {
      const response = await axios.get(`${API_URL}/coding/leaderboard`);
      set({ leaderboard: response.data });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  },

  fetchProgress: async () => {
    try {
      const response = await axios.get(`${API_URL}/coding/progress`);
      set({ 
        progress: {
          ...response.data.progress,
          recommendations: response.data.recommendations
        },
        submissions: response.data.submissions 
      });
    } catch (error) {
      console.error('Failed to fetch coding progress:', error);
    }
  },

  generateAIProblem: async (topic, targetCompany, difficulty) => {
    set({ aiLoading: true, aiError: null });
    try {
      const response = await axios.post(`${API_URL}/coding/generate-problem`, {
        topic,
        targetCompany,
        difficulty
      });

      const newProblem = response.data.problem;
      set((state) => ({
        problems: [newProblem, ...state.problems],
        activeProblem: newProblem,
        editorCode: (newProblem?.starterTemplates && newProblem.starterTemplates[state.activeLanguage]) || '',
        evaluation: null,
        aiLoading: false
      }));
      return true;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to generate AI problem.';
      set({ aiError: errMsg, aiLoading: false });
      throw new Error(errMsg);
    }
  },

  sendRecruiterMessage: async (userMessage) => {
    const { activeProblem, editorCode, activeLanguage, recruiterMessages } = get();
    if (!activeProblem) return;

    const newUserMsg = { sender: 'candidate', text: userMessage };
    set((state) => ({
      recruiterMessages: [...state.recruiterMessages, newUserMsg],
      aiLoading: true,
      aiError: null
    }));

    try {
      const response = await axios.post(`${API_URL}/coding/coach/followup`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage,
        userMessage,
        chatHistory: recruiterMessages.concat(newUserMsg)
      });

      const recruiterMsg = {
        sender: 'recruiter',
        text: response.data.followUpQuestion
      };

      set((state) => ({
        recruiterMessages: [...state.recruiterMessages, recruiterMsg],
        aiLoading: false
      }));
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to send recruiter message.';
      set({ aiError: errMsg, aiLoading: false });
      
      const fallbackMsg = {
        sender: 'recruiter',
        text: "That makes sense. If we look closer at Big-O space complexity, what are the primary hurdles of this structure?"
      };
      set((state) => ({
        recruiterMessages: [...state.recruiterMessages, fallbackMsg]
      }));
    }
  },

  resetRecruiterChat: () => {
    const { activeProblem } = get();
    set({
      recruiterMessages: activeProblem ? [
        {
          sender: 'recruiter',
          text: `Hello! I am your AI Recruiter. I see you are working on "${activeProblem.title}". Let's discuss your implementation details. Once you submit a successful solution, we'll talk about your design decisions, Big-O complexities, and optimizations!`
        }
      ] : []
    });
  },

  getPathProgress: (pathKey) => {
    const { progress, pathsData } = get();
    const pathConfig = pathsData[pathKey];
    if (!pathConfig) return { pct: 0, solvedCount: 0, totalCount: 5 };
    if (!progress || !progress.topicMastery) return { pct: 0, solvedCount: 0, totalCount: pathConfig.totalCount };

    let totalMastery = 0;
    pathConfig.topics.forEach(topic => {
      let topicKey = topic;
      const mastery = progress.topicMastery[topicKey] || 0;
      totalMastery += mastery;
    });

    const pct = Math.round(totalMastery / pathConfig.topics.length);
    const solvedCount = Math.min(
      Math.round((pct / 100) * pathConfig.totalCount),
      pathConfig.totalCount
    );

    return {
      pct: Math.min(pct, 100),
      solvedCount,
      totalCount: pathConfig.totalCount
    };
  },

  getAIHint: async (hintType) => {
    const { activeProblem, editorCode, activeLanguage } = get();
    if (!activeProblem) return;

    set({ aiLoading: true, aiError: null, aiHint: null });
    try {
      const response = await axios.post(`${API_URL}/coding/coach/hint`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage,
        hintType
      });
      set({ aiHint: response.data.hint, aiLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to load AI hint.';
      set({ aiError: errMsg, aiLoading: false });
      throw new Error(errMsg);
    }
  },

  getAICodeReview: async () => {
    const { activeProblem, editorCode, activeLanguage } = get();
    if (!activeProblem) return;

    set({ aiLoading: true, aiError: null, aiReview: null });
    try {
      const response = await axios.post(`${API_URL}/coding/coach/review`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage
      });
      set({ aiReview: response.data, aiLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to generate AI code review.';
      set({ aiError: errMsg, aiLoading: false });
      throw new Error(errMsg);
    }
  },

  getAISolutionExplanation: async () => {
    const { activeProblem, editorCode, activeLanguage } = get();
    if (!activeProblem) return;

    set({ aiLoading: true, aiError: null, aiExplanation: null });
    try {
      const response = await axios.post(`${API_URL}/coding/coach/explain`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage
      });
      set({ aiExplanation: response.data, aiLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to generate AI explanation.';
      set({ aiError: errMsg, aiLoading: false });
      throw new Error(errMsg);
    }
  },

  getAIInterviewFollowUp: async () => {
    const { activeProblem, editorCode, activeLanguage } = get();
    if (!activeProblem) return;

    set({ aiLoading: true, aiError: null, aiFollowup: null });
    try {
      const response = await axios.post(`${API_URL}/coding/coach/followup`, {
        problemId: activeProblem._id,
        code: editorCode,
        language: activeLanguage
      });
      set({ aiFollowup: response.data, aiLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to simulate AI interview follow-up.';
      set({ aiError: errMsg, aiLoading: false });
      throw new Error(errMsg);
    }
  },

  toggleBookmark: async (problemId) => {
    try {
      const response = await axios.post(`${API_URL}/coding/problems/${problemId}/bookmark`);
      await get().fetchProgress();
      return response.data.bookmarked;
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  },

  toggleFavorite: async (problemId) => {
    try {
      const response = await axios.post(`${API_URL}/coding/problems/${problemId}/favorite`);
      await get().fetchProgress();
      return response.data.favorite;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  },

  fetchDailyChallenge: async () => {
    try {
      const response = await axios.get(`${API_URL}/coding/daily-challenge`);
      set({ dailyChallenge: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
    }
  },

  unlockNextHint: async () => {
    const current = get().unlockedHintsCount;
    if (current < 4) {
      set({ unlockedHintsCount: current + 1 });
      const activeProb = get().activeProblem;
      if (activeProb) {
        try {
          await axios.post(`${API_URL}/coding/problems/${activeProb._id}/action`, { action: 'ask' });
          get().fetchProgress();
        } catch (e) {}
      }
    }
  },

  resumeLastSession: () => {
    const lastSession = get().progress?.lastSession;
    if (lastSession && lastSession.problemId) {
      const problem = lastSession.problemId;
      set({
        activeProblem: problem,
        activeLanguage: lastSession.language || 'javascript',
        editorCode: lastSession.code || '',
        evaluation: null,
        error: null,
        unlockedHintsCount: 0
      });
      return true;
    }
    return false;
  }
}));

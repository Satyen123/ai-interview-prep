import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useCodingStore = create((set, get) => ({
  problems: [],
  activeProblem: null,
  activeLanguage: 'javascript',
  editorCode: '',
  evaluation: null, // this will hold the response details: status, runtime, memory, passed etc.
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
      
      // Default to first problem if none is active or active is not in new search
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

  selectProblem: (problem) => {
    const lang = get().activeLanguage;
    set({
      activeProblem: problem,
      editorCode: (problem?.starterTemplates && problem.starterTemplates[lang]) || '',
      evaluation: null,
      error: null,
      aiHint: null,
      aiReview: null,
      aiExplanation: null,
      aiFollowup: null,
      aiError: null,
      recruiterMessages: problem ? [
        {
          sender: 'recruiter',
          text: `Hello! I am your AI Recruiter. I see you are working on "${problem.title}". Let's discuss your implementation details. Once you submit a successful solution, we'll talk about your design decisions, Big-O complexities, and optimizations!`
        }
      ] : []
    });
  },

  setLanguage: (lang) => {
    const { activeProblem } = get();
    if (!activeProblem) return;
    set({
      activeLanguage: lang,
      editorCode: (activeProblem?.starterTemplates && activeProblem.starterTemplates[lang]) || '',
      evaluation: null
    });
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

        // Auto-trigger Recruiter followup dialogue after successful Accept
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
      // Automatically advance to the next question under filters
      await get().nextProblem(search, category, difficulty, company);
    } catch (error) {
      console.error('Failed to skip problem:', error);
    }
  },

  // Practice Navigation Operations
  nextProblem: async (search = '', category = '', difficulty = '', company = '') => {
    const { activeProblem } = get();
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
      aiFollowup: null
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

  // Premium progression & Leaderboard Actions
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
        progress: response.data.progress,
        submissions: response.data.submissions 
      });
    } catch (error) {
      console.error('Failed to fetch coding progress:', error);
    }
  },

  // Dynamic AI Problem Generator
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

  // Recruiter Dialogue Message Handlers
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
        text: "That makes sense. If we look closer at Big-O space complexity, what are the primary scaling hurdles of this structure?"
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

  // Guided Path Calculators
  getPathProgress: (pathKey) => {
    const { progress, pathsData } = get();
    const pathConfig = pathsData[pathKey];
    if (!pathConfig) return { pct: 0, solvedCount: 0, totalCount: 5 };
    if (!progress || !progress.topicMastery) return { pct: 0, solvedCount: 0, totalCount: pathConfig.totalCount };

    let totalMastery = 0;
    pathConfig.topics.forEach(topic => {
      let topicKey = topic;
      // Map Stack / Queue singular/plural cases
      if (topic === "Stack") topicKey = "Stack";
      else if (topic === "Queue") topicKey = "Queue";
      
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

  // Premium AI Coach Actions
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
  }
}));

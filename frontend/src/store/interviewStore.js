import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useInterviewStore = create((set, get) => ({
  activeInterview: null,
  history: [],
  loading: false,
  error: null,
  successSynthesis: null,

  startSession: async (interviewType, difficulty, jobRole, experienceLevel = 'Mid-Level', companyType = 'Startup', interviewerStyle = 'Friendly') => {
    set({ loading: true, error: null, successSynthesis: null });
    try {
      const response = await axios.post(`${API_URL}/interview/start`, { 
        interviewType, 
        difficulty, 
        jobRole, 
        experienceLevel, 
        companyType,
        interviewerStyle
      });
      
      // Save active session to localStorage for resilience
      localStorage.setItem('active_interview_id', response.data._id);
      
      set({ activeInterview: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to start interview session.', 
        loading: false 
      });
      return null;
    }
  },

  submitUserAnswer: async (answer, durationSeconds, endInterview = false) => {
    const { activeInterview } = get();
    if (!activeInterview) return false;

    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/interview/answer`, {
        interviewId: activeInterview._id,
        answer,
        durationSeconds,
        endInterview
      });

      // Check if the response indicates final completion
      if (response.data.message === 'Interview completed and evaluated.') {
        localStorage.removeItem('active_interview_id');
        set({ 
          activeInterview: null, 
          successSynthesis: response.data.interview, 
          loading: false 
        });
        return 'completed';
      } else {
        // Otherwise, update active interview state to step to the next question
        set({ activeInterview: response.data, loading: false });
        return 'next';
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to submit answer.', 
        loading: false 
      });
      return false;
    }
  },

  resumeSession: async () => {
    const activeId = localStorage.getItem('active_interview_id');
    if (!activeId) return null;

    set({ loading: true, error: null });
    try {
      // Set default credentials mapping for axios in case headers are ready
      const response = await axios.get(`${API_URL}/interview/${activeId}`);
      if (response.data && response.data.status === 'in-progress') {
        set({ activeInterview: response.data, loading: false });
        return response.data;
      } else {
        localStorage.removeItem('active_interview_id');
        set({ loading: false });
        return null;
      }
    } catch (error) {
      // Active ID is invalid/deleted/expired
      localStorage.removeItem('active_interview_id');
      set({ loading: false });
      return null;
    }
  },

  endSessionImmediately: async () => {
    const { activeInterview } = get();
    if (!activeInterview) return false;

    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/interview/answer`, {
        interviewId: activeInterview._id,
        answer: '',
        durationSeconds: 0,
        endInterview: true
      });

      localStorage.removeItem('active_interview_id');
      set({ 
        activeInterview: null, 
        successSynthesis: response.data.interview, 
        loading: false 
      });
      return 'completed';
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to terminate session.', 
        loading: false 
      });
      return false;
    }
  },

  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/interview/history`);
      set({ history: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to load history.', 
        loading: false 
      });
    }
  },

  resetStore: () => set({ activeInterview: null, error: null, successSynthesis: null })
}));

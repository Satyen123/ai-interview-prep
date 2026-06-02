import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, User, Loader2, Cpu } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

export default function MentorChat() {
  const [messages, setMessages] = useState([
    {
      sender: 'mentor',
      text: "Hello! I am your AI Placement Mentor. Ask me anything regarding resume writing, system design, HR answers, or coding interview strategies!"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal;
    setInputVal('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    // Call mentor mock synthesis after brief timer (extremely fast and robust)
    setTimeout(() => {
      let reply = "That is a great question. When addressing that aspect in an interview, ensure you utilize the STAR method. Describe a concrete Situation you faced, identify the specific Task you were responsible for, outline the Action you took, and quantify the final Result with clear metrics. Can you tell me more about the project you are referring to?";
      
      const lower = userText.toLowerCase();
      if (lower.includes('resume') || lower.includes('ats')) {
        reply = "To optimize your resume for ATS parsers: 1. Keep formatting to a single column with simple standard fonts (Arial, Calibri). 2. Integrate key technologies matching the job spec directly into your experience bullet points. 3. Group skills into clear blocks (e.g. Frontend, Backend). Check out our ATS Resume Reviewer tab for a full diagnosis!";
      } else if (lower.includes('behavioral') || lower.includes('conflict') || lower.includes('fail')) {
        reply = "When handling behavioral questions about conflict or failure, recruiters want to verify your self-awareness and professional growth. 1. Describe the conflict calmly without blaming anyone. 2. Focus on how you compromised or coordinated. 3. Conclude by describing what you learned and the subsequent success of the project. Always maintain a positive, constructive tone!";
      } else if (lower.includes('system design') || lower.includes('scale')) {
        reply = "For System Design interviews: 1. Start by defining the functional and non-functional requirements (e.g. read latency, write latency). 2. Establish high-level estimation (QPS, storage calculations). 3. Map out a solid core diagram (load balancer, app server, DB replication). 4. Dive into bottleneck resolution (CDNs, Redis cache pools, microservices). Avoid jumping to technology buzzwords immediately without context!";
      }

      setMessages(prev => [...prev, { sender: 'mentor', text: reply }]);
      setLoading(false);
    }, 1200);
  };

  const templates = [
    "How do I structure my Projects section?",
    "Tips to explain a gap in my resume?",
    "Explain horizontal vs vertical scaling.",
    "What is the best format for HR answers?"
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 h-[calc(100vh-120px)]">
        
        {/* Header Title */}
        <div className="text-left shrink-0">
          <span className="text-xs font-bold text-cyber-neon tracking-widest uppercase block mb-2">
            24/7 INTERACTIVE ADVICE
          </span>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            AI Placement Mentor Chatbot
          </h2>
        </div>

        {/* Dynamic Chats Split */}
        <div className="flex-grow glass-panel border border-white/5 rounded-3xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyber-accentGlow filter blur-[100px] pointer-events-none -z-10"></div>

          {/* Messages Console */}
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 text-left">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`
                  flex gap-3 max-w-[80%] items-start
                  ${m.sender === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}
                `}
              >
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border
                  ${m.sender === 'user' 
                    ? 'bg-cyber-neon/15 border-cyber-neon/30 text-cyber-neon' 
                    : 'bg-cyber-accent/15 border-cyber-accent/30 text-cyber-accent'
                  }
                `}>
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5 animate-pulse-slow" />}
                </div>

                {/* Text Bubble */}
                <div className={`
                  p-4 rounded-2xl text-xs leading-relaxed border
                  ${m.sender === 'user' 
                    ? 'bg-cyber-neon/10 border-cyber-neon/20 text-white rounded-tr-none' 
                    : 'bg-white/3 border-white/5 text-gray-300 rounded-tl-none'
                  }
                `}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-3 items-center text-left">
                <div className="w-8 h-8 rounded-full bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl rounded-tl-none text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  AI Mentor is typing answers...
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Quick Predefined prompts */}
          <div className="px-6 pb-2 shrink-0 hidden sm:flex flex-wrap gap-2 select-none border-t border-white/5 pt-4 bg-white/1">
            {templates.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setInputVal(t)}
                className="text-[10px] font-bold bg-white/2 border border-white/5 text-gray-400 hover:text-white hover:border-cyber-accent/40 hover:bg-cyber-accent/5 px-3 py-1.5 rounded-full transition"
              >
                {t}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3 shrink-0 bg-cyber-darker">
            <input
              type="text"
              placeholder="Ask me about resume writing, scaling, behavioral questions..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-grow glass-input py-2 text-xs"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold p-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-cyber-accent/25 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4 shrink-0" />
            </button>
          </form>

        </div>

      </div>
    </PageWrapper>
  );
}

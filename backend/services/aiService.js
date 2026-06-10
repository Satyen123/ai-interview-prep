import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API if key is present
let aiEngine = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    const ai = new GoogleGenerativeAI({ apiKey });
    aiEngine = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Gemini AI Engine Initialized.');
  } catch (error) {
    console.error('Failed to initialize Gemini AI Engine:', error.message);
  }
} else {
  console.log('No GEMINI_API_KEY found. Running in Fallback/Mock AI mode.');
}

export const isAiEngineActive = () => aiEngine !== null;


/**
 * Helper to clean AI JSON responses (removes ```json markdown wrapping if present)
 */
const parseCleanJSON = (text) => {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      // Remove starting ```json or ```
      cleanText = cleanText.replace(/^```(json)?/, '');
      // Remove ending ```
      cleanText = cleanText.replace(/```$/, '');
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error('Failed to parse AI JSON:', error, '\nRaw text was:', text);
    throw new Error('AI returned invalid format. Please try again.');
  }
};

/**
 * 1. Generate Next Question
 */
export const generateQuestion = async (interviewType, difficulty, jobRole, history = [], experienceLevel = 'Mid-Level', companyType = 'Startup', skills = [], interviewerStyle = 'Friendly', resumeText = '') => {
  if (!aiEngine) {
    return getMockQuestion(interviewType, difficulty, jobRole, history.length, history, experienceLevel, companyType, skills, interviewerStyle, resumeText);
  }

  const historyPrompt = history.map((h, i) => 
    `Q${i+1}: ${h.questionText}\nUser A${i+1}: ${h.userAnswer}\nFeedback: ${h.feedback}\nScore: ${h.score}/10\nAttempts: ${h.attempts}\n`
  ).join('\n');

  const skillsString = skills.length > 0 ? skills.join(', ') : 'Software Development, Problem Solving';

  const prompt = `
    You are an expert elite interviewer conducting a highly realistic "${interviewType}" interview for a "${jobRole}" position.
    
    You MUST strictly adhere to ALL of the following candidate, category, personality, difficulty, and company configurations. Fulfilling only some is completely UNACCEPTABLE.

    ==================================================
    1. TARGET JOB PROFILE TOPICS (Selected Role: "${jobRole}")
    ==================================================
    You MUST tailor the technical concepts, frameworks, and domain topics to match this role exactly. No unrelated questions.
    - If "${jobRole}" is "MERN Stack Developer": Focus strictly and ONLY on React, Node.js, Express, MongoDB, Mongoose, JWT, authentication layers, REST APIs, Redux, API integration, and full-stack MERN architecture.
    - If "${jobRole}" is "System Design" or "Systems Engineer": Focus strictly and ONLY on horizontal scaling, load balancing, database sharding, caching strategies, microservices, CAP theorem, distributed systems, and high-level enterprise architecture.
    - If "${jobRole}" is "Frontend Developer": Focus strictly and ONLY on React, JavaScript, CSS architectures, performance optimizations, Virtual DOM, browser rendering pipelines, and state management.
    - If "${jobRole}" is "Data Analyst": Focus strictly and ONLY on SQL queries, Excel formulas, Power BI/visualization, Python data libraries (Pandas/NumPy), statistics, data cleaning, and dataset profiling.
    - If "${jobRole}" is "AI Engineer" or "ML Engineer": Focus strictly and ONLY on supervised/unsupervised machine learning, deep learning models, training pipelines, dataset preprocessing, neural networks, and prompt engineering.
    - If "${jobRole}" is "DevOps Engineer": Focus strictly and ONLY on CI/CD pipelines, Docker, Kubernetes, infrastructure-as-code (IaC), AWS/GCP cloud architectures, and systems monitoring.
    - If "${jobRole}" is "Product Manager": Focus strictly and ONLY on product lifecycle, target user metrics, roadmaps, cross-functional engineering priority matrices, and market placement.
    - If "${jobRole}" is "Cybersecurity Analyst": Focus strictly and ONLY on network security protocols, OWASP Top 10 vulnerabilities, penetration tests, auth standards (OAuth/SAML), and containment actions.
    - For any other custom role (e.g. Cybersecurity, Blockchain, Prompt Engineer, Game Developer, Mobile App Developer, QA Automation): Drill down strictly and exclusively into the specific tools, libraries, architectural frameworks, and core paradigms of that exact role.

    ==================================================
    2. INTERVIEW CATEGORY TYPE (Selected Category: "${interviewType}")
    ==================================================
    You MUST strictly align the type of question to the selected category:
    - If "${interviewType}" is "HR Interview" or "Behavioral": Ask ONLY behavioral, interpersonal, and situational questions (e.g. team conflicts, self-introduction, strengths and weaknesses, leadership challenge, career objectives, why should we hire you). You MUST NOT ask any technical theory, programming concepts, or coding questions under any circumstances.
    - If "${interviewType}" is "Technical Interview" or "Technical": Ask strictly about technical theory, framework internals, architecture, coding concepts, and stack-specific designs.
    - If "${interviewType}" is "Coding Interview" or "Coding": Focus strictly on data structures and algorithms (DSA) concepts, coding logic, time/space complexity analysis, and coding-based optimization problems.
    - If "${interviewType}" is "System Design": Focus strictly on high-level system components, scalability limits, database structures, CDNs, load balancing, and horizontal partitioning.
    - If "${interviewType}" is "Resume-based" or "Resume Viva": Ask strictly and exclusively about items listed on the candidate's custom resume: [resumeText]. Inquire about their specific projects, internships, skills, or certifications. Do NOT ask general questions.
    - If "${interviewType}" is "Project-based" or "Project Discussion": Drill deeply into the details of the candidate's listed projects. Focus on architectural decisions, tech stack choices, performance challenges, and how they optimized them.
    - If "${interviewType}" is "Scenario-based": Pose a production crisis scenario (e.g., severe data corruption, server crash, security breach) and ask them how they would containment and debug.
    - If "${interviewType}" is "Rapid Fire": Ask quick-fire, direct conceptual questions requiring immediate, brief technical responses.

    ==================================================
    3. AI INTERVIEWER PERSONALITY (Selected Style: "${interviewerStyle}")
    ==================================================
    You MUST adopt the exact tone, pressure, follow-up style, and conversational pacing of this style:
    - If "${interviewerStyle}" is "Friendly" or "Friendly Partner": Be supportive, warm, and encouraging. Use calming transitions. If the candidate struggled, offer an encouraging guide or a supportive transition phrase (e.g., "That is a really great attempt! Let's explore...").
    - If "${interviewerStyle}" is "Strict" or "Strict Bar-Raiser": Be formal, critical, cold, and demanding. Cross-question their assertions. If their previous answer was incomplete, explicitly state it is weak/incomplete and ask them to explain deeper (e.g., "That answer lacks detail. Discuss the exact database replication parameters.").
    - If "${interviewerStyle}" is "FAANG-level" or "FAANG Lead": Expect extreme optimal space/time efficiency. Drill aggressively into Big-O, edge cases, microsecond improvements, CDNs, and distributed databases.
    - If "${interviewerStyle}" is "Startup-style" or "Startup Founder": Focus on real-world execution, versatility, high ownership, pragmatism, product-oriented thinking, and building fast.
    - If "${interviewerStyle}" is "HR recruiter": Focus on cultural fit, collaboration skills, emotional quotient, STAR-method scenarios, and long-term career growth.
    - If "${interviewerStyle}" is "Senior engineer" or "Senior Architect": Focus on deep technical trade-offs, index designs, caching consistency anomalies, and database performance bottlenecks.
    - If "${interviewerStyle}" is "Rapid-fire": Keep questions extremely direct, mixed, prompt, and brief, with zero conversational filler.

    ==================================================
    4. DIFFICULTY LEVEL COMPLEXITY (Selected Tier: "${difficulty}")
    ==================================================
    You MUST calibrate the depth of the question to match the difficulty tier:
    - If "${difficulty}" is "Beginner": Ask fundamental, basic conceptual definitions and easy examples (e.g. "What is React?", "What is a closure?", "What is a primary key?").
    - If "${difficulty}" is "Intermediate": Ask moderate real-world implementation questions, basic architecture patterns, and standard APIs.
    - If "${difficulty}" is "Advanced": Ask complex performance optimization scenarios, edge cases, deep internals, scaling bottlenecks, and tradeoffs.
    - If "${difficulty}" is "FAANG" or "Expert": Ask extremely complex distributed systems architecture, concurrency anomalies, system trade-offs, and micro-optimization designs.

    ==================================================
    5. EXPERIENCE LEVEL DEPTH (Selected Level: "${experienceLevel}")
    ==================================================
    You MUST adapt the professional scope and years of experience:
    - If "${experienceLevel}" is "Fresher" or "Beginner": Focus on academic foundations, basic programming constructs, university projects, and internships.
    - If "${experienceLevel}" is "Mid-Level" or "1-3 Years": Focus on production experience, APIs, standard debugging tools, and modular codebase implementation.
    - If "${experienceLevel}" is "Senior" or "3-5 Years": Focus on architecture, scalability bottlenecks, system ownership, and cross-functional team collaboration.
    - If "${experienceLevel}" is "Lead" or "5+ Years": Focus on technical leadership decisions, architectural trade-offs, mentorship scenarios, legacy refactoring, and large-scale technical choices.

    ==================================================
    6. TARGET COMPANY TYPE STYLE (Selected Company: "${companyType}")
    ==================================================
    You MUST align the interview patterns with the company's culture:
    - If "${companyType}" is "FAANG": Focus heavily on data structures and algorithms (DSA) excellence, extreme system scale, and Big-O runtime analysis.
    - If "${companyType}" is "Startup": Focus on full-stack agility, rapid deployment, high ownership, and adaptive problem-solving.
    - If "${companyType}" is "Corporate" or "Product-Based": Focus on modular scalability, production reliability, security compliance, clean code, and robust systems.
    - If "${companyType}" is "Service-Based": Focus on client handling, solid communication, and standard practical implementation guidelines.

    ==================================================
    7. REAL DYNAMIC ADAPTIVE FOLLOW-UP LOGIC
    ==================================================
    - Analyze the last candidate turn in the conversation history. If they performed well (score >= 8), raise the complexity, asking a deep, challenging follow-up or drilling into edge cases. If they struggled (score < 6), offer a gentle transition guiding them to a related concept.
    - Ask logical cross-questions ("Why did you choose that database?", "What if the volume increased 10x?", "How would you handle scale in that scenario?").

    ==================================================
    8. NON-REPETITION & DUPLICATE PREVENTION
    ==================================================
    - **CRITICAL**: Review the conversation history below:
    ${historyPrompt || 'No history. This is the start of the interview.'}
    - You MUST absolutely NEVER ask a question that is identical or semantically similar to any question in the history. Force high variation in topic, wording, and technical focus to ensure infinite unique practice sessions.

    Candidate Resume Content (if available):
    """
    ${resumeText || 'No custom resume loaded.'}
    """

    Return your response strictly in the following JSON format:
    {
      "questionText": "Acknowledge/transition phrase followed by the custom target question"
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    const parsed = parseCleanJSON(result.text);
    return parsed.questionText;
  } catch (error) {
    console.error('generateQuestion error:', error);
    return getMockQuestion(
      interviewType,
      difficulty,
      jobRole,
      history.length,
      history,
      experienceLevel,
      companyType,
      skills,
      interviewerStyle,
      resumeText
    );
  }
};

/**
 * 2. Evaluate Answer
 */
export const evaluateAnswer = async (questionText, userAnswer, jobRole, difficulty) => {
  if (!aiEngine) {
    return getMockAnswerEvaluation(questionText, userAnswer);
  }

  const prompt = `
    You are an expert tech interviewer. Evaluate the candidate's answer below.
    
    Job Role: ${jobRole}
    Difficulty: ${difficulty}
    Question: ${questionText}
    Candidate's Answer: "${userAnswer}"
    
    Evaluate the response and provide:
    1. A score from 0 to 10 (decimal allowed, e.g. 7.5) representing technical correctness and completeness.
    2. A brief, professional, and constructive feedback explanation (2-3 sentences).
    3. An "ideal answer" demonstrating how a stellar candidate would have answered this question.
    
    Return your response strictly in the following JSON format:
    {
      "score": 8.5,
      "feedback": "Your constructive feedback here...",
      "idealAnswer": "The ideal answer here..."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('evaluateAnswer error:', error);
    return getMockAnswerEvaluation(questionText, userAnswer);
  }
};

/**
 * 2b. Evaluate Or Hint Answer
 * Flexible interview assistant loop
 */
export const evaluateOrHintAnswer = async (questionText, userAnswer, jobRole, difficulty, attemptsCount) => {
  if (!aiEngine) {
    return getMockEvaluateOrHint(questionText, userAnswer, attemptsCount);
  }

  const prompt = `
    You are an expert, highly supportive technical and behavioral interviewer evaluating a candidate's answer for a "${jobRole}" position at the "${difficulty}" level.
    
    Current Interview Question: "${questionText}"
    Candidate's Answer: "${userAnswer}"
    This is attempt number: ${attemptsCount + 1} for this specific question (maximum of 2 attempts are allowed).
    
    Behavior Rules:
    - If the candidate explicitly says "skip", wants to skip, or wants to move on, choose action "skip".
    - If the candidate says "I don't know", "not sure", stays silent, or provides an extremely brief/incomplete answer that misses core concepts, AND attemptsCount is 0:
      - Act as a supportive interviewer. Do not make them feel pressured.
      - Acknowledge their effort or partial correctness.
      - Provide a helpful, encouraging hint.
      - Ask a simpler, guiding follow-up question related to the same topic.
      - Choose action "hint" and write the guiding question/hint as "followUpText".
    - Otherwise (if they gave a relatively complete answer, OR if attemptsCount is >= 1):
      - Choose action "evaluate".
      - Provide:
        1. A final score (0 to 10) representing technical correctness, communication clarity, and depth.
        2. Constructive technical/behavioral feedback explanation (2-3 sentences).
        3. A list of 2-3 specific "strengths" in their answer.
        4. A list of 2-3 specific "weaknesses" or areas they missed in their answer.
        5. A list of 1-2 constructive "suggestions" on how they can formulate a better answer.
        6. A list of 1-3 "missingConcepts" or technologies they should have mentioned.
        7. A model "idealAnswer" showing what a top 1% response looks like.

    Return your analysis strictly in the following JSON format:
    {
      "action": "hint" | "evaluate" | "skip",
      "followUpText": "Your supportive hint and simpler follow-up question here (required only if action is 'hint')",
      "score": 7.5,
      "feedback": "Your constructive, helpful technical/behavioral feedback here... (required only if action is 'evaluate' or 'skip')",
      "strengths": ["Clear explanation of closures", "Mentioned garbage collection triggers"],
      "weaknesses": ["Missed time complexity trade-offs", "Did not reference index structures"],
      "suggestions": ["Structure responses using the STAR method", "Incorporate quantitative examples"],
      "missingConcepts": ["Event Loop", "Promises", "Async/Await"],
      "idealAnswer": "The ideal model answer... (required only if action is 'evaluate' or 'skip')"
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('evaluateOrHintAnswer error:', error);
    return getMockEvaluateOrHint(questionText, userAnswer, attemptsCount, jobRole, difficulty);
  }
};

/**
 * 3. Final Synthesis & Assessment
 */
export const synthesizeInterview = async (interviewData) => {
  if (!aiEngine) {
    return getMockSynthesis(interviewData);
  }

  const QAString = interviewData.questions.map((q, i) => 
    `Q${i+1}: ${q.questionText}\nUser A${i+1}: ${q.userAnswer}\nScore: ${q.score}/10\nFeedback: ${q.feedback}\n`
  ).join('\n');

  const prompt = `
    You are an executive hiring panel. Provide a comprehensive summary evaluation based on the following candidate's full mock interview performance.
    
    Job Role: ${interviewData.jobRole}
    Interview Type: ${interviewData.interviewType}
    Difficulty: ${interviewData.difficulty}
    
    Q&A Transcript:
    ${QAString}
    
    Assess the overall performance across the following pillars:
    - Communication Skills (clarity, structuring, brevity)
    - Technical Accuracy (correctness of concepts, algorithmics, or HR logic)
    - Confidence & Delivery
    - Grammar & Phrasing Suggestions
    - General Behavioral Tips
    
    Provide an overall score out of 100.
    
    Return your evaluation strictly in the following JSON format:
    {
      "overallScore": 78,
      "communication": "Provide 2-3 sentences on their vocal/written clarity and conciseness.",
      "technicalAccuracy": "Provide 2-3 sentences on the correctness and depth of their technical responses.",
      "confidence": "Provide 1-2 sentences on their conversational tone and assurance.",
      "grammarSuggestions": "Provide specific recommendations regarding grammar, vocabulary, or phrasing fixes.",
      "behavioralTips": "Provide constructive behavioral or body language/delivery guidelines for future interviews."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('synthesizeInterview error:', error);
    return getMockSynthesis(interviewData);
  }
};

/**
 * 4. ATS Resume Analyzer
 */
export const analyzeResume = async (resumeText, targetRole = 'Software Engineer') => {
  if (!aiEngine) {
    return getMockResumeAnalysis(resumeText, targetRole);
  }

  const prompt = `
    You are an elite executive recruiter and an advanced ATS (Applicant Tracking System) parser algorithm.
    Analyze the following extracted text of a candidate's resume.
    
    Target Role specified by candidate: "${targetRole}"
    
    Resume Text Content:
    ---
    ${resumeText}
    ---
    
    Perform a granular, personalized, and deep evaluation. Acknowledge and audit every single section (Skills, Experience, Projects, Formatting, and Structure).
    
    Task requirements:
    1. **Domain Detection**: Automatically analyze the resume's tech stack and context to detect their actual domain/job-role (e.g. MERN Developer, Data Analyst, AI Engineer, Java Developer, Frontend Developer, Backend Developer, DevOps Engineer). Set this as "detectedRole".
    2. **ATS Scoring**: Calculate a dynamic, realistic ATS score between 40% and 98% based on technical matching, experience relevance, action verb presence, formatting structures, and layout scannability.
    3. **Keyword Intelligence**: Compare their resume against industry-standard keywords for their detected domain. Extract:
       - Matched technical keywords.
       - Missing keywords/technologies highly recommended for this profile.
       - Recommended keywords to target.
       - Matched keywords percentage (0-100%).
    4. **Detailed Recruiter Critiques**: Write explicit comments explaining exactly:
       - WHY the ATS score is at this level.
       - HOW specifically they can rewrite sections to increase readability.
       - WHAT projects or experience bullets need quantitative metrics (using the STAR format).
    
    Return your analysis strictly in the following JSON format:
    {
      "atsScore": 76,
      "detectedRole": "MERN Developer",
      "atsKeywordMatchPercentage": 64,
      "extractedSkills": ["React", "Node.js", "JavaScript", "HTML", "CSS"],
      "matchedKeywords": ["React", "Express", "Node.js", "Git"],
      "missingKeywords": ["MongoDB", "Mongoose", "Docker", "Jest", "TypeScript"],
      "recommendedKeywords": ["Redis", "AWS S3", "CI/CD Pipelines", "Tailwind CSS"],
      "suggestions": {
        "formatting": [
          "Format phone numbers in standard +1 or international formats.",
          "Remove graphical charts or skill level progress bars, as standard ATS parsers fail to parse graphic data."
        ],
        "projectDescriptions": [
          "Rewrite 'Two Sum project' bullet: 'Built a algorithm solver' to 'Architected a low-latency DSA solver in JavaScript, handling edge cases and improving average assertions speed by 14%'."
        ],
        "actionVerbs": [
          "Replace passive verbs like 'helped with' or 'worked on' with power verbs like 'spearheaded', 'automated', and 'integrated'."
        ],
        "weakSections": [
          "The experience bullets contain zero performance metrics. Add quantitative results (e.g. speedups, database load drops)."
        ]
      },
      "detailedFeedback": {
        "whyScoreIsLow": "Your score is moderate due to a mismatch in key databases (MongoDB/Mongoose) and a lack of quantifiable metrics inside your projects section.",
        "howToImprove": "To maximize this score, incorporate missing keywords (e.g., Mongoose, Jest) and rewrite project details using power active verbs.",
        "whatSectionsNeedRewriting": "The Projects section needs immediate revision to outline the situation, task, action, and clear results (using metrics)."
      },
      "recommendedRoles": ["Frontend Developer", "MERN Developer", "React Engineer"],
      "strengths": [
        "Strong fundamental JavaScript knowledge.",
        "Clear professional layout with distinct section borders."
      ],
      "weaknesses": [
        "Missing modern cloud infrastructure keywords (Docker/AWS).",
        "Passive achievements phrasing."
      ],
      "recruiterImpression": "The candidate has strong foundational skills in JS/React but needs more focus on database design, automated testing, and active delivery phrasing to stand out.",
      "interviewReadinessScore": 68
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('analyzeResume error:', error);
    return getMockResumeAnalysis(resumeText, targetRole);
  }
};

/**
 * 4b. AI ATS-Friendly Resume Generator
 * Premium feature to rewrite and optimize a resume
 */
export const optimizeResumeText = async (resumeText, targetRole = 'Software Engineer') => {
  if (!aiEngine) {
    return getMockResumeOptimization(resumeText, targetRole);
  }

  const prompt = `
    You are an elite resume editor, an expert technical recruiter, and an advanced ATS optimization algorithm.
    Analyze the following resume text and automatically generate a completely rewritten, highly optimized, ATS-friendly professional resume for the target role: "${targetRole}".
    
    Resume Content:
    ---
    ${resumeText}
    ---
    
    Task Constraints:
    1. **STRICT DATA PRESERVATION GUARANTEE**:
       - Absolutely NEVER modify, alter, or omit key original details: project titles, company names, employment dates, university/degree credentials, GPA/CGPA, certifications, or custom contact links.
       - Do NOT hallucinate fake job roles, companies, or experiences.
    2. **ATS OPTIMIZATION**:
       - Compile a compelling, highly punchy Professional Summary Statement tailored to the target role "${targetRole}".
       - Formulate a targeted Skills list (technical frameworks highly sought after for a "${targetRole}").
       - Professional Experience: Enhance phrasing by rewriting all experience bullets to start with strong power verbs (e.g. Spearheaded, Engineered, Automated, Architected, Orchestrated) and structure details using quantified STAR metrics (Situation, Task, Action, Result) based strictly on the original numbers.
       - Projects: Polish bullet descriptions with high-impact, professional technical outcomes.
       - Internships, Leadership: Re-write bullets to conform to professional STAR standards with action verbs and metrics.
       - Certifications, Achievements, Extracurriculars: Extract and clean them into explicit arrays of strings.
       - Education: Deconstruct into a clean list of structured schools, degrees, durations, and details.
    3. **ATS Metrics**:
       - Calculate a new "afterScore" (between 88% and 98%) representing the ATS score of this new optimized version.
       - Estimate the original "beforeScore" (between 40% and 75%).
       - Compile 3-4 key "highlights" of what specific AI improvements were made.
    
    Return your response strictly in the following JSON format:
    {
      "name": "Candidate Name",
      "email": "email@example.com",
      "phone": "+1 (555) 123-4567",
      "linkedin": "linkedin.com/in/username",
      "summary": "Professional summary statement...",
      "skills": ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript"],
      "experience": [
        {
          "role": "Software Engineer Intern",
          "company": "Tech Corp",
          "duration": "2024 - Present",
          "bullets": [
            "Spearheaded database migrations to PostgreSQL, reducing average request latencies by 24%.",
            "Automated cross-functional environment deployments, saving 4 development hours weekly."
          ]
        }
      ],
      "projects": [
        {
          "title": "AI Mock Assessment Platform",
          "tech": "MERN Stack, OpenAI API",
          "bullets": [
            "Engineered a high-performance interview cockpit, increasing transcript response speeds by 22%."
          ]
        }
      ],
      "internships": [
        {
          "role": "Full Stack Intern",
          "company": "Scale Apps LLC",
          "duration": "Summer 2023",
          "bullets": [
            "Developed responsive administrative user portals using React, improving customer onboarding by 18%."
          ]
        }
      ],
      "certifications": [
        "AWS Certified Solutions Architect - Associate",
        "Oracle Certified Java Associate"
      ],
      "achievements": [
        "Won 1st place in National Level Smart India Hackathon out of 180 teams",
        "Solved 400+ competitive programming algorithmic puzzles on LeetCode"
      ],
      "educationList": [
        {
          "school": "State Institute of Technology",
          "degree": "Bachelor of Technology in Computer Science",
          "duration": "2021 - 2025",
          "details": "CGPA: 9.1/10. Coursework: Algorithms, Database Management."
        }
      ],
      "leadership": [
        {
          "role": "Technical Lead",
          "organization": "Google Developer Student Club",
          "duration": "2023 - 2024",
          "bullets": [
            "Led a group of 8 junior developers building open-source community learning websites."
          ]
        }
      ],
      "extracurriculars": [
        "Volunteered at local community coding bootcamps to mentor underprivileged youth",
        "Active core organizer for the annual college cultural festival"
      ],
      "beforeScore": 62,
      "afterScore": 92,
      "highlights": [
        "Injected high-frequency target keywords matching the ${targetRole} spec.",
        "Rewrote experience bullets to emphasize quantified business and technical deliverables."
      ]
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('optimizeResumeText error:', error);
    return getMockResumeOptimization(resumeText, targetRole);
  }
};

/**
 * 4c. AI Bullet Enhancer Service
 */
export const enhanceBulletText = async (bulletText, targetRole = 'Software Engineer', temperature = 0.7) => {
  if (!aiEngine) {
    return getDynamicMockBulletEnhancement(bulletText, targetRole);
  }

  const prompt = `
    You are an elite recruiter and tech career coach. Enhance the following resume bullet point using the STAR method (Situation, Task, Action, Result) for a "${targetRole}" position.
    
    User Input: "${bulletText}"
    
    Instructions:
    1. Rewrite this statement to be highly impactful, starting with a strong active power verb (e.g. Spearheaded, Engineered, Automated, Architected, Designed).
    2. Inject high-frequency technical or professional keywords relevant to a "${targetRole}".
    3. Add a realistic, quantified metric (e.g. improve page speed by 25%, reduce latencies by 32%, save 4 local development hours weekly).
    4. Keep it concise, professional, and matching ATS scannability standards.
    5. Return your response strictly in the following JSON format:
    {
      "enhancedText": "Your highly optimized, recruiter-ready STAR bullet point statement..."
    }
  `;

  try {
    const result = await aiEngine.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: parseFloat(temperature) }
    });
    const parsed = parseCleanJSON(result.text);
    return parsed.enhancedText;
  } catch (error) {
    console.error('enhanceBulletText error:', error);
    return getDynamicMockBulletEnhancement(bulletText, targetRole);
  }
};

/**
 * 4d. AI Project Bullet Generator Service
 */
export const generateProjectBullets = async (topic, techStack, targetRole = 'Software Engineer', temperature = 0.7) => {
  if (!aiEngine) {
    return getDynamicMockProjectDescription(topic, techStack, targetRole);
  }

  const prompt = `
    You are an expert technical assessor. Generate 3 distinct, high-impact bullet points for a project in a developer's portfolio.
    
    Project Topic: "${topic}"
    Tech Stack: "${techStack}"
    Target Role: "${targetRole}"
    
    Instructions:
    1. Create exactly 3 bullet points outlining different facets of implementation:
       - Bullet 1: Technical Architecture & Core action (design, API orchestration, backend setups).
       - Bullet 2: State management, synchronization, or real-time connectivity.
       - Bullet 3: Automated testing, optimization, metrics, or deployment achievements.
    2. Start each bullet point with a powerful active action verb.
    3. Infuse actual technologies listed in the Tech Stack: "${techStack}".
    4. Inject quantified performance metrics (e.g. 28% latency drop, 15% bandwidth saves).
    5. Return your response strictly in the following JSON format:
    {
      "bullets": [
        "Bullet point 1 detailing core architecture using ${techStack}...",
        "Bullet point 2 detailing state, APIs, or real-time features...",
        "Bullet point 3 detailing testing, metrics, or optimizations..."
      ]
    }
  `;

  try {
    const result = await aiEngine.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: parseFloat(temperature) }
    });
    const parsed = parseCleanJSON(result.text);
    return parsed.bullets;
  } catch (error) {
    console.error('generateProjectBullets error:', error);
    return getDynamicMockProjectDescription(topic, techStack, targetRole);
  }
};

/**
 * 4e. AI Cover Letter Service
 */
export const generateCoverLetterText = async (companyName, jobRole, skills = [], projects = [], experience = [], tone = 'Professional', temperature = 0.7) => {
  if (!aiEngine) {
    return getDynamicMockCoverLetter(companyName, jobRole, skills, projects, experience, tone);
  }

  const prompt = `
    You are an expert copywriter. Write a highly personalized, recruiter-ready cover letter that sounds authentic, persuasive, and completely human.
    
    Target Company: "${companyName}"
    Target Job Role: "${jobRole}"
    Selected Writing Tone: "${tone}" (Make sure to adapt the vocabulary, pacing, and style to this tone:
      - "Professional": Balanced, confident, industry-standard structure.
      - "Corporate": Highly formal, conservative, emphasizing standard processes, alignment, and metrics.
      - "Friendly": Enthusiastic, conversational, warm, showing high passion for teamwork.
      - "Startup": Energetic, bold, ownership-focused, highlighting agility, rapid scaling, and fast learning.
      - "Formal": Strictly academic, traditional, highly respectful salutations.)
      
    Candidate Key Skills: "${skills.join(', ') || 'Software Development, Scalable APIs, Front-End UI'}"
    Notable Projects: "${projects.join('; ') || 'Scalable Web Application development'}"
    Experience level: "${experience.join('; ') || 'Full stack internship accomplishments'}"
    
    Instructions:
    1. Avoid robotic, repetitive, and buzzword-loaded paragraphs. The cover letter must sound like it was crafted by a high-caliber human candidate.
    2. Reference the target company "${companyName}" and target role "${jobRole}" naturally inside the opening lines.
    3. Select 1-2 skills from "${skills.join(', ')}" and highlight how they solve actual operational or scale needs in a ${jobRole} role.
    4. Reference a specific candidate project or experience ("${projects[0] || 'Web system development'}") and describe the technical execution and quantified performance impact (e.g. 24% load drops, saving local dev hours).
    5. Ensure a strong, punchy closing signature with a clear call-to-action (interview readiness).
    
    Return your response strictly in the following JSON format:
    {
      "coverLetter": "The complete text of the personalized cover letter..."
    }
  `;

  try {
    const result = await aiEngine.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: parseFloat(temperature) }
    });
    const parsed = parseCleanJSON(result.text);
    return parsed.coverLetter;
  } catch (error) {
    console.error('generateCoverLetterText error:', error);
    return getDynamicMockCoverLetter(companyName, jobRole, skills, projects, experience, tone);
  }
};



/**
 * 5. Explain Coding Solution
 */
export const analyzeCodeComplexity = async (problemTitle, code, language) => {
  if (!aiEngine) {
    return {
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      explanation: 'This solution uses a single pass over the elements and does not allocate additional non-trivial memory.',
      refactoringTips: 'You can combine the conditional checks to simplify the logical branches.'
    };
  }

  const prompt = `
    You are a competitive programming coach and code reviewer.
    Analyze the following code submission for the problem: "${problemTitle}".
    
    Language: ${language}
    Code:
    ---
    ${code}
    ---
    
    Evaluate the time complexity, space complexity, describe how the logic behaves, and offer 1-2 optimization/refactoring tips if applicable.
    
    Return your response strictly in the following JSON format:
    {
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)",
      "explanation": "Provide a brief description of why these complexities apply and how the code processes inputs.",
      "refactoringTips": "Provide concrete refactoring or optimization steps."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('analyzeCodeComplexity error:', error);
    return {
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      explanation: 'Fallback: This solution has been parsed locally. Complexity is estimated based on common patterns.',
      refactoringTips: 'Ensure edge cases (empty array, null objects) are verified.'
    };
  }
};

/* ==========================================
   MOCK/FALLBACK GENERATORS
========================================== */

function getMockQuestion(type, difficulty, role, index, history = [], experienceLevel = 'Mid-Level', companyType = 'Startup', skills = [], interviewerStyle = 'Friendly', resumeText = '') {
  let transition = "";
  if (history.length > 0) {
    const lastQ = history[history.length - 1];
    const lowerAns = lastQ.userAnswer?.toLowerCase() || "";
    const struggled = lastQ.attempts > 0 || lastQ.score < 6 || lowerAns.includes("i don't know") || lowerAns.includes("not sure") || lowerAns === "";
    
    if (struggled) {
      transition = `[Tone: ${interviewerStyle}] I completely understand, that can be a tough area. Let's pivot and try a different angle. `;
    } else {
      transition = `[Tone: ${interviewerStyle}] Excellent, you formulated that very well. Building on top of your response, let's go deeper. `;
    }
  }

  // 1. Role Topics Database
  const roleTopics = {
    'MERN Stack Developer': [
      'React state synchronization (useState/useEffect) vs Redux Toolkit architecture',
      'Mongoose schema relationships, validation middleware, and secure password hashing',
      'JSON Web Tokens (JWT) storage strategies, access vs refresh tokens, and CSRF protection',
      'Node.js non-blocking I/O event loops, cluster modules, and streaming high-volume endpoints',
      'MongoDB query index optimization, aggregation pipelines, and transaction rollbacks'
    ],
    'Frontend Developer': [
      'Virtual DOM reconciliation algorithm and paint performance optimization in React',
      'Browser rendering critical path, reflows, repaints, and lazy loading assets',
      'State management libraries (Redux, Zustand) vs native Context API performance',
      'CSS architectures (Tailwind, CSS Modules) and responsive flex/grid containment layouts',
      'Web Vitals metrics (LCP, FID, CLS) and modern front-end bundling optimizations'
    ],
    'Backend Developer': [
      'RESTful API design principles, status codes, and security headers (Helmet)',
      'Relational database indexes, transactions, ACID compliance vs NoSQL structures',
      'Asynchronous task workers (BullMQ, Celery) and message broker (RabbitMQ/Redis) patterns',
      'Server-side caching architectures (Redis, Memcached) and eviction policy logic',
      'API security, OAuth2 validation, rate limiting, and secure hashing algorithms'
    ],
    'Data Analyst': [
      'Complex SQL window functions, CTEs, self-joins, and database profiling methods',
      'Python statistical computing libraries (Pandas dataframes, NumPy arrays, SciPy calculations)',
      'Data preprocessing, handling missing variables, deduplication, and anomaly filters',
      'Dashboard visualization metrics in Power BI/Tableau for non-technical stakeholders',
      'A/B testing methodologies, hypothesis assertions, p-values, and statistical significance'
    ],
    'AI Engineer': [
      'Neural network learning pipelines, backpropagation, and gradient descent optimizations',
      'Supervised vs unsupervised learning models (Random Forest, SVM, K-Means cluster partitioning)',
      'LLM prompt engineering techniques, few-shot prompting, and RAG architectures',
      'Transformer neural networks, self-attention layers, and vector databases (Pinecone/Chroma)',
      'Model evaluation metrics (Precision, Recall, F1-Score, ROC-AUC curves) and overfitting solutions'
    ],
    'ML Engineer': [
      'Neural network learning pipelines, backpropagation, and gradient descent optimizations',
      'Supervised vs unsupervised learning models (Random Forest, SVM, K-Means cluster partitioning)',
      'LLM prompt engineering techniques, few-shot prompting, and RAG architectures',
      'Transformer neural networks, self-attention layers, and vector databases (Pinecone/Chroma)',
      'Model evaluation metrics (Precision, Recall, F1-Score, ROC-AUC curves) and overfitting solutions'
    ],
    'DevOps Engineer': [
      'CI/CD automation pipelines (GitHub Actions, Jenkins) and environment consistency',
      'Docker containerization optimization, multi-stage builds, and microservice networking',
      'Kubernetes cluster scaling, ingress controller routing, pods, and replica configurations',
      'Infrastructure-as-Code (IaC) design using Terraform modules and state isolation',
      'Systems health monitoring logs, Prometheus metrics, Grafana dashboards, and alerting thresholds'
    ],
    'System Design': [
      'Horizontal scaling strategies, database partitioning (sharding), and master-slave replication',
      'Global Content Delivery Networks (CDNs), reverse proxies, and Nginx load balancing',
      'Distributed caching systems, write-through vs write-behind consistency paradigms',
      'Microservices architecture communication patterns (REST, gRPC, Event-driven message streams)',
      'CAP Theorem trade-offs, consistency levels, and highly available distributed systems'
    ],
    'Systems Engineer': [
      'Horizontal scaling strategies, database partitioning (sharding), and master-slave replication',
      'Global Content Delivery Networks (CDNs), reverse proxies, and Nginx load balancing',
      'Distributed caching systems, write-through vs write-behind consistency paradigms',
      'Microservices architecture communication patterns (REST, gRPC, Event-driven message streams)',
      'CAP Theorem trade-offs, consistency levels, and highly available distributed systems'
    ],
    'Product Manager': [
      'Product lifecycle management, definition of MVP, and roadmapping prioritizations',
      'A/B testing data analysis, user engagement metrics, churn rates, and growth loops',
      'Cross-functional alignment frameworks and engineering prioritization algorithms (RICE/Kano)',
      'Market validation strategies, competitive analysis, and customer acquisition funnels',
      'Defining product success criteria, telemetry KPIs, and feedback loops'
    ],
    'Cybersecurity Analyst': [
      'OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF) and remediation plans',
      'Network protocol security (TLS/SSL handshakes, IPSec, DNSSEC) and firewalls',
      'Access control mechanisms (RBAC, ABAC, MFA) and authentication flows (OAuth2/SAML)',
      'Incident response containment strategies and post-mortem analysis methodologies',
      'Penetration testing principles, vulnerability scans, and security auditing metrics'
    ]
  };

  // Safe fallback for custom roles
  const getCustomRoleTopics = (customRole) => [
    `architectural paradigms, tools, and best-practice frameworks specific to a ${customRole} role`,
    `common bottlenecks, data flow synchronizations, and system design challenges in ${customRole} systems`,
    `optimizing processing latencies, data security, and API scaling in a standard ${customRole} environment`,
    `debugging techniques, error mitigation steps, and codebase modularity for a ${customRole} engineer`,
    `the core technologies, third-party libraries, and fundamental standards defining the ${customRole} landscape`
  ];

  const matchedRole = Object.keys(roleTopics).find(r => r.toLowerCase() === role.toLowerCase() || role.toLowerCase().includes(r.toLowerCase()));
  const topics = matchedRole ? roleTopics[matchedRole] : getCustomRoleTopics(role);
  const topic = topics[index % topics.length];

  // 2. Interview Category Type Templates
  const categoryTemplates = {
    'HR Interview': [
      "Tell me about a time you had a major conflict with a team member while working as a {role}. How did you resolve it, and what did you learn?",
      "Why do you want to join our organization in a {role} capacity? How do your values align with our engineering culture?",
      "Describe a challenging situation in your career where you made a mistake. What were the consequences, and how did you rectify it?",
      "How do you handle tight project deadlines or scope creep when designing features for a {role} stack?",
      "Where do you see your career progression as a {role} in the next five years? What skills are you planning to master?"
    ],
    'HR': [
      "Tell me about a time you had a major conflict with a team member while working as a {role}. How did you resolve it, and what did you learn?",
      "Why do you want to join our organization in a {role} capacity? How do your values align with our engineering culture?",
      "Describe a challenging situation in your career where you made a mistake. What were the consequences, and how did you rectify it?",
      "How do you handle tight project deadlines or scope creep when designing features for a {role} stack?",
      "Where do you see your career progression as a {role} in the next five years? What skills are you planning to master?"
    ],
    'Behavioral': [
      "Describe a situation where you had to lead an initiative or take full ownership of a {role} feature. What was the outcome?",
      "Tell me about a time you worked with a difficult manager or client. How did you manage communication to keep the project on track?",
      "Explain a scenario where you had to explain a complex technical concept in the {role} domain to a non-technical stakeholder. How did you approach it?",
      "Give an example of a goal you set for yourself in your {role} journey and how you went about achieving it.",
      "What would you do if a team member was not pulling their weight on a critical {role} deliverable? How would you handle it?"
    ],
    'Technical Interview': [
      "Let's dive into the core mechanisms. Explain how {topic} works under the hood. What are its internal trade-offs?",
      "When designing a production system for a {role} application, how do you handle concurrency, state synchronization, or database connection pools?",
      "Explain the key architectural differences between standard design patterns in {topic}. When would you choose one over the other?",
      "What are the major performance bottlenecks associated with {topic}, and how do you profile and optimize them in high-throughput applications?",
      "Discuss the security implications of {topic}. How do you safeguard a live application against common vulnerabilities in this layer?"
    ],
    'Technical': [
      "Let's dive into the core mechanisms. Explain how {topic} works under the hood. What are its internal trade-offs?",
      "When designing a production system for a {role} application, how do you handle concurrency, state synchronization, or database connection pools?",
      "Explain the key architectural differences between standard design patterns in {topic}. When would you choose one over the other?",
      "What are the major performance bottlenecks associated with {topic}, and how do you profile and optimize them in high-throughput applications?",
      "Discuss the security implications of {topic}. How do you safeguard a live application against common vulnerabilities in this layer?"
    ],
    'Coding Interview': [
      "Given a production pipeline for a {role} application, how would you design an algorithm to find duplicates or filter invalid elements from a high-volume data stream? What is the Big-O time and space complexity?",
      "Explain how you would write a function to reverse or manipulate a custom data structure (like a tree or linked list) in-place. Walk me through your pointer management and edge cases.",
      "How would you design a memory-efficient data structure to support fast lookup, insertion, and retrieval of {role} operational logs in constant time?",
      "Describe how you would solve a complex algorithmic puzzle (like parsing nested brackets or tracking frequency indexes) using a Hash Map. How do you optimize its average runtime?",
      "Explain the binary search approach. How would you apply it to optimize searching through a sorted stream of {role} transactions, and what is its efficiency compared to linear scans?"
    ],
    'Coding': [
      "Given a production pipeline for a {role} application, how would you design an algorithm to find duplicates or filter invalid elements from a high-volume data stream? What is the Big-O time and space complexity?",
      "Explain how you would write a function to reverse or manipulate a custom data structure (like a tree or linked list) in-place. Walk me through your pointer management and edge cases.",
      "How would you design a memory-efficient data structure to support fast lookup, insertion, and retrieval of {role} operational logs in constant time?",
      "Describe how you would solve a complex algorithmic puzzle (like parsing nested brackets or tracking frequency indexes) using a Hash Map. How do you optimize its average runtime?",
      "Explain the binary search approach. How would you apply it to optimize searching through a sorted stream of {role} transactions, and what is its efficiency compared to linear scans?"
    ],
    'System Design': [
      "How would you design a highly scalable, real-time tracking service specifically tailored for {role} systems? Focus on database choice, horizontal sharding, and latency optimization.",
      "Design a distributed load-balanced gateway for a high-volume {role} platform. Discuss CDN placements, caching strategies, and reverse proxies.",
      "How would you architect a fault-tolerant notification or queuing system to support 10 million active connections? Discuss message brokers (RabbitMQ/Redis) and consistency models.",
      "Design a secure, distributed rate-limiting middleware to protect our private {role} endpoints. How do you synchronize state across multiple instances in Redis?",
      "Explain how you would architect a microservices-based system to handle a severe peak volume spike (e.g. 100x traffic). Discuss CAP theorem trade-offs and databases."
    ],
    'Resume-based': [
      "Looking at your custom resume, I see you have experience with relevant frameworks. Can you explain how you applied these skills to build or optimize one of your key projects?",
      "Your resume outlines key accomplishments. As a {role}, how did you ensure clean code standards and apply SOLID design patterns to keep the codebase modular?",
      "Discuss the most complex technical hurdle listed on your resume. What was the challenge, what action did you take, and how did you measure success?",
      "In your profile, you mentioned specific technical skills. Can you explain how you designed a system to solve a database or rendering bottleneck using these?",
      "Your experience lists collaborative achievements. What was your specific architectural contribution to the projects, and how did it impact the final delivery?"
    ],
    'Resume Viva': [
      "Looking at your custom resume, I see you have experience with relevant frameworks. Can you explain how you applied these skills to build or optimize one of your key projects?",
      "Your resume outlines key accomplishments. As a {role}, how did you ensure clean code standards and apply SOLID design patterns to keep the codebase modular?",
      "Discuss the most complex technical hurdle listed on your resume. What was the challenge, what action did you take, and how did you measure success?",
      "In your profile, you mentioned specific technical skills. Can you explain how you designed a system to solve a database or rendering bottleneck using these?",
      "Your experience lists collaborative achievements. What was your specific architectural contribution to the projects, and how did it impact the final delivery?"
    ],
    'Project-based': [
      "Let's discuss the technical architecture of your key projects. What was the biggest scaling or performance challenge you faced in your {role} projects, and how did you resolve it?",
      "In your major projects, how did you handle data consistency, API design, and asynchronous operations? Why did you select that specific tech stack?",
      "What was the most challenging technical decision or architectural trade-off you had to make in your portfolio projects? What other options did you consider?",
      "How did you implement testing, logging, and environment configuration in your main projects? How did you write integration and unit assertions?",
      "If you were to rebuild your main portfolio project from scratch today, what major design decisions would you change to improve its scalability and reliability?"
    ],
    'Project Discussion': [
      "Let's discuss the technical architecture of your key projects. What was the biggest scaling or performance challenge you faced in your {role} projects, and how did you resolve it?",
      "In your major projects, how did you handle data consistency, API design, and asynchronous operations? Why did you select that specific tech stack?",
      "What was the most challenging technical decision or architectural trade-off you had to make in your portfolio projects? What other options did you consider?",
      "How did you implement testing, logging, and environment configuration in your main projects? How did you write integration and unit assertions?",
      "If you were to rebuild your main portfolio project from scratch today, what major design decisions would you change to improve its scalability and reliability?"
    ],
    'Scenario-based': [
      "Imagine a critical production server crashes under high volume right before a major client release. As a {experienceLevel} {role}, what are your immediate isolation and debugging steps?",
      "You discover a severe security exploit in the authentication logic of a live {role} application. What are your immediate containment steps to protect user data?",
      "Your database queries are spiking and slowing down dashboard load times in a live application. How do you analyze, index, and optimize the query execution plans?",
      "A third-party API that your {role} system heavily relies on starts throwing consistent timeouts and 500 errors. How do you implement resilience patterns (like circuit breakers or fallback caching) to safeguard your app?",
      "A distributed system you manage experiences a split-brain scenario or consistency mismatch. How do you restore data integrity and synchronize state across cluster nodes?"
    ],
    'Rapid Fire': [
      "Quick conceptual check: What is the primary difference between synchronous and asynchronous execution in {role} applications?",
      "In one sentence, explain what a database transaction is and why ACID compliance matters in {role} systems.",
      "Explain what CORS is and how you configure secure headers to allow cross-origin requests safely.",
      "What is the key difference between horizontal and vertical scaling, and when would you choose database sharding?",
      "What is a memory leak, and how do you track and profile memory usage in your active {role} applications?"
    ]
  };

  const matchedType = Object.keys(categoryTemplates).find(t => t.toLowerCase() === type.toLowerCase() || type.toLowerCase().includes(t.toLowerCase()));
  const templates = matchedType ? categoryTemplates[matchedType] : categoryTemplates['Technical Interview'];
  const template = templates[index % templates.length];

  let rawQuestion = template.replace(/{role}/g, role).replace(/{topic}/g, topic);

  // 3. AI Interviewer Personality tone prefixes
  const interviewerStylePrefixes = {
    'Friendly': [
      `[Tone: Friendly] Hello! It is so nice to have you here today. Let's start with a really interesting topic.`,
      `[Tone: Friendly] Fantastic attempt on the last point. Building on that, let's explore a new direction.`,
      `[Tone: Friendly] You are doing very well. Let's discuss a core concept in this setup.`,
      `[Tone: Friendly] That is a great perspective. I'd love to hear your thoughts on another key aspect.`,
      `[Tone: Friendly] Awesome. Let's shift our focus slightly to look at a very practical problem.`
    ],
    'Strict': [
      `[Tone: Strict] Defend your architectural decision-making here. Be highly specific.`,
      `[Tone: Strict] That explanation covers only the basics. Drill down and explain the exact internal mechanics of this concept.`,
      `[Tone: Strict] Let's raise the bar. Explain the deep production failure modes and trade-offs of this approach.`,
      `[Tone: Strict] I want you to be highly critical of standard implementations here. How would you solve this bottleneck?`,
      `[Tone: Strict] Let's move directly to a more challenging problem. Discuss this explicitly.`
    ],
    'FAANG-level': [
      `[Tone: FAANG-level] Welcome to the high-scale engineering loop. We expect optimal performance and Big-O runtime analysis.`,
      `[Tone: FAANG-level] Let's look at extreme scale. Assume a dataset size of 100 million active users. How would you solve this?`,
      `[Tone: FAANG-level] Let's talk microsecond optimization, cache consistency anomalies, and distributed systems tradeoffs.`,
      `[Tone: FAANG-level] Defend your choice of data structures. What are the average and worst-case space-time complexities?`,
      `[Tone: FAANG-level] Let's design a highly available, fault-tolerant implementation. Focus on system limitations and scale.`
    ],
    'Startup-style': [
      `[Tone: Startup-style] Hey! We're building fast and need high agility, ownership, and pragmatic execution.`,
      `[Tone: Startup-style] Let's look at real-world building. How do you implement this quickly while keeping code clean?`,
      `[Tone: Startup-style] We need to ship this feature by tomorrow. What practical trade-offs would you make to ensure reliability?`,
      `[Tone: Startup-style] Let's dive into direct implementation. How would you wear multiple hats and coordinate this feature?`,
      `[Tone: Startup-style] Think about rapid prototyping and user feedback. How do you validate this design fast?`
    ],
    'HR recruiter': [
      `[Tone: HR recruiter] Hi there! I would love to learn more about your collaborative mindset and professional communication.`,
      `[Tone: HR recruiter] Let's discuss cultural fit and alignment with our team's core values.`,
      `[Tone: HR recruiter] Tell me about your emotional intelligence and how you handle stress in high-pressure situations.`,
      `[Tone: HR recruiter] I'd love to hear how you manage growth, mentorship, and career goals in this role.`,
      `[Tone: HR recruiter] Let's explore your interpersonal and situational communication skills.`
    ],
    'Senior engineer': [
      `[Tone: Senior engineer] Let's look at deep system trade-offs, indexing strategies, and performance bottlenecks.`,
      `[Tone: Senior engineer] How do you design this to prevent memory leaks and optimize connection pool resources?`,
      `[Tone: Senior engineer] Discuss the architectural choices, design patterns, and SOLID principles you'd adopt here.`,
      `[Tone: Senior engineer] Explain how you would write clean, highly testable, and modular code for this implementation.`,
      `[Tone: Senior engineer] Let's examine how this system handles database anomalies, synchronization, and race conditions.`
    ],
    'Rapid-fire': [
      `[Tone: Rapid-fire] Quick conceptual check. Keep your response brief and to the point.`,
      `[Tone: Rapid-fire] Direct technical check. No conversational filler, please.`,
      `[Tone: Rapid-fire] Rapid verification. What is your immediate technical choice?`,
      `[Tone: Rapid-fire] Immediate quick-fire question. State your core reasoning.`,
      `[Tone: Rapid-fire] Direct and prompt conceptual question. How do you explain this?`
    ]
  };

  const stylePrefixes = interviewerStylePrefixes[interviewerStyle] || interviewerStylePrefixes['Friendly'];
  const prefix = stylePrefixes[index % stylePrefixes.length];

  // 4. Difficulty calibration suffixes
  const difficultySuffixes = {
    'Beginner': "Keep your explanation simple, focus on basic definitions, standard keywords, and clear examples.",
    'Intermediate': "Calibrate your response for standard production systems, explaining basic APIs and implementation setups.",
    'Advanced': "CALIBRATE for advanced engineering. Focus on performance bottlenecks, thread safety, scaling constraints, and trade-offs.",
    'FAANG': "CALIBRATE for elite high-scale systems. Detail microsecond latencies, extreme Big-O optimizations, and horizontal scaling metrics.",
    'Expert': "CALIBRATE for principal architectural scale. Focus on deep consistency anomalies, complex system trade-offs, and failure recoveries."
  };
  const diffSuffix = difficultySuffixes[difficulty] || difficultySuffixes['Intermediate'];

  // 5. Experience-level adaptation prefixes
  const experiencePrefixes = {
    'Fresher': "As an entry-level candidate focusing on strong academic foundations",
    'Mid-Level': "Leveraging your 1-3 years of hands-on production codebase experience",
    'Senior': "As a senior owner leading system architecture and design choices",
    'Lead': "As a principal technical lead responsible for critical strategic decisions and cross-team code quality"
  };
  const expPrefix = experiencePrefixes[experienceLevel] || experiencePrefixes['Mid-Level'];

  // 6. Company-specific focus
  const companyFocus = {
    'FAANG': "with rigorous algorithmic analysis, Big-O space-time benchmarks, and massive horizontal scale in mind.",
    'Startup': "with high agility, rapid deployment loops, cost efficiency, and high ownership in mind.",
    'Corporate': "with modular stability, enterprise security compliance, data auditing, and SLA metrics in mind.",
    'Service-Based': "with clear client communication, solid architectural standards, and maintainable implementation guidelines in mind."
  };
  const compFocus = companyFocus[companyType] || companyFocus['Startup'];

  // Inject experience and company parameters into the question
  rawQuestion = rawQuestion.replace("Let's dive into", `${expPrefix}, let's dive into`);
  rawQuestion = rawQuestion.replace("When designing", `As a ${experienceLevel} professional, when designing`);
  rawQuestion = rawQuestion.replace("Imagine a critical", `${expPrefix}, imagine a critical`);

  // Handle resume injection in custom category
  let resumeSnippet = "";
  if ((type.includes('Resume') || type.includes('Viva')) && resumeText && resumeText.trim().length > 10) {
    // Extract a few lines from resume to make it look hyper-realistic
    const lines = resumeText.split('\n').filter(l => l.trim().length > 5).slice(0, 3);
    if (lines.length > 0) {
      resumeSnippet = ` Based specifically on your resume highlight: "${lines[index % lines.length].trim()}", `;
    }
  }

  const finalQuestionText = `${transition}${prefix} ${resumeSnippet}${rawQuestion} Please ensure your response is calibrated for a ${difficulty} level, ${compFocus} ${diffSuffix}`;

  return finalQuestionText;
}

function getMockEvaluateOrHint(question, answer, attempts, jobRole = 'Software Engineer', difficulty = 'Intermediate') {
  const lower = answer.toLowerCase().trim();
  if (lower === 'skip' || lower === '"skip"') {
    return {
      action: 'skip',
      score: 0,
      feedback: 'Question skipped by candidate request.',
      strengths: ["Respectfully expressed the desire to move on"],
      weaknesses: ["Did not answer the question asked"],
      suggestions: ["Try to attempt with partial knowledge in future sessions"],
      missingConcepts: ["Interview Completion Mode"],
      idealAnswer: 'Skipped'
    };
  }

  const isUnclear = answer.length < 15 || lower.includes("i don't know") || lower.includes("not sure") || lower.includes("no idea") || lower === '';
  
  if (isUnclear && attempts < 1) {
    // Attempt to extract the core topic of the question to build a custom hint
    let topicName = "this concept";
    if (question.includes("React") || question.includes("state")) topicName = "React State & Synchronization Hooks";
    else if (question.includes("Mongoose") || question.includes("hash")) topicName = "Password Hashing & DB Validation Models";
    else if (question.includes("JWT") || question.includes("token")) topicName = "Secure JWT Storage & Access validation";
    else if (question.includes("Node") || question.includes("event")) topicName = "Asynchronous Event Loop triggers";
    else if (question.includes("scale") || question.includes("shard")) topicName = "Horizontal Scaling & Database Sharding";
    else if (question.includes("SQL") || question.includes("window")) topicName = "SQL Query analytics and indexing";

    return {
      action: 'hint',
      followUpText: `No problem at all! Let me give you a supportive hint to get you on track. When thinking about ${topicName}, consider how the core parameters or data flows are structured, and how error mitigation is handled under simulated workloads. Can you tell me what you know about the fundamental parts of this? (Attempt 2 of 2)`
    };
  }

  // Analyze answer keywords to dynamically score and construct critiques
  const wordCount = answer.trim().split(/\s+/).length;
  const lowercaseAnswer = answer.toLowerCase();

  // Basic keyword matcher database
  const keywords = {
    frontend: ['component', 'state', 'hook', 'react', 'virtual dom', 'render', 'browser', 'paint', 'performance', 'redux', 'context'],
    backend: ['database', 'server', 'api', 'express', 'node', 'mongoose', 'mongodb', 'sql', 'nosql', 'security', 'hash', 'jwt', 'auth'],
    system: ['scale', 'load balance', 'cdn', 'shard', 'cache', 'redis', 'distributed', 'horizontal', 'vertical', 'consistent', 'latency'],
    data: ['pandas', 'numpy', 'sql', 'formula', 'statistics', 'visualize', 'chart', 'clean', 'metric', 'query', 'join', 'window'],
    ai: ['model', 'neural', 'learning', 'training', 'prompt', 'llm', 'vector', 'transformer', 'fine-tune', 'overfit', 'recall']
  };

  let matchedCategory = 'backend';
  if (lowercaseAnswer.includes('react') || lowercaseAnswer.includes('dom') || lowercaseAnswer.includes('css')) matchedCategory = 'frontend';
  else if (lowercaseAnswer.includes('scale') || lowercaseAnswer.includes('balance') || lowercaseAnswer.includes('system')) matchedCategory = 'system';
  else if (lowercaseAnswer.includes('pandas') || lowercaseAnswer.includes('dataset') || lowercaseAnswer.includes('sql')) matchedCategory = 'data';
  else if (lowercaseAnswer.includes('model') || lowercaseAnswer.includes('prompt') || lowercaseAnswer.includes('deep')) matchedCategory = 'ai';

  const categoryKeywords = keywords[matchedCategory];
  const matchedKeywords = categoryKeywords.filter(kw => lowercaseAnswer.includes(kw));

  // Dynamic scoring
  let score = 5.0;
  if (wordCount < 10) {
    score = 3.0 + (matchedKeywords.length * 0.4);
  } else if (wordCount < 30) {
    score = 5.5 + (matchedKeywords.length * 0.5);
  } else {
    score = 7.5 + (matchedKeywords.length * 0.4);
  }
  score = Math.min(Math.max(parseFloat(score.toFixed(1)), 1.0), 10.0);

  // Dynamic Feedback Description
  let feedback = '';
  if (score < 5.0) {
    feedback = `Your answer is quite brief. While you touched on standard frameworks, it lacks deep technical explanations or concrete production examples. Try using the STAR methodology (Situation, Task, Action, Result) to structure your response more robustly.`;
  } else if (score < 7.5) {
    feedback = `Good progress. You successfully identified the core premise of ${matchedCategory} architecture and listed standard parameters. However, incorporating quantitative metrics or comparing trade-offs between alternatives would make this response much stronger.`;
  } else {
    feedback = `Excellent, highly detailed response! You demonstrated clear technical mastery of the concept, structured your thoughts sequentially, and successfully integrated specific engineering keywords. Keep using this level of rigor.`;
  }

  // Dynamic strengths and weaknesses
  const strengths = [
    `Acknowledge the core premise of the question regarding ${matchedCategory} systems.`,
    wordCount > 25 ? `Demonstrated good communication structure with detailed phrasing.` : `Showcased clear focus on standard definitions and concepts.`,
  ];
  if (matchedKeywords.length > 0) {
    strengths.push(`Successfully integrated industry-standard keywords: ${matchedKeywords.slice(0, 3).map(k => `'${k}'`).join(', ')}.`);
  }

  const weaknesses = [];
  if (wordCount < 20) {
    weaknesses.push("Response lacks appropriate structural detail and is too brief for an interview setting.");
  }
  if (!lowercaseAnswer.includes("complexity") && !lowercaseAnswer.includes("time") && !lowercaseAnswer.includes("big-o")) {
    weaknesses.push("Did not outline the space or time complexity trade-offs of this approach.");
  }
  if (!lowercaseAnswer.includes("scale") && !lowercaseAnswer.includes("bottleneck") && !lowercaseAnswer.includes("limit")) {
    weaknesses.push("Missed detailing how this technical design behaves under peak workload pressures.");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Could further elaborate on concrete third-party monitoring utilities or testing frameworks.");
  }

  const suggestions = [
    `State how your proposal would perform under 10x increased user volume (e.g. data volumes or endpoint hits).`,
    `Incorporate quantitative results (e.g., 'reduced query times by 24%', 'saved 4 local dev hours') to paint a vivid picture of success.`
  ];

  // Dynamic missing keywords suggestions based on role
  const missingConcepts = categoryKeywords.filter(kw => !lowercaseAnswer.includes(kw)).slice(0, 3).map(kw => kw.toUpperCase());

  return {
    action: 'evaluate',
    score,
    feedback,
    strengths,
    weaknesses,
    suggestions,
    missingConcepts: missingConcepts.length > 0 ? missingConcepts : ["BIG-O ANALYSIS", "STAR METRICS", "API ORCHESTRATION"],
    idealAnswer: `A stellar answer to this ${difficulty} question should outline the exact internal mechanics of the system, list specific tools, evaluate architectural trade-offs (e.g., speed vs memory, SQL vs NoSQL, or friendly vs strict delivery), and frame the final execution with a quantified performance improvement.`
  };
}

function getMockSynthesis(interview) {
  const scores = interview.questions.map(q => q.score);
  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const overall = Math.round(avg * 10);

  return {
    overallScore: overall || 75,
    communication: "Your communication is highly professional. You structure your ideas well and express technical terminology naturally. Watch out for speech fillers during complex questions.",
    technicalAccuracy: "You show a solid grip of core engineering patterns. You successfully detailed system limitations, database indexes, and framework structures, showing high technical proficiency.",
    confidence: "Your delivery is calm, clear, and assertive. You speak with authority on topics you are familiar with and handle edge cases gracefully.",
    grammarSuggestions: "Minimize passive voice sentences. Use active keywords such as 'architected', 'spearheaded', 'automated', and 'integrated' to describe your accomplishments.",
    behavioralTips: "Ensure your behavioral answers maintain a positive tone when describing struggles. Frame issues as growth opportunities and always mention the subsequent business/technical success."
  };
}

function getMockResumeAnalysis(text, role) {
  // Simple check to dynamically vary mock ATS score based on text length (simulating advanced matching)
  const length = text?.length || 100;
  let dynamicScore = Math.min(Math.max(Math.round(40 + (length % 45)), 40), 98);
  let detected = role || "MERN Developer";

  if (text?.toLowerCase().includes("python") || text?.toLowerCase().includes("data")) {
    detected = "Data Analyst";
  } else if (text?.toLowerCase().includes("model") || text?.toLowerCase().includes("ai")) {
    detected = "AI Engineer";
  }

  return {
    atsScore: dynamicScore,
    detectedRole: detected,
    atsKeywordMatchPercentage: Math.round(dynamicScore - 12),
    extractedSkills: ["React.js", "Node.js", "Express.js", "JavaScript", "HTML5", "CSS3", "Git"],
    matchedKeywords: ["React.js", "Node.js", "JavaScript", "Git"],
    missingKeywords: ["MongoDB", "Mongoose", "Docker", "Kubernetes", "Redis", "Jest", "TypeScript", "CI/CD Pipeline"],
    recommendedKeywords: ["Tailwind CSS", "AWS S3", "GraphQL", "Bcrypt"],
    suggestions: {
      formatting: [
        "Ensure your contact details (Email, Phone, Location) are clearly placed at the top header.",
        "Limit the resume layout to a single, concise page since experience is under 5 years.",
        "Remove double-column styles as they can sometimes confuse standard ATS parser software."
      ],
      projectDescriptions: [
        "Upgrade: 'Built an interview website' to 'Collaborated in a team of 2 to engineer a secure MERN interview preparation cockpit, improving question transcript response speeds by 22%.'"
      ],
      actionVerbs: [
        "Replace passive descriptors ('helped build', 'fixed bugs') with active delivery verbs ('engineered', 'spearheaded', 'automated')."
      ],
      weakSections: [
        "The Projects bullet lists are too short. Describe exact situation, tools used, and quantitative business results."
      ]
    },
    detailedFeedback: {
      whyScoreIsLow: `Your ATS score is currently at ${dynamicScore}% because some core modern frameworks (Mongoose, Jest) are missing, and your bullet points are phrasing achievements passively without clear metrics.`,
      howToImprove: "To maximize this score, start by installing direct technical keywords matching your target role into your Skills section, and use active active verbs.",
      whatSectionsNeedRewriting: "Your Experience and Projects sections should be rewritten to emphasize business deliverables using the STAR format."
    },
    recommendedRoles: ["Backend Engineer", "MERN Developer", "Full Stack JavaScript Developer"],
    strengths: [
      "Excellent technical skills formatting and order.",
      "Clear contact section headers."
    ],
    weaknesses: [
      "Lack of automated test keywords (Jest/Cypress).",
      "No cloud hosting or containerization frameworks."
    ],
    recruiterImpression: `Solid foundations as a ${detected}. Adding metrics and containerization tools will instantly boost interest from tech recruiters.`,
    interviewReadinessScore: Math.round(dynamicScore - 5)
  };
}

function getMockResumeOptimization(text, role) {
  const cleanRole = role || 'MERN Stack Developer';
  
  // 1. Dynamic Name Extraction
  const nameMatch = text?.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  const name = nameMatch ? nameMatch[0] : 'Satyendra Kumar';
  
  // 2. Dynamic Email Extraction
  const emailMatch = text?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'satye.prep@university.edu';
  
  // 3. Dynamic Phone Extraction
  const phoneMatch = text?.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
  const phone = phoneMatch ? phoneMatch[0] : '+1 (555) 234-5678';
  
  // 4. Dynamic Skills Extraction
  const allSkills = ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JavaScript", "TypeScript", "Git", "Docker", "Jest", "RESTful APIs", "Python", "SQL", "DevOps", "Kubernetes", "AWS"];
  const parsedSkills = allSkills.filter(s => text?.toLowerCase().includes(s.toLowerCase()));
  const skills = parsedSkills.length >= 4 ? parsedSkills : ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JavaScript (ES6)", "TypeScript", "Git", "Jest"];
  
  // 5. Dynamic Projects Extraction
  const projects = [];
  const projectMatches = [...text?.matchAll(/(project|app|platform|website|system)\s*:\s*([^\n\r]+)/gi)];
  if (projectMatches.length > 0) {
    projectMatches.slice(0, 2).forEach(match => {
      projects.push({
        title: match[2].trim().substring(0, 40),
        tech: skills.slice(0, 3).join(', '),
        bullets: [
          `Engineered a scalable ${match[2].trim().substring(0, 30)} solution using ${skills.slice(0, 2).join(' and ')}, reducing bottlenecks by 26%.`,
          `Automated secure API handshakes and environment consistency validation asserts, cutting debug cycles by 14%.`
        ]
      });
    });
  }
  
  if (projects.length === 0) {
    projects.push({
      title: "AI Placement Dashboard Cockpit",
      tech: "MERN Stack, Express, Tailwind CSS",
      bullets: [
        "Spearheaded database schema mappings and query optimizations in MongoDB, reducing server endpoint response latencies by 28%.",
        "Engineered secure auth validation layers in Express, ensuring robust access control and reducing threat surfaces by 12%."
      ]
    });
  }

  // 6. Dynamic Experience Extraction
  const experience = [
    {
      role: `Lead ${cleanRole} Intern`,
      company: "Innovate Tech Labs",
      duration: "2025 - Present",
      bullets: [
        `Spearheaded client-side rendering optimizations, reducing page paint overhead by 22% under peak user access streams.`,
        `Automated end-to-end unit test assertions, lowering runtime bug frequencies by 15% and saving 4 local development hours weekly.`
      ]
    }
  ];

  // 7. Dynamic Internships
  const internships = [
    {
      role: "Backend Intern",
      company: "Apex Scale Tech",
      duration: "Summer 2024",
      bullets: [
        `Assisted in building load-balanced API routing layers, improving service availability throughput metrics by 14%.`
      ]
    }
  ];

  // 8. Dynamic Certifications & Achievements
  const certifications = [
    "AWS Certified Solutions Architect - Associate",
    "MongoDB Certified Developer Associate"
  ];

  const achievements = [
    "Won 1st Place in University Code-A-Thon out of 120 competitive developers",
    "Maintained top 5% rank in standard leetcode DSA solver profiles"
  ];

  // 9. Structured Education
  const educationList = [
    {
      school: "State Institute of Technology",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      duration: "2021 - 2025",
      details: "GPA: 9.1/10. Core Focus: Relational Databases, Advanced Algorithms."
    }
  ];

  // 10. Leadership & Extracurriculars
  const leadership = [
    {
      role: "Technical Lead",
      organization: "Google Developer Student Club",
      duration: "2023 - 2024",
      bullets: [
        `Orchestrated 8 cross-functional technical hackathons for over 350 university developers.`,
        `Spearheaded student mentoring initiatives, boosting active coding sandbox submissions by 40%.`
      ]
    }
  ];

  const extracurriculars = [
    "Active open-source contributor inside local developer community repositories",
    "Core volunteer at university tech bootcamps, teaching data structures basics"
  ];

  return {
    name,
    email,
    phone,
    linkedin: `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
    summary: `High-impact ${cleanRole} with a strong foundation in scalable architecture, automated testing assertions, and API orchestration. Proven track record of spearheading optimizations and developing high-fidelity interactive user interfaces.`,
    skills,
    experience,
    projects,
    internships,
    certifications,
    achievements,
    educationList,
    leadership,
    extracurriculars,
    education: "Bachelor of Technology in Computer Science, State Institute of Technology",
    beforeScore: 64,
    afterScore: 94,
    highlights: [
      `Automatically detected and tailored resume details specifically for a ${cleanRole} profile.`,
      `Injected high-frequency target keywords (${skills.slice(0, 5).join(', ')}).`,
      "Rewrote experience and project description bullet points to utilize strong power verbs and quantified STAR metrics."
    ]
  };
}

function getDynamicMockBulletEnhancement(bulletText, targetRole) {
  const verbs = ["Spearheaded", "Engineered", "Automated", "Architected", "Optimized", "Integrated"];
  const metrics = [
    "improving response throughput efficiency by 34% and dropping server bottlenecks",
    "reducing database query assertion latency by 28%",
    "saving 5 cross-functional development hours weekly while slashing bugs by 18%",
    "boosting application performance by 22% under peak loads",
    "cutting deployment integration loops by 4 hours weekly"
  ];
  
  const selectedVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const selectedMetric = metrics[Math.floor(Math.random() * metrics.length)];
  
  const cleanInput = bulletText.trim().replace(/^(I |we |worked on |helped with |built a |developed an? )/i, '');
  return `${selectedVerb} the development and orchestration of ${cleanInput || 'technical features'} tailored for the ${targetRole} pipeline, ${selectedMetric}.`;
}

function getDynamicMockProjectDescription(topic, techStack, targetRole) {
  const stackList = techStack ? techStack.split(',').map(s => s.trim()) : ['React', 'Node.js'];
  const firstTech = stackList[0];
  const secondTech = stackList[1] || 'RESTful APIs';
  
  return [
    `Architected and structured a custom ${topic} cockpit utilizing ${techStack}, establishing secure endpoint protocols and reducing overall data rendering latencies by 28%.`,
    `Automated asynchronous state synchronization metrics with ${firstTech}, ensuring seamless API handshakes and data integrity across distributed cluster nodes.`,
    `Integrated end-to-end unit test assertions using standard configurations, optimizing system throughput with ${secondTech} and cutting bug occurrences by 16% under simulated workloads.`
  ];
}

function getDynamicMockCoverLetter(companyName, jobRole, skills, projects, experience, tone = 'Professional') {
  const primarySkill = skills?.[0] || 'Scalable Software Architecture';
  const secondarySkill = skills?.[1] || 'RESTful API Orchestration';
  const mainProj = projects?.[0] || 'AI assessment system';
  
  let opening = `I am writing to express my enthusiastic interest in the ${jobRole || 'Software Engineer'} position at ${companyName || 'your esteemed company'}. With my background in ${primarySkill}, ${secondarySkill}, and scalable software design, I am confident in my ability to deliver immediate value to your engineering workflows.`;
  let body = `During my work on ${mainProj}, I spearheaded technical updates that directly boosted pipeline speeds by 24% and reduced load latency. Tying these precise deliverables back to standard operational requirements allows me to build high-performance solutions that match your exact standards at ${companyName}.`;
  let closing = `I am incredibly excited about the prospect of applying these skills to your active codebase. Thank you for your time, consideration, and leadership.`;

  if (tone === 'Startup') {
    opening = `I was absolutely thrilled to see the opening for the ${jobRole || 'Software Developer'} role at ${companyName}! As someone who thrives in fast-paced, high-ownership environments, I am eager to bring my deep capabilities in ${primarySkill} and ${secondarySkill} to your scaling product team.`;
    body = `I don't just write code—I build user-centric systems. For instance, when engineering ${mainProj}, I designed an optimization layer that cut latencies by 28% and saved dozens of local deployment cycles. I love wearing multiple hats and moving quickly to ship robust products.`;
    closing = `I would love the opportunity to chat about how my entrepreneurial drive aligns with ${companyName}'s rapid product milestones. Let's build something epic!`;
  } else if (tone === 'Corporate') {
    opening = `Please accept this application as formal expression of my interest in the ${jobRole || 'Software Analyst'} position at ${companyName}. I offer a comprehensive background in ${primarySkill} and a proven capacity to deliver enterprise-grade performance and architectural integrity.`;
    body = `My career highlights include managing high-impact technical initiatives. Notably, while spearheading ${mainProj}, I coordinated scalable data migrations that reduced database load bounds by 24% and optimized operational throughput. I understand the value of system compliance and robust SLA metrics.`;
    closing = `I look forward to discussing how my professional qualifications meet the long-term strategic needs of ${companyName}. Thank you for your review.`;
  } else if (tone === 'Friendly') {
    opening = `Hi team! I'm super excited to apply for the ${jobRole || 'Developer'} role at ${companyName}. I've been following your growth and love your culture—I'd be absolutely thrilled to collaborate with your team to deliver incredible user experiences.`;
    body = `I love solving hard problems alongside creative people. In my project ${mainProj}, I used ${primarySkill} to build a super smooth dashboard that users loved, helping to increase throughput efficiency by 34%. I bring high positive energy and collaborative skillsets to every team I join!`;
    closing = `I'd love to drop by or hop on a call to share ideas and get to know the team at ${companyName} better. Thanks for reading!`;
  } else if (tone === 'Formal') {
    opening = `Dear Hiring panel at ${companyName}, I write to formally submit my candidacy for the position of ${jobRole}. I present an advanced foundation in ${primarySkill} and have dedicated my career to establishing rigorous methodologies for backend and frontend engineering.`;
    body = `My academic and professional pursuits have centered on code quality and clean architecture. In designing ${mainProj}, I strictly adhered to clean design patterns, decreasing processing bottlenecks by 22% and improving the structural integrity of our API orchestrations.`;
    closing = `I remain at your disposal for a formal interview to evaluate my analytical compliance. Thank you for your esteemed consideration.`;
  }
  
  return `Dear Hiring Committee at ${companyName || 'the target team'},
  
${opening}

${body}

${closing}

Sincerely,
[Candidate Name]`;
}

/**
 * 6. AI Hint Engine for DSA
 */
export const generateDSACoachingHint = async (problemTitle, code, language, hintType = 'step-by-step') => {
  if (!aiEngine) {
    return getDynamicDSACoachingHint(problemTitle, code, language, hintType);
  }

  const prompt = `
    You are an elite competitive programming coach.
    Provide a supportive and intelligent hint for the problem: "${problemTitle}" based on the candidate's current code:
    
    Language: ${language}
    Code:
    ---
    ${code}
    ---
    
    Hint Type requested: "${hintType}" (options: step-by-step, complexity, edge-case)
    
    Instructions:
    1. Do NOT write the completed solution code.
    2. Offer a precise hint focusing on the requested Hint Type.
    3. Keep it encouraging and technical.
    
    Return your response strictly in the following JSON format:
    {
      "hint": "Your conceptual, step-by-step or edge-case hint here..."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('generateDSACoachingHint error:', error);
    return getDynamicDSACoachingHint(problemTitle, code, language, hintType);
  }
};

/**
 * 7. AI Code Review for DSA
 */
export const generateDSACodeReview = async (problemTitle, code, language) => {
  if (!aiEngine) {
    return getDynamicDSACodeReview(problemTitle, code, language);
  }

  const prompt = `
    You are a principal software engineer conducting a code review.
    Analyze the candidate's code submission for the problem: "${problemTitle}".
    
    Language: ${language}
    Code:
    ---
    ${code}
    ---
    
    Analyze:
    - Time and space complexity.
    - Whether the solution is a brute-force approach that can be optimized.
    - Bad practices or code smells.
    - Refactoring and optimization steps.
    - Give a quality score from 0 to 100.
    
    Return your response strictly in the following JSON format:
    {
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)",
      "detectedBruteForce": false,
      "badPractices": ["Avoid using global state variables", "Redundant conditional checks"],
      "optimizations": ["Use a two-pointer approach to achieve O(1) space complexity", "Pre-allocate array size"],
      "score": 88
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('generateDSACodeReview error:', error);
    return getDynamicDSACodeReview(problemTitle, code, language);
  }
};

/**
 * 8. AI Explanation Engine for DSA
 */
export const generateDSASolutionExplanation = async (problemTitle, code, language) => {
  if (!aiEngine) {
    return getDynamicDSASolutionExplanation(problemTitle, code, language);
  }

  const prompt = `
    You are an expert DSA educator. Explain the solution to: "${problemTitle}".
    
    Language: ${language}
    Code:
    ---
    ${code}
    ---
    
    Task:
    - Provide a step-by-step description of how the logic runs.
    - Provide a concrete, easy-to-follow dry run of a sample test case.
    - Outline the optimal/alternative approach to solve this problem.
    
    Return your response strictly in the following JSON format:
    {
      "stepByStep": [
        "1. First, we initialize a map to store seen elements and their indices.",
        "2. We loop through the array nums using a single index tracker.",
        "3. For each element, we calculate the complement relative to target..."
      ],
      "dryRun": "Input: nums = [2,7,11,15], target = 9\\n- i = 0: complement = 9 - 2 = 7. Not in map. Store map[2] = 0.\\n- i = 1: complement = 9 - 7 = 2. Found in map! Map[2] is 0. Return indices [0, 1].",
      "optimizedApproach": "The optimal approach uses a single-pass hash map to index items on-the-fly, reducing search time from O(N^2) to O(N) at the cost of O(N) memory."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('generateDSASolutionExplanation error:', error);
    return getDynamicDSASolutionExplanation(problemTitle, code, language);
  }
};

/**
 * 9. AI Dynamic Problem Generator
 */
export const generateDSADynamicProblem = async (topic, targetCompany, difficulty, resumeSkills = [], resumeText = '', targetRole = 'MERN Stack Developer') => {
  let targetTopic = topic || 'Arrays';
  let targetComp = targetCompany || 'Google';

  // Normalize topic name
  const normalizationMap = {
    'hashmaps': 'Hash Maps', 'hash map': 'Hash Maps', 'hash maps': 'Hash Maps',
    'linkedlist': 'Linked List', 'linked list': 'Linked List',
    'binary search tree': 'BST', 'bst': 'BST',
    'priority queue': 'Heap', 'heap': 'Heap', 'heap/priority queue': 'Heap',
    'dfs': 'DFS', 'bfs': 'BFS',
    'dynamic programming': 'Dynamic Programming', 'dp': 'Dynamic Programming',
    'sliding window': 'Sliding Window',
    'two pointer': 'Two Pointers', 'two pointers': 'Two Pointers',
    'bit manipulation': 'Bit Manipulation',
    'segment tree': 'Segment Tree',
    'union find': 'Union Find', 'unionfind': 'Union Find',
    'javascript': 'JavaScript', 'node': 'Node.js', 'node.js': 'Node.js',
    'mongodb': 'MongoDB', 'system design': 'System Design', 'oop': 'OOP'
  };
  const normKey = targetTopic.toLowerCase().trim();
  if (normalizationMap[normKey]) {
    targetTopic = normalizationMap[normKey];
  }

  // Resume-Aware Mapping logic
  const skillsLower = resumeSkills.map(s => s.toLowerCase());
  const hasPythonData = skillsLower.some(s => s.includes('python') || s.includes('sql') || s.includes('power bi') || s.includes('pandas') || s.includes('numpy') || s.includes('analytics'));
  const hasMern = skillsLower.some(s => s.includes('react') || s.includes('node') || s.includes('mongodb') || s.includes('express') || s.includes('javascript') || s.includes('typescript') || s.includes('api'));

  if (!topic) {
    if (targetRole.includes('Data') || hasPythonData) {
      const options = ['SQL database join and grouping logic', 'Data Analytics profiling calculation', 'Arrays'];
      targetTopic = options[Math.floor(Math.random() * options.length)];
    } else if (targetRole.includes('MERN') || targetRole.includes('Frontend') || hasMern) {
      const options = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Strings'];
      targetTopic = options[Math.floor(Math.random() * options.length)];
    } else if (targetRole.includes('AI') || targetRole.includes('Machine')) {
      const options = ['Bit Manipulation', 'Recursion', 'Arrays', 'Heap'];
      targetTopic = options[Math.floor(Math.random() * options.length)];
    }
  }

  const resumeContext = resumeSkills.length > 0 
    ? `Candidate Resume Tech Stack: ${resumeSkills.join(', ')}. Please customize the problem phrasing to relate to this stack.`
    : '';

  const roleContext = `Candidate targeted job role is: "${targetRole}". Focus the coding question, context, description scenario, and templates closely on topics and APIs relevant to this role:
    - MERN Stack Developer / Frontend Developer: Frontend state updates, DOM-like nested trees or JSON mapping, React Todo filter loops, API pagination, or String parsing.
    - Data Analyst / Data Scientist: SQL table queries, Pandas-style computations, data cleansing, aggregations, stats/KPI formulas.
    - AI Engineer / ML Engineer: Gradient steps, matrix tensor adjustments, preprocessing layers, features normalization, or math/array algorithms.
    - Software Engineer / Backend Developer: Traditional DSA (Graphs, Trees, DP), backend route rate limiting, cache eviction strategies, system logic implementation.`;

  const companyMappingContext = `Target Company is: "${targetComp}". Calibrate the problem patterns to match this company's interview style:
    - Google: Focus heavily on Graphs, Dynamic Programming (DP), optimization puzzles, and advanced algorithms.
    - Amazon: Focus on Arrays, Trees, Hash Maps, and practical real-world backend coding.
    - Meta: Focus on Graphs, extreme performance optimizations, and low latency/memory scalability constraints.
    - Microsoft: Focus on Object-Oriented programming (OOP) logic, standard data structures, and system thinking.
    - Netflix: Focus on backend logic, high-throughput scaling, and distributed systems algorithms.
    - TCS: Focus on basic DSA algorithms, array/string operations, and aptitude-oriented coding.
    - Infosys: Focus on foundational programming constructs, logic building, and array loops.
    - Coal India: Focus on programming fundamentals, basic problem solving, and technical reasoning.`;

  if (!aiEngine) {
    return getDynamicMockDSAProblem(targetTopic, targetComp, difficulty);
  }

  const prompt = `
    You are an elite interviewer at "${targetComp}".
    Generate a unique, highly realistic "${difficulty}" coding problem for the topic: "${targetTopic}".
    
    ${resumeContext}
    ${roleContext}
    ${companyMappingContext}
    
    Instructions:
    1. The problem must have a Title and a clear description in standard LeetCode markdown format. The description MUST explicitly contain separate markdown sections for: Problem Statement, Input Format, Output Format, and Examples (with Input, Output, and Explanation).
    2. Define realistic constraints (e.g. constraints on array size, element ranges).
    3. Provide starter templates with standard function names for all 6 languages: javascript, python, cpp, java, c, go.
    4. Provide exactly 4 test cases, categorized as type: 'visible' (sample), 'hidden', 'edge', and 'stress'. Test cases input should be in standard formatted strings (e.g. "[2,7,11], 9").
    5. Add exactly 4 progressive hint levels: Hint 1 (small clue), Hint 2 (approach guidance), Hint 3 (pseudo-solution guidance), and Hint 4 (near-complete strategy).
    6. Include expected time and space complexities.
    7. Tag the company "${targetComp}" and topic "${targetTopic}".
    8. Write a clear detailed explanation of the solution.
    9. Explicitly provide "optimalSolution" (complete JavaScript solution code) and "editorial" (theoretical review of the ideal algorithmic design).
    
    Return your response strictly in the following JSON format:
    {
      "title": "Unique Problem Title",
      "description": "# Description\\nProblem statement details here...\\n\\n# Input Format\\nInput description here...\\n\\n# Output Format\\nOutput description here...\\n\\n# Examples\\n**Example 1:**\\n- **Input:** nums = [2,7,11], target = 9\\n- **Output:** [0,1]\\n- **Explanation:** 2 + 7 = 9.",
      "difficulty": "${difficulty}",
      "category": "${targetTopic}",
      "constraints": ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      "starterTemplates": {
        "javascript": "function solve(nums) {\\n  // code here\\n}",
        "python": "def solve(nums: list[int]) -> int:\\n    pass",
        "cpp": "class Solution {\\npublic:\\n    int solve(vector<int>& nums) {\\n        return 0;\\n        \\n    }\\n};",
        "java": "class Solution {\\n    public int solve(int[] nums) {\\n        return 0;\\n        \\n    }\\n}",
        "c": "int solve(int* nums, int numsSize) {\\n    return 0;\\n}",
        "go": "func solve(nums []int) int {\\n    return 0\\n}"
      },
      "testCases": [
        { "input": "[1,2,3]", "expectedOutput": "6", "isSample": true, "type": "visible" },
        { "input": "[4,5,6]", "expectedOutput": "15", "isSample": true, "type": "hidden" },
        { "input": "[0,0,0]", "expectedOutput": "0", "isSample": false, "type": "edge" },
        { "input": "[1000,1000]", "expectedOutput": "2000", "isSample": false, "type": "stress" }
      ],
      "tags": ["${targetTopic}", "Algorithms"],
      "expectedTime": "O(N)",
      "expectedSpace": "O(1)",
      "hints": ["Hint 1 text...", "Hint 2 text..."],
      "companyTags": ["${targetComp}"],
      "explanation": "Detailed walk-through of the ideal solution...",
      "optimalSolution": "function solve(nums) {\\n  return nums.reduce((a,b) => a+b, 0);\\n}",
      "editorial": "Theoretical review of why this greedy/DP approach holds..."
    }
  `;

  // 3x Robust retry loop on AI generative failure
  let attempts = 3;
  while (attempts > 0) {
    try {
      const result = await aiEngine.generateContent(prompt);
      return parseCleanJSON(result.text);
    } catch (error) {
      attempts--;
      console.warn(`generateDSADynamicProblem attempt failed. Retries remaining: ${attempts}. Error:`, error.message);
      if (attempts === 0) {
        console.error('Gemini DSA generator fully exhausted retries. Serving fallback question...');
        return getDynamicMockDSAProblem(targetTopic, targetComp, difficulty);
      }
      // Wait 1s before retrying to prevent burst rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

/**
 * 10. AI Interviewer Follow-Up Engine
 */
export const generateDSAInterviewFollowUp = async (problemTitle, code, language, userMessage = '', chatHistory = []) => {
  if (!aiEngine) {
    const defaultFollowups = [
      "Excellent points! How would you modify your approach if the input data cannot fit entirely in memory, or if it is already sorted?",
      "That is a reasonable strategy. What about edge cases? How would your solution behave if all elements are identical, or if we pass negative values?",
      "Great optimization! Now, let's think about thread safety. If multiple concurrent requests access this solution, how do we prevent race conditions?",
      "Perfect. Thank you for walking me through that. We've completed our dialogue. Feel free to continue to the next round!"
    ];
    const turnIndex = Math.min(chatHistory.filter(m => m.sender === 'candidate').length, defaultFollowups.length - 1);
    return {
      followUpQuestion: defaultFollowups[turnIndex],
      hint: "Think about memory-mapped structures, in-place adjustments, or atomic synchronization operations."
    };
  }

  const historyPrompt = chatHistory.map(m => 
    `${m.sender === 'recruiter' ? 'Recruiter' : 'Candidate'}: ${m.text}`
  ).join('\n');

  const prompt = `
    You are an expert technical recruiter and systems engineering interviewer at a top-tier tech firm.
    The candidate has submitted a code solution for "${problemTitle}" in "${language}".
    
    Candidate's code:
    ---
    ${code}
    ---
    
    You are conducting a live post-submission dialogue with the candidate.
    
    Conversation History so far:
    ${historyPrompt || 'No history yet.'}
    
    Candidate's latest message: "${userMessage}"
    
    Task:
    1. Act as the recruiter. Evaluate the candidate's answer technically and conversationally.
    2. Acknowledge what they got right, correct any misconceptions, and ask a contextual, professional follow-up question.
    3. Keep the conversation extremely realistic and professional. Discuss Big-O complexity, system limits, concurrency, or robust alternative approaches.
    
    Return your response strictly in the following JSON format:
    {
      "followUpQuestion": "Your conversational recruiter follow-up or reply here...",
      "hint": "A guiding tip or hint for this turn..."
    }
  `;

  try {
    const result = await aiEngine.generateContent(prompt);
    return parseCleanJSON(result.text);
  } catch (error) {
    console.error('generateDSAInterviewFollowUp error:', error);
    return {
      followUpQuestion: "Interesting details. How would your approach change if we scaled the transaction volume 100x or introduced distributed parallel processing?",
      hint: "Consider using map-reduce operations or distributed queues like Kafka."
    };
  }
};

/* ==========================================
   DSA PREMIUM DYNAMIC FALLBACK DICTIONARY (28 TOPICS)
   ========================================== */

function getDynamicMockDSAProblem(topic, company, difficulty) {
  const cleanTopic = topic || 'Arrays';
  const cleanCompany = company || 'Google';
  
  // Comprehensive fail-safe dictionary mapping all 28 topics to LeetCode-grade problems
  const fallbackRegistry = {
    "Arrays": {
      title: "Two Sum",
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      difficulty: "Easy",
      category: "Arrays",
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      starterTemplates: {
        javascript: "function twoSum(nums, target) {\n  return [];\n}",
        python: "def two_sum(nums: list[int], target: int) -> list[int]:\n    return []",
        cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};",
        java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[2];\n    }\n}"
      },
      testCases: [
        { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]", isSample: true, type: "visible" },
        { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]", isSample: true, type: "hidden" },
        { input: "[3, 3], 6", expectedOutput: "[0, 1]", isSample: false, type: "edge" },
        { input: "[1, 5, 8], 13", expectedOutput: "[1, 2]", isSample: false, type: "stress" }
      ],
      tags: ["Arrays", "Hashing"],
      expectedTime: "O(N)",
      expectedSpace: "O(N)",
      hints: ["Try using a hash map to save visited elements.", "Calculate the complement (target - nums[i]) for each index."]
    },
    "Strings": {
      title: "Valid Parentheses",
      description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      category: "Strings",
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
      starterTemplates: {
        javascript: "function isValid(s) {\n  return false;\n}",
        python: "def is_valid(s: str) -> bool:\n    return False",
        cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};",
        java: "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}"
      },
      testCases: [
        { input: "\"( )\"", expectedOutput: "true", isSample: true, type: "visible" },
        { input: "\"( )[ ]{ }\"", expectedOutput: "true", isSample: true, type: "hidden" },
        { input: "\"( ]\"", expectedOutput: "false", isSample: false, type: "edge" },
        { input: "\"([)]\"", expectedOutput: "false", isSample: false, type: "stress" }
      ],
      tags: ["Strings", "Stack"],
      expectedTime: "O(N)",
      expectedSpace: "O(N)",
      hints: ["Use a stack to track open brackets.", "When a closed bracket appears, pop the top of the stack and see if they match."]
    },
    "Hash Maps": {
      title: "Group Anagrams",
      description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
      difficulty: "Medium",
      category: "Hash Maps",
      constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
      starterTemplates: {
        javascript: "function groupAnagrams(strs) {\n  return [];\n}",
        python: "def group_anagrams(strs: list[str]) -> list[list[str]]:\n    return []"
      },
      testCases: [
        { input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", isSample: true, type: "visible" },
        { input: "[\"\"]", expectedOutput: "[[\"\"]]", isSample: true, type: "hidden" }
      ],
      tags: ["Hash Maps", "Strings"],
      expectedTime: "O(N * K log K)",
      expectedSpace: "O(N * K)"
    },
    "Stack": {
      title: "Min Stack",
      description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      difficulty: "Medium",
      category: "Stack",
      constraints: ["Methods will be called at most 3 * 10^4 times."],
      starterTemplates: {
        javascript: "class MinStack {\n  constructor() { this.stack = []; }\n  push(val) {}\n  pop() {}\n  top() { return 0; }\n  getMin() { return 0; }\n}"
      },
      testCases: [
        { input: "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"], [[],[-2],[0],[-3],[],[],[],[]]", expectedOutput: "[null,null,null,null,-3,null,0,-2]", isSample: true, type: "visible" }
      ],
      tags: ["Stack", "Designs"]
    },
    "Queue": {
      title: "Implement Queue using Stacks",
      description: "Implement a first in first out (FIFO) queue using only two stacks. The queue should support push, pop, peek, and empty.",
      difficulty: "Easy",
      category: "Queue",
      constraints: ["At most 100 calls will be made to push, pop, peek, and empty."],
      starterTemplates: {
        javascript: "class MyQueue {\n  constructor() { this.s1 = []; this.s2 = []; }\n  push(x) {}\n  pop() { return 0; }\n  peek() { return 0; }\n  empty() { return false; }\n}"
      },
      testCases: [
        { input: "[\"push\", \"push\", \"peek\", \"pop\", \"empty\"], [[1], [2], [], [], []]", expectedOutput: "[null, null, 1, 1, false]", isSample: true, type: "visible" }
      ],
      tags: ["Stack", "Queue"]
    },
    "Linked List": {
      title: "Reverse Linked List",
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      difficulty: "Easy",
      category: "Linked List",
      constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
      starterTemplates: {
        javascript: "function reverseList(head) {\n  return null;\n}"
      },
      testCases: [
        { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", isSample: true, type: "visible" }
      ],
      tags: ["Linked List", "Recursion"]
    },
    "Tree": {
      title: "Maximum Depth of Binary Tree",
      description: "Given the root of a binary tree, return its maximum depth.",
      difficulty: "Easy",
      category: "Tree",
      constraints: ["The number of nodes in the tree is in the range [0, 10^4]."],
      starterTemplates: {
        javascript: "function maxDepth(root) {\n  return 0;\n}"
      },
      testCases: [
        { input: "[3,9,20,null,null,15,7]", expectedOutput: "3", isSample: true, type: "visible" }
      ],
      tags: ["Tree", "DFS"]
    },
    "BST": {
      title: "Lowest Common Ancestor of a Binary Search Tree",
      description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
      difficulty: "Easy",
      category: "BST",
      constraints: ["The number of nodes in the tree is in the range [2, 10^5]."],
      starterTemplates: {
        javascript: "function lowestCommonAncestor(root, p, q) {\n  return null;\n}"
      },
      testCases: [
        { input: "[6,2,8,0,4,7,9,null,null,3,5], 2, 8", expectedOutput: "6", isSample: true, type: "visible" }
      ],
      tags: ["BST", "Trees"]
    },
    "Heap": {
      title: "Kth Largest Element in an Array",
      description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.",
      difficulty: "Medium",
      category: "Heap",
      constraints: ["1 <= k <= nums.length <= 10^5"],
      starterTemplates: {
        javascript: "function findKthLargest(nums, k) {\n  return 0;\n}"
      },
      testCases: [
        { input: "[3,2,1,5,6,4], 2", expectedOutput: "5", isSample: true, type: "visible" }
      ],
      tags: ["Heap", "Divide and Conquer"]
    },
    "Graph": {
      title: "Number of Islands",
      description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.",
      difficulty: "Medium",
      category: "Graph",
      constraints: ["1 <= m, n <= 300"],
      starterTemplates: {
        javascript: "function numIslands(grid) {\n  return 0;\n}"
      },
      testCases: [
        { input: "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", expectedOutput: "3", isSample: true, type: "visible" }
      ],
      tags: ["Graph", "DFS"]
    },
    "DFS": {
      title: "Path Sum",
      description: "Given the root of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.",
      difficulty: "Easy",
      category: "DFS",
      starterTemplates: {
        javascript: "function hasPathSum(root, targetSum) {\n  return false;\n}"
      },
      testCases: [
        { input: "[5,4,8,11,null,13,4,7,2,null,null,null,1], 22", expectedOutput: "true", isSample: true, type: "visible" }
      ],
      tags: ["DFS", "Trees"]
    },
    "BFS": {
      title: "Binary Tree Level Order Traversal",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
      difficulty: "Medium",
      category: "BFS",
      starterTemplates: {
        javascript: "function levelOrder(root) {\n  return [];\n}"
      },
      testCases: [
        { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]", isSample: true, type: "visible" }
      ],
      tags: ["BFS", "Trees"]
    },
    "Dynamic Programming": {
      title: "Climbing Stairs",
      description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      difficulty: "Easy",
      category: "Dynamic Programming",
      constraints: ["1 <= n <= 45"],
      starterTemplates: {
        javascript: "function climbStairs(n) {\n  return 0;\n}"
      },
      testCases: [
        { input: "2", expectedOutput: "2", isSample: true, type: "visible" },
        { input: "3", expectedOutput: "3", isSample: true, type: "hidden" }
      ],
      tags: ["Dynamic Programming"],
      expectedTime: "O(N)",
      expectedSpace: "O(1)"
    },
    "Greedy": {
      title: "Jump Game",
      description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
      difficulty: "Medium",
      category: "Greedy",
      starterTemplates: {
        javascript: "function canJump(nums) {\n  return false;\n}"
      },
      testCases: [
        { input: "[2,3,1,1,4]", expectedOutput: "true", isSample: true, type: "visible" }
      ],
      tags: ["Greedy", "Arrays"]
    },
    "Backtracking": {
      title: "Subsets",
      description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
      difficulty: "Medium",
      category: "Backtracking",
      starterTemplates: {
        javascript: "function subsets(nums) {\n  return [];\n}"
      },
      testCases: [
        { input: "[1,2,3]", expectedOutput: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", isSample: true, type: "visible" }
      ],
      tags: ["Backtracking", "Recursion"]
    },
    "Sliding Window": {
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string `s`, find the length of the longest substring without repeating characters.",
      difficulty: "Medium",
      category: "Sliding Window",
      starterTemplates: {
        javascript: "function lengthOfLongestSubstring(s) {\n  return 0;\n}"
      },
      testCases: [
        { input: "\"abcabcbb\"", expectedOutput: "3", isSample: true, type: "visible" }
      ],
      tags: ["Sliding Window", "Hashing"]
    },
    "Two Pointer": {
      title: "Container With Most Water",
      description: "Given an integer array `height` of length `n`, find two lines that together with the x-axis form a container, such that the container contains the most water.",
      difficulty: "Medium",
      category: "Two Pointer",
      starterTemplates: {
        javascript: "function maxArea(height) {\n  return 0;\n}"
      },
      testCases: [
        { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49", isSample: true, type: "visible" }
      ],
      tags: ["Two Pointers", "Sliding Window"]
    },
    "Bit Manipulation": {
      title: "Single Number",
      description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
      difficulty: "Easy",
      category: "Bit Manipulation",
      starterTemplates: {
        javascript: "function singleNumber(nums) {\n  return 0;\n}"
      },
      testCases: [
        { input: "[2,2,1]", expectedOutput: "1", isSample: true, type: "visible" }
      ],
      tags: ["Bit Manipulation", "Arrays"]
    },
    "Recursion": {
      title: "Fibonacci Number",
      description: "Calculate F(n) where F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
      difficulty: "Easy",
      category: "Recursion",
      starterTemplates: {
        javascript: "function fib(n) {\n  return 0;\n}"
      },
      testCases: [
        { input: "2", expectedOutput: "1", isSample: true, type: "visible" },
        { input: "4", expectedOutput: "3", isSample: true, type: "hidden" }
      ],
      tags: ["Recursion", "Dynamic Programming"]
    },
    "Trie": {
      title: "Implement Trie (Prefix Tree)",
      description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement insert, search, and startsWith.",
      difficulty: "Medium",
      category: "Trie",
      starterTemplates: {
        javascript: "class Trie {\n  constructor() { this.trie = {}; }\n  insert(word) {}\n  search(word) { return false; }\n  startsWith(prefix) { return false; }\n}"
      },
      testCases: [
        { input: "[\"Trie\",\"insert\",\"search\",\"startsWith\"], [[],[\"apple\"],[\"apple\"],[\"app\"]]", expectedOutput: "[null,null,true,true]", isSample: true, type: "visible" }
      ],
      tags: ["Trie", "Designs"]
    },
    "Segment Tree": {
      title: "Range Sum Query - Mutable",
      description: "Given an integer array `nums`, handle multiple queries of: (1) Update value at an index, and (2) Return the sum of elements between left and right indices.",
      difficulty: "Hard",
      category: "Segment Tree",
      starterTemplates: {
        javascript: "class NumArray {\n  constructor(nums) {}\n  update(index, val) {}\n  sumRange(left, right) { return 0; }\n}"
      },
      testCases: [
        { input: "[\"NumArray\",\"sumRange\",\"update\",\"sumRange\"], [[[1,3,5]],[0,2],[1,2],[0,2]]", expectedOutput: "[null,9,null,8]", isSample: true, type: "visible" }
      ],
      tags: ["Segment Tree", "Designs"]
    },
    "SQL": {
      title: "Second Highest Salary",
      description: "Write a SQL query to report the second highest salary from the Employee table. If there is no second highest salary, query should return null.",
      difficulty: "Medium",
      category: "SQL",
      starterTemplates: {
        javascript: "/* Write your SQL Query here */\nSELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1 OFFSET 1;"
      },
      testCases: [
        { input: "Employee = [[1, 100], [2, 200], [3, 300]]", expectedOutput: "200", isSample: true, type: "visible" }
      ],
      tags: ["SQL", "Databases"]
    },
    "JavaScript": {
      title: "Counter II",
      description: "Write a function `createCounter`. It should accept an initial integer `init`. It should return an object with three functions: increment, decrement, and reset.",
      difficulty: "Easy",
      category: "JavaScript",
      starterTemplates: {
        javascript: "function createCounter(init) {\n  return {\n    increment: () => 0,\n    decrement: () => 0,\n    reset: () => 0\n  };\n}"
      },
      testCases: [
        { input: "5, [\"increment\",\"reset\",\"decrement\"]", expectedOutput: "[6,5,4]", isSample: true, type: "visible" }
      ],
      tags: ["JavaScript", "Closures"]
    },
    "React": {
      title: "React Filterable Todo List",
      description: "Implement a custom Todo Hook or State component that takes an array of items, supports toggling active/completed states, and handles text searches.",
      difficulty: "Easy",
      category: "React",
      starterTemplates: {
        javascript: "function filterTodos(todos, query, status) {\n  // status can be 'active', 'completed', or 'all'\n  return [];\n}"
      },
      testCases: [
        { input: "[{id:1, text:\"Buy milk\", completed:false}], \"milk\", \"active\"", expectedOutput: "[{id:1, text:\"Buy milk\", completed:false}]", isSample: true, type: "visible" }
      ],
      tags: ["React", "Hooks"]
    },
    "Node.js": {
      title: "Custom Rate Limiter Middleware",
      description: "Build a modular memory rate-limiter that takes maxRequests and windowMs parameters, tracks IPs in a map, and blocks requests with 429 status code.",
      difficulty: "Medium",
      category: "Node.js",
      starterTemplates: {
        javascript: "function rateLimiter(requestsMap, ip, maxRequests, windowMs) {\n  // Return true if allowed, false if rate limited\n  return true;\n}"
      },
      testCases: [
        { input: "{}, \"127.0.0.1\", 2, 60000", expectedOutput: "true", isSample: true, type: "visible" }
      ],
      tags: ["Node.js", "Middleware"]
    },
    "MongoDB": {
      title: "User Activity Aggregation Pipeline",
      description: "Implement a MongoDB aggregation matching users, grouping logs by date, sorting by activity levels, and project-filtering records.",
      difficulty: "Medium",
      category: "MongoDB",
      starterTemplates: {
        javascript: "function aggregateLogs(logs) {\n  return [];\n}"
      },
      testCases: [
        { input: "[{user:\"Alice\", duration:30}, {user:\"Alice\", duration:20}]", expectedOutput: "[{_id:\"Alice\", totalDuration:50}]", isSample: true, type: "visible" }
      ],
      tags: ["MongoDB", "Aggregation"]
    },
    "System Design": {
      title: "URL Shortener Rate Controller",
      description: "Formulate a routing system mapping clean encoded short URLs to destination URLs using hash indexing, supporting load balances and cdns.",
      difficulty: "Hard",
      category: "System Design",
      starterTemplates: {
        javascript: "class URLShortener {\n  constructor() { this.db = {}; }\n  encode(longUrl) { return ''; }\n  decode(shortUrl) { return ''; }\n}"
      },
      testCases: [
        { input: "\"https://google.com\"", expectedOutput: "\"https://google.com\"", isSample: true, type: "visible" }
      ],
      tags: ["System Design", "Hashing"]
    },
    "OOP": {
      title: "Design Parking Lot",
      description: "Implement an object-oriented Parking Lot carrying support for various vehicle slots (small, medium, large), fee calculations, and occupancy maps.",
      difficulty: "Medium",
      category: "OOP",
      starterTemplates: {
        javascript: "class ParkingLot {\n  constructor(spots) { this.spots = spots; }\n  park(vehicle) { return false; }\n  leave(vehicle) { return 0; }\n}"
      },
      testCases: [
        { input: "10, \"car\"", expectedOutput: "true", isSample: true, type: "visible" }
      ],
      tags: ["OOP", "Classes"]
    },
    "Union Find": {
      title: "Number of Connected Components",
      description: "Given `n` nodes and a list of undirected edges, return the number of connected components in the graph.",
      difficulty: "Medium",
      category: "Union Find",
      constraints: ["1 <= n <= 2000", "0 <= edges.length <= 5000"],
      starterTemplates: {
        javascript: "function countComponents(n, edges) {\n  return 0;\n}",
        python: "def count_components(n: int, edges: list[list[int]]) -> int:\n    return 0",
        cpp: "class Solution {\npublic:\n    int countComponents(int n, vector<vector<int>>& edges) {\n        return 0;\n    }\n};",
        java: "class Solution {\n    public int countComponents(int n, int[][] edges) {\n        return 0;\n    }\n}"
      },
      testCases: [
        { input: "5, [[0,1],[1,2],[3,4]]", expectedOutput: "2", isSample: true, type: "visible" },
        { input: "5, [[0,1],[1,2],[2,3],[3,4]]", expectedOutput: "1", isSample: true, type: "hidden" },
        { input: "4, [[0,1],[2,3]]", expectedOutput: "2", isSample: false, type: "edge" },
        { input: "1, []", expectedOutput: "1", isSample: false, type: "stress" }
      ],
      tags: ["Union Find", "Graph"],
      expectedTime: "O(N + E log N)",
      expectedSpace: "O(N)",
      hints: [
        "Initialize a parent array parent[i] = i for all nodes.",
        "Implement the Find operation with path compression.",
        "Implement the Union operation. For each edge, union the two nodes.",
        "Each successful union reduces the number of connected components by 1."
      ]
    }
  };

  const selectedProblem = fallbackRegistry[cleanTopic] || fallbackRegistry["Arrays"];
  
  // Pad hints to exactly 4 items
  const hints = selectedProblem.hints || [];
  const paddedHints = [
    hints[0] || "Analyze the problem constraints and sample test cases carefully.",
    hints[1] || "Think about the data structures that can help optimize this process.",
    hints[2] || "Formulate the algorithmic strategy or base case logic.",
    hints[3] || "Verify edge conditions (empty inputs, out-of-bounds indices) before compiling."
  ];

  // Augment title and tags dynamically based on selected company
  return {
    title: `${cleanCompany} ${selectedProblem.title}`,
    description: selectedProblem.description,
    difficulty: difficulty || selectedProblem.difficulty,
    category: selectedProblem.category,
    constraints: selectedProblem.constraints || ["1 <= nums.length <= 10^5"],
    starterTemplates: selectedProblem.starterTemplates,
    testCases: selectedProblem.testCases || [
      { input: "[1,2,3]", expectedOutput: "[1,2,3]", isSample: true, type: "visible" }
    ],
    tags: selectedProblem.tags || [cleanTopic],
    expectedTime: selectedProblem.expectedTime || "O(N)",
    expectedSpace: selectedProblem.expectedSpace || "O(1)",
    hints: paddedHints,
    companyTags: [cleanCompany],
    explanation: selectedProblem.explanation || "Walk through basic iterations to fulfill optimal outcomes."
  };
}

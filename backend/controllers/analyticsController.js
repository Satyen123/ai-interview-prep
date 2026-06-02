import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

/**
 * @desc    Get user aggregate performance metrics
 * @route   GET /api/analytics/user
 * @access  Private
 */
export const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(userId).select('xp level streak targetRole skills badges');

    // Fetch interviews taken
    const interviews = await Interview.find({ userId, status: 'completed' });
    const totalInterviews = interviews.length;

    // Calculate average score
    const avgScore = totalInterviews > 0
      ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / totalInterviews)
      : 0;

    // Weak and strong area logic based on interview scores
    const categoryScores = {
      HR: { sum: 0, count: 0 },
      Technical: { sum: 0, count: 0 },
      Behavioral: { sum: 0, count: 0 },
      'System Design': { sum: 0, count: 0 }
    };

    interviews.forEach(item => {
      if (categoryScores[item.interviewType]) {
        categoryScores[item.interviewType].sum += item.overallScore;
        categoryScores[item.interviewType].count += 1;
      }
    });

    const categoryAverages = [];
    let strongArea = 'N/A';
    let weakArea = 'N/A';
    let highest = -1;
    let lowest = 101;

    Object.keys(categoryScores).forEach(cat => {
      const { sum, count } = categoryScores[cat];
      const avg = count > 0 ? Math.round(sum / count) : 0;
      
      categoryAverages.push({ category: cat, score: avg });

      if (count > 0) {
        if (avg > highest) {
          highest = avg;
          strongArea = cat;
        }
        if (avg < lowest) {
          lowest = avg;
          weakArea = cat;
        }
      }
    });

    // Check resume scores
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const latestAtsScore = resumes.length > 0 ? resumes[0].atsScore : 0;

    // Progress chart log (last 7 interviews)
    const progressLog = interviews
      .slice(-7)
      .map(item => ({
        date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: item.overallScore,
        type: item.interviewType
      }));

    res.json({
      user,
      totalInterviews,
      avgScore,
      strongArea: strongArea === 'N/A' ? 'Technical' : strongArea,
      weakArea: weakArea === 'N/A' ? 'System Design' : weakArea,
      latestAtsScore,
      categoryAverages,
      progressLog
    });
  } catch (error) {
    next(error);
  }
};

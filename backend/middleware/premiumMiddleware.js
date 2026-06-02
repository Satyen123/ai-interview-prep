export const checkMockPremium = (req, res, next) => {
  if (req.user && (req.user.isFullPremium || req.user.mockInterviewPremium)) {
    next();
  } else {
    res.status(403);
    next(new Error('Premium Feature: Please upgrade your account to utilize the Mock Interview system.'));
  }
};

export const checkResumePremium = (req, res, next) => {
  if (req.user && (req.user.isFullPremium || req.user.resumePremium)) {
    next();
  } else {
    res.status(403);
    next(new Error('Premium Feature: Please upgrade your account to utilize the AI ATS Resume Generator.'));
  }
};

export const checkCodingPremium = (req, res, next) => {
  if (req.user && (req.user.isFullPremium || req.user.codingPremium)) {
    next();
  } else {
    res.status(403);
    next(new Error('Premium Feature: Please upgrade your account to utilize the AI Coding Sandbox tools.'));
  }
};

export const checkFullPremium = (req, res, next) => {
  if (req.user && req.user.isFullPremium) {
    next();
  } else {
    res.status(403);
    next(new Error('Premium Feature: Full platform pass is required for this action.'));
  }
};

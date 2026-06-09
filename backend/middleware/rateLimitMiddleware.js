const WINDOW_SIZE_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 150; // max 150 requests per minute
const requestLogs = new Map();

// Periodic cleanup of expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLogs.entries()) {
    const validTimestamps = timestamps.filter(time => now - time < WINDOW_SIZE_MS);
    if (validTimestamps.length === 0) {
      requestLogs.delete(ip);
    } else {
      requestLogs.set(ip, validTimestamps);
    }
  }
}, WINDOW_SIZE_MS * 2);

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (!requestLogs.has(ip)) {
    requestLogs.set(ip, []);
  }

  const userTimestamps = requestLogs.get(ip);
  // Filter out timestamps outside the active window
  const activeTimestamps = userTimestamps.filter(time => now - time < WINDOW_SIZE_MS);

  if (activeTimestamps.length >= MAX_REQUESTS) {
    res.status(429).json({
      message: 'Too many requests. Please slow down and try again in a minute.',
      ip,
      windowMs: WINDOW_SIZE_MS,
      max: MAX_REQUESTS
    });
    return;
  }

  activeTimestamps.push(now);
  requestLogs.set(ip, activeTimestamps);
  next();
};

import rateLimit from 'express-rate-limit';

// General limiter (for entire app)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per IP per window
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter (e.g., for uploading)
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5, // only 5 uploads per IP
  message: 'Upload limit reached. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
  legacyHeaders: false,
});

// Chat limiter (AI queries are expensive)
export const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 30, // 30 AI requests per 5 mins
  message: 'You are chatting too fast! excessive AI usage detected.',
  standardHeaders: true,
  legacyHeaders: false,
});

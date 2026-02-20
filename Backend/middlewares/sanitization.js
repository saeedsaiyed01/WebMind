// middlewares/sanitization.js
import sanitizeHtml from 'sanitize-html';

// Sanitize user input to prevent XSS
// Helper for recursive sanitization
function deepSanitize(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }                                                                                         

  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      obj[key] = deepSanitize(obj[key]);
    }
  }

  if (typeof obj === 'string') {
    return sanitizeHtml(obj, {
      allowedTags: [], // Strict stripping
      allowedAttributes: {}
    });
  }

  return obj;
}

// Sanitize user input to prevent XSS
export function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = deepSanitize(req.body);
  }

  if (req.query) {
    req.query = deepSanitize(req.query);
  }

  next();
}

// Rate limit for sensitive operations
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
/**
 * ScamShield AI — Sanitization & Anti-Injection Middleware
 * Strips XSS script tags and Mongo Operator Injections ($gt, $ne, $where)
 */

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip HTML script tags and javascript: URIs
    let cleaned = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onload\s*=/gi, '');

    // Strip MongoDB Operator prefixes at start of input strings
    if (cleaned.startsWith('$')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(value)) {
      // Prevent Mongo key injection ($where, $gt, etc.)
      const cleanKey = key.replace(/^\$/, '');
      sanitizedObj[cleanKey] = sanitizeValue(value[key]);
    }
    return sanitizedObj;
  }

  return value;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

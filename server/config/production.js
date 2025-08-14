const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

/**
 * Production configuration for the Express server
 * Includes security headers, compression, and rate limiting
 */

const productionConfig = {
  // Security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Compression
  compression: {
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  },

  // CORS configuration for production
  cors: {
    origin: process.env.FRONTEND_PRODUCTION_URL || 'https://your-frontend-domain.com',
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Logging configuration
  logging: {
    level: 'info',
    format: 'combined'
  }
};

module.exports = productionConfig;

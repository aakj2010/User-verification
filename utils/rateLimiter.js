// rateLimiter.js
const rateLimit = require('express-rate-limit');

// Define rate limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this Device, please try again later.'
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many password reset requests from this Device, please try again later.'
});

module.exports = { loginLimiter, forgotPasswordLimiter };

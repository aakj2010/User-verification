const express = require('express');
const { sendPasswordResetEmail, resetPassword } = require('../controllers/resetPassword');
const router = express.Router();
const { forgotPasswordLimiter } = require('../utils/rateLimiter'); // Import rate limiter

router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => { // Apply rate limiter
    try {
        const { email } = req.body;
        const response = await sendPasswordResetEmail(email);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;


router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const response = await resetPassword(token, password);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

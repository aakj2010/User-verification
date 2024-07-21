const express = require('express');
const { AuthenticateUser } = require('../controllers/login');
const { loginLimiter } = require('../utils/rateLimiter');
const router = express.Router();

router.post('/', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        var loginCredentials = await AuthenticateUser(email, password);
        if (loginCredentials === "Invalid Username or Password") {
            res.status(200).send("Invalid Username or Password");
        } else if (loginCredentials === "Server Busy") {
            res.status(200).send("Server Busy");
        } else {
            res.status(200).json({ token: loginCredentials.token });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

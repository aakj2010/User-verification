const express = require('express');
const { AuthorizeUser } = require('../controllers/login');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const auth_token = req.headers.authorization;
        if (!auth_token) {
            return res.status(401).send("Authorization header missing");
        }
        const loginCredentials = await AuthorizeUser(auth_token)
        if (loginCredentials === false) {
            res.status(200).send("Invalid Token")
        } else {
            res.json(loginCredentials)
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Server busy")
    }

});

module.exports = router;
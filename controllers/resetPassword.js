const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendMail } = require('../utils/sendMail');
const dotenv = require('dotenv');
dotenv.config();

async function sendPasswordResetEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return "User not found";
        }

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour

        // Update user with reset token and expiration
        user.forgetPassword = { token: token, expiration: expiration };
        await user.save();
        console.log(process.env.FRONTEND_URL)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;  // Use environment variable
        const content = `
            <h4>Password Reset Request</h4>
            <p>You have requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        sendMail(email, "Password Reset", content);

        return "Password reset link sent to Your email, Please check your email";
    } catch (error) {
        console.log(error);
        return "Server Error";
    }
}

async function resetPassword(token, newPassword) {
    try {
        const user = await User.findOne({
            'forgetPassword.token': token,
            'forgetPassword.expiration': { $gt: Date.now() }
        });

        if (!user) {
            return "Invalid or expired token";
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.forgetPassword = { token: null, expiration: null };

        await user.save();

        return "Password has been reset";
    } catch (error) {
        console.log(error);
        return "Server Error";
    }
}

module.exports = { sendPasswordResetEmail, resetPassword };

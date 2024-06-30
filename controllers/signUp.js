const User = require('../models/User');
const { sendMail } = require('../utils/sendMail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const verifyUser = require('../models/verifyUser');

dotenv.config();

async function InsertVerifyUser(name, email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        })

        const activationLink = `http://localhost:4000/signup/${token}`;
        const content = `<h4>Hi There</h4>
        <h5>Welcome to the App</h5>
        <p>Thank you for signing up. Click on the below link to Activate</p>
        <a href="${activationLink}">Click here</a>
        <p>Regards</p>
        <p>Team</p>`

        await newUser.save();
        sendMail(email, "Verify User", content);

    } catch (error) {
        console.log(error);
    }
}


function generateToken(email) {
    const token = jwt.sign(email, process.env.JWT_SECRET);
    console.log(token)
    return token
}

async function InsertSignUpUser(token) {
    try {
        const userVerify = await verifyUser.findOne({ token: token });
        if (userVerify) {
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetPassword: {}
            });
            await newUser.save();
            await userVerify.deleteOne({ token: token });

            const content = `<h4>Registeration Successfull</h4>
                            <h5>Welcome to the App</h5>
                            <p>You are Successfully Registered</p>
                            <p>Regards</p>
                            <p>Team</p>`

            sendMail(newUser.email, "Registeration Success", content);

            return `<h4>Hi There</h4>
                    <h5>Welcome to the App</h5>
                    <p>You are Successfully Registered</p>
                    <p>Regards</p>
                    <p>Team</p>`
        }
        return `<h4>Registeration Failed</h4>
                <p>Link Expired......</p>
                <p>Regards</p>
                <p>Team</p>`
    } catch (error) {
        console.log(error);
        return `<html>
                <body>
                <h4>Registeration Failed</h4>
                <p>Un Expected Error happened</p>
                <p>Regards</p>
                <p>Team</p>
                </body>
                </html>`
    }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };
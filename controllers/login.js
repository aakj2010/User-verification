const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const client = require('../redis');
dotenv.config();

async function CheckUser(email) {
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        return "Server Busy"
    }
}

async function AuthenticateUser(email, password) {
    try {
        const userCheck = await User.findOne({ email: email });
        const validPassword = await bcrypt.compare(password, userCheck.password);

        if (validPassword) {
            const token = jwt.sign({ email }, process.env.login_Secret);
            const response = {
                id: userCheck._id,
                name: userCheck.name,
                email: userCheck.email,
                token: token,
                status: true
            };
            // await client.set(`key-${email}`, JSON.stringify(response));
            // await localStorage.setItem('userToken', token);
            await User.findOneAndUpdate(
                { email: userCheck.email },
                { $set: { token: token } },
                { new: true }
            );
            return response;
        }
        return "Invalid Username or Password"
    } catch (error) {
        console.log(error)
        return "Server Busy"
    }
}


async function AuthorizeUser(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.login_Secret);
        if (decodedToken) {
            const email = decodedToken.email;
            const data = await User.findOne({ email: email });
            return data;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { CheckUser, AuthenticateUser, AuthorizeUser };
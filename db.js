const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MonoDB is Connected');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDb
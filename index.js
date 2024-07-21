const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDb = require('./db');
const cors = require('cors');
const signupRouter = require('./routes/signUp');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const notesRouter = require('./routes/notes');
const resetPasswordRouter = require('./routes/resetPassword');
dotenv.config();

const port = 4000;

app.use(express.static('./public'));
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true
}))

connectDb();

app.get("/", (req, res) => {
    res.send("hello world")
})


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/api', resetPasswordRouter);
app.use('/notes', notesRouter);

app.listen(port, () => {
    console.log(`Server Running on ${port}`);
})
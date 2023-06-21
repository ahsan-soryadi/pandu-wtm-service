const express = require('express');
const cors = require('cors');
const login = require('./login');

const app = express();
app.use(express.json());

app.options('*', cors())
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

app.use('/user', login);
app.get("/", (req, res) => {
    res.send("test saja")
});


app.listen(3001);
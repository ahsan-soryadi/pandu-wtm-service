const express = require('express');
const cors = require('cors');
const login = require('./login');
const stock = require('./stock');
const app = express();
app.use(express.json());

app.options('*', cors())
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

app.use('/user', login);
app.use('/stock', stock)
app.get("/", (req, res) => {
    res.send("test saja")
});


app.listen(3001);
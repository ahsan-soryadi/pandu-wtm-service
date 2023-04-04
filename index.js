const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("test saja")
});

app.listen(3080);
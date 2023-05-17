const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const https = require('https');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    user: "sandi",
    password: "Aplikas!123",
    host: "localhost",
    database: "pandu-wtm"
})
let isLogin = false;

router.use(cookieParser());

router.get("/test", (req, res) => {
    db.connect((err, result)=> {
        if(err){
            console.log(err)
        }
        result = {"pesan": "ok"}
        console.log(result)
        res.send(result)
    })
})

router.get("/encrypt", (req, res) => {
    try {
        bcrypt.genSalt(10).then(result => {
            bcrypt.hash('cancerjune06', result).then(hashResult => {
                console.log(hashResult);
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
        res.send({"message":"ok"})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.post("/login", async (req, res)=> {
    const userName = req.body.userName  ? req.body.userName : "";
    const password = req.body.password  ? req.body.password : "";
    // console.log("username : ", userName)
    // console.log("password : ", password)
    if(userName === "" || password === ""){
        res.send({"error": "username and password cannot empty"})
        return
    }
    // db.query("SELECT USERNAME FROM USER WHERE USERNAME= ?", [userName], (err, result) =>{
    //     if(err){
    //         console.log(err); 
    //     } else {
            // if(result.length > 0){
                // db.query("SELECT USERNAME FROM USER WHERE USERNAME = ? AND PASSWORD = ?", 
                // [userName, password], 
                db.query("SELECT USERNAME, PASSWORD FROM USER WHERE USERNAME = ?", 
                [userName], 
                 async (err, result) => {
                    if(result.length > 0){
                        //need further check for multiple rows of result
                        for(let i=0; i<result.length; i++){
                            if(userName === result[i].USERNAME){
                                if(await bcrypt.compare(password, result[i].PASSWORD)){
                                    console.log('password sama')
                                    const token = jwt.sign({"user":result[i].USERNAME}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:60})
                                    res.send({"message":"ok", "token":token})
                                }else{
                                    console.log('password salah')
                                    res.send({"message":"error, password did not match"})
                                }
                            }
                        }
                    } else {
                        res.send({"error":"username not found"})
                    }
                })

})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader.split('=')[1];
    token.replace(" ","");
    console.log("token=", token)
    if(token == null) return res.status(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log("error = ", err)
        if(err){
            isLogin = false;
            // return res.sendStatus(403);
        } else {
            isLogin = true;
        }
        next();
    })
}

router.get('/auth', authenticateToken, (req, res) => {   
    console.log("result = ", isLogin) 
    res.json({"result": isLogin});
})


module.exports = router;
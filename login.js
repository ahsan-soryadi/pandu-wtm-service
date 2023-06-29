const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const https = require('https');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const { cookie } = require('express/lib/response');
const dbUtils = require('./dbUtils');
const {generateAccessToken} = require('./token')


let isLogin = false;

router.use(cookieParser());

//test DB connection
router.get("/test",async (req, res) => {
    const dbResult = await dbUtils.findUser("Pandu Wibisana");
    console.log("db result : ",dbResult)
    res.send({"result":dbResult})
})

//encrypt password manual
router.get("/encrypt", (req, res) => {
    try {
        bcrypt.genSalt(10).then(result => {
            bcrypt.hash('12345678', result).then(hashResult => {
                console.log(hashResult);
                res.send({"message":"ok", "hashed password": hashResult})
                return
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
        
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

//login end point
router.post("/login", async (req, res)=> {
    const userName = req.body.userName  ? req.body.userName : "";
    const password = req.body.password  ? req.body.password : "";
    // console.log("username : ", userName)
    // console.log("password : ", password)
    if(userName === "" || password === ""){
        res.send({"error": "username and password cannot empty"})
        return
    }
    //check if user exist
    const user = await dbUtils.findUser(userName);
    if(Object.keys(user).length <= 0){
        console.log("inside user not found")
        res.send({"error":"username not found"})
        return
    }
    //end

    //check if password correct
      if(await dbUtils.comparePassword(userName, password)){
        const token = generateAccessToken(userName)
        res.send({"message":"ok", "token":token, "user":user})
      } else {
        res.send({"error": "username or password did not match", "password": password})
      }
    //end
})

//authenticate token send from frontend process
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split('=')[1];
    if(token == null || token === undefined) {
        isLogin = false;
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                isLogin = false;
            } else {
                isLogin = true;
            }
            
        })
    }
    next();  
}

//authenticate token end point
router.get('/auth', authenticateToken, (req, res) => {    
    res.json({"result": isLogin});
})

//logout end point
router.get('/logout', (req, res) => {
    console.log()
    res.cookie({'token': 'none'}, {
        expires: 3,
        httpOnly: true
    })
    isLogin = false;
    res.status(200).json({"result": isLogin})
})

module.exports = router;
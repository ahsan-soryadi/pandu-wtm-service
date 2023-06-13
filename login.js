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

router.get("/test",async (req, res) => {
    const dbResult = await dbUtils.findUser("Pandu Wibisana");
    console.log("db result : ",dbResult)
    res.send({"result":dbResult})
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
    const user = await dbUtils.findUser(userName);
    console.log(user)
    if(Object.keys(user).length <= 0){
        console.log("inside user not found")
        res.send({"error":"username not found"})
        return
        //isUserExist = true;
    }
    //if(!isUserExist){
        
   // } else {
      if(await dbUtils.comparePassword(userName, password)){
        const token = generateAccessToken(userName)
        //const refreshToken = generateRefreshToken(userName)
        // res.cookie("token",token,{httpOnly: true})
        res.send({"message":"ok", "token":token})
      } else {
        res.send({"error": "username or password did not match"})
      }
    //}
                // db.query("SELECT USERNAME, PASSWORD FROM USER WHERE USERNAME = ?", 
                // [userName], 
                //  async (err, result) => {
                //     if(result.length > 0){
                //         //need further check for multiple rows of result
                //         for(let i=0; i<result.length; i++){
                //             if(userName === result[i].USERNAME){
                //                 if(await bcrypt.compare(password, result[i].PASSWORD)){
                //                     console.log('password sama')
                //                     const token = jwt.sign({"user":result[i].USERNAME}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:60})
                //                     res.send({"message":"ok", "token":token})
                //                 }else{
                //                     console.log('password salah')
                //                     res.send({"message":"error, password did not match"})
                //                 }
                //             }
                //         }
                //     } else {
                //         res.send({"error":"username not found"})
                //     }
                // })

})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader.split('=')[1];
    console.log("token=", token)
    if(token == null || token === undefined) {
        isLogin = false;
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log("error = ", err)
            if(err){
                isLogin = false;
            } else {
                isLogin = true;
            }
            
        })
    }
    next();  
}

router.get('/auth', authenticateToken, (req, res) => {   
    console.log("result = ", isLogin) 
    res.json({"result": isLogin});
})

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
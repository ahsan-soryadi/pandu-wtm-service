const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = mysql.createConnection({
    user: "sandi",
    password: "Aplikas!123",
    host: "localhost",
    database: "pandu-wtm"
})

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

router.post("/login", (req, res)=> {
    const userName = req.body.userName  ? req.body.userName : "";
    const password = req.body.password  ? req.body.password : "";
    console.log("username : ", userName)
    console.log("password : ", password)
    if(userName === "" || password === ""){
        res.send({"error": "username and password cannot empty"})
        return
    }
    db.query("SELECT USERNAME FROM USER WHERE USERNAME= ?", [userName], (err, result) =>{
        if(err){
            console.log(err); 
        } else {
            if(result.length > 0){
                db.query("SELECT USERNAME FROM USER WHERE USERNAME = ? AND PASSWORD = ?", 
                [userName, password], 
                (err, result) => {
                    if(result.length > 0){
                        console.log(result)
                        res.send({"ok":"user " + userName + " ada"})
                    } else {
                        res.send({"error":"username and password did not match"})
                    }
                })
                console.log(result)
                // res.send(result)
            } else {
                res.send({"error": "user not found"})
            }
        }
    })

})


module.exports = router;
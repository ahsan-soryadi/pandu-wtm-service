const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const util = require('util');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// const pool = mysql.createPool({
//     user: "sandi",
//     password: "Aplikas!123",
//     host: "localhost",
//     database: "wtm"
// })
exports.conn = async() => {
    const pool =  mysql.createPool({
        user: "sandi",
        password: "Aplikas!123",
        host: "localhost",
        database: "wtm"
    })
    return pool.promise();
}

exports.findUser = async (userName) => {
    if(userName === undefined || null) return {};
    let result = {}
    const conn = await this.conn()
    try {
        const [rows] = await conn.execute("SELECT * FROM USERNAME WHERE USERNAME = ?",[userName])
        result = {}
        // console.log("rows ",rows)
        if(rows.length > 0){
            rows.map(data => {
                result = data
            })
        }
        // console.log("result ",result)
        return result;
    } catch (error) {
        console.log(error)
        return result
    } finally {
        await conn.end()
    }
}

exports.comparePassword = async (userName, password) => {
    let result = false
    const conn = await this.conn()
    try {
        const [rows] = await conn.execute("SELECT USERNAME, PASSWORD FROM USERNAME WHERE PASSWORD = ?", [password])
        result = false
        if(rows.length > 0){
            rows.forEach(data => {
                if(data.USERNAME.toLowerCase() === userName.toLowerCase() && data.PASSWORD === password){
                    console.log("inside password match")
                    result = true
                    // if(await bcrypt.compare(password, row.PASSWORD)) return true;
                }
            })
        }
        
    } catch (error) {
        console.log(error)
        result = false
    } finally {
        await conn.end()
    }
    return result
}
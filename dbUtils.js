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
        const [rows] = await conn.execute("SELECT USERNAME, ROLE, ID FROM USERNAME WHERE USERNAME = ?",[userName])
        result = {}
        if(rows.length > 0){
            rows.map(data => {
                result = data
            })
        }
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
        const [rows] = await conn.execute("SELECT USERNAME, PASSWORD FROM USERNAME WHERE USERNAME = ?", [userName])
        if(rows.length > 0){
            for (const data of rows){
                if(data.USERNAME.toLowerCase() === userName.toLowerCase()){
                    result = await bcrypt.compare(password, data.PASSWORD)
                }
            }
        }
        
    } catch (error) {
        console.log(error)
        result = false
        
    } finally {
        await conn.end()
    }
    return result
}
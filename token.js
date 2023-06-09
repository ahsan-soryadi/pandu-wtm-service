const jwt = require("jsonwebtoken")
require('dotenv/config')

exports.generateAccessToken = (userName) =>{
    return jwt.sign({"name":userName}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60})
}

exports.generateRefreshToken = (userName) => {
    return jwt.sign({"name": userName}, process.env.REFRESH_TOKEN_SECRET)
}
const jwt = require("jsonwebtoken")
require('dotenv/config')

//generate access token
exports.generateAccessToken = (userName) =>{
    return jwt.sign({"name":userName}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
}
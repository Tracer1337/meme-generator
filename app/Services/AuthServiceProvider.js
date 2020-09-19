const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function authorize(req) {
    return (
        req.header("Authorization") &&
        req.header("Authorization") === process.env.UPLOAD_PASSWORD
    )
}

function generateToken(input) {
    return jwt.sign(input, process.env.JWT_SECRET)
}

function hashPassword(password) {
    return bcrypt.hash(password, +process.env.SALT_ROUNDS)
}

function validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = { authorize, generateToken, hashPassword, validatePassword }
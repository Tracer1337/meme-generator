const path = require("path")
const opn = require("opn")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

console.log(process.env)

opn(`http://localhost:${process.env.PORT}`)
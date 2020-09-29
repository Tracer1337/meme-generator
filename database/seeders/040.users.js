const bcrypt = require("bcrypt")
const faker = require("faker")
const moment = require("moment")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })

const User = require("../../app/Models/User.js")
const Templates = require("../../app/Models/Template.js")

function randomTimestamp() {
    const offset = Math.random() * 1000 * 3600 * 24 * 7
    return moment(moment() - offset)
}

module.exports = {
    table: "users",

    run: async () => {
        const user = new User({
            created_at: moment(),
            username: "Tracer",
            email: "joebau.0815@googlemail.com",
            password: bcrypt.hashSync("12345678", +process.env.SALT_ROUNDS)
        })

        await user.store()
    }
}
const bcrypt = require("bcrypt")
const { v4: uuid } = require("uuid")
const moment = require("moment")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })

const User = require("../../app/Models/User.js")

module.exports = {
    table: "users",

    run: async () => {
        const data = [
            ["first_user", "test@mail.com", bcrypt.hashSync("12345678", +process.env.SALT_ROUNDS), moment()]
        ]

        await Promise.all(data.map(async ([username, email, password, created_at]) => {
            const user = new User({ id: uuid(), username, email, password, created_at })
            await user.store()
        }))
    }
}
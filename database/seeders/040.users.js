const bcrypt = require("bcrypt")
const faker = require("faker")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })

const User = require("../../app/Models/User.js")
const Templates = require("../../app/Models/Template.js")

module.exports = {
    table: "users",

    run: async () => {
        const data = [
            ["first_user", "test@mail.com", bcrypt.hashSync("12345678", +process.env.SALT_ROUNDS)],
            ["second_user", "test2@mail.com", bcrypt.hashSync("12345678", +process.env.SALT_ROUNDS)],
        ]

        for (let i = 0; i < 100; i++) {
            data.push([faker.internet.userName(), faker.internet.email(), bcrypt.hashSync("12345678", +process.env.SALT_ROUNDS)])
        }

        for (let [username, email, password] of data) {
            const user = new User({ username, email, password })
            await user.store()

            for (let i = 0; i < 5; i++) {
                const templates = await Templates.where("user_id IS NULL")

                if (templates.length > 0) {
                    const randomTemplate = templates.random()
                    randomTemplate.user_id = user.id
                    await randomTemplate.update()
                }
            }
        }
    }
}
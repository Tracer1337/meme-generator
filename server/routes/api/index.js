const express = require("express")
const router = express.Router()

const modules = ["templates", "stickers", "auth"]

for(let name of modules) {
    router.use("/" + name, require(`./${name}.js`))
}

module.exports = router
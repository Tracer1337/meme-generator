const { v4: uuidv4 } = require("uuid")

function randomFileName() {
    return uuidv4().match(/([^-]*)/)[0]
}

module.exports = randomFileName
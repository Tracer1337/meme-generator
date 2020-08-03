const path = require("path")
const chalk = require("chalk")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })
require("../../config.js")

const StorageFacade = require("../facades/StorageFacade.js")

;(async () => {
    console.log("Creating bucket...")

    const { Bucket } = await StorageFacade.createBucket()

    console.log(chalk.green("Created bucket " + Bucket))
})()
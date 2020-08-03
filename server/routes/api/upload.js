const express = require("express")
const router = express.Router()

const { db } = require("../../utils/connectToDB.js")

// Get random file from uploads table
router.get("/random", (req, res) => {
    // Get random row from table
    const sql = "SELECT * FROM uploads ORDER BY RAND()"
    db.query(sql, (error, results) => {
        if (error) {
            console.error(error)
            return void res.status(500).end()
        }

        // Send first entry of shuffled rows
        const row = results[0]
        res.render("image", {
            imagePath: `/nudes/${row.filename.replace(/\..*/, "")}.jpg`,
            title: "Created with https://easymeme69.com/"
        })
    })
})

module.exports = router
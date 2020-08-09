const express = require("express")
const router = express.Router()

const { db } = require("../../utils/connectToDB.js")
const authorize = require("../../utils/authorize.js")

// Get random file from uploads table
router.get("/random", (req, res) => {
    // Get random row from table
    const sql = "SELECT * FROM uploads WHERE is_hidden = 0 ORDER BY RAND()"
    db.query(sql, (error, results) => {
        if (error) {
            console.error(error)
            return void res.status(500).end()
        }

        // Send first entry of shuffled rows
        const row = results[0]
        res.send(`/nudes/${row.filename.replace(/\..*/, "")}`)
    })
})

// Get all files
router.get("/all", (req, res) => {
    const isAuthorized = authorize({ body: req.query })

    const query = `SELECT filename ${isAuthorized ? ", is_hidden" : ""} FROM uploads ${!isAuthorized ? "WHERE is_hidden = 0" : ""} ORDER BY created_at DESC`
    
    db.query(query, (error, results) => {
        if (error) throw error

        const data = results.map(row => {
            const result = { filename: row.filename }

            if (isAuthorized) {
                result.is_hidden = !!row.is_hidden[0]
            }

            return result
        })

        res.send(data)
    })
})

module.exports = router
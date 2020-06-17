const mysql = require("mysql")

function createConnection() {
    // Create database connection
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })

    // Establish connection
    db.connect((error) => {
        if (error) throw error
        console.log("Connected to database")
    })

    return db
}

module.exports = createConnection
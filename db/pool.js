const { Pool } = require("pg")
require('dotenv').config({debug: true})

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
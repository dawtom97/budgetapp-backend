const Pool = require("pg").Pool;

const pool = new Pool({
    user:"postgres",
    password:"titanum97",
    host:"localhost",
    port:5433,
    database:"pern_app"
})

module.exports = pool;
const { Pool } = require('pg');
const { database } = require('./config');

const pool = new Pool({
    ...(database.connectionString ? { connectionString: database.connectionString } : {}),
    user: database.user,
    host: database.host,
    database: database.database,
    password: database.password,
    ssl: database.ssl,
    port: database.port,
});


pool.on("connect", () => {
    console.log("Connected to the database");
});

pool.on("error", (err) => {
    console.error("Database error", err.message);
});

module.exports = pool;

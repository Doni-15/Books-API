import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,

    ssl: {
        rejectUnauthorized: false,
    },
    
    port: process.env.DB_PORT,
});


pool.on("connect", () => {
    console.log("Connected to the database");
});

pool.on("error", (err) => {
    console.error("Database erro", err);
});

export default pool;
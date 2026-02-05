require("dotenv").config();
// const sql = require("mssql");
// const 
const { Pool } = require('pg');

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };

// const pool = new sql.ConnectionPool(config);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Dibutuhkan untuk banyak provider cloud seperti Prisma/Render/Neon
  }
});


const connectDB = async () => {
  try {
    await pool.connect();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB
};
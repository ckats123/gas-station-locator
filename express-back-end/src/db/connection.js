// Require dotenv to load environment variables from .env file
require("dotenv").config();

const { Pool } = require("pg");

// Setup database connection parameters using environment variables
const dbParams = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  //  ssl: true
};

// Create a new Pool instance with the database parameters
const db = new Pool(dbParams);

// Connect to the database
db.connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
  });

module.exports = db;

// Require dotenv to load environment variables from .env file
require('dotenv').config();

const { Pool } = require('pg');

// Setup database connection parameters using environment variables
const dbParams = {
  host: 'localhost',
  port: 5432,
  user: 'maryanibrahim',
  password: '',
  database: 'gas_station_db'
};

// Create a new Pool instance with the database parameters
const db = new Pool(dbParams);

// Connect to the database
db.connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
  });

module.exports = db;

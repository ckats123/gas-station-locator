// queries.js

const { Pool } = require('pg');

// Database connection configuration
// Setup database connection parameters using environment variables
const dbParams = {
  host: 'localhost',
  port: 5432,
  user: 'maryanibrahim',
  password: '',
  database: 'gas_station_db'
};
  

// Create a new Pool instance
const pool = new Pool(dbParams);

// Perform a sample query
async function testConnection() {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Execute a simple query
    const result = await client.query('SELECT NOW()');

    // Log the result
    console.log('Database connected successfully:', result.rows[0]);

    // Release the client back to the pool
    client.release();
  } catch (error) {
    // Log any errors
    console.error('Error connecting to the database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Call the testConnection function to execute the query
testConnection();

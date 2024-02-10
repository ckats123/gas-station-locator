// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: 'localhost',
  port: 5432,
  user: 'maryanibrahim',
  password: '',
  database: 'gas_station_db'
};

const db = new Pool(dbParams);

db.connect(() => {
  console.log('Connected to database');
});



module.exports = db;

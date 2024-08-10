const router = require("express").Router();
const db = require('../src/db/connection');
const authorization = require("../middleware/authorization");


// Get all gas stations within a certain distance of the user's location
router.get("/", async (req, res) => {
  try {
    const { lat, lng, paymentMethod } = req.query;

    // Trim the user-selected paymentMethod
    const trimmedPaymentMethod = paymentMethod ? paymentMethod.trim() : null;

    const query = `
      SELECT
        gs.id,
        gs.name,
        gs.vicinity,
        gs.payment_method,
        gs.fuel_type,
        l.lat,
        l.lng,
        gp.regular_price,
        gp.premium_price,
        gp.diesel_price,
        r.rating
      FROM gas_stations gs
      JOIN locations l ON gs.id = l.gas_station_id
      JOIN gas_prices gp ON gs.id = gp.gas_station_id
      LEFT JOIN reviews r ON gs.id = r.gas_station_id
      WHERE ST_DistanceSphere(
        ST_MakePoint(l.lng, l.lat),
        ST_MakePoint($1, $2)
      ) < 10000
      ${trimmedPaymentMethod ? 'AND LOWER(gs.payment_method) LIKE $3' : ''}
    `;

    const params = [lng, lat];

    if (trimmedPaymentMethod) params.push(`%${trimmedPaymentMethod.toLowerCase()}%`);

    const gasStations = await db.query(query, params);
    res.json(gasStations.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// Search for gas stations
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    const searchQuery = `
      SELECT
        gs.id,
        gs.name,
        gs.vicinity,
        gs.payment_method,
        gs.fuel_type,
        l.lat,
        l.lng,
        gp.regular_price,
        gp.premium_price,
        gp.diesel_price,
        r.rating
      FROM gas_stations gs
      JOIN locations l ON gs.id = l.gas_station_id
      LEFT JOIN gas_prices gp ON gs.id = gp.gas_station_id
      LEFT JOIN reviews r ON gs.id = r.gas_station_id
      WHERE LOWER(gs.name) LIKE LOWER($1)
        OR LOWER(l.street) LIKE LOWER($1)
        OR LOWER(l.city) LIKE LOWER($1)
        OR LOWER(l.province) LIKE LOWER($1)
        OR LOWER(l.postal_code) LIKE LOWER($1);
    `;

    const searchResults = await db.query(searchQuery, [`%${keyword}%`]);
    res.json(searchResults.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// Get a gas station
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gasStation = await db.query(
      "SELECT * FROM gas_stations WHERE gas_station_id = $1",
      [id]
    );
    res.json(gasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a gas station
router.post("/",  async (req, res) => {
  try {
    const { name, address, city, state, zip, lat, long } = req.body;
    const newGasStation = await db.query(
      "INSERT INTO gas_stations (gas_station_name, gas_station_address, gas_station_city, gas_station_state, gas_station_zip, gas_station_lat, gas_station_long) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, address, city, state, zip, lat, long]
    );
    res.json(newGasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a gas station
router.put("/:id",  async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, zip, lat, long } = req.body;
    const updateGasStation = await db.query(
      "UPDATE gas_stations SET gas_station_name = $1, gas_station_address = $2, gas_station_city = $3, gas_station_state = $4, gas_station_zip = $5, gas_station_lat = $6, gas_station_long = $7 WHERE gas_station_id = $8 RETURNING *",
      [name, address, city, state, zip, lat, long, id]
    );
    res.json(updateGasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a gas station
router.delete("/:id",  async (req, res) => {
  try {
    const { id } = req.params;
    const deleteGasStation = await db.query(
      "DELETE FROM gas_stations WHERE gas_station_id = $1",
      [id]
    );
    res.json("Gas station was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

const router = require("express").Router();
const db = require('../src/db/connection.js');

// Get all gas stations
router.get("/", async (req, res) => {
  try {
      const query = `
          SELECT
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
          LEFT JOIN reviews r ON gs.id = r.gas_station_id;
      `;
      const gasStations = await db.query(query);
      res.json(gasStations.rows);
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
      "SELECT * FROM gas_stations WHERE id = $1",
      [id]
    );
    res.json(gasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a gas station
router.post("/", async (req, res) => {
  try {
    const { name, vicinity, payment_method, fuel_type } = req.body;
    const newGasStation = await db.query(
      "INSERT INTO gas_stations (name, vicinity, payment_method, fuel_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, vicinity, payment_method, fuel_type]
    );
    res.json(newGasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a gas station
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, vicinity, payment_method, fuel_type } = req.body;
    const updateGasStation = await db.query(
      "UPDATE gas_stations SET name = $1, vicinity = $2, payment_method = $3, fuel_type = $4 WHERE id = $5 RETURNING *",
      [name, vicinity, payment_method, fuel_type, id]
    );
    res.json(updateGasStation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a gas station
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteGasStation = await db.query(
      "DELETE FROM gas_stations WHERE id = $1",
      [id]
    );
    res.json("Gas station was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

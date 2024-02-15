const router = require("express").Router();
const db = require("../src/db/connection");

// Add a favorite gas station
router.post("/", async (req, res) => {
  try {
    const { user_id, gas_station_id } = req.body;
    const newFavorite = await db.query(
      "INSERT INTO favorites (user_id, gas_station_id) VALUES ($1, $2) RETURNING *",
      [user_id, gas_station_id]
    );
    res.json(newFavorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all favorite gas stations for a user with additional details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
      FROM favorites f
      JOIN gas_stations gs ON f.gas_station_id = gs.id
      JOIN locations l ON gs.id = l.gas_station_id
      JOIN gas_prices gp ON gs.id = gp.gas_station_id
      LEFT JOIN reviews r ON gs.id = r.gas_station_id
      WHERE f.user_id = $1;
    `;

    const favoritesWithDetails = await db.query(query, [id]);
    res.json(favoritesWithDetails.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a favorite gas station
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFavorite = await db.query(
      "DELETE FROM favorites WHERE favorite_id = $1",
      [id]
    );
    res.json("Favorite was deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

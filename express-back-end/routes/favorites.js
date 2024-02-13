// /routes/favorites.js

const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all the user's favorited gas stations
router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// add a gas station to user's favorited list
router.post("/", authorization, async (req, res) => {
  try {
    const { id, name, address, city, state, zip, distance } =
      req.body;
    const newFavorite = await pool.query(
      "INSERT INTO favorites (user_id, gas_station_id, name, address, city, state, zip, distance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [req.user, id, name, address, city, state, zip, distance]
    );
    res.json(newFavorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// remove a gas station from user's favorited list
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFavorite = await pool.query(
      "DELETE FROM favorites WHERE gas_station_id = $1 AND user_id = $2",
      [id, req.user]
    );
    res.json("Favorite deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;

const router = require("express").Router();
const db = require('../src/db/connection');

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

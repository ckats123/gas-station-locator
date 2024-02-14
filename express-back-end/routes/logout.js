const router = require("express").Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  try {
    res.json("Logged out");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

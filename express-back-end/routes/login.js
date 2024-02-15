// login.js

const router = require("express").Router();
const db = require("../src/db/connection");
const bcrypt = require("bcrypt");

// Logging in
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await db.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    } else {
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid email or password");
      }

      // Send user.id in the response
      res.status(200).json({ id: user.rows[0].id, message: 'Login successful' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

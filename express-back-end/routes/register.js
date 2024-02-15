// register.js

const router = require("express").Router();
const db = require("../src/db/connection");
const bcrypt = require("bcrypt");

// Registering
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const { name, lastname, username, email, password } = req.body;

        // Check if the user already exists
        const user = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists");
        } else {
            // Hash the password before storing it
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            // Insert the new user into the database
            const newUser = await db.query(
                "INSERT INTO users (name, lastname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [name, lastname, username, email, bcryptPassword]
            );

            res.status(201).json(newUser.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;

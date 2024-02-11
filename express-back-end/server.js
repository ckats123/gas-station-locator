require('dotenv').config();

const express = require("express");
const cors = require("cors");

// Routes
const gasStationRoute = require("./routes/gas-stations");
const userLocationRoute = require("./routes/user-location");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use("/api/gasStations", gasStationRoute);
app.use("/api/userLocation", userLocationRoute);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});

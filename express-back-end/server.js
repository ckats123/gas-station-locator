require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const gasStationRoute = require("./routes/gas-stations");
const userLocationRoute = require("./routes/user-location");

//const gasStationPriceRoute = require("./routes/gasStationPrice");
const favoritesRoute = require("./routes/favorites");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const accountRoute = require("./routes/account")
//const userRoute = require("./routes/user");
//const reviewRoute = require("./routes/review");
//const notificationRoute = require("./routes/notification");
//const locationRoute = require("./routes/location");
//const updateRoute = require("./routes/update");
//const accountRoute = require("./routes/account");
//const settingsRoute = require("./routes/settings");

const corsOptions = {
  AccessControlAllowOrigin: "*",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

// Use routes
app.use(bodyParser.json());
app.use("/api/gas-stations", gasStationRoute);
app.use("/api/user-location", userLocationRoute);
//app.use("/api/gasStationPrice", gasStationPriceRoute);
app.use("/api/favorites", favoritesRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
//app.use("/api/user", userRoute);
//app.use("/api/review", reviewRoute);
//app.use("/api/notification", notificationRoute);
//app.use("/api/location", locationRoute);
//app.use("/api/update", updateRoute);
app.use("/api/account", accountRoute);
//app.use("/api/settings", settingsRoute);



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});

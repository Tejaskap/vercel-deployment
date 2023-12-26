const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Enable CORS with dynamic origin and optionsSuccessStatus
// Enable CORS with wildcard origin to allow all
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello, World from the Tejas's Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

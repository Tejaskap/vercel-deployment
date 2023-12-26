const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://vercel-deployment-client-eosin.vercel.app",
  optionsSuccessStatus: 200,
};

// Enable CORS with dynamic origin and optionsSuccessStatus
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello, World from the Tejas's Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

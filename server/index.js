const express = require("express");
const cors = require("cors");
const app = express();

// Determine the CORS origin based on the environment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "https://vercel-deployment-client-eosin.vercel.app"
      : "http://localhost:5000", // Use a default value for non-development environments
};

// Enable CORS with dynamic origin
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello, World from the Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

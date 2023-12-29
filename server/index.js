const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const googleCalendar = require("./lib/googleCalendar");
require("dotenv").config();

// Enable CORS with wildcard origin to allow all
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: "*",
    optionsSuccessStatus: 200,
  })
);

// Handle OPTIONS request for create-event
app.options("/api/create-event", cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World from the Tejas's Server!");
});

app.get("/bhaibhai", (req, res) => {
  res.send("bhaibhai");
});

// Display Events
app.get("/api/display-events", async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const events = await googleCalendar.displayEventTimes(startTime, endTime);
    console.log("json response", events);
    res.status(200).json(events).end();
  } catch (error) {
    console.log("this is an error", error);
    res.status(500).json({ error: error.message });
  }
});

// Define the getCurrentDateTimeForCalendar function
const getCurrentDateTimeForCalendar = () => {
  const date = new Date();
  const padZero = (value) => (value < 10 ? `0${value}` : value);

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hour = padZero(date.getHours());
  const minute = padZero(date.getMinutes());

  const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

  const startDate = new Date(newDateTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
};

app.post("/api/create-event", async (req, res) => {
  try {
    const eventData = req.body; // Assume eventData already contains start and end properties
    const events = await googleCalendar.insertEvent(eventData);
    res.json(events);
  } catch (error) {
    console.error("Error creating event:", error.message);
    console.error("Error details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/current-datetime", (req, res) => {
  try {
    const { start, end } = getCurrentDateTimeForCalendar();
    res.json({ start, end });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = "https://vercel-deployment-server-xi.vercel.app" || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

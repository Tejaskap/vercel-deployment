const { google } = require("googleapis");
require("dotenv").config();

// Load environment variables
const CREDENTIALS = process.env.CREDENTIALS
  ? JSON.parse(process.env.CREDENTIALS)
  : null;

const CALENDAR_ID = process.env.CALENDAR_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const TIMEOFFSET = "+01:00";
console.log("Credentials", CREDENTIALS);
// Create an auth object using JWT
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

// Define the calendar object globally
const calendar = google.calendar({ version: "v3", auth });

// Define a utility function to pad zero
const padZero = (value) => (value < 10 ? `0${value}` : value);

// Define the getCurrentDateTimeForCalendar function
const getCurrentDateTimeForCalendar = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hour = padZero(date.getHours());
  const minute = padZero(date.getMinutes());

  const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

  const startDate = new Date(newDateTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

  return {
    start: startDate.toISOString(), // Convert to ISO string
    end: endDate.toISOString(), // Convert to ISO string
  };
};

// Define the insertEvent function
const insertEvent = async (event) => {
  console.log("This is event data", event);

  try {
    // Ensure start and end are Date objects
    event.start.dateTime = new Date(event.start.dateTime);
    event.end.dateTime = new Date(event.end.dateTime);

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    if (response.status >= 200 && response.status < 300) {
      return "Event added to calendar";
    } else {
      console.error("Error response from Google Calendar API:", response.data);
      throw new Error("Error response from Google Calendar API");
    }
  } catch (error) {
    console.error(`Error at insertEvent --> ${error.message}`);
    console.error("Error details:", error);

    throw error; // Rethrow the error to provide additional information
  }
};

// Define the getEvents function
const getEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Europe/Berlin",
    });

    return response.data.items || [];
  } catch (error) {
    console.log(`Error at getEvents --> ${error.message}`);
    return [];
  }
};

// Define the deleteEvent function
const deleteEvent = async (eventId) => {
  try {
    const response = await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId,
    });

    return response.data === "" ? 1 : 0;
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error.message}`);
    return 0;
  }
};

// Define the displayEventTimes function
const displayEventTimes = async (startDateTime, endDateTime) => {
  const events = await getEvents(startDateTime, endDateTime);
  return events;
};

module.exports = {
  displayEventTimes,
  insertEvent,
  getCurrentDateTimeForCalendar,
};

const { google } = require("googleapis");
require("dotenv").config();

// Load environment variables
const CREDENTIALS_1 = JSON.parse(process.env.NEXT_PUBLIC_CREDENTIALS_1);
const CREDENTIALS_2 = JSON.parse(process.env.NEXT_PUBLIC_CREDENTIALS_2);

const CALENDAR_ID_1 = process.env.NEXT_PUBLIC_CALENDAR_ID_1;
const CALENDAR_ID_2 = process.env.NEXT_PUBLIC_CALENDAR_ID_2;

const SCOPES = "https://www.googleapis.com/auth/calendar";
const TIMEOFFSET = "+01:00";

// Create auth objects using JWT for each calendar
const auth1 = new google.auth.JWT(
  CREDENTIALS_1.client_email,
  null,
  CREDENTIALS_1.private_key,
  SCOPES
);

const auth2 = new google.auth.JWT(
  CREDENTIALS_2.client_email,
  null,
  CREDENTIALS_2.private_key,
  SCOPES
);

// Define the calendar objects globally for each calendar
const calendar1 = google.calendar({ version: "v3", auth: auth1 });
const calendar2 = google.calendar({ version: "v3", auth: auth2 });

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
const getEvents = async (dateTimeStart, dateTimeEnd, calendarId) => {
  try {
    // Use calendar1 for the first calendar
    const response = await calendar1.events.list({
      calendarId: CALENDAR_ID_1,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Europe/Berlin",
    });

    // Use calendar2 for the second calendar
    const response1 = await calendar2.events.list({
      calendarId: CALENDAR_ID_2,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Europe/Berlin",
    });

    return {
      calendar1Events: response.data.items || [],
      calendar2Events: response1.data.items || [],
    };
  } catch (error) {
    console.error(`Error at getEvents --> ${error.message}`);
    return [];
  }
};

// Define the deleteEvent function
const deleteEvent = async (eventId) => {
  try {
    const response = await calendar.events.delete({
      calendarId: CALENDAR_ID_1,
      eventId,
    });

    return response.data === "" ? 1 : 0;
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error.message}`);
    return 0;
  }
};

// Define the displayEventTimes function
const displayEventTimes = async (startDateTime, endDateTime, calendarId) => {
  const events = await getEvents(startDateTime, endDateTime, calendarId);
  return events;
};

module.exports = {
  displayEventTimes,
  insertEvent,
  getCurrentDateTimeForCalendar,
};

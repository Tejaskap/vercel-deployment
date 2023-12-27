const { google } = require("googleapis");
require("dotenv").config();

// Load environment variables
const CREDENTIALS = {
  type: "service_account",
  project_id: "chromatic-fx-404318",
  private_key_id: "e6742b88be155ac7fa42f114880bf157c5a942d6",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCS092g4zhtuVGP\npbYdf2+7Q2EOjRrEuwfI5LFltNeALy/qcNaCrvWfu/vRWjraWWKAo6Mm4Rjei68F\n3e4Hmqz3PI8Bs2sKymOLR5lmf+cGcMBEDN8IsfoLMgyogLfjxImFeIsyV1/YdQvL\nl+H5hOMIqBjMhzgGh8QFVVL+xdPM3mvd+tmdGKjtpwaFMaW6KrSy3APDDWbyWc9u\nt0z7lKaG/BoLdi29P/b5ZYnYhBZ/UvmRRJRSPLYxRNyQJkzLfESWSUorJPjLO9jA\nEEy1x3AGNCa/0s+fZWD+DwBO+Nddec5tR/t+EnzucfnPZ9aJbknb1giWprpiGMWL\nfS/hVQzbAgMBAAECggEAEtZkGVz9jjTtThDfIBgLpYq7/DTF9JaK+vm9pBmttPru\nMABhF8F1rumHIcbB7+Xxjs/abJsK6JvNjThPbndS7fdoNjom0hVsQbV3wgrygMTc\nzf5EFnwAY15STxi7PwQl9qikBzCRkeuruJJYbNML7mjj9vL5kPuV08Ss0hYJxJSq\nQ/fxgapVXaJAPRVt8T+ZnuS3itL5wkCslPoBsKz0uDTZysTcJIIT1uTniaKL4JqA\nHUVSRxDEY6Dw3Qk6TK2DNRtHb2zdWCGoeiN5chM2REiQsUgx9tFErbM2bMpdiTWq\nEtAXGd78RC7bgnL5QfI2jB6bnGZUfHv24SNXH5Zq5QKBgQDJU2gL+plHXa5EpE7c\nKFLHI5946PXJa9tJCZ13ctNhcb2bPBRiRjB7Sm/xS0nNezXXP2nthNyIcw0SLQSC\nQxPjbD0pe2EE+SEDvlAh6TMyoTTOwyVjNS9jJ2/3VHV6J4wiTKsqVuzr+s4i3sE3\nIKhDZSLlkR/ihq4ZmpAgsD31NQKBgQC6s6EfwtjNQg9218HHBFTdTR3ULRwB3Df5\noXQZHXEGpwKWLzFbYUY5xcLx695LqQ1BLeN0SN7rSAOkENo2DYK+pZmcmRVwiP9V\n4h+J30dTj02SZfxHGioxkW36C18ogqm2SDLDlcbg0r5nScNzBpGm+RkHicncDy62\nE6N6KbiLzwKBgQCPOFSGYQn1qQE2N6UaHV116TOjciaX2bCv7rUkqn0RjzaRXlYp\n60DGFJg6EZM5KHOO4r/ahm/UafRcf8X7XPijCvcfsXO9c/U2koay+RDA7cmBZXYN\nc2J4qS+PxXelJMkeBWimwBvfbBaE2+6b5xGMkEAZC/qgzarA8CGj/3y0GQKBgQCK\ndRB2l29kuSryvYsNZp7xB3GpmlJ85q30SNHqljTt9AktC46U8Ay+Z3TtKDjQ72vO\n/JMD986pudxJXd4V2+ssK29B/R0zOcXyESHGg3lH9KxYd52htTu5Stq+ZpSJXG0z\nq1NKTNcSf/eIbeGueh6mL3Fqb7rtoazIhsPjovEjbQKBgEdoR85yoPphAjUc7Hc1\nGBTL3ppgxma7QMFu6X+5PZY+9rj+exqga/fZoUH3LqgCc6hSwEz5Yzf+Q1WmF6J+\nz9aI4/ypUWLazSpA2jcmaU6xmNfncI+YkYXXEqnv9MVXRLUCmEXbP5jHG3mwEFz0\n5EEAptbWbVkTq2ubVBJDbj1J\n-----END PRIVATE KEY-----\n",
  client_email:
    "tesing-google-calender-api@chromatic-fx-404318.iam.gserviceaccount.com",
  client_id: "113451235793250586237",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/tesing-google-calender-api%40chromatic-fx-404318.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
const CALENDAR_ID =
  "9bd42a48cf019b21317287fffbb7c4bfe2310969869a0ff4e65721a7f1ad0939@group.calendar.google.com";
const SCOPES = "https://www.googleapis.com/auth/calendar";
const TIMEOFFSET = "+01:00";

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

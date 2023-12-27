// Home.js

// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/CalendarComponent";
import TimeSlots from "./components/TimeSlots";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://vercel-deployment-client-eosin.vercel.app/";

const API_ENDPOINT = `${API_BASE_URL}/api/display-events`;
const API_ENDPOINT_CREATE_EVENT = `${API_BASE_URL}/api/create-event`;

async function getData(startTime, endTime) {
  try {
    const res = await fetch(
      `${API_ENDPOINT}?startTime=${startTime}&endTime=${endTime}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    console.log(res.json);
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

const generateTimeSlots = (startHour, endHour, interval) => {
  const timeSlots = [];
  let currentHour = startHour;
  while (currentHour < endHour) {
    const startTime = `${currentHour < 10 ? "0" : ""}${currentHour}:00`;
    const endTime = `${currentHour + 1 < 10 ? "0" : ""}${currentHour + 1}:00`;
    timeSlots.push({ startTime, endTime });
    currentHour += interval;
  }
  return timeSlots;
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookingSlot, setBookingSlot] = useState(null); // Initial state set to null
  const [clientName, setClientName] = useState("");

  const fetchData = async (startDateTime, endDateTime) => {
    try {
      console.log(
        "Fetching data with startTime and endTime:",
        startDateTime,
        endDateTime
      );
      const result = await getData(
        startDateTime.toISOString(),
        endDateTime.toISOString()
      );
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const generatedTimeSlots = generateTimeSlots(8, 20, 1);
    console.log("Generated time slots:", generatedTimeSlots);
    setTimeSlots(generatedTimeSlots);

    // Reset bookingSlot when the date changes
    setBookingSlot(null);
  }, [selectedDate]);

  const onSelectDate = (date) => {
    setSelectedDate(date);

    const startDateTime = new Date(date);
    startDateTime.setHours(8, 0, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(20, 0, 0, 0);

    fetchData(startDateTime, endDateTime);

    const generatedTimeSlots = generateTimeSlots(8, 20, 1);
    console.log("Generated time slots:", generatedTimeSlots);
    setTimeSlots(generatedTimeSlots);
  };

  const handleBookNow = (startTime, endTime) => {
    setBookingSlot({ startTime, endTime });
  };

  const handleConfirmBooking = async () => {
    try {
      // Check if bookingSlot is available
      if (!bookingSlot) {
        console.error("No bookingSlot available");
        return;
      }

      // Check if clientName is provided
      if (!clientName) {
        console.error("Client name is required");
        return;
      }

      // Prepare event data
      const event = {
        summary: `Booking for ${clientName}`,
        location: "Event location",
        description: "Event description",
        start: {
          dateTime: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(bookingSlot.startTime.split(":")[0], 10),
            parseInt(bookingSlot.startTime.split(":")[1], 10),
            0
          ).toISOString(),
          timeZone: "Europe/Berlin",
        },
        end: {
          dateTime: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(bookingSlot.endTime.split(":")[0], 10),
            parseInt(bookingSlot.endTime.split(":")[1], 10),
            0
          ).toISOString(),
          timeZone: "Europe/Berlin",
        },
      };

      // Send a POST request to the server API
      console.log("Event Data:", event);
      try {
        const response = await fetch(API_ENDPOINT_CREATE_EVENT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error in fetch:", error.message);
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
    }
  };

  const handleCancelBooking = () => {
    setBookingSlot(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full md:max-w-screen-md p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Book a Session with Tejas
        </h1>
        <div className="w-full p-4 rounded-md">
          <CalendarComponent onSelectDate={onSelectDate} />
        </div>
        <div className="w-full p-4 mt-4 rounded-md">
          <TimeSlots
            timeSlots={timeSlots}
            data={data}
            selectedDate={selectedDate}
            bookingSlot={bookingSlot}
            handleBookNow={handleBookNow}
            handleConfirmBooking={handleConfirmBooking}
            handleCancelBooking={() => setBookingSlot(null)}
            clientName={clientName}
            setClientName={setClientName}
          />
        </div>
      </div>
    </div>
  );
}

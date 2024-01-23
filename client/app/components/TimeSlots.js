import React, { useEffect, useMemo, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

// Utility function to get day name
const getDayName = (dayIndex) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex];
};

const TimeSlots = ({ timeSlots, data, selectedDate, onAddNow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addedSlots, setAddedSlots] = useState([]);

  console.log("Events from calendar1:", data.calendar1Events);
  console.log("Events from calendar2:", data.calendar2Events);

  const isTimeOverlap = (start1, end1, start2, end2) => {
    return !(end1 <= start2 || start1 >= end2);
  };

  const availableTimeSlots = useMemo(() => {
    if (
      !selectedDate ||
      !data ||
      data.calendar1Events === undefined ||
      data.calendar2Events === undefined
    ) {
      return [];
    }

    console.log("Events from calendar1:", data.calendar1Events);
    console.log("Events from calendar2:", data.calendar2Events);

    // Check if events are present in both calendars
    if (!data.calendar1Events.length || !data.calendar2Events.length) {
      console.log("Events are missing from one or both calendars.");
      return [];
    }

    const slotOverlapsEvent = (slotStartTime, slotEndTime, events) => {
      return events.some((event) => {
        const eventStartTime =
          event.start && event.start.dateTime
            ? new Date(event.start.dateTime)
            : null;
        const eventEndTime =
          event.end && event.end.dateTime ? new Date(event.end.dateTime) : null;

        const isValid = eventStartTime && eventEndTime;

        if (isValid) {
          return (
            isTimeOverlap(
              eventStartTime,
              eventEndTime,
              slotStartTime,
              slotEndTime
            ) ||
            (eventEndTime &&
              eventEndTime.getTime() === slotStartTime.getTime()) ||
            (eventStartTime &&
              eventStartTime.getTime() === slotEndTime.getTime())
          );
        }

        return false;
      });
    };

    const availableSlots = timeSlots.filter((slot) => {
      const slotStartTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(slot.startTime.split(":")[0], 10),
        0,
        0
      );
      const slotEndTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(slot.endTime.split(":")[0], 10),
        0,
        0
      );

      const calendar1Overlap = slotOverlapsEvent(
        slotStartTime,
        slotEndTime,
        data.calendar1Events
      );
      const calendar2Overlap = slotOverlapsEvent(
        slotStartTime,
        slotEndTime,
        data.calendar2Events
      );

      // Log details for debugging
      console.log("Slot:", slot);
      console.log("Slot Start Time:", slotStartTime);
      console.log("Slot End Time:", slotEndTime);
      console.log("Calendar 1 Overlap:", calendar1Overlap);
      console.log("Calendar 2 Overlap:", calendar2Overlap);

      return !(calendar1Overlap || calendar2Overlap);
    });

    // Log the available time slots
    console.log("Available Time Slots:", availableSlots);

    return availableSlots;
  }, [data, selectedDate, timeSlots]);

  useEffect(() => {
    setIsLoading(true);

    const delay = setTimeout(() => {
      // Log events from calendar1
      console.log("Events from calendar1:", data.calendar1Events);

      // Log events from calendar2
      console.log("Events from calendar2:", data.calendar2Events);

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [selectedDate, timeSlots]);

  const handleAddNow = (slot) => {
    const timeSlotString = `${slot.startTime} - ${slot.endTime}`;
    const slotInfo = {
      timeSlotString,
      date: selectedDate.toDateString(),
    };

    if (
      !addedSlots.some(
        (addedSlot) =>
          addedSlot.timeSlotString === timeSlotString &&
          addedSlot.date === slotInfo.date
      )
    ) {
      setAddedSlots([...addedSlots, slotInfo]);
      onAddNow({
        startTime: slot.startTime,
        endTime: slot.endTime,
        date: selectedDate.toDateString(),
        day: getDayName(selectedDate.getDay()),
      });
    }
  };

  return (
    <div className="mt-8">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ul className="space-y-4">
          {availableTimeSlots.map((slot, index) => (
            <li
              key={index}
              className="border-t border-black border-solid pt-4 px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">
                  {`${slot.startTime} - ${slot.endTime}`}
                </span>
                <div className="flex space-x-4">
                  <button
                    className={`${
                      addedSlots.some(
                        (addedSlot) =>
                          addedSlot.timeSlotString ===
                            `${slot.startTime} - ${slot.endTime}` &&
                          addedSlot.date === selectedDate.toDateString()
                      )
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 text-sm transition duration-300 ease-in-out`}
                    onClick={() => handleAddNow(slot)}
                    disabled={addedSlots.some(
                      (addedSlot) =>
                        addedSlot.timeSlotString ===
                          `${slot.startTime} - ${slot.endTime}` &&
                        addedSlot.date === selectedDate.toDateString()
                    )}
                  >
                    {addedSlots.some(
                      (addedSlot) =>
                        addedSlot.timeSlotString ===
                          `${slot.startTime} - ${slot.endTime}` &&
                        addedSlot.date === selectedDate.toDateString()
                    )
                      ? "Added"
                      : "Add Now"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeSlots;

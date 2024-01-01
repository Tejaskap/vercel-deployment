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

  const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  const availableTimeSlots = useMemo(() => {
    if (
      !selectedDate ||
      !data ||
      !data.calendar1Events ||
      !data.calendar2Events
    ) {
      return [];
    }

    return timeSlots.filter((slot) => {
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

      // Check if the slot overlaps with any event in either calendar
      return !(
        data.calendar1Events.some((event) => {
          const eventStartTime =
            event.start && event.start.dateTime
              ? new Date(event.start.dateTime)
              : null;
          const eventEndTime =
            event.end && event.end.dateTime
              ? new Date(event.end.dateTime)
              : null;

          // Check if the start and end properties exist before using them
          const isValid = eventStartTime && eventEndTime;

          if (isValid) {
            return isTimeOverlap(
              eventStartTime,
              eventEndTime,
              slotStartTime,
              slotEndTime
            );
          }

          return false;
        }) ||
        data.calendar2Events.some((event) => {
          const eventStartTime =
            event.start && event.start.dateTime
              ? new Date(event.start.dateTime)
              : null;
          const eventEndTime =
            event.end && event.end.dateTime
              ? new Date(event.end.dateTime)
              : null;

          // Check if the start and end properties exist before using them
          const isValid = eventStartTime && eventEndTime;

          if (isValid) {
            return isTimeOverlap(
              eventStartTime,
              eventEndTime,
              slotStartTime,
              slotEndTime
            );
          }

          return false;
        })
      );
    });
  }, [data, selectedDate, timeSlots]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(8, 0, 0, 0);

        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(20, 0, 0, 0);

        const result1 = await getData(
          startDateTime.toISOString(),
          endDateTime.toISOString(),
          process.env.NEXT_PUBLIC_CALENDAR_ID_1
        );

        const result2 = await getData(
          startDateTime.toISOString(),
          endDateTime.toISOString(),
          process.env.NEXT_PUBLIC_CALENDAR_ID_2
        );

        // Ensure that result1 and result2 have the expected structure
        const isValidStructure =
          result1.hasOwnProperty("calendar1Events") &&
          result1.hasOwnProperty("calendar2Events") &&
          Array.isArray(result1.calendar1Events) &&
          Array.isArray(result1.calendar2Events) &&
          result2.hasOwnProperty("calendar1Events") &&
          result2.hasOwnProperty("calendar2Events") &&
          Array.isArray(result2.calendar1Events) &&
          Array.isArray(result2.calendar2Events);

        if (!isValidStructure) {
          throw new Error("Invalid data structure received from the server");
        }

        // Combine or manage results as needed
        const combinedResults = {
          calendar1Events: [
            ...result1.calendar1Events,
            ...result2.calendar1Events,
          ],
          calendar2Events: [
            ...result1.calendar2Events,
            ...result2.calendar2Events,
          ],
        };

        if (
          combinedResults.calendar1Events.length === 0 &&
          combinedResults.calendar2Events.length === 0
        ) {
          throw new Error("No data received from the server");
        }

        setData(combinedResults);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [selectedDate]);

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

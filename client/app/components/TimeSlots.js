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
    if (!selectedDate) {
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

      return !data.some((event) => {
        const eventStartTime = new Date(event.start.dateTime);
        const eventEndTime = new Date(event.end.dateTime);

        return isTimeOverlap(
          eventStartTime,
          eventEndTime,
          slotStartTime,
          slotEndTime
        );
      });
    });
  }, [data, selectedDate, timeSlots]);

  useEffect(() => {
    setIsLoading(true);

    // Simulate an asynchronous operation (e.g., fetching data)
    const delay = setTimeout(() => {
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

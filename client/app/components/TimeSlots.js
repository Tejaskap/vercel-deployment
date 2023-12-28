import React, { useEffect, useMemo, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import _ from "lodash";
import isEqual from "lodash/isEqual";
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
  const [addedSlot, setAddedSlot] = useState(null);

  const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  const areObjectsEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };

  const availableTimeSlots = useMemo(() => {
    return timeSlots.filter((slot) => {
      return !data.some((event) =>
        isTimeOverlap(
          new Date(event.start.dateTime),
          new Date(event.end.dateTime),
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(slot.startTime.split(":")[0], 10),
            0,
            0
          ),
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(slot.endTime.split(":")[0], 10),
            0,
            0
          )
        )
      );
    });
  }, [data, selectedDate, timeSlots]);

  useEffect(() => {
    setIsLoading(true); // Show loader when calendar changes

    // Simulate an asynchronous operation (e.g., fetching data)
    const delay = setTimeout(() => {
      setIsLoading(false); // Hide loader after data is fetched (replace this with your actual data fetching logic)
    }, 1000);

    return () => clearTimeout(delay); // Cleanup function to clear the timeout on component unmount
  }, [selectedDate, timeSlots]);

  const handleAddNow = (slot) => {
    const dataToCheck = {
      startTime: slot.startTime,
      endTime: slot.endTime,
      date: selectedDate.toDateString(),
      day: getDayName(selectedDate.getDay()),
    };

    if (!data.some((event) => areObjectsEqual(event, dataToCheck))) {
      setAddedSlot(dataToCheck);
      onAddNow(dataToCheck);
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
                      addedSlot && areObjectsEqual(addedSlot, slot)
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 text-sm transition duration-300 ease-in-out`}
                    onClick={() => handleAddNow(slot)}
                    disabled={addedSlot && areObjectsEqual(addedSlot, slot)}
                  >
                    {addedSlot && areObjectsEqual(addedSlot, slot)
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

// TimeSlots.js
import React, { useEffect, useMemo } from "react";
import BookingForm from "./BookingForm";

const TimeSlots = ({
  timeSlots,
  data,
  selectedDate,
  bookingSlot,
  handleBookNow,
  handleConfirmBooking,
  handleCancelBooking,
  clientName,
  setClientName,
}) => {
  const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
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
    console.log("TimeSlots component re-rendered");
  }, [data, selectedDate, timeSlots]);

  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {availableTimeSlots.map((slot, index) => (
          <li
            key={index}
            className="border-t border-black border-solid pt-4 px-4 py-2 rounded"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-800">{`${slot.startTime} - ${slot.endTime}`}</span>
              {bookingSlot &&
              bookingSlot.startTime === slot.startTime &&
              bookingSlot.endTime === slot.endTime ? (
                <BookingForm
                  bookingSlot={bookingSlot}
                  handleConfirmBooking={handleConfirmBooking}
                  handleCancelBooking={handleCancelBooking}
                  clientName={clientName}
                  setClientName={setClientName}
                />
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleBookNow(slot.startTime, slot.endTime)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 text-sm"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSlots;

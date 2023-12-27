// BookingForm.js
import React from "react";

const BookingForm = ({
  bookingSlot,
  handleConfirmBooking,
  handleCancelBooking,
  clientName,
  setClientName,
}) => {
  console.log("bookingSlot in BookingForm:", bookingSlot);

  const confirmBooking = () => {
    // Ensure bookingSlot exists and has start and end times
    if (bookingSlot && bookingSlot.startTime && bookingSlot.endTime) {
      // Explicitly set start and end times for the event
      const event = {
        ...bookingSlot,
        start: { dateTime: bookingSlot.startTime },
        end: { dateTime: bookingSlot.endTime },
      };

      // Call handleConfirmBooking with the event data
      handleConfirmBooking(event);
    } else {
      // Handle the case when bookingSlot is not set or doesn't have the required data
      console.error("Invalid bookingSlot:", bookingSlot);
    }
  };

  return (
    <>
      {bookingSlot && (
        <div className="flex-container">
          <div className="input-container">
            <input
              type="text"
              placeholder="Your Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border p-2"
            />
          </div>
          <div className="button-container">
            <button
              onClick={confirmBooking}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
            >
              Confirm
            </button>
            <button
              onClick={handleCancelBooking}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;

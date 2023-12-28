// BookingForm.js
import React, { useEffect, useState } from "react";

const BookingForm = ({ onBookNow, bookingData }) => {
  const [bookingList, setBookingList] = useState([]);

  const handleBookNow = (bookingData) => {
    if (bookingData) {
      setBookingList([...bookingList, bookingData]);
      onBookNow(bookingData);
    }
  };

  useEffect(() => {
    if (bookingData) {
      setBookingList([...bookingList, bookingData]);
    }
  }, [bookingData]);

  return (
    <div>
      <h2>Booking List:</h2>
      {bookingList.length > 0 ? (
        <ul className="booking-list">
          {bookingList.map((booking, index) => (
            <li key={index} className="booking-item">
              <p>
                <span className="booking-time">{`${booking.startTime} to ${booking.endTime}`}</span>
                <span className="booking-date">{` - ${booking.date}`}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings">
          28th December - Monday - 08:00 to 09:00 - Add Your List Below
        </p>
      )}
      <button
        className="book-now-button"
        onClick={() =>
          handleBookNow({
            /* your booking data here */
          })
        }
      >
        Book Now
      </button>
    </div>
  );
};

export default BookingForm;

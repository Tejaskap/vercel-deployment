// CalendarComponent.js
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/styles.css";

const CalendarComponent = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setOpen] = useState(false);

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onSelectDate(today);
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
    setOpen(false);
  };

  // Close the calendar when the selected date changes
  useEffect(() => {
    setOpen(false);
  }, [selectedDate]);

  return (
    <div className="calendar-container p-4">
      <div className="datepicker-header mb-4">
        <button className="today_button" onClick={goToToday}>
          Go To Today
        </button>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
        className="w-full"
        calendarClassName="responsive-calendar" // Add this line
        open={isOpen}
        onClickOutside={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
    </div>
  );
};

export default CalendarComponent;

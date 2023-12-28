// CalendarComponent.js
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/styles.css";

const CalendarComponent = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onSelectDate(today);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

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
      />
    </div>
  );
};

export default CalendarComponent;

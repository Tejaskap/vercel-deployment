// LoadingIndicator.js
import React from "react";
import "../styles/LoadingIndicator.css";

const LoadingIndicator = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingIndicator;

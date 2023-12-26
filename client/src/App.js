import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchServerMessage();
  }, []);

  const fetchServerMessage = async () => {
    try {
      // Use the environment variable for the server URL only during development
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_URL || "http://localhost:5000"
          : "https://vercel-deployment-server-sage.vercel.app";

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      console.log("Server message:", data);
      setServerMessage(data);
    } catch (error) {
      console.error("Error fetching data from the server:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {serverMessage || "Loading..."}
          <br />
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

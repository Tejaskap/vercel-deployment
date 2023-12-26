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
      const response = await fetch("http://localhost:5000/"); // Update the URL to match your server's address
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

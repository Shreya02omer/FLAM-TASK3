import React from "react";
import Calendar from "./components/Calendar"; // Make sure the path is correct
import { EventProvider } from "./context/EventContext"; // Again, path must match
import "./styles.css";

const App = () => {
  return (
    <EventProvider>
      <div className="app-container">
        <h1>Event Calendar</h1>
        <Calendar />
      </div>
    </EventProvider>
  );
};

export default App;

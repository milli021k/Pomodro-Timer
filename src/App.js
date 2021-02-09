import React from "react";
import "./App.css";
import Pomodoro from "./pomodoro/Pomodoro";

function App() {
  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div className="container">
        <Pomodoro />
      </div>
    </div>
  );
}

export default App;

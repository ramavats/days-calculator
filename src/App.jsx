import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [includeEndDate, setIncludeEndDate] = useState(false); // State for checkbox

  const calculateTimeDifference = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Add one day to the end date if the checkbox is checked
    if (includeEndDate) {
      to.setDate(to.getDate() + 1);
    }
    
    const difference = to - from;

    // Validate date inputs
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');

    if (!fromDate) {
      fromDateInput.setCustomValidity("Please select a start date.");
      fromDateInput.reportValidity();
      return;
    } else {
      fromDateInput.setCustomValidity(""); // Clear any previous error
    }

    if (!toDate) {
      toDateInput.setCustomValidity("Please select an end date.");
      toDateInput.reportValidity();
      return;
    } else {
      toDateInput.setCustomValidity(""); // Clear any previous error
    }

    if (difference < 0) {
      fromDateInput.setCustomValidity("The 'Start Date' must be before the 'End Date'.");
      fromDateInput.reportValidity();
      return;
    } else {
      fromDateInput.setCustomValidity(""); // Clear any previous error
    }

    // Clear any previous errors on the toDate input
    toDateInput.setCustomValidity("");

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    // Set the countdown state directly after calculating the time difference
    setCountdown({ days, hours, minutes, seconds });
    setIsCounting(true);
  };

  useEffect(() => {
    let timer;
    if (isCounting && countdown) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          } else if (prev.days > 0) {
            return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
          } else {
            clearInterval(timer);
            setIsCounting(false);
            return null;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  const handleCalculate = () => {
    calculateTimeDifference();
  };

  return (
    <div className="App">
      <h1>Days Calculator</h1>
      <div className="date-picker">
        <label htmlFor="fromDate">Start Date</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      <div className="date-picker">
        <label htmlFor="toDate">End Date</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <div className="checkbox">
  <input
    type="checkbox"
    id="includeEndDate"
    checked={includeEndDate}
    onChange={(e) => setIncludeEndDate(e.target.checked)}
  />
  <label htmlFor="includeEndDate">Include End Date in Calculation</label>
</div>
      <button onClick={handleCalculate}>Calculate</button>
      {isCounting && countdown && (
        <div className="countdown">
          <h2>Countdown:</h2>
          <p>{countdown.days} Days, {countdown.hours} Hours, {countdown.minutes} Minutes, {countdown.seconds} Seconds</p>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import TrainDisplay from './TrainResultsDisplay';


const TrainSearchTab = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState('');

  const fetchTrainData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trains/search?from=${from}&to=${to}&date=${date}`
      );

      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        setTrains(data.data);
        setError('');
      } else {
        setTrains([]);
        setError('No trains found for the selected route and date.');
      }
    } catch (err) {
      console.error('Error fetching train data:', err);
      setError('An error occurred while fetching train data.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      setError('Please enter From, To, and Date of Journey.');
      return;
    }
    fetchTrainData();
  };

  return (
    <div className="train-search-container">
      <h2>Search Trains</h2>
      <form onSubmit={handleSubmit} className="train-search-form">
        <input
          type="text"
          placeholder="From Station Code (e.g. NDLS)"
          value={from}
          onChange={(e) => setFrom(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          placeholder="To Station Code (e.g. BPL)"
          value={to}
          onChange={(e) => setTo(e.target.value.toUpperCase())}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {trains.length > 0 && <TrainDisplay trains={trains} />}
    </div>
  );
};

export default TrainSearchTab;

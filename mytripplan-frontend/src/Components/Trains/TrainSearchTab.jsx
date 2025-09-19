import React, { useState } from "react";
import TrainDisplay from "./TrainResultsDisplay";

const TrainSearchTab = () => {
  const backendUrl = "http://localhost:5000"; // ⚡ Update if deployed
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrainData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/trains/search?from=${from}&to=${to}&date=${date}`
      );
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        setTrains(data.data);
        setError("");
      } else {
        setTrains([]);
        setError("No trains found for the selected route and date.");
      }
    } catch (err) {
      console.error("Error fetching train data:", err);
      setError("An error occurred while fetching train data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      setError("Please enter From, To, and Date of Journey.");
      return;
    }
    fetchTrainData();
  };

  return (
    <div className="train-search-container p-6 bg-gray-50 rounded-2xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">🚆 Search Trains</h2>
      <form
        onSubmit={handleSubmit}
        className="train-search-form flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="From Station Code (e.g. NDLS)"
          value={from}
          onChange={(e) => setFrom(e.target.value.toUpperCase())}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <input
          type="text"
          placeholder="To Station Code (e.g. BPL)"
          value={to}
          onChange={(e) => setTo(e.target.value.toUpperCase())}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-500">Fetching train details...</p>}
      {error && <p className="error-message text-red-500 mt-4">{error}</p>}
      {trains.length > 0 && <TrainDisplay trains={trains} />}
    </div>
  );
};

export default TrainSearchTab;

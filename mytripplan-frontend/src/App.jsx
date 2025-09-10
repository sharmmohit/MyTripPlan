import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Components/Home";
import LoginSignup from "./Components/LoginSignup";
import FlightResultsDisplay from "./Components/Flights/FlightResultsDisplay";
import TrainResults from "./Components/Trains/TrainResultsDisplay";
import BusResults from "./Components/Buses/BusResults";
import CabResults from "./Components/Cabs/CabResults";
import HotelSearch from "./Components/HotelSearch";
import CinemaResultsPage from "./Components/Cinema/CinemaResultsPage";

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/flightdisplay" element={<FlightResultsDisplay />} />
        <Route path="/train-results" element={<TrainResults />} />
        <Route path="/bus-results" element={<BusResults />} />
        <Route path="/cab-results" element={<CabResults />} />
        <Route path="/hotel-search" element={<HotelSearch />} />
        <Route path="/cinema-results" element={<CinemaResultsPage />} />
      </Routes>

      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
  </>
  );
}

export default App;

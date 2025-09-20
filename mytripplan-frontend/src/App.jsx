import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Components/Home";
import FlightResultsDisplay from "./Components/Flights/FlightResultsDisplay";
import TrainResults from "./Components/Trains/TrainResultsDisplay";
import BusResults from "./Components/Buses/BusResults";
import CabResults from "./Components/Cabs/CabResults";
import HotelSearch from "./Components/HotelSearch";
import CinemaResultsPage from "./Components/Cinema/CinemaResultsPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import TrainBooking from "./Components/Trains/TrainBooking";

function App() {
  // Function to handle login success
  const handleLoginSuccess = (userData, token) => {
    // This will be passed to the Login component
    console.log("User logged in successfully:", userData);
    // The Home component will handle the state update through its own logic
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/flightdisplay" element={<FlightResultsDisplay />} />
        <Route path="/train-results" element={<TrainResults />} />
        <Route path="/bus-results" element={<BusResults />} />
        <Route path="/cab-results" element={<CabResults />} />
        <Route path="/hotel-search" element={<HotelSearch />} />
        <Route path="/cinema-results" element={<CinemaResultsPage />} />
        <Route path="/train-results" element={<TrainResults />} />
<Route path="/train-booking" element={<TrainBooking />} />
      </Routes>

      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
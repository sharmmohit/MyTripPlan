import React, { useState } from 'react';
import Home from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import LoginSignup from './Components/LoginSignup';
import FlightSearchTab from './Components/Flights/FlightSearchTab';
import FlightResultsDisplay from './Components/Flights/FlightResultsDisplay';
import TrainResults from './Components/Trains/TrainResultsDisplay';
import BusResults from './Components/Buses/BusResults';
import CabResults from './Components/Cabs/CabResults';
import HotelSearch from './Components/HotelSearch';
import CinemaSearchTab from './Components/Cinema/CinemaSearchTab';
import CinemaResultsPage from './Components/Cinema/CinemaResultsPage';
import Signup from './Components/Signup';

function App() {
  return (
    
      
       
        <Routes>
            <Route path="/" element={<LoginSignup />} />
          <Route path="/flightdisplay" element={<FlightResultsDisplay />} />
          <Route path="/train-results" element={<TrainResults />} />
            <Route path="/bus-results" element={<BusResults />} />
             <Route path="/cab-results" element={<CabResults />} />
             <Route path="/hotel-search" element={<HotelSearch />} />
               <Route path="/cinema-results" element={<CinemaResultsPage />} />
        </Routes>
      
  

    
  );
}

export default App;


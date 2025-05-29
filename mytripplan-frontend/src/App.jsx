import React, { useState } from 'react';
import Home from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import LoginSignup from './Components/LoginSignup';
import FlightSearchTab from './Components/FlightSearchTab';
import FlightResultsDisplay from './Components/FlightResultsDisplay';
import TrainResults from './Components/TrainResultsDisplay';
import BusResults from './Components/BusResults';
import CabResults from './Components/CabResults';

function App() {
  return (
    
      
       
        <Routes>
            <Route path="/" element={<Home/>} />
          <Route path="/flightdisplay" element={<FlightResultsDisplay />} />
          <Route path="/train-results" element={<TrainResults />} />
            <Route path="/bus-results" element={<BusResults />} />
             <Route path="/cab-results" element={<CabResults />} />
        </Routes>
      
  

    
  );
}

export default App;


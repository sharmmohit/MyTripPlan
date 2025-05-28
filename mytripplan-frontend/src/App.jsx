import React, { useState } from 'react';
import Home from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import LoginSignup from './Components/LoginSignup';
import FlightSearchTab from './Components/FlightSearchTab';
import FlightResultsDisplay from './Components/FlightResultsDisplay';

function App() {
  return (
    
      
       
        <Routes>
            <Route path="/" element={<Home/>} />
          <Route path="/flightdisplay" element={<FlightResultsDisplay />} />
        </Routes>
      
  

    
  );
}

export default App;


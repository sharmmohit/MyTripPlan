// controllers/flightController.js
const flightModel = require('../models/flightModel');
const { v4: uuidv4 } = require('uuid');

// Change the signature to accept 'pool'
exports.searchFlights = async (req, res, pool) => { // ADD 'pool' here
  const { departure, arrival, date } = req.query;

  if (!departure || !arrival || !date) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  try {
    // Pass the pool to your flightModel function
    const flights = await flightModel.searchFlights(departure, arrival, date, pool); // Pass 'pool' here
    res.status(200).json({ flights }); // Ensure you send { flights: [...] } to match frontend expectation
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error searching flights.' });
  }
};

// For bookFlight, ensure it also accepts 'pool' and passes it to the model
exports.bookFlight = async (req, res, pool) => { // ADD 'pool' here
  const { flight_id, num_passengers, cabin_class } = req.body;

  if (!flight_id || !num_passengers || !cabin_class) {
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }

  const bookingData = {
    flight_booking_id: uuidv4(),
    booking_id: uuidv4(),
    flight_id,
    num_passengers,
    cabin_class
  };

  try {
    const result = await flightModel.bookFlight(bookingData, pool); // Pass 'pool' here
    res.status(201).json({
      message: 'Booking successful',
      booking_id: bookingData.booking_id,
      total_fare: result.totalFare
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: err.message || 'Booking failed' });
  }
};
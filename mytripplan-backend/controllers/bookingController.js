// controllers/bookingController.js
const { v4: uuidv4 } = require('uuid');

exports.bookFlight = async (req, res, pool) => {
  const { flight_id, num_passengers, cabin_class } = req.body;
  const userId = req.userId; // from protect middleware

  if (!flight_id || !num_passengers || !cabin_class) {
    return res.status(400).json({ message: 'Please provide flight_id, num_passengers and cabin_class.' });
  }

  if (!['economy', 'premium_economy', 'business', 'first'].includes(cabin_class)) {
    return res.status(400).json({ message: 'Invalid cabin_class value.' });
  }

  try {
    // Start transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check available seats for flight
      const [flights] = await connection.execute(
        'SELECT available_seats, price FROM flights WHERE flight_id = ? FOR UPDATE',
        [flight_id]
      );

      if (flights.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: 'Flight not found.' });
      }

      const flight = flights[0];

      if (flight.available_seats < num_passengers) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: 'Not enough available seats.' });
      }

      // Calculate total fare (simple: price * num_passengers, you can add cabin_class pricing logic here)
      let total_fare = flight.price * num_passengers;

      // Update available seats
      const newAvailableSeats = flight.available_seats - num_passengers;
      await connection.execute(
        'UPDATE flights SET available_seats = ? WHERE flight_id = ?',
        [newAvailableSeats, flight_id]
      );

      // Create booking
      const booking_id = uuidv4();
      const flight_booking_id = uuidv4();

      await connection.execute(
        `INSERT INTO flight_bookings (flight_booking_id, booking_id, flight_id, num_passengers, cabin_class, total_fare) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [flight_booking_id, booking_id, flight_id, num_passengers, cabin_class, total_fare]
      );

      await connection.commit();
      connection.release();

      res.status(201).json({ message: 'Booking successful', booking_id, flight_booking_id, total_fare });

    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).json({ message: 'Server error during booking', error: error.message });
  }
};


exports.searchFlights = async (departure, arrival, date, pool) => { // ADD 'pool' here
  const [rows] = await pool.execute(
    `SELECT
        f.flight_id,
        f.flight_number,
        f.departure_airport_id,
        f.arrival_airport_id,
        DATE_FORMAT(f.departure_time, '%Y-%m-%dT%H:%i:%s') AS departure_time,
        DATE_FORMAT(f.arrival_time, '%Y-%m-%dT%H:%i:%s') AS arrival_time,
        f.duration_minutes,
        f.price,
        f.available_seats,
        f.aircraft_type,
        a.name AS airline_name -- Join to get airline name
     FROM flights f
     JOIN airlines a ON f.airline_id = a.airline_id
     WHERE f.departure_airport_id = ?
       AND f.arrival_airport_id = ?
       AND DATE(f.departure_time) = ?`,
    [departure, arrival, date]
  );
  return rows;
};

exports.bookFlight = async (bookingData, pool) => { // ADD 'pool' here
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check seat availability
    const [flight] = await conn.execute(
      'SELECT available_seats, price FROM flights WHERE flight_id = ? FOR UPDATE',
      [bookingData.flight_id]
    );

    if (!flight.length || flight[0].available_seats < bookingData.num_passengers) {
      throw new Error('Not enough seats available');
    }

    const totalFare = flight[0].price * bookingData.num_passengers;

    // Insert into flight_bookings
    await conn.execute(
      `INSERT INTO flight_bookings
        (flight_booking_id, booking_id, flight_id, num_passengers, cabin_class, total_fare)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [
        bookingData.flight_booking_id,
        bookingData.booking_id,
        bookingData.flight_id,
        bookingData.num_passengers,
        bookingData.cabin_class,
        totalFare
      ]
    );

    // Update available seats
    await conn.execute(
      `UPDATE flights SET available_seats = available_seats - ? WHERE flight_id = ?`,
      [bookingData.num_passengers, bookingData.flight_id]
    );

    await conn.commit();
    return { success: true, totalFare };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
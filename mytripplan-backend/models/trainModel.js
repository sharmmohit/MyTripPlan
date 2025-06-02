// nodejs-backend/models/trainModel.js
const pool = require('../config/db');

// Helper function to convert minutes to 'Xh Ym' format
const formatDuration = (minutes) => {
    if (minutes === null || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

// Helper function to determine day offset for arrival time display
const getDayOffsetDisplay = (depTime, arrTime, durationMinutes) => {
    // Convert times to minutes from start of day
    const [depH, depM] = depTime.split(':').map(Number);
    const [arrH, arrM] = arrTime.split(':').map(Number);

    const depTotalMinutes = depH * 60 + depM;
    const arrTotalMinutes = arrH * 60 + arrM;

    // Calculate expected arrival day based on departure and duration
    const expectedArrivalTotalMinutes = depTotalMinutes + durationMinutes;

    let dayOffset = 0;
    if (expectedArrivalTotalMinutes >= 24 * 60) {
        dayOffset = Math.floor(expectedArrivalTotalMinutes / (24 * 60));
    }

    // Adjust for actual arrival time if it spans across midnight
    if (arrTotalMinutes < depTotalMinutes && durationMinutes > 0) {
        dayOffset = Math.max(dayOffset, 1); // At least one day if arrival is earlier than departure on same clock
    }

    return dayOffset > 0 ? ` (+${dayOffset})` : '';
};


const trainModel = {
    /**
     * Searches for trains between a departure and arrival station for a specific date and class.
     * @param {string} fromCode - Departure station code.
     * @param {string} toCode - Arrival station code.
     * @param {string} travelDate - Travel date in YYYY-MM-DD format.
     * @param {string} trainClass - Desired train class (e.g., '1A', '2A', 'SL', 'ALL').
     * @returns {Promise<Array>} List of found train objects.
     */
    findTrains: async (fromCode, toCode, travelDate, trainClass) => {
        let connection;
        try {
            connection = await pool.getConnection();

            const query = `
                SELECT
                    t.train_id,
                    t.name AS train_name,
                    t.train_number,
                    t.train_type,
                    t.classes,
                    dep_st.station_id AS departure_station_id,
                    dep_st.name AS departure_station_name,
                    dep_st.city AS departure_station_city,
                    dep_st.code AS departure_station_code,
                    arr_st.station_id AS arrival_station_id,
                    arr_st.name AS arrival_station_name,
                    arr_st.city AS arrival_station_city,
                    arr_st.code AS arrival_station_code,
                    tr.route_id,
                    tr.departure_time,
                    tr.arrival_time,
                    tr.travel_duration_minutes,
                    tr.days_of_week,
                    tr.base_price_per_seat
                FROM
                    train_routes tr
                JOIN
                    trains t ON tr.train_id = t.train_id
                JOIN
                    train_stations dep_st ON tr.departure_station_id = dep_st.station_id
                JOIN
                    train_stations arr_st ON tr.arrival_station_id = arr_st.station_id
                WHERE
                    dep_st.code = ? AND arr_st.code = ?;
            `;

            const [rows] = await connection.execute(query, [fromCode, toCode]);

            const dayOfWeek = new Date(travelDate).getDay(); // 0 for Sunday, 1 for Monday, etc.
            // Adjust to 1-7 for Monday-Sunday to match typical SQL DAYOFWEEK() or custom JSON array
            const searchDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday (0) to 7

            const results = rows
                .map(row => {
                    // Parse JSON fields
                    const daysOfWeek = typeof row.days_of_week === 'string' ? JSON.parse(row.days_of_week) : row.days_of_week;
                    const classes = typeof row.classes === 'string' ? JSON.parse(row.classes) : row.classes;

                    // Filter by day of week
                    if (!daysOfWeek.includes(searchDay)) {
                        return null; // Skip this train if it doesn't run on the travel day
                    }

                    // Calculate class-specific prices and filter by trainClass
                    const availableClasses = {};
                    for (const clsCode in classes) {
                        if (classes.hasOwnProperty(clsCode)) {
                            const clsDetails = classes[clsCode];
                            const price = parseFloat((row.base_price_per_seat * clsDetails.price_multiplier).toFixed(2));
                            const seats = clsDetails.seats_available;

                            // Only add if seats are available (simple check)
                            if (seats > 0) {
                                availableClasses[clsCode] = { price: price, seats: seats };
                            }
                        }
                    }

                    // If a specific class is requested and not found/available, skip
                    if (trainClass !== 'ALL' && !availableClasses[trainClass]) {
                        return null;
                    }
                    if (Object.keys(availableClasses).length === 0) { // If no classes are available for this train at all
                        return null;
                    }


                    const durationDisplay = formatDuration(row.travel_duration_minutes);
                    const arrivalTimeDisplay = row.arrival_time.substring(0, 5) + getDayOffsetDisplay(row.departure_time, row.arrival_time, row.travel_duration_minutes);


                    return {
                        id: row.train_id, // This was 'id' in frontend, now 'train_id'
                        trainName: row.train_name, // 'name' in DB
                        trainNumber: row.train_number,
                        departureTime: row.departure_time.substring(0, 5), // Format to HH:MM
                        departureStationCode: row.departure_station_code, // 'code' in train_stations
                        departureStationCity: row.departure_station_city,
                        arrivalTime: arrivalTimeDisplay, // Format to HH:MM and add day offset
                        arrivalStationCode: row.arrival_station_code, // 'code' in train_stations
                        arrivalStationCity: row.arrival_station_city,
                        duration: durationDisplay,
                        classes: availableClasses, // Filtered and priced classes
                        basePrice: row.base_price_per_seat // Raw base price
                    };
                })
                .filter(Boolean); // Remove null entries (trains that don't run or don't have desired class)

            return results;

        } catch (error) {
            console.error('Error in trainModel.findTrains:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
};

module.exports = trainModel;
const pool = require('./config/db'); 

const formatDuration = (minutes) => {
    if (minutes === null || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const getDayOffsetDisplay = (depTime, arrTime, durationMinutes) => {
    const [depH, depM] = depTime.split(':').map(Number);
    const [arrH, arrM] = arrTime.split(':').map(Number);

    const depTotalMinutes = depH * 60 + depM;
    const arrTotalMinutes = arrH * 60 + arrM;
    const expectedArrivalTotalMinutes = depTotalMinutes + durationMinutes;

    let dayOffset = 0;
    if (expectedArrivalTotalMinutes >= 24 * 60) {
        dayOffset = Math.floor(expectedArrivalTotalMinutes / (24 * 60));
    }

    if (arrTotalMinutes < depTotalMinutes && durationMinutes > 0) {
        dayOffset = Math.max(dayOffset, 1);
    }

    return dayOffset > 0 ? ` (+${dayOffset})` : '';
};

const trainModel = {
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

            const dayOfWeek = new Date(travelDate).getDay();
            const searchDay = dayOfWeek === 0 ? 7 : dayOfWeek;

            const results = rows
                .map(row => {
                    const daysOfWeek = typeof row.days_of_week === 'string' ? 
                        JSON.parse(row.days_of_week) : row.days_of_week;
                    const classes = typeof row.classes === 'string' ? 
                        JSON.parse(row.classes) : row.classes;

                    if (!daysOfWeek.includes(searchDay)) {
                        return null;
                    }

                    const availableClasses = {};
                    for (const clsCode in classes) {
                        if (classes.hasOwnProperty(clsCode)) {
                            const clsDetails = classes[clsCode];
                            const price = parseFloat((row.base_price_per_seat * clsDetails.price_multiplier).toFixed(2));
                            const seats = clsDetails.seats_available;

                            if (seats > 0) {
                                availableClasses[clsCode] = { price, seats };
                            }
                        }
                    }

                    if (trainClass !== 'ALL' && !availableClasses[trainClass]) {
                        return null;
                    }
                    if (Object.keys(availableClasses).length === 0) {
                        return null;
                    }

                    const durationDisplay = formatDuration(row.travel_duration_minutes);
                    const arrivalTimeDisplay = row.arrival_time.substring(0, 5) + 
                        getDayOffsetDisplay(row.departure_time, row.arrival_time, row.travel_duration_minutes);

                    return {
                        id: row.train_id,
                        trainName: row.train_name,
                        trainNumber: row.train_number,
                        departureTime: row.departure_time.substring(0, 5),
                        departureStationCode: row.departure_station_code,
                        departureStationCity: row.departure_station_city,
                        arrivalTime: arrivalTimeDisplay,
                        arrivalStationCode: row.arrival_station_code,
                        arrivalStationCity: row.arrival_station_city,
                        duration: durationDisplay,
                        classes: availableClasses,
                        basePrice: row.base_price_per_seat
                    };
                })
                .filter(Boolean);

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
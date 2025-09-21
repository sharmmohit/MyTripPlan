// routes/flights.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

// Get flights between airports
router.get('/search', async (req, res) => {
    try {
        const { departure, arrival, date } = req.query;
        
        const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
            params: {
                access_key: AVIATIONSTACK_API_KEY,
                dep_iata: departure,
                arr_iata: arrival,
                flight_date: date
            }
        });

        res.json({
            success: true,
            data: response.data.data || []
        });
    } catch (error) {
        console.error('Flight search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching flight data'
        });
    }
});

// Book flight
router.post('/book', async (req, res) => {
    try {
        const { flight, passengers, contact, searchParams } = req.body;
        
        // Validate flight availability (in a real system, you'd check with the airline API)
        const bookingRef = 'FL' + Date.now();
        
        res.json({
            success: true,
            bookingId: bookingRef,
            message: 'Flight booking confirmed successfully',
            details: {
                flight,
                passengers,
                contact,
                totalAmount: calculateTotalAmount(searchParams)
            }
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Booking failed'
        });
    }
});

function calculateTotalAmount(searchParams) {
    const basePrice = 2500;
    const classMultipliers = {
        economy: 1,
        premium_economy: 1.5,
        business: 2.5,
        first: 4
    };
    
    const totalPassengers = searchParams.passengers.adults + searchParams.passengers.children;
    return Math.round(basePrice * classMultipliers[searchParams.cabinClass] * totalPassengers * 1.18);
}

module.exports = router;
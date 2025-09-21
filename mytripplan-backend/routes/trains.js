// routes/trains.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get train between stations
router.get('/search', async (req, res) => {
    try {
        const { from, to, date } = req.query;
        
        // Using RailYatri API (free tier)
        const response = await axios.get(`https://railapi.rail.co.in/api/v2/route/train/${from}/to/${to}/date/${date}/`);
        
        res.json({
            success: true,
            trains: response.data.trains || []
        });
    } catch (error) {
        console.error('Train search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching train data'
        });
    }
});

// Get train schedule
router.get('/schedule/:trainNumber', async (req, res) => {
    try {
        const { trainNumber } = req.params;
        const response = await axios.get(`https://railapi.rail.co.in/api/v2/schedule/train/${trainNumber}/`);
        
        res.json({
            success: true,
            schedule: response.data
        });
    } catch (error) {
        console.error('Schedule fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching train schedule'
        });
    }
});

// Book train tickets
router.post('/book', async (req, res) => {
    try {
        const { train, passengers, contact } = req.body;
        
        // Here you would integrate with IRCTC API or your booking system
        // This is a mock implementation
        
        const bookingRef = 'TR' + Date.now();
        
        res.json({
            success: true,
            bookingId: bookingRef,
            message: 'Booking confirmed successfully',
            details: {
                train,
                passengers,
                contact,
                totalAmount: calculateTotal(train, passengers.length)
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

function calculateTotal(train, passengerCount) {
    // Mock calculation
    const baseFare = Object.values(train.fare)[0];
    return baseFare * passengerCount * 1.18; // Including 18% tax
}

module.exports = router;
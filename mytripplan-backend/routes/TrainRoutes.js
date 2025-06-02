// nodejs-backend/routes/trainRoutes.js
const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

// Define the train search route
router.post('/search', trainController.searchTrains);

// Add other train-related routes here if needed
// router.get('/pnr-status/:pnr', trainController.getPNRStatus);
// router.post('/book', trainController.bookTrain);

module.exports = router;
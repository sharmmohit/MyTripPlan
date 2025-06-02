// nodejs-backend/controllers/trainController.js
const trainModel = require('../models/trainModel');

const trainController = {
    searchTrains: async (req, res) => {
        const { fromCode, toCode, travelDate, trainClass } = req.body;

        // Basic server-side validation
        if (!fromCode || !toCode || !travelDate || !trainClass) {
            return res.status(400).json({ message: "Missing required train search parameters." });
        }

        // Date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const reqDate = new Date(travelDate);
        reqDate.setHours(0, 0, 0, 0);

        if (reqDate < today) {
            return res.status(400).json({ message: "Travel date cannot be in the past." });
        }

        try {
            const trains = await trainModel.findTrains(fromCode, toCode, travelDate, trainClass);
            if (trains.length === 0) {
                return res.json({ trains: [], message: "No trains found for your selected criteria." });
            }
            res.json({ trains });
        } catch (error) {
            console.error('Error in trainController.searchTrains:', error);
            res.status(500).json({ message: "Internal server error during train search." });
        }
    }
    // Add other train-related controller methods here (e.g., getPNRStatus, bookTrain, etc.)
};

module.exports = trainController;
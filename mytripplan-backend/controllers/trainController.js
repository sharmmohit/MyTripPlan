const axios = require('axios');

exports.searchTrains = async (req, res) => {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
        return res.status(400).json({ message: 'Please provide from, to, and date' });
    }

    try {
        const options = {
            method: 'GET',
            url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
            params: {
                fromStationCode: from,
                toStationCode: to,
                dateOfJourney: date
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_API_HOST
            }
        };

        const response = await axios.request(options);
        const data = response.data;

        if (data && data.data && data.data.length > 0) {
            res.status(200).json({ trains: data.data });
        } else {
            res.status(404).json({ message: 'No trains found' });
        }

    } catch (error) {
        console.error('Error fetching train data:', error.message);
        res.status(500).json({ message: 'Failed to fetch train data', error: error.message });
    }
};

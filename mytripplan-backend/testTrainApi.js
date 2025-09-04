// trainFetch.js
require('dotenv').config();
const axios = require('axios');

const getTrainData = async (from, to, date) => {
  const options = {
    method: 'GET',
    url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
    params: {
      fromStationCode: from,
      toStationCode: to,
      dateOfJourney: date
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log("✅ Train Data Fetched:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
  }
};

// Example usage
const from = 'NDLS';  // New Delhi
const to = 'BCT';     // Mumbai Central
const date = '2025-08-07';

getTrainData(from, to, date);

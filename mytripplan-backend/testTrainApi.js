require('dotenv').config();
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
  params: {
    fromStationCode: 'NDLS',
    toStationCode: 'BCT',
    dateOfJourney: '2025-08-06'
  },
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
  }
};

axios.request(options)
  .then(response => {
    console.log("✅ Train Data:", response.data.data);
  })
  .catch(error => {
    console.error("❌ Error:", error.response?.data || error.message);
  });

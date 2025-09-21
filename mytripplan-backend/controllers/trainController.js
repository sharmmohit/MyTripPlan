const axios = require("axios");

exports.searchTrains = async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Please provide from, to, and date" });
  }

  try {
    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v1/searchTrain",
      params: {
        fromStationCode: from,
        toStationCode: to,
        dateOfJourney: date,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);

    if (response.data && response.data.data) {
      res.json({ data: response.data.data });
    } else {
      res.json({ data: [] });
    }
  } catch (error) {
    console.error("❌ Error fetching train data:", error.message);
    res.status(500).json({ error: "Failed to fetch train data" });
  }
};

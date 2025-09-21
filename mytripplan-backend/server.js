const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const flightsRoutes = require("./routes/flights");
const authRoutes = require("./routes/authorization");
const trainRoutes = require("./routes/trains"); // ✅ NEW



const app = express();
const PORT = process.env.PORT || 5000;

// Allow multiple frontend origins
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://traveltrip-six.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightsRoutes);
app.use("/api/trains", trainRoutes); // ✅ NEW

app.get("/", (req, res) => res.send("Auth + Flights + Trains server running 🚀"));

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not set in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () =>
      console.log(`🚀 Server listening on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();

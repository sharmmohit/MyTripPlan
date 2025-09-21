import React, { useState } from "react";
import { FaPlane, FaCalendarAlt, FaUser, FaChevronDown, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";

const FlightSearchTab = () => {
  const navigate = useNavigate();
  
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("Delhi");
  const [fromCode, setFromCode] = useState("DEL");
  const [toCity, setToCity] = useState("Mumbai");
  const [toCode, setToCode] = useState("BOM");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [cabinClass, setCabinClass] = useState("economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = [
    { name: "Delhi", code: "DEL", airport: "Indira Gandhi International Airport" },
    { name: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji Maharaj International Airport" },
    { name: "Bengaluru", code: "BLR", airport: "Kempegowda International Airport" },
    { name: "Chennai", code: "MAA", airport: "Chennai International Airport" },
    { name: "Kolkata", code: "CCU", airport: "Netaji Subhash Chandra Bose International Airport" },
    { name: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi International Airport" },
    { name: "Goa", code: "GOI", airport: "Goa International Airport" },
    { name: "Kochi", code: "COK", airport: "Cochin International Airport" },
    { name: "Ahmedabad", code: "AMD", airport: "Sardar Vallabhbhai Patel International Airport" },
    { name: "Pune", code: "PNQ", airport: "Pune International Airport" },
    { name: "Jaipur", code: "JAI", airport: "Jaipur International Airport" },
    { name: "Lucknow", code: "LKO", airport: "Chaudhary Charan Singh International Airport" },
  ];

  const cabinClasses = [
    { value: "economy", label: "Economy" },
    { value: "premium_economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First Class" },
  ];

  const handleCitySelect = (city, type) => {
    if (type === "from") {
      setFromCity(city.name);
      setFromCode(city.code);
    } else {
      setToCity(city.name);
      setToCode(city.code);
    }
    setShowCityDropdown(null);
  };

  const swapCities = () => {
    const tempCity = fromCity;
    const tempCode = fromCode;
    setFromCity(toCity);
    setFromCode(toCode);
    setToCity(tempCity);
    setToCode(tempCode);
  };

  const handlePassengerChange = (type, operation) => {
    setPassengers(prev => {
      const newValue = operation === "increment" ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Validation rules
      if (type === "infants" && newValue > prev.adults) {
        return prev; // Infants cannot exceed adults
      }
      if (type === "adults" && newValue < prev.infants) {
        return { ...prev, adults: newValue, infants: newValue }; // Adjust infants if adults decreased
      }
      
      return { ...prev, [type]: newValue };
    });
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!toCode) {
      setError("Please select destination city.");
      return;
    }
    if (!departureDate) {
      setError("Please select departure date.");
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      setError("Please select return date for round trip.");
      return;
    }

    setLoading(true);
    try {
      // Format date for API (YYYY-MM-DD)
      const formattedDate = departureDate.split('-').reverse().join('-');
      
      // Using AviationStack API for real-time flight data
      const response = await fetch(
        `http://api.aviationstack.com/v1/flights?access_key=f346de7645a5582d31f93756a82bd64e&dep_iata=${fromCode}&arr_iata=${toCode}&flight_date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.info || "API error occurred");
      }

      navigate("/flight-results", {
        state: {
          flights: data.data || [],
          searchParams: {
            fromCity,
            toCity,
            fromCode,
            toCode,
            departureDate,
            returnDate: tripType === "round-trip" ? returnDate : null,
            passengers,
            cabinClass,
            tripType
          }
        }
      });
    } catch (err) {
      setError(err.message || "Failed to fetch flight data. Please try again.");
      console.error("Flight search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaPlane className="mr-2 text-blue-600" />
        Book Flights
      </h1>

      {/* Trip Type Selection */}
      <div className="flex space-x-4 mb-6">
        {["one-way", "round-trip"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded-lg font-medium ${
              tripType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type === "one-way" ? "One Way" : "Round Trip"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* City Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* From City */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
              onClick={() => setShowCityDropdown("from")}
            >
              <FaPlane className="text-gray-400 mr-2" />
              <div>
                <p className="font-medium">{fromCity}</p>
                <p className="text-xs text-gray-500">{fromCode}</p>
              </div>
            </div>
            {showCityDropdown === "from" && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                {cities.map((city) => (
                  <div
                    key={city.code}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    onClick={() => handleCitySelect(city, "from")}
                  >
                    <p className="font-medium">{city.name}</p>
                    <p className="text-xs text-gray-500">{city.airport} ({city.code})</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={swapCities}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaExchangeAlt className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* To City */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
              onClick={() => setShowCityDropdown("to")}
            >
              <FaPlane className="text-gray-400 mr-2 rotate-180" />
              <div>
                {toCity ? (
                  <>
                    <p className="font-medium">{toCity}</p>
                    <p className="text-xs text-gray-500">{toCode}</p>
                  </>
                ) : (
                  <p className="text-gray-400">Select Destination</p>
                )}
              </div>
            </div>
            {showCityDropdown === "to" && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                {cities.map((city) => (
                  <div
                    key={city.code}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    onClick={() => handleCitySelect(city, "to")}
                  >
                    <p className="font-medium">{city.name}</p>
                    <p className="text-xs text-gray-500">{city.airport} ({city.code})</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Return Date (only for round trip) */}
          {tripType === "round-trip" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  required={tripType === "round-trip"}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min={departureDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Passengers */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div
              onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
              className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
            >
              <span>{getTotalPassengers()} Passenger{getTotalPassengers() !== 1 ? "s" : ""}</span>
              <FaChevronDown className="text-gray-400" />
            </div>
            
            {showPassengerDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Adults (12+ years)</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("adults", "decrement")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={passengers.adults <= 1}
                      >
                        -
                      </button>
                      <span>{passengers.adults}</span>
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("adults", "increment")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Children (2-12 years)</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("children", "decrement")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={passengers.children <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.children}</span>
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("children", "increment")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Infants (under 2 years)</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("infants", "decrement")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={passengers.infants <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.infants}</span>
                      <button
                        type="button"
                        onClick={() => handlePassengerChange("infants", "increment")}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={passengers.infants >= passengers.adults}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cabin Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Class</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {cabinClasses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 transition-colors duration-300"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching Flights...
            </div>
          ) : (
            "Search Flights"
          )}
        </button>

        {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
      </form>

      {/* API Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Using real-time flight data from AviationStack API. 
          Make sure to replace "YOUR_AVIATIONSTACK_API_KEY" with your actual API key.
        </p>
      </div>
    </div>
  );
};

export default FlightSearchTab;
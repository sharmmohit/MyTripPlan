import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBus, FaRegClock, FaRegUser, FaSnowflake, FaWifi } from 'react-icons/fa';

const BusResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(null);
  const [busResults, setBusResults] = useState([]);

  // Mock data for bus results
  const mockResults = [
    {
      id: 'BUS001',
      busName: 'Sharma Travels AC Sleeper',
      busType: 'AC Sleeper (2+1)',
      departureTime: '22:00',
      arrivalTime: '06:00 (+1)',
      duration: '8h 0m',
      seatsAvailable: 24,
      amenities: ['AC', 'WiFi', 'Charging', 'Water'],
      fare: 1200,
      rating: 4.2,
      operator: 'Sharma Travels'
    },
    {
      id: 'BUS002',
      busName: 'Rajdhani Express AC Seater',
      busType: 'AC Seater (2+2)',
      departureTime: '23:30',
      arrivalTime: '07:30 (+1)',
      duration: '8h 0m',
      seatsAvailable: 12,
      amenities: ['AC', 'WiFi', 'Water'],
      fare: 900,
      rating: 3.8,
      operator: 'Rajdhani Express'
    },
    {
      id: 'BUS003',
      busName: 'Patel Travels Non-AC Sleeper',
      busType: 'Non-AC Sleeper (2+1)',
      departureTime: '20:00',
      arrivalTime: '04:30 (+1)',
      duration: '8h 30m',
      seatsAvailable: 18,
      amenities: ['Charging', 'Water'],
      fare: 700,
      rating: 4.0,
      operator: 'Patel Travels'
    },
    {
      id: 'BUS004',
      busName: 'Gujarat Travels AC Seater',
      busType: 'AC Seater (2+2)',
      departureTime: '21:00',
      arrivalTime: '05:00 (+1)',
      duration: '8h 0m',
      seatsAvailable: 5,
      amenities: ['AC', 'Charging', 'Water'],
      fare: 850,
      rating: 4.1,
      operator: 'Gujarat Travels'
    }
  ];

  useEffect(() => {
    if (location.state) {
      setSearchParams(location.state);
      // Simulate API call
      setTimeout(() => {
        setBusResults(mockResults);
        setIsLoading(false);
      }, 1000);
    } else {
      // If no search params, redirect back to search
      navigate('/bus');
    }
  }, [location.state, navigate]);

  const handleBackToSearch = () => {
    navigate('/bus', {
      state: {
        fromCity: searchParams?.fromCity,
        toCity: searchParams?.toCity,
        travelDate: searchParams?.travelDate
      }
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', "'");
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${formattedDate} ${weekday}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-lg text-gray-700">Searching for buses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Back button and search summary */}
      <div className="mb-6">
        <button 
          onClick={handleBackToSearch}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Modify Search
        </button>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Bus Search Results</h2>
              <p className="text-sm text-gray-600">
                {searchParams?.fromCity} → {searchParams?.toCity}
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <p>Journey Date: {formatDisplayDate(searchParams?.travelDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      {busResults.length > 0 ? (
        <div className="space-y-4">
          {busResults.map((bus) => (
            <div key={bus.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Bus Info */}
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start">
                    <FaBus className="text-blue-600 text-2xl mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{bus.busName}</h3>
                      <p className="text-sm text-gray-600">{bus.busType}</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                          {bus.rating} ★
                        </span>
                        <span className="text-sm text-gray-600 ml-2">{bus.operator}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {bus.amenities.includes('AC') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaSnowflake className="mr-1 text-blue-500" /> AC
                      </span>
                    )}
                    {bus.amenities.includes('WiFi') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaWifi className="mr-1 text-blue-500" /> WiFi
                      </span>
                    )}
                    {bus.amenities.includes('Charging') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                        </svg>
                        Charging
                      </span>
                    )}
                    {bus.amenities.includes('Water') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5 9a7 7 0 0110.566.001 1 1 0 01-1.414 1.414A5 5 0 005 11a1 1 0 01-2 0zm1 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        </svg>
                        Water
                      </span>
                    )}
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-center md:items-start md:justify-center md:w-1/4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">{bus.departureTime}</p>
                    <p className="text-xs text-gray-500">Departure</p>
                    <div className="my-1 flex justify-center">
                      <FaRegClock className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-500 ml-1">{bus.duration}</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{bus.arrivalTime}</p>
                    <p className="text-xs text-gray-500">Arrival</p>
                  </div>
                </div>

                {/* Fare and Seats */}
                <div className="flex flex-col items-end md:w-1/4 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{bus.fare}</p>
                    <p className="text-xs text-gray-500">per seat</p>
                    <div className="flex items-center justify-end mt-2">
                      <FaRegUser className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{bus.seatsAvailable} seats left</span>
                    </div>
                  </div>
                  <button 
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    onClick={() => navigate('/bus-booking', { state: { bus, searchParams } })}
                  >
                    View Seats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">No buses found for your search criteria.</p>
          <button 
            onClick={handleBackToSearch}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Modify Search
          </button>
        </div>
      )}
    </div>
  );
};

export default BusResults;
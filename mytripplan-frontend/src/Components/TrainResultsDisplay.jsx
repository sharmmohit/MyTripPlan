// src/components/TrainResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TrainResultsDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(null);
  const [trainResults, setTrainResults] = useState([]);

  // Mock data for train results (same as before)
  const mockResults = [
    {
      id: 'TRN001',
      trainName: 'Duronto Express',
      trainNumber: '12221',
      departureTime: '06:00',
      arrivalTime: '14:30',
      duration: '8h 30m',
      from: 'INDB',
      to: 'RTM',
      classes: {
        '1A': { price: 2500, seats: 10 },
        '2A': { price: 1800, seats: 25 },
        '3A': { price: 1200, seats: 50 },
      },
    },
    {
      id: 'TRN002',
      trainName: 'Rajdhani Express',
      trainNumber: '12345',
      departureTime: '10:00',
      arrivalTime: '18:00',
      duration: '8h 0m',
      from: 'INDB',
      to: 'RTM',
      classes: {
        '1A': { price: 3000, seats: 5 },
        '2A': { price: 2200, seats: 15 },
        '3A': { price: 1500, seats: 30 },
      },
    },
    {
      id: 'TRN003',
      trainName: 'Superfast Express',
      trainNumber: '54321',
      departureTime: '20:00',
      arrivalTime: '06:00 (+1)',
      duration: '10h 0m',
      from: 'INDB',
      to: 'RTM',
      classes: {
        'SL': { price: 450, seats: 100 },
        '2S': { price: 200, seats: 200 },
      },
    },
  ];

  useEffect(() => {
    if (location.state) {
      setSearchParams(location.state);
      // Simulate API call
      setTimeout(() => {
        // Filter results by class if not 'ALL'
        const filteredResults = location.state.trainClass === 'ALL' 
          ? mockResults 
          : mockResults.filter(train => train.classes[location.state.trainClass]);
        
        setTrainResults(filteredResults);
        setIsLoading(false);
      }, 1000);
    } else {
      // If no search params, redirect back to search
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleBackToSearch = () => {
    navigate('/', {
      state: {
        fromStation: searchParams?.fromStation,
        toStation: searchParams?.toStation,
        travelDate: searchParams?.travelDate,
        trainClass: searchParams?.trainClass
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
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-lg text-gray-700">Searching for trains...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
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
              <h2 className="text-xl font-bold text-gray-800">Train Search Results</h2>
              <p className="text-sm text-gray-600">
                {searchParams?.fromStation.city} ({searchParams?.fromStation.code}) → {searchParams?.toStation.city} ({searchParams?.toStation.code})
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <p>Journey Date: {formatDisplayDate(searchParams?.travelDate)}</p>
              <p>Class: {searchParams?.trainClass === 'ALL' ? 'All Classes' : searchParams?.trainClass}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      {trainResults.length > 0 ? (
        <div className="space-y-4">
          {trainResults.map((train) => (
            <div key={train.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-2 md:mb-0 md:w-1/4 text-center md:text-left">
                  <p className="text-lg font-semibold text-gray-900">{train.trainName}</p>
                  <p className="text-sm text-gray-600">#{train.trainNumber}</p>
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-xl font-bold text-blue-600">{train.departureTime}</p>
                  <p className="text-sm text-gray-600">{train.from}</p>
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-sm text-gray-500">{train.duration}</p>
                  <p className="text-xs text-gray-500">→</p>
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-xl font-bold text-blue-600">{train.arrivalTime}</p>
                  <p className="text-sm text-gray-600">{train.to}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Available Classes:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.keys(train.classes).map(cls => (
                        <span
                          key={cls}
                          className={`px-2 py-1 text-xs rounded ${searchParams.trainClass === cls || searchParams.trainClass === 'ALL' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {cls} (₹{train.classes[cls].price})
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    onClick={() => navigate('/booking', { state: { train, searchParams } })}
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">No trains found for your search criteria.</p>
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

export default TrainResultsDisplay;
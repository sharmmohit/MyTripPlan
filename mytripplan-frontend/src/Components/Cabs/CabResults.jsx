import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaUser, FaSnowflake, FaWifi, FaTint, FaMobileAlt, FaRegStar, FaStar } from 'react-icons/fa';

const CabResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(null);
  const [cabResults, setCabResults] = useState([]);

  // Mock data for cab results
  const mockResults = [
    {
      id: 'CAB001',
      cabName: 'Sedan (Swift Dzire)',
      cabType: '4 Seater',
      features: ['AC', 'WiFi', 'Water', 'Charging'],
      price: 2500,
      estimatedTime: '2h 30m',
      rating: 4.5,
      reviews: 124,
      driver: 'Rahul Sharma',
      image: 'https://example.com/car1.jpg'
    },
    {
      id: 'CAB002',
      cabName: 'SUV (Toyota Innova)',
      cabType: '7 Seater',
      features: ['AC', 'Water'],
      price: 3500,
      estimatedTime: '2h 45m',
      rating: 4.2,
      reviews: 89,
      driver: 'Vikram Patel',
      image: 'https://example.com/car2.jpg'
    },
    {
      id: 'CAB003',
      cabName: 'Luxury (Mercedes E-Class)',
      cabType: '4 Seater',
      features: ['AC', 'WiFi', 'Water', 'Charging', 'Premium'],
      price: 6000,
      estimatedTime: '2h 15m',
      rating: 4.8,
      reviews: 56,
      driver: 'Ajay Singh',
      image: 'https://example.com/car3.jpg'
    },
    {
      id: 'CAB004',
      cabName: 'Hatchback (Swift)',
      cabType: '4 Seater',
      features: ['AC'],
      price: 2000,
      estimatedTime: '2h 50m',
      rating: 4.0,
      reviews: 210,
      driver: 'Sanjay Verma',
      image: 'https://example.com/car4.jpg'
    }
  ];

  useEffect(() => {
    if (location.state) {
      setSearchParams(location.state);
      // Simulate API call
      setTimeout(() => {
        setCabResults(mockResults);
        setIsLoading(false);
      }, 1000);
    } else {
      // If no search params, redirect back to search
      navigate('/cab');
    }
  }, [location.state, navigate]);

  const handleBackToSearch = () => {
    navigate('/cab', {
      state: searchParams
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit', weekday: 'long' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
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
        <p className="text-lg text-gray-700">Searching for cabs...</p>
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
              <h2 className="text-xl font-bold text-gray-800">Cab Search Results</h2>
              <p className="text-sm text-gray-600">
                {searchParams?.fromCity} → {searchParams?.toCity}
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <p>Departure: {formatDisplayDate(searchParams?.departureDate)} {searchParams?.pickupTime}</p>
              {searchParams?.tripType === 'round-trip' && (
                <p>Return: {formatDisplayDate(searchParams?.returnDate)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      {cabResults.length > 0 ? (
        <div className="space-y-6">
          {cabResults.map((cab) => (
            <div key={cab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Cab Image and Basic Info */}
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <FaCar className="text-4xl text-gray-400" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="flex justify-center">
                      {renderStars(cab.rating)}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{cab.rating} ({cab.reviews} reviews)</p>
                  </div>
                </div>

                {/* Cab Details */}
                <div className="md:w-2/4 md:px-4">
                  <h3 className="text-lg font-bold text-gray-800">{cab.cabName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{cab.cabType}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cab.features.includes('AC') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaSnowflake className="mr-1 text-blue-500" /> AC
                      </span>
                    )}
                    {cab.features.includes('WiFi') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaWifi className="mr-1 text-blue-500" /> WiFi
                      </span>
                    )}
                    {cab.features.includes('Water') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaTint className="mr-1 text-blue-500" /> Water
                      </span>
                    )}
                    {cab.features.includes('Charging') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaMobileAlt className="mr-1 text-blue-500" /> Charging
                      </span>
                    )}
                    {cab.features.includes('Premium') && (
                      <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        <FaStar className="mr-1 text-yellow-500" /> Premium
                      </span>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center mt-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Driver: {cab.driver}</span>
                  </div>

                  {/* Estimated Time */}
                  <div className="mt-2 text-sm text-gray-700">
                    Estimated travel time: {cab.estimatedTime}
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="md:w-1/4 flex flex-col items-end justify-between mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{cab.price}</p>
                    <p className="text-xs text-gray-500">for one way trip</p>
                    {searchParams?.tripType === 'round-trip' && (
                      <p className="text-sm text-gray-700 mt-1">
                        Round trip: ₹{cab.price * 1.8} <span className="text-green-600">(10% off)</span>
                      </p>
                    )}
                  </div>
                  <button 
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    onClick={() => navigate('/cab-booking', { state: { cab, searchParams } })}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">No cabs found for your search criteria.</p>
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

export default CabResults;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

const BusSearchTab = () => {
  const [fromCity, setFromCity] = useState('Delhi, Delhi');
  const [toCity, setToCity] = useState('Kanpur, Uttar Pradesh');
  const [travelDate, setTravelDate] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock Bus Cities Data
  const busCities = [
    { city: 'Delhi, Delhi', description: 'India' },
    { city: 'Kanpur, Uttar Pradesh', description: 'India' },
    { city: 'Mumbai, Maharashtra', description: 'India' },
    { city: 'Bangalore, Karnataka', description: 'India' },
    { city: 'Chennai, Tamil Nadu', description: 'India' },
    { city: 'Hyderabad, Telangana', description: 'India' },
    { city: 'Pune, Maharashtra', description: 'India' },
  ];

  // Formats a Date object into 'YYYY-MM-DD' string for input
  const formatDateForInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Gets today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    return formatDateForInput(new Date());
  };

  // Sets initial travel date when component mounts
  useEffect(() => {
    const today = new Date();
    setTravelDate(formatDateForInput(today));
  }, []);

  // Formats date for display: "30 May '25 Friday"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', "'");
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${formattedDate} ${weekday}`;
  };

  // Handles city selection from dropdown
  const handleCitySelect = (city, type) => {
    if (type === 'from') {
      setFromCity(city.city);
      setShowFromDropdown(false);
    } else {
      setToCity(city.city);
      setShowToDropdown(false);
    }
  };

  // Handles the bus search form submission
  const handleSearchBuses = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!fromCity || !toCity || !travelDate) {
      setError('Please select From, To, and Travel Date.');
      setIsLoading(false);
      return;
    }
    if (fromCity === toCity) {
      setError('Origin and Destination cannot be the same.');
      setIsLoading(false);
      return;
    }

    // Navigate to results page with search parameters
    navigate('/bus-results', {
      state: {
        fromCity,
        toCity,
        travelDate
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Bus Ticket Booking</h1>
      <p className="text-gray-600 mb-6">Travelling with a group? Hire a bus.</p>

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearchBuses}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* From City Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">FROM</label>
            <div
              className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg"
              onClick={() => {
                setShowFromDropdown(!showFromDropdown);
                setShowToDropdown(false);
              }}
            >
              <FaBus className="text-gray-400 mr-2" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{fromCity}</p>
                <p className="text-xs text-gray-500">India</p>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${showFromDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {/* From City Dropdown */}
            {showFromDropdown && (
              <div className="absolute z-20 top-full left-0 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto mt-1">
                {busCities.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCitySelect(city, 'from')}
                  >
                    <p className="font-medium">{city.city}</p>
                    <p className="text-xs text-gray-500">{city.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To City Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">TO</label>
            <div
              className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg"
              onClick={() => {
                setShowToDropdown(!showToDropdown);
                setShowFromDropdown(false);
              }}
            >
              <FaBus className="text-gray-400 mr-2" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{toCity}</p>
                <p className="text-xs text-gray-500">India</p>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${showToDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {/* To City Dropdown */}
            {showToDropdown && (
              <div className="absolute z-20 top-full left-0 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto mt-1">
                {busCities.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCitySelect(city, 'to')}
                  >
                    <p className="font-medium">{city.city}</p>
                    <p className="text-xs text-gray-500">{city.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Date Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">TRAVEL DATE</label>
            <div className="relative flex items-center p-3 border border-gray-300 rounded-lg">
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-2 py-1 bg-transparent text-gray-800 focus:outline-none appearance-none"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={getTodayDate()}
                required
              />
            </div>
            <span className="block text-xs text-gray-600 mt-1">{formatDisplayDate(travelDate)}</span>
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SEARCHING...
              </span>
            ) : (
              'SEARCH'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusSearchTab;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaChevronDown, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const CabSearchTab = () => {
  const [tripType, setTripType] = useState('one-way');
  const [fromCity, setFromCity] = useState('Mumbai');
  const [toCity, setToCity] = useState('Pune');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock Cities Data
  const cities = [
    'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad',
    'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  // Time slots
  const timeSlots = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM',
    '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ];

  // Format date for display: "30 May 25 Friday"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit', weekday: 'long' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  // Format date for input: YYYY-MM-DD
  const formatDateForInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Set initial dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setDepartureDate(formatDateForInput(today));
    setReturnDate(formatDateForInput(tomorrow));
  }, []);

  // Handle city selection
  const handleCitySelect = (city, type) => {
    if (type === 'from') {
      setFromCity(city);
      setShowFromDropdown(false);
    } else {
      setToCity(city);
      setShowToDropdown(false);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setPickupTime(time);
    setShowTimeDropdown(false);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!fromCity || !toCity || !departureDate) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    if (tripType === 'round-trip' && !returnDate) {
      setError('Please select return date for round trip');
      setIsLoading(false);
      return;
    }

    // Navigate to results with search params
    navigate('/cab-results', {
      state: {
        tripType,
        fromCity,
        toCity,
        departureDate,
        returnDate,
        pickupTime
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Outstation {tripType === 'one-way' ? 'One-Way' : 
        tripType === 'round-trip' ? 'Round-Trip' : 
        tripType === 'airport' ? 'Airport Transfers' : 'Hourly Rentals'}</h1>

      {/* Trip Type Toggle */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setTripType('one-way')}
          className={`px-4 py-2 rounded-full ${tripType === 'one-way' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Outstation One-Way
        </button>
        <button
          onClick={() => setTripType('round-trip')}
          className={`px-4 py-2 rounded-full ${tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Outstation Round-Trip
        </button>
        <button
          onClick={() => setTripType('airport')}
          className={`px-4 py-2 rounded-full ${tripType === 'airport' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Airport Transfers
        </button>
        <button
          onClick={() => setTripType('hourly')}
          className={`px-4 py-2 rounded-full ${tripType === 'hourly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Hourly Rentals
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* From City */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowFromDropdown(!showFromDropdown);
                setShowToDropdown(false);
                setShowTimeDropdown(false);
              }}
            >
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{fromCity}</span>
              <FaChevronDown className={`text-gray-400 ${showFromDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showFromDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(city, 'from')}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To City */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowToDropdown(!showToDropdown);
                setShowFromDropdown(false);
                setShowTimeDropdown(false);
              }}
            >
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{toCity}</span>
              <FaChevronDown className={`text-gray-400 ${showToDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showToDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(city, 'to')}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departure Date */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Departure</label>
            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={formatDateForInput(new Date())}
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDisplayDate(departureDate)}
            </div>
          </div>

          {/* Return Date (conditionally shown for round-trip) */}
          {tripType === 'round-trip' && (
            <div className="md:col-span-2 relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">Return</label>
              {returnDate ? (
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    className="w-full bg-transparent focus:outline-none"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate}
                    required
                  />
                </div>
              ) : (
                <div 
                  className="p-3 border border-gray-300 rounded-lg text-gray-400 cursor-pointer"
                  onClick={() => {
                    const tomorrow = new Date(departureDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setReturnDate(formatDateForInput(tomorrow));
                  }}
                >
                  Tap to add a return date for bigger discounts
                </div>
              )}
              {returnDate && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatDisplayDate(returnDate)}
                </div>
              )}
            </div>
          )}

          {/* Pickup Time */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Pickup-Time</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowTimeDropdown(!showTimeDropdown);
                setShowFromDropdown(false);
                setShowToDropdown(false);
              }}
            >
              <FaClock className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{pickupTime}</span>
              <FaChevronDown className={`text-gray-400 ${showTimeDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showTimeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Stops Button */}
        <div className="mb-6">
          <button
            type="button"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaPlus className="mr-1" />
            Add Stops
          </button>
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

export default CabSearchTab;
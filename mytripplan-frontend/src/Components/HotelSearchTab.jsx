import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaChevronDown, FaSearch, FaHotel } from 'react-icons/fa';

const HotelSearchTab = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Popular destinations
  const popularDestinations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur',
    'Hyderabad', 'Chennai', 'Kolkata', 'Kochi', 'Udaipur'
  ];

  // Set initial dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setCheckInDate(formatDate(today));
    setCheckOutDate(formatDate(tomorrow));
  }, []);

  // Handle location selection
  const handleLocationSelect = (city) => {
    setLocation(city);
    setShowLocationDropdown(false);
  };

  // Handle guest selection
  const handleGuestChange = (type, value) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, value)
    }));
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    
    if (!location) {
      setError('Please select a destination');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      navigate('/hotel-results', {
        state: {
          location,
          checkInDate,
          checkOutDate,
          guests
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaHotel className="mr-2 text-blue-600" />
        Hotel Search
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Location */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Destination</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowGuestsDropdown(false);
              }}
            >
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{location || 'Where are you going?'}</span>
              <FaChevronDown className={`text-gray-400 ${showLocationDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showLocationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {popularDestinations.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-in</label>
            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDisplayDate(checkInDate)}
            </div>
          </div>

          {/* Check-out Date */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-out</label>
            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate}
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDisplayDate(checkOutDate)}
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Guests & Rooms</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowGuestsDropdown(!showGuestsDropdown);
                setShowLocationDropdown(false);
              }}
            >
              <FaUser className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">
                {guests.adults} Adult{guests.adults !== 1 ? 's' : ''}, {guests.children} Child{guests.children !== 1 ? 'ren' : ''}, {guests.rooms} Room{guests.rooms !== 1 ? 's' : ''}
              </span>
              <FaChevronDown className={`text-gray-400 ${showGuestsDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showGuestsDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span>Adults</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('adults', guests.adults - 1)}
                      disabled={guests.adults <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3">{guests.adults}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('adults', guests.adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span>Children</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('children', guests.children - 1)}
                      disabled={guests.children <= 0}
                    >
                      -
                    </button>
                    <span className="mx-3">{guests.children}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('children', guests.children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rooms</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('rooms', guests.rooms - 1)}
                      disabled={guests.rooms <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3">{guests.rooms}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      onClick={() => handleGuestChange('rooms', guests.rooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SEARCHING...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                SEARCH HOTELS
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelSearchTab;
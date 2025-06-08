import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiUser, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi';

const HotelSearch = () => {
  const [searchParams, setSearchParams] = useState({
    location: 'Goa',
    checkIn: '8 Jun\'25',
    checkOut: '9 Jun\'25',
    rooms: 1,
    adults: 2,
    priceRange: '₹0-₹1500'
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const popularLocations = [
    'Mumbai, India',
    'London, United Kingdom',
    'Bangkok, Thailand',
    'Dubai, UAE',
    'New York, USA'
  ];

  const priceRanges = [
    '₹0-₹1500',
    '₹1500-₹2500',
    '₹2500-₹4000',
    '₹4000-₹6000',
    '₹6000+'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomChange = (type, value) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: Math.max(1, prev[type] + value)
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you would typically call an API with the search parameters
    console.log('Searching with:', searchParams);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Upto 4 Rooms</h1>
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">TRAVA</span>
          <span className="text-sm text-gray-600">Group Deals</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Book Domestic and International Property Online. To list your property <a href="#" className="text-blue-600 hover:underline">Click Here</a>
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Location Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">City, Property Name Or Location</label>
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              <div>
                <div className="font-medium text-gray-800">{searchParams.location}</div>
                <div className="text-xs text-gray-500">India</div>
              </div>
              <FiMapPin className="text-gray-400" />
            </div>
            
            {showLocationDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                <input
                  type="text"
                  className="w-full p-2 border-b border-gray-300 focus:outline-none"
                  placeholder="Search location..."
                  value={searchParams.location}
                  onChange={(e) => handleInputChange({ target: { name: 'location', value: e.target.value } })}
                />
                <div className="max-h-60 overflow-y-auto">
                  {popularLocations.map((loc, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleInputChange({ target: { name: 'location', value: loc.split(',')[0] } });
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Check-In Date */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-In</label>
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              <div>
                <div className="font-medium text-gray-800">{searchParams.checkIn}</div>
                <div className="text-xs text-gray-500">Sunday</div>
              </div>
              <FiCalendar className="text-gray-400" />
            </div>
            
            {showDateDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg p-4">
                <div className="flex justify-between mb-4">
                  <button className="text-gray-500 hover:text-gray-700">
                    &lt; Prev
                  </button>
                  <span className="font-medium">June 2025</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    Next &gt;
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="font-medium text-gray-500">{day}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`p-1 rounded-full ${i === 7 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Check-Out Date */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out</label>
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              <div>
                <div className="font-medium text-gray-800">{searchParams.checkOut}</div>
                <div className="text-xs text-gray-500">Monday</div>
              </div>
              <FiCalendar className="text-gray-400" />
            </div>
          </div>

          {/* Rooms & Guests */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Rooms & Guests</label>
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer"
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            >
              <div>
                <div className="font-medium text-gray-800">
                  {searchParams.rooms} Rooms {searchParams.adults} Adults
                </div>
              </div>
              <FiUser className="text-gray-400" />
            </div>
            
            {showGuestsDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Rooms</span>
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        onClick={() => handleRoomChange('rooms', -1)}
                        disabled={searchParams.rooms <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4">{searchParams.rooms}</span>
                      <button 
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        onClick={() => handleRoomChange('rooms', 1)}
                        disabled={searchParams.rooms >= 4}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Adults</span>
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        onClick={() => handleRoomChange('adults', -1)}
                        disabled={searchParams.adults <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4">{searchParams.adults}</span>
                      <button 
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        onClick={() => handleRoomChange('adults', 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  className="w-full bg-blue-500 text-white py-2 rounded"
                  onClick={() => setShowGuestsDropdown(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Price Per Night</label>
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer"
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
            >
              <div className="font-medium text-gray-800">{searchParams.priceRange}</div>
              <FiDollarSign className="text-gray-400" />
            </div>
            
            {showPriceDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                {priceRanges.map((range, index) => (
                  <div 
                    key={index}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${searchParams.priceRange === range ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      handleInputChange({ target: { name: 'priceRange', value: range } });
                      setShowPriceDropdown(false);
                    }}
                  >
                    {range}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <FiSearch className="mr-2" />
          SEARCH HOTELS
        </button>
      </form>

      {/* Trending Searches */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Trending Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {popularLocations.slice(0, 3).map((location, index) => (
            <span 
              key={index}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => handleInputChange({ target: { name: 'location', value: location.split(',')[0] } })}
            >
              {location}
            </span>
          ))}
        </div>
      </div>

      {/* Search Results - This would be populated from API response */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Properties in {searchParams.location}</h2>
        
        {/* Sample result - in a real app this would be mapped from API data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Luxury Hotel {item}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FiMapPin className="mr-1" size={14} />
                  {searchParams.location}, India
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">₹{1500 + (item * 500)}</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
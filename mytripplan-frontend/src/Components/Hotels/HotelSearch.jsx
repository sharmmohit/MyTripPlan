import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiHome, FiMapPin, FiDollarSign, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';

const HotelSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: 'Goa',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    rooms: 1,
    adults: 2,
    priceRange: '0-5000'
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const popularLocations = [
    'Goa, India',
    'Mumbai, India',
    'Delhi, India',
    'Bangalore, India',
    'Jaipur, India',
    'Kerala, India'
  ];

  const priceRanges = [
    { label: 'Budget (₹0-₹2500)', value: '0-2500' },
    { label: 'Standard (₹2500-₹5000)', value: '2500-5000' },
    { label: 'Luxury (₹5000-₹10000)', value: '5000-10000' },
    { label: 'Premium (₹10000+)', value: '10000-50000' }
  ];

  // Fetch hotels on component mount and when search params change
  useEffect(() => {
    searchHotels();
  }, []);

  const searchHotels = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Using Travel Advisor API (free tier) - Note: You might need to sign up for an API key
      const query = searchParams.location.split(',')[0];
      const response = await fetch(
        `https://travel-advisor.p.rapidapi.com/hotels/list?location_id=1&adults=${searchParams.adults}&rooms=${searchParams.rooms}&checkin=${searchParams.checkIn}&nights=1`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your RapidAPI key
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      
      if (data.data) {
        // Filter by price range
        const [minPrice, maxPrice] = searchParams.priceRange.split('-').map(Number);
        const filteredHotels = data.data
          .filter(hotel => hotel.price && hotel.price >= minPrice && hotel.price <= maxPrice)
          .slice(0, 6); // Show only 6 hotels
        
        setHotels(filteredHotels);
      } else {
        // Fallback to mock data if API fails
        setHotels(getMockHotelData());
      }
    } catch (err) {
      console.error('Hotel search error:', err);
      setError('Failed to load hotels. Using sample data.');
      setHotels(getMockHotelData());
    } finally {
      setLoading(false);
    }
  };

  const getMockHotelData = () => {
    return [
      {
        location_id: "1",
        name: "Taj Resort & Spa",
        location: "Goa",
        price: 4500,
        rating: "4.5",
        num_reviews: "284",
        photo: { images: { medium: { url: "" } } },
        amenities: ["Pool", "Spa", "Free WiFi", "Beach Access"]
      },
      {
        location_id: "2",
        name: "Sea View Hotel",
        location: "Goa",
        price: 3200,
        rating: "4.2",
        num_reviews: "156",
        photo: { images: { medium: { url: "" } } },
        amenities: ["Beach Front", "Restaurant", "Free WiFi"]
      },
      {
        location_id: "3",
        name: "Luxury Beach Resort",
        location: "Goa",
        price: 6800,
        rating: "4.8",
        num_reviews: "432",
        photo: { images: { medium: { url: "" } } },
        amenities: ["Infinity Pool", "Spa", "3 Restaurants", "Bar"]
      }
    ];
  };

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

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchHotels();
  };

  const handleBookNow = (hotel) => {
    navigate('/hotel-booking', {
      state: {
        hotel,
        searchParams
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
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
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-In</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleInputChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Check-Out Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleInputChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min={searchParams.checkIn}
              />
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
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleRoomChange('rooms', -1)}
                        disabled={searchParams.rooms <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4">{searchParams.rooms}</span>
                      <button 
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
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
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleRoomChange('adults', -1)}
                        disabled={searchParams.adults <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4">{searchParams.adults}</span>
                      <button 
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleRoomChange('adults', 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
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
              <div className="font-medium text-gray-800">
                {priceRanges.find(range => range.value === searchParams.priceRange)?.label || 'Select Price'}
              </div>
              <FiDollarSign className="text-gray-400" />
            </div>
            
            {showPriceDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                {priceRanges.map((range, index) => (
                  <div 
                    key={index}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${searchParams.priceRange === range.value ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      handleInputChange({ target: { name: 'priceRange', value: range.value } });
                      setShowPriceDropdown(false);
                    }}
                  >
                    {range.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              SEARCHING...
            </>
          ) : (
            <>
              <FiSearch className="mr-2" />
              SEARCH HOTELS
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Trending Searches */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Trending Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {popularLocations.slice(0, 3).map((location, index) => (
            <span 
              key={index}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => {
                handleInputChange({ target: { name: 'location', value: location.split(',')[0] } });
                searchHotels();
              }}
            >
              {location}
            </span>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Available Properties in {searchParams.location}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <FiHome className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <FiHome className="text-gray-400 text-4xl" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiMapPin className="mr-1" size={14} />
                    {hotel.location || searchParams.location}, India
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">{hotel.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({hotel.num_reviews || '100'} reviews)</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold">₹{hotel.price}</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities?.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleBookNow(hotel)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelSearch;
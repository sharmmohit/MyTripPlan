import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaChevronDown, FaMapMarkerAlt, FaFilm, FaTheaterMasks } from 'react-icons/fa';

const CinemaSearchTab = () => {
  const [location, setLocation] = useState('Mumbai');
  const [movie, setMovie] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [tickets, setTickets] = useState(1);
  const [cinema, setCinema] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMovieDropdown, setShowMovieDropdown] = useState(false);
  const [showCinemaDropdown, setShowCinemaDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock Data
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
  const popularMovies = ['Kalki 2898 AD', 'Pushpa 2', 'Singham Again', 'Indian 2', 'Vedaa', 'Deadpool & Wolverine'];
  const cinemaChains = ['PVR', 'INOX', 'Cinepolis', 'Miraj', 'Carnival', 'Asian'];
  const timeSlots = [
    '10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'
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

  // Set initial date
  useEffect(() => {
    const today = new Date();
    setDate(formatDateForInput(today));
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!location || !movie || !date) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    // Mock response data
    const mockResponse = {
      success: true,
      data: {
        location,
        movie,
        date,
        time,
        tickets,
        cinema: cinema || 'PVR',
        cinemas: [
          {
            name: `${cinema || 'PVR'} ${location}`,
            timings: ['10:00 AM', '01:30 PM', '04:45 PM', '08:00 PM'],
            prices: {
              standard: 250,
              premium: 400,
              recliner: 600
            },
            address: `Mall of ${location}, Main Road`
          }
        ]
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      navigate("/cinema-results", { state: mockResponse });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Movie Tickets Booking</h1>

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
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowMovieDropdown(false);
                setShowCinemaDropdown(false);
                setShowTimeDropdown(false);
              }}
            >
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{location}</span>
              <FaChevronDown className={`text-gray-400 ${showLocationDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showLocationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setLocation(city);
                      setShowLocationDropdown(false);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Movie */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Movie</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowMovieDropdown(!showMovieDropdown);
                setShowLocationDropdown(false);
                setShowCinemaDropdown(false);
                setShowTimeDropdown(false);
              }}
            >
              <FaFilm className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{movie || 'Select a movie'}</span>
              <FaChevronDown className={`text-gray-400 ${showMovieDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showMovieDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {popularMovies.map((movie, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setMovie(movie);
                      setShowMovieDropdown(false);
                    }}
                  >
                    {movie}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={formatDateForInput(new Date())}
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDisplayDate(date)}
            </div>
          </div>

          {/* Time */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowTimeDropdown(!showTimeDropdown);
                setShowLocationDropdown(false);
                setShowMovieDropdown(false);
                setShowCinemaDropdown(false);
              }}
            >
              <FaClock className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{time}</span>
              <FaChevronDown className={`text-gray-400 ${showTimeDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showTimeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setTime(slot);
                      setShowTimeDropdown(false);
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cinema (Optional) */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Cinema (Optional)</label>
            <div
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowCinemaDropdown(!showCinemaDropdown);
                setShowLocationDropdown(false);
                setShowMovieDropdown(false);
                setShowTimeDropdown(false);
              }}
            >
              <FaTheaterMasks className="text-gray-400 mr-2" />
              <span className="font-medium flex-1">{cinema || 'Any'}</span>
              <FaChevronDown className={`text-gray-400 ${showCinemaDropdown ? 'transform rotate-180' : ''}`} />
            </div>
            {showCinemaDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCinema('');
                    setShowCinemaDropdown(false);
                  }}
                >
                  Any Cinema
                </div>
                {cinemaChains.map((chain, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCinema(chain);
                      setShowCinemaDropdown(false);
                    }}
                  >
                    {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tickets Selector */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-500 mb-1">Tickets</label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                className={`w-12 h-12 rounded-full flex items-center justify-center ${tickets === num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTickets(num)}
              >
                {num}
              </button>
            ))}
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
              'SEARCH CINEMAS'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CinemaSearchTab;
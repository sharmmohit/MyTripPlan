// src/components/TrainSearchTab.jsx
import React, { useState, useEffect } from 'react';
import { FaTrain, FaCalendarAlt, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TrainSearchTab = ({ initialFrom, initialTo }) => {
  // Use initial props for default state, allowing pre-filling from other parts of the app
  const [fromStation, setFromStation] = useState(initialFrom || { city: 'Indore', code: 'INDB', description: 'Indore - All Stations' });
  const [toStation, setToStation] = useState(initialTo || { city: 'Ratlam', code: 'RTM', description: 'Ratlam Junction' });
  const [travelDate, setTravelDate] = useState('');
  const [trainClass, setTrainClass] = useState('ALL'); // Default to 'ALL'
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [error, setError] = useState(''); // For client-side validation errors
  const navigate = useNavigate(); // Hook for navigation

  // Mock Train Station Data (ensure these codes match your database train_stations.code)
  const trainStations = [
    { city: 'Indore', code: 'INDB', description: 'Indore - All Stations' },
    { city: 'Ratlam', code: 'RTM', description: 'Ratlam Junction' },
    { city: 'Bhopal', code: 'BPL', description: 'Bhopal Junction' },
    { city: 'Mumbai', code: 'BOMC', description: 'Mumbai Central' }, // Use BOMC as per your mock data
    { city: 'Delhi', code: 'NDLS', description: 'New Delhi Railway Station' },
    { city: 'Bengaluru', code: 'SBC', description: 'KSR Bengaluru City Junction' },
    { city: 'Chennai', code: 'MAS', description: 'MGR Chennai Central' },
    { city: 'Kolkata', code: 'HWH', description: 'Howrah Junction' },
    { city: 'Hyderabad', code: 'SC', description: 'Secunderabad Junction' },
    { city: 'Jaipur', code: 'JP', description: 'Jaipur Junction' },
    { city: 'Ahmedabad', code: 'ADI', description: 'Ahmedabad Junction' },
    { city: 'Pune', code: 'PUNE', description: 'Pune Junction' },
    { city: 'Lucknow', code: 'LKO', description: 'Lucknow Charbagh NR' },
  ];

  // Train Class Options (These codes must match the keys in the 'classes' JSON in your trains table)
  const trainClasses = [
    { code: 'ALL', label: 'All Class' },
    { code: '1A', label: 'AC First Class (1A)' },
    { code: '2A', label: 'AC 2 Tier (2A)' },
    { code: '3A', label: 'AC 3 Tier (3A)' },
    { code: 'SL', label: 'Sleeper (SL)' },
    { code: '2S', label: 'Second Seating (2S)' },
    { code: 'EC', label: 'Executive Class (EC)' }, // Added for Shatabdi
    { code: 'CC', label: 'Chair Car (CC)' },     // Added for Shatabdi/Gomti
  ];

  // Formats a Date object into 'YYYY-MM-DD' string for input 'min' attribute
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Gets today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    return formatDateForInput(new Date());
  };

  // Sets initial travel date to tomorrow when the component mounts
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(formatDateForInput(tomorrow));
  }, []);

  // Formats date for display: "29 May '25 Thursday"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', "'");
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${formattedDate} ${weekday}`;
  };

  // Handles selection of a station from the dropdown
  const handleStationSelect = (station, type) => {
    if (type === 'from') {
      setFromStation(station);
      setShowFromDropdown(false); // Close dropdown after selection
    } else {
      setToStation(station);
      setShowToDropdown(false); // Close dropdown after selection
    }
  };

  // Swaps the 'From' and 'To' stations
  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Handles the train search form submission - now navigates to results page
  const handleSearchTrains = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors

    // Basic client-side validation
    if (!fromStation.code || !toStation.code || !travelDate) {
      setError('Please select From, To, and Travel Date.');
      return;
    }
    if (fromStation.code === toStation.code) {
      setError('Origin and Destination cannot be the same.');
      return;
    }

    // Navigate to the train results page, passing search parameters via state
    navigate('/train-results', {
      state: {
        fromStation,
        toStation,
        travelDate,
        trainClass
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Train Tickets</h1>

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Grid layout for search inputs */}
      <div className="grid grid-cols-1 md:grid-cols-9 gap-0 rounded-lg border border-gray-300 shadow-md mb-6">
        {/* From Station Input */}
        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b md:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">FROM</label>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false); // Close other dropdown
            }}
          >
            <FaTrain className="text-gray-400 mr-2" />
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-800">{fromStation.city}</p>
              <p className="text-xs text-gray-500">{fromStation.code}, {fromStation.description}</p>
            </div>
            {/* Chevron icon with rotation for dropdown state */}
            <FaChevronDown className={`text-gray-400 transition-transform ${showFromDropdown ? 'transform rotate-180' : ''}`} />
          </div>
          {/* From Station Dropdown */}
          {showFromDropdown && (
            <div className="absolute z-20 top-full left-0 w-full bg-white shadow-lg rounded-b-lg border border-gray-200 max-h-60 overflow-y-auto">
              {trainStations.map((station) => (
                <div
                  key={station.code}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleStationSelect(station, 'from')}
                >
                  <p className="font-medium">{station.city}</p>
                  <p className="text-xs text-gray-500">{station.code}, {station.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center p-2 bg-blue-50 md:col-span-1">
          <button
            type="button"
            onClick={swapStations}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Swap origin and destination"
          >
            <FaExchangeAlt className="h-5 w-5 text-gray-600" /> {/* Using FaExchangeAlt icon */}
          </button>
        </div>

        {/* To Station Input */}
        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b md:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">TO</label>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false); // Close other dropdown
            }}
          >
            <FaTrain className="text-gray-400 mr-2 rotate-90" /> {/* Rotated train icon */}
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-800">{toStation.city}</p>
              <p className="text-xs text-gray-500">{toStation.code}, {toStation.description}</p>
            </div>
            {/* Chevron icon with rotation for dropdown state */}
            <FaChevronDown className={`text-gray-400 transition-transform ${showToDropdown ? 'transform rotate-180' : ''}`} />
          </div>
          {/* To Station Dropdown */}
          {showToDropdown && (
            <div className="absolute z-20 top-full left-0 w-full bg-white shadow-lg rounded-b-lg border border-gray-200 max-h-60 overflow-y-auto">
              {trainStations.map((station) => (
                <div
                  key={station.code}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleStationSelect(station, 'to')}
                >
                  <p className="font-medium">{station.city}</p>
                  <p className="text-xs text-gray-500">{station.code}, {station.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Travel Date Input */}
        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b sm:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">TRAVEL DATE</label>
          <div className="relative flex items-center">
            <FaCalendarAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="w-full pl-8 pr-1 py-2 bg-transparent text-lg font-bold text-gray-800 focus:outline-none appearance-none"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={getTodayDate()}
              required
            />
          </div>
          {/* Date text element visibility fix: Increased font size and ensured block display */}
          <span className="block text-sm text-gray-600 mt-1">{formatDisplayDate(travelDate)}</span>
        </div>

        {/* Class Selection */}
        <div className="md:col-span-2 relative p-4 bg-blue-50 border-b sm:border-b-0 border-gray-300">
          {/* Class title visibility fix: Ensure label is block and has margin */}
          <label className="block text-xs font-medium text-blue-700 mb-1">CLASS</label>
          <div className="relative flex items-center">
            <select
              value={trainClass}
              onChange={(e) => setTrainClass(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-transparent text-lg font-bold text-gray-800 focus:outline-none appearance-none"
            >
              {trainClasses.map(cls => (
                <option key={cls.code} value={cls.code}>{cls.label}</option>
              ))}
            </select>
            {/* Chevron icon for select dropdown, pointer-events-none ensures select is clickable */}
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {/* Class text alignment fix: Increased font size and ensured block display */}
          <span className="block text-sm text-gray-600 mt-1">
            {trainClasses.find(cls => cls.code === trainClass)?.label || 'All Class'}
          </span>
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center">
        <button
          type="submit"
          onClick={handleSearchTrains}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          // isLoading state is no longer needed here as API call is on results page
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default TrainSearchTab;

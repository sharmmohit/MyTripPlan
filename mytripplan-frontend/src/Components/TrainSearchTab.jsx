import React, { useState, useEffect } from 'react';
import { FaTrain, FaCalendarAlt, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainSearchTab = ({ initialFrom, initialTo }) => {
  const [fromStation, setFromStation] = useState(initialFrom || { city: 'Mumbai', code: 'BOMC', description: 'Mumbai Central' });
  const [toStation, setToStation] = useState(initialTo || { city: 'Delhi', code: 'NDLS', description: 'New Delhi Railway Station' });
  const [travelDate, setTravelDate] = useState('');
  const [trainClass, setTrainClass] = useState('ALL');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const trainStations = [
    { city: 'Mumbai', code: 'BOMC', description: 'Mumbai Central' },
    { city: 'Delhi', code: 'NDLS', description: 'New Delhi Railway Station' },
    { city: 'Bangalore', code: 'SBC', description: 'KSR Bengaluru City Junction' },
    { city: 'Chennai', code: 'MAS', description: 'MGR Chennai Central' },
    { city: 'Kolkata', code: 'HWH', description: 'Howrah Junction' },
    { city: 'Hyderabad', code: 'SC', description: 'Secunderabad Junction' },
    { city: 'Pune', code: 'PUNE', description: 'Pune Junction' },
  ];

  const trainClasses = [
    { code: 'ALL', label: 'All Class' },
    { code: '1A', label: 'AC First Class (1A)' },
    { code: '2A', label: 'AC 2 Tier (2A)' },
    { code: '3A', label: 'AC 3 Tier (3A)' },
    { code: 'SL', label: 'Sleeper (SL)' },
    { code: '2S', label: 'Second Seating (2S)' },
  ];

  const formatDateForInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(formatDateForInput(tomorrow));
  }, []);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', "'");
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${formattedDate} ${weekday}`;
  };

  const handleStationSelect = (station, type) => {
    if (type === 'from') {
      setFromStation(station);
      setShowFromDropdown(false);
    } else {
      setToStation(station);
      setShowToDropdown(false);
    }
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearchTrains = (e) => {
    e.preventDefault();
    setError('');

    if (!fromStation.code || !toStation.code || !travelDate) {
      setError('Please select From, To, and Travel Date.');
      return;
    }
    if (fromStation.code === toStation.code) {
      setError('Origin and Destination cannot be the same.');
      return;
    }

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-9 gap-0 rounded-lg border border-gray-300 shadow-md mb-6">
        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b md:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">FROM</label>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false);
            }}
          >
            <FaTrain className="text-gray-400 mr-2" />
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-800">{fromStation.city}</p>
              <p className="text-xs text-gray-500">{fromStation.code}, {fromStation.description}</p>
            </div>
            <FaChevronDown className={`text-gray-400 transition-transform ${showFromDropdown ? 'transform rotate-180' : ''}`} />
          </div>
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

        <div className="flex items-center justify-center p-2 bg-blue-50 md:col-span-1">
          <button
            type="button"
            onClick={swapStations}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Swap origin and destination"
          >
            <FaExchangeAlt className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b md:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">TO</label>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false);
            }}
          >
            <FaTrain className="text-gray-400 mr-2 rotate-90" />
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-800">{toStation.city}</p>
              <p className="text-xs text-gray-500">{toStation.code}, {toStation.description}</p>
            </div>
            <FaChevronDown className={`text-gray-400 transition-transform ${showToDropdown ? 'transform rotate-180' : ''}`} />
          </div>
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

        <div className="md:col-span-2 relative p-4 bg-blue-50 border-r border-b sm:border-b-0 border-gray-300">
          <label className="block text-xs font-medium text-blue-700 mb-1">TRAVEL DATE</label>
          <div className="relative flex items-center">
            <FaCalendarAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="w-full pl-8 pr-1 py-2 bg-transparent text-lg font-bold text-gray-800 focus:outline-none appearance-none"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={formatDateForInput(new Date())}
              required
            />
          </div>
          <span className="block text-sm text-gray-600 mt-1">{formatDisplayDate(travelDate)}</span>
        </div>

        <div className="md:col-span-2 relative p-4 bg-blue-50 border-b sm:border-b-0 border-gray-300">
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
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="block text-sm text-gray-600 mt-1">
            {trainClasses.find(cls => cls.code === trainClass)?.label || 'All Class'}
          </span>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          onClick={handleSearchTrains}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default TrainSearchTab;
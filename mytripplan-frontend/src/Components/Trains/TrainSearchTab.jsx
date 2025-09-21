import React, { useState } from 'react';
import { FaTrain, FaCalendarAlt, FaUser, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainSearchTab = () => {
    const navigate = useNavigate();
    
    const [fromStation, setFromStation] = useState('Delhi');
    const [fromCode, setFromCode] = useState('DLI');
    const [toStation, setToStation] = useState('');
    const [toCode, setToCode] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [classType, setClassType] = useState('all');
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [showStationDropdown, setShowStationDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // More comprehensive station list
    const stations = [
        { name: 'New Delhi', code: 'NDLS', city: 'Delhi' },
        { name: 'Mumbai Central', code: 'BCT', city: 'Mumbai' },
        { name: 'Chennai Central', code: 'MAS', city: 'Chennai' },
        { name: 'Howrah Junction', code: 'HWH', city: 'Kolkata' },
        { name: 'Bangalore City', code: 'SBC', city: 'Bengaluru' },
        { name: 'Secunderabad Junction', code: 'SC', city: 'Hyderabad' },
        { name: 'Ahmedabad Junction', code: 'ADI', city: 'Ahmedabad' },
        { name: 'Pune Junction', code: 'PUNE', city: 'Pune' },
        { name: 'Jaipur Junction', code: 'JP', city: 'Jaipur' },
        { name: 'Lucknow Charbagh', code: 'LKO', city: 'Lucknow' },
        { name: 'Patna Junction', code: 'PNBE', city: 'Patna' },
        { name: 'Bhopal Junction', code: 'BPL', city: 'Bhopal' },
        { name: 'Chhatrapati Shivaji Terminus', code: 'CSTM', city: 'Mumbai' },
        { name: 'Kanpur Central', code: 'CNB', city: 'Kanpur' },
        { name: 'Varanasi Junction', code: 'BSB', city: 'Varanasi' },
        { name: 'Coimbatore Junction', code: 'CBE', city: 'Coimbatore' },
        { name: 'Nagpur Junction', code: 'NGP', city: 'Nagpur' },
        { name: 'Visakhapatnam Junction', code: 'VSKP', city: 'Visakhapatnam' },
        { name: 'Thiruvananthapuram Central', code: 'TVC', city: 'Thiruvananthapuram' },
        { name: 'Madurai Junction', code: 'MDU', city: 'Madurai' },
        { name: 'Guwahati', code: 'GHY', city: 'Guwahati' },
        { name: 'Chandigarh Junction', code: 'CDG', city: 'Chandigarh' },
        { name: 'Jammu Tawi', code: 'JAT', city: 'Jammu' },
        { name: 'Dehradun', code: 'DDN', city: 'Dehradun' },
        { name: 'Bhubaneswar', code: 'BBS', city: 'Bhubaneswar' },
        { name: 'Ranchi Junction', code: 'RNC', city: 'Ranchi' },
        { name: 'Raipur Junction', code: 'R', city: 'Raipur' },
        { name: 'Jabalpur Junction', code: 'JBP', city: 'Jabalpur' },
        { name: 'Gwalior Junction', code: 'GWL', city: 'Gwalior' },
        { name: 'Kochi', code: 'ERS', city: 'Kochi' },
    ];

    const classOptions = [
        { value: 'all', label: 'All Classes' },
        { value: '1A', label: 'First AC' },
        { value: '2A', label: 'Second AC' },
        { value: '3A', label: 'Third AC' },
        { value: 'SL', label: 'Sleeper' },
        { value: 'CC', label: 'Chair Car' },
    ];

    const handleStationSelect = (station, type) => {
        if (type === 'from') {
            setFromStation(station.city);
            setFromCode(station.code);
        } else {
            setToStation(station.city);
            setToCode(station.code);
        }
        setShowStationDropdown(null);
    };

    const swapStations = () => {
        const tempStation = fromStation;
        const tempCode = fromCode;
        setFromStation(toStation);
        setFromCode(toCode);
        setToStation(tempStation);
        setToCode(tempCode);
    };

    const formatDateForAPI = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!toCode) {
            setError('Please select destination station.');
            return;
        }
        if (!departureDate) {
            setError('Please select departure date.');
            return;
        }

        setLoading(true);
        try {
            // Using IRCTC API from RapidAPI
            const formattedDate = formatDateForAPI(departureDate);
            
            const url = `https://irctc1.p.rapidapi.com/api/v2/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&dateOfJourney=${formattedDate}`;
            
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'bc4914961fmsh2906570d84a8ee3p1b1782jsn42832c37a4ba',
                    'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
                }
            };

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status && data.data && data.data.length > 0) {
                navigate('/train-results', {
                    state: {
                        trains: data.data,
                        searchParams: {
                            fromStation,
                            toStation,
                            fromCode,
                            toCode,
                            departureDate,
                            passengers,
                            classType
                        }
                    }
                });
            } else {
                throw new Error('No trains found for this route');
            }
        } catch (err) {
            console.error('Train search error:', err);
            setError(err.message || 'Failed to fetch train data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaTrain className="mr-2 text-blue-600" />
                Book Trains
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Station Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {/* From Station */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Station</label>
                        <div
                            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                            onClick={() => setShowStationDropdown('from')}
                        >
                            <FaTrain className="text-gray-400 mr-2" />
                            <div>
                                <p className="font-medium">{fromStation}</p>
                                <p className="text-xs text-gray-500">{fromCode}</p>
                            </div>
                        </div>
                        {showStationDropdown === 'from' && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                                {stations.map(station => (
                                    <div
                                        key={station.code}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                        onClick={() => handleStationSelect(station, 'from')}
                                    >
                                        <p className="font-medium">{station.city}</p>
                                        <p className="text-xs text-gray-500">{station.name} ({station.code})</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Swap Button */}
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            onClick={swapStations}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <FaExchangeAlt className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* To Station */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">To Station</label>
                        <div
                            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                            onClick={() => setShowStationDropdown('to')}
                        >
                            <FaTrain className="text-gray-400 mr-2" />
                            <div>
                                {toStation ? (
                                    <>
                                        <p className="font-medium">{toStation}</p>
                                        <p className="text-xs text-gray-500">{toCode}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-400">Select Destination</p>
                                )}
                            </div>
                        </div>
                        {showStationDropdown === 'to' && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                                {stations.map(station => (
                                    <div
                                        key={station.code}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                        onClick={() => handleStationSelect(station, 'to')}
                                    >
                                        <p className="font-medium">{station.city}</p>
                                        <p className="text-xs text-gray-500">{station.name} ({station.code})</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Date and Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Departure Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="date"
                                required
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                        <div
                            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                            className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                        >
                            <span>{passengers} Passenger{passengers > 1 ? 's' : ''}</span>
                            <FaChevronDown className="text-gray-400" />
                        </div>
                        {showPassengerDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                                {[1, 2, 3, 4, 5, 6].map(count => (
                                    <div
                                        key={count}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                                            passengers === count ? 'bg-blue-50 font-semibold' : ''
                                        }`}
                                        onClick={() => {
                                            setPassengers(count);
                                            setShowPassengerDropdown(false);
                                        }}
                                    >
                                        {count} Passenger{count > 1 ? 's' : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Class Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select
                            value={classType}
                            onChange={(e) => setClassType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            {classOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 transition-colors duration-300"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Searching Trains...
                        </div>
                    ) : (
                        'Search Trains'
                    )}
                </button>

                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
            </form>

            {/* API Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Using real-time IRCTC API to fetch train data.
                </p>
            </div>
        </div>
    );
};

export default TrainSearchTab;
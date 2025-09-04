import React, { useState } from 'react';
import { FaPlane, FaCalendarAlt, FaUser, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FlightSearchTab = () => {
    const backendUrl = 'http://localhost:5000';
    const navigate = useNavigate();
    
    const [tripType, setTripType] = useState('one-way');
    const [fromLocation, setFromLocation] = useState('Delhi');
    const [fromCode, setFromCode] = useState('DEL');
    const [toLocation, setToLocation] = useState('');
    const [toCode, setToCode] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [cabinClass, setCabinClass] = useState('economy');
    const [fareType, setFareType] = useState('regular');
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const locations = [
        { city: 'Delhi', code: 'DEL', airport: 'Indira Gandhi International Airport' },
        { city: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji Maharaj International Airport' },
        { city: 'Bengaluru', code: 'BLR', airport: 'Kempegowda International Airport' },
        { city: 'Hyderabad', code: 'HYD', airport: 'Rajiv Gandhi International Airport' },
        { city: 'Chennai', code: 'MAA', airport: 'Chennai International Airport' },
        { city: 'Kolkata', code: 'CCU', airport: 'Netaji Subhash Chandra Bose International Airport' },
    ];

    const fareOptions = [
        { id: 'regular', label: 'Regular', description: 'Regular fares' },
        { id: 'student', label: 'Student', description: 'Extra discounts/baggage' },
        { id: 'senior-citizen', label: 'Senior Citizen', description: 'Up to ₹ 600 off' },
        { id: 'armed-forces', label: 'Armed Forces', description: 'Up to ₹ 600 off' },
        { id: 'doctor-nurse', label: 'Doctor & Nurses', description: 'Up to ₹ 600 off' },
    ];

    const handleLocationSelect = (location, type) => {
        if (type === 'from') {
            setFromLocation(location.city);
            setFromCode(location.code);
        } else {
            setToLocation(location.city);
            setToCode(location.code);
        }
        setShowLocationDropdown(null);
    };

    const swapLocations = () => {
        const tempLocation = fromLocation;
        const tempCode = fromCode;
        setFromLocation(toLocation);
        setFromCode(toCode);
        setToLocation(tempLocation);
        setToCode(tempCode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!toCode) {
            setError('Please select destination (TO) location.');
            return;
        }
        if (!departureDate) {
            setError('Please select departure date.');
            return;
        }
        if (tripType === 'round-trip' && !returnDate) {
            setError('Please select return date for round-trip.');
            return;
        }

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                departure: fromCode,
                arrival: toCode,
                date: departureDate,
                passengers,
                cabinClass,
                fareType
            });

            const response = await fetch(`${backendUrl}/api/flights/search?${queryParams.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Navigate to results page with state
            navigate('/flightdisplay', {
                state: {
                    searchResults: data.flights,
                    searchParams: {
                        fromLocation,
                        toLocation,
                        departureDate,
                        returnDate,
                        passengers,
                        cabinClass,
                        tripType
                    }
                }
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch flights. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Book International and Domestic Flights</h1>

            {/* Trip Type Selection */}
            <div className="flex space-x-4 mb-6 border-b pb-4">
                {['one-way', 'round-trip', 'multi-city'].map(type => (
                    <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`px-4 py-2 text-lg font-medium rounded-md ${tripType === type ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Fare Type Selection */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Select a special fare</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {fareOptions.map(option => (
                        <div
                            key={option.id}
                            onClick={() => setFareType(option.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${fareType === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                            <div className="flex items-start">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 mr-2 ${fareType === option.id ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                    {fareType === option.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                                <div>
                                    <h3 className={`font-medium ${fareType === option.id ? 'text-blue-800' : 'text-gray-800'}`}>{option.label}</h3>
                                    <p className="text-xs text-gray-600">{option.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flight Search Form */}
            <form onSubmit={handleSubmit}>
                {(tripType === 'one-way' || tripType === 'round-trip') && (
                    <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-6">
                        {/* From Location */}
                        <div className="md:col-span-2 relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1">FROM</label>
                            <div
                                className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                                onClick={() => setShowLocationDropdown('from')}
                            >
                                <FaPlane className="text-gray-400 mr-2" />
                                <div>
                                    <p className="font-medium">{fromLocation}</p>
                                    <p className="text-xs text-gray-500">{fromCode}</p>
                                </div>
                            </div>
                            {showLocationDropdown === 'from' && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                                    {locations.map(location => (
                                        <div
                                            key={location.code}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleLocationSelect(location, 'from')}
                                        >
                                            <p className="font-medium">{location.city}</p>
                                            <p className="text-xs text-gray-500">{location.code}, {location.airport}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Swap Button */}
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={swapLocations}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5m0 0l-5-5m5 5H9m7 5v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1" />
                                </svg>
                            </button>
                        </div>

                        {/* To Location */}
                        <div className="md:col-span-2 relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1">TO</label>
                            <div
                                className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                                onClick={() => setShowLocationDropdown('to')}
                            >
                                <FaPlane className="text-gray-400 mr-2 rotate-180" />
                                <div>
                                    {toLocation ? (
                                        <>
                                            <p className="font-medium">{toLocation}</p>
                                            <p className="text-xs text-gray-500">{toCode}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400">Select Destination</p>
                                    )}
                                </div>
                            </div>
                            {showLocationDropdown === 'to' && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                                    {locations.map(location => (
                                        <div
                                            key={location.code}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleLocationSelect(location, 'to')}
                                        >
                                            <p className="font-medium">{location.city}</p>
                                            <p className="text-xs text-gray-500">{location.code}, {location.airport}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Departure Date */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">DEPARTURE</label>
                            <input
                                type="date"
                                required
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Return Date - only for round-trip */}
                        {tripType === 'round-trip' && (
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">RETURN</label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    min={departureDate || new Date().toISOString().split('T')[0]}
                                    required={tripType === 'round-trip'}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Passenger and Cabin Class */}
                <div className="flex space-x-6 mb-6">
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">PASSENGERS</label>
                        <div
                            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                            className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer w-36 justify-between"
                        >
                            <span>{passengers} Passenger{passengers > 1 ? 's' : ''}</span>
                            <FaChevronDown />
                        </div>
                        {showPassengerDropdown && (
                            <div className="absolute mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                {[...Array(9).keys()].map(i => {
                                    const count = i + 1;
                                    return (
                                        <div
                                            key={count}
                                            className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${passengers === count ? 'bg-blue-50 font-semibold' : ''}`}
                                            onClick={() => { setPassengers(count); setShowPassengerDropdown(false); }}
                                        >
                                            {count} Passenger{count > 1 ? 's' : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">CABIN CLASS</label>
                        <select
                            value={cabinClass}
                            onChange={(e) => setCabinClass(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 w-36"
                        >
                            <option value="economy">Economy</option>
                            <option value="premium-economy">Premium Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search Flights'}
                </button>

                {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
            </form>
        </div>
    );
};

export default FlightSearchTab;
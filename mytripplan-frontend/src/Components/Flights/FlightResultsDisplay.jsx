import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaClock, FaRupeeSign, FaArrowLeft } from 'react-icons/fa';

const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flights, searchParams } = location.state || { flights: [], searchParams: {} };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const time = new Date(timeString);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (departure, arrival) => {
        if (!departure || !arrival) return 'N/A';
        
        const dep = new Date(departure);
        const arr = new Date(arrival);
        const diff = Math.abs(arr - dep);
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        
        return `${hours}h ${minutes}m`;
    };

    const calculatePrice = (basePrice, cabinClass, passengers) => {
        const classMultipliers = {
            economy: 1,
            premium_economy: 1.5,
            business: 2.5,
            first: 4
        };
        
        const totalPassengers = passengers.adults + passengers.children + (passengers.infants * 0.1);
        const price = basePrice * classMultipliers[cabinClass] * totalPassengers;
        
        return Math.round(price);
    };

    const handleBookNow = (flight) => {
        navigate('/flight-booking', {
            state: {
                flight,
                searchParams
            }
        });
    };

    if (!flights || flights.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Search
                    </button>
                    
                    <div className="text-center py-12">
                        <FaPlane className="text-gray-400 text-6xl mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Flights Found</h2>
                        <p className="text-gray-600">No flights available for the selected route and date.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Search
                </button>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Flight Search Results</h1>
                    <p className="text-gray-600">
                        {searchParams.fromCity} → {searchParams.toCity} • 
                        {new Date(searchParams.departureDate).toLocaleDateString()} • 
                        {searchParams.passengers.adults + searchParams.passengers.children} Passenger{(searchParams.passengers.adults + searchParams.passengers.children) > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {flights.map((flight, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Airline Info */}
                                <div>
                                    <h3 className="font-bold text-lg text-blue-800">
                                        {flight.airline?.name || 'Unknown Airline'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {flight.flight?.iata || flight.flight?.number || 'N/A'}
                                    </p>
                                    <div className="flex items-center mt-2 text-sm text-gray-600">
                                        <FaClock className="mr-1" />
                                        {formatDuration(flight.departure?.scheduled, flight.arrival?.scheduled)}
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold text-lg">
                                            {formatTime(flight.departure?.scheduled)}
                                        </p>
                                        <p className="text-sm text-gray-600">{searchParams.fromCode}</p>
                                        <p className="text-xs text-gray-500">{searchParams.fromCity}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">
                                            {formatTime(flight.arrival?.scheduled)}
                                        </p>
                                        <p className="text-sm text-gray-600">{searchParams.toCode}</p>
                                        <p className="text-xs text-gray-500">{searchParams.toCity}</p>
                                    </div>
                                </div>

                                {/* Flight Details */}
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Status: <span className={`font-medium ${
                                            flight.flight_status === 'scheduled' ? 'text-green-600' :
                                            flight.flight_status === 'active' ? 'text-blue-600' :
                                            flight.flight_status === 'landed' ? 'text-gray-600' :
                                            'text-red-600'
                                        }`}>
                                            {flight.flight_status?.charAt(0).toUpperCase() + flight.flight_status?.slice(1)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Aircraft: {flight.aircraft?.iata || 'N/A'}
                                    </p>
                                </div>

                                {/* Price & Booking */}
                                <div className="text-right">
                                    <div className="flex items-center justify-end mb-2">
                                        <FaRupeeSign className="text-green-600 text-sm" />
                                        <span className="font-bold text-green-700 text-xl">
                                            {calculatePrice(2500, searchParams.cabinClass, searchParams.passengers)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleBookNow(flight)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors"
                                    >
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

export default FlightResults;
// FILE: src/Components/FlightResultsDisplay.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FlightResultsDisplay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchResults, searchParams } = location.state || {};

    const handleBackToSearch = () => {
        navigate('/');
    };

    // This block handles cases where the page is accessed directly or state is missing
    if (!searchResults || !searchParams) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Search Results Found</h2>
                <p className="text-gray-600 mb-6">Please perform a flight search first.</p>
                <button
                    onClick={handleBackToSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                    Back to Search
                </button>
            </div>
        );
    }

    const { fromLocation, toLocation, departureDate, returnDate, passengers, cabinClass, tripType } = searchParams;

    const formatDate = (dateString) => {
        // Ensure dateString is valid before creating Date object
        if (!dateString) return '';
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            console.error("Error formatting date:", e, dateString);
            return dateString; // Fallback to raw string if parsing fails
        }
    };

    const formatTime = (dateTimeString) => {
        // Ensure dateTimeString is valid before creating Date object
        if (!dateTimeString) return '';
        try {
            return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.error("Error formatting time:", e, dateTimeString);
            return dateTimeString; // Fallback to raw string if parsing fails
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Flight Search Results</h2>

            {/* Search Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Search:</h3>
                <p className="text-gray-700">
                    <span className="font-medium">{fromLocation.toUpperCase()}</span> to <span className="font-medium">{toLocation.toUpperCase()}</span>
                </p>
                <p className="text-gray-700">
                    Departure: <span className="font-medium">{formatDate(departureDate)}</span>
                    {tripType === 'round-trip' && returnDate && ( // Added check for returnDate to prevent error if undefined
                        <span> | Return: <span className="font-medium">{formatDate(returnDate)}</span></span>
                    )}
                </p>
                <p className="text-gray-700">
                    Passengers: <span className="font-medium">{passengers}</span> | Cabin Class: <span className="font-medium">
                        {cabinClass.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                </p>
            </div>

            {searchResults.length > 0 ? (
                <div className="space-y-4">
                    {searchResults.map((flight) => (
                        <div key={flight.flight_id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="mb-2 md:mb-0">
                                    <p className="text-lg font-semibold text-gray-900">{flight.airline_name}</p>
                                    <p className="text-sm text-gray-600">Flight #{flight.flight_number}</p>
                                </div>

                                <div className="flex-1 md:px-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-center">
                                            <p className="text-xl font-bold">{formatTime(flight.departure_time)}</p>
                                            {/* CHANGED: Use flight.departure_airport_id */}
                                            <p className="text-sm text-gray-600">{flight.departure_airport_id}</p>
                                        </div>

                                        <div className="mx-2 text-center">
                                            <p className="text-sm text-gray-500">{flight.duration_minutes} min</p>
                                            <div className="w-16 h-px bg-gray-300 my-1"></div>
                                            <p className="text-sm text-gray-500">Non-stop</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-xl font-bold">{formatTime(flight.arrival_time)}</p>
                                            {/* CHANGED: Use flight.arrival_airport_id */}
                                            <p className="text-sm text-gray-600">{flight.arrival_airport_id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 md:mt-0 text-right">
                                    <p className="text-2xl font-extrabold text-green-600">₹{flight.price}</p>
                                    <button
                                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
                                        onClick={() => alert(`Booking flight ${flight.flight_number}`)}
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-600 text-lg py-10">
                    <p>No flights found for your search criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your search parameters.</p>
                </div>
            )}

            <div className="text-center mt-6">
                <button
                    onClick={handleBackToSearch}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
                >
                    Back to Search
                </button>
            </div>
        </div>
    );
};

export default FlightResultsDisplay;
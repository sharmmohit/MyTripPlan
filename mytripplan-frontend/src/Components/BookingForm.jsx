// FILE: src/Components/BookingForm.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedFlight, searchParams } = location.state || {}; // Get passed state

    const [passengerName, setPassengerName] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
    const [passengerPhone, setPassengerPhone] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    useEffect(() => {
        // Redirect if no flight data is present (e.g., direct access)
        if (!selectedFlight || !searchParams) {
            navigate('/', { replace: true }); // Go back to search page
        }
    }, [selectedFlight, searchParams, navigate]);

    if (!selectedFlight || !searchParams) {
        return null; // Render nothing while redirecting
    }

    // Helper functions for formatting (can be reused from FlightResultsDisplay or a utils file)
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.error("Error formatting time:", e, dateTimeString);
            return dateTimeString;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            console.error("Error formatting date:", e, dateString);
            return dateString;
        }
    };

    // Calculate total fare for this flight segment
    const totalFareForFlight = (selectedFlight.price * searchParams.passengers).toFixed(2);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setBookingError('');
        setBookingSuccess('');

        if (!passengerName || !passengerEmail || !passengerPhone) {
            setBookingError('All passenger details are required.');
            setBookingLoading(false);
            return;
        }

        const bookingDetails = {
            flight_id: selectedFlight.flight_id,
            passenger_name: passengerName,
            passenger_email: passengerEmail,
            passenger_phone: passengerPhone,
            num_passengers: searchParams.passengers, // Use the number of passengers from searchParams
            cabin_class: searchParams.cabinClass,   // Pass cabin class
            total_fare_flight: parseFloat(totalFareForFlight) // Send calculated fare for this flight
        };

        try {
            const backendUrl = 'http://localhost:5000'; // Make sure this matches your backend URL
            const response = await fetch(`${backendUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Booking failed: ${response.statusText}`);
            }

            const result = await response.json();
            setBookingSuccess(`Booking successful! Master Booking ID: ${result.booking_id}, Flight Booking ID: ${result.flight_booking_id}`);
            console.log("Booking successful:", result);
            // Optionally navigate to a booking confirmation page, perhaps passing result.booking_id
            // navigate('/booking-confirmation', { state: { masterBookingId: result.booking_id, flightBookingId: result.flight_booking_id } });

        } catch (err) {
            setBookingError(err.message || 'Failed to complete booking. Please try again.');
            console.error("Booking error:", err);
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Your Flight</h2>

            {/* Selected Flight Details */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Flight Details:</h3>
                <p className="text-gray-700 text-lg font-medium">{selectedFlight.airline_name} - Flight {selectedFlight.flight_number}</p>
                <div className="grid grid-cols-2 gap-y-2 text-gray-600 mt-2">
                    <div>
                        <p><span className="font-semibold">From:</span> {selectedFlight.departure_airport_id}</p>
                        <p><span className="font-semibold">Departure:</span> {formatDate(selectedFlight.departure_time)} at {formatTime(selectedFlight.departure_time)}</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">To:</span> {selectedFlight.arrival_airport_id}</p>
                        <p><span className="font-semibold">Arrival:</span> {formatDate(selectedFlight.arrival_time)} at {formatTime(selectedFlight.arrival_time)}</p>
                    </div>
                    <div className="col-span-2">
                        <p><span className="font-semibold">Duration:</span> {selectedFlight.duration_minutes} minutes</p>
                        <p><span className="font-semibold">Price per passenger:</span> ₹{selectedFlight.price}</p>
                        <p className="text-xl font-extrabold text-green-700">
                            Total Price: ₹{totalFareForFlight} for {searchParams.passengers} passenger(s)
                        </p>
                        <p><span className="font-semibold">Cabin Class:</span> {searchParams.cabinClass.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    </div>
                </div>
            </div>

            {/* Passenger Details Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Passenger Details:</h3>
                <div>
                    <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="passengerName"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="passengerEmail" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="passengerEmail"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="passengerPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="passengerPhone"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        required
                    />
                </div>

                {bookingError && <p className="text-red-600 text-center font-semibold">{bookingError}</p>}
                {bookingSuccess && <p className="text-green-600 text-center font-semibold">{bookingSuccess}</p>}

                <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg disabled:opacity-50"
                >
                    {bookingLoading ? 'Processing Booking...' : 'Confirm Booking'}
                </button>
            </form>

            <div className="text-center mt-6">
                <button
                    onClick={() => navigate(-1)} // Go back to the previous page (FlightResultsDisplay)
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
                >
                    Back to Flight List
                </button>
            </div>
        </div>
    );
};

export default BookingForm;
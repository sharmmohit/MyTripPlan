import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaRupeeSign, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const FlightBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight, searchParams } = location.state || {};

    const [passengerDetails, setPassengerDetails] = useState(
        Array(searchParams.passengers.adults + searchParams.passengers.children).fill().map(() => ({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: 'Male',
            passportNumber: '',
            nationality: 'Indian'
        }))
    );

    const [contactDetails, setContactDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    const handlePassengerChange = (index, field, value) => {
        const updated = [...passengerDetails];
        updated[index][field] = value;
        setPassengerDetails(updated);
    };

    const handleContactChange = (field, value) => {
        setContactDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the booking data to your backend
        alert('Flight booking confirmed! Redirecting to payment...');
        // navigate('/payment');
    };

    if (!flight) {
        navigate('/');
        return null;
    }

    const calculateTotal = () => {
        const basePrice = 2500; // Base price per passenger
        const classMultipliers = {
            economy: 1,
            premium_economy: 1.5,
            business: 2.5,
            first: 4
        };
        
        const totalPassengers = searchParams.passengers.adults + searchParams.passengers.children;
        const price = basePrice * classMultipliers[searchParams.cabinClass] * totalPassengers;
        
        return Math.round(price * 1.18); // Including 18% tax
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const time = new Date(timeString);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaPlane className="mr-2 text-blue-600" />
                    Confirm Flight Booking
                </h1>

                {/* Flight Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-lg mb-2">
                        {flight.airline?.name} - {flight.flight?.iata}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">From</p>
                            <p className="font-semibold">{searchParams.fromCity}</p>
                            <p>{formatTime(flight.departure?.scheduled)}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">To</p>
                            <p className="font-semibold">{searchParams.toCity}</p>
                            <p>{formatTime(flight.arrival?.scheduled)}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-semibold">{new Date(searchParams.departureDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Class</p>
                            <p className="font-semibold capitalize">{searchParams.cabinClass.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Passenger Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaUser className="mr-2 text-blue-600" />
                            Passenger Details
                        </h3>
                        <div className="space-y-4">
                            {passengerDetails.map((passenger, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-3">
                                        {index < searchParams.passengers.adults ? `Adult ${index + 1}` : `Child ${index - searchParams.passengers.adults + 1}`}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={passenger.firstName}
                                                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="First name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={passenger.lastName}
                                                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Last name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                required
                                                value={passenger.dateOfBirth}
                                                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                value={passenger.gender}
                                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={passenger.passportNumber}
                                                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Passport number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                            <select
                                                value={passenger.nationality}
                                                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            >
                                                <option value="Indian">Indian</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaIdCard className="mr-2 text-blue-600" />
                            Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={contactDetails.fullName}
                                    onChange={(e) => handleContactChange('fullName', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaPhone className="inline mr-1 text-gray-400" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={contactDetails.phone}
                                    onChange={(e) => handleContactChange('phone', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaEnvelope className="inline mr-1 text-gray-400" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={contactDetails.email}
                                    onChange={(e) => handleContactChange('email', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Your email address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={contactDetails.address}
                                    onChange={(e) => handleContactChange('address', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    rows="2"
                                    placeholder="Your complete address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fare Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Fare Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Base Fare ({searchParams.passengers.adults + searchParams.passengers.children} passengers)</span>
                                <span className="flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {calculateTotal() / 1.18}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes & Charges (18%)</span>
                                <span className="flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {calculateTotal() - (calculateTotal() / 1.18)}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total Amount</span>
                                    <span className="flex items-center text-green-700">
                                        <FaRupeeSign className="text-sm" />
                                        {calculateTotal()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
                    >
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FlightBooking;
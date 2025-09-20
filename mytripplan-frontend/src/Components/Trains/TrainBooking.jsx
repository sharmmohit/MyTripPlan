import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrain, FaRupeeSign, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const TrainBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { train, classType, searchParams } = location.state || {};

    const [passengerDetails, setPassengerDetails] = useState(
        Array(searchParams.passengers).fill().map(() => ({
            name: '',
            age: '',
            gender: 'Male',
            berthPreference: 'No Preference'
        }))
    );

    const [contactDetails, setContactDetails] = useState({
        name: '',
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
        alert('Booking confirmed! Redirecting to payment...');
        // navigate('/payment');
    };

    if (!train) {
        navigate('/');
        return null;
    }

    const classNames = {
        '1A': 'First AC',
        '2A': 'Second AC',
        '3A': 'Third AC',
        'SL': 'Sleeper',
        'CC': 'Chair Car'
    };

    const totalFare = train.fare[classType] * searchParams.passengers;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaTrain className="mr-2 text-blue-600" />
                    Confirm Booking
                </h1>

                {/* Train Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-lg mb-2">{train.train_name} ({train.train_number})</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">From</p>
                            <p className="font-semibold">{searchParams.fromStation}</p>
                            <p>{train.departure_time}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">To</p>
                            <p className="font-semibold">{searchParams.toStation}</p>
                            <p>{train.arrival_time}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Class</p>
                            <p className="font-semibold">{classNames[classType]}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-semibold">{new Date(searchParams.departureDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Passenger Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaUser className="mr-2 text-blue-600" />
                            Passenger Details ({searchParams.passengers})
                        </h3>
                        <div className="space-y-4">
                            {passengerDetails.map((passenger, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={passenger.name}
                                                onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                max="100"
                                                value={passenger.age}
                                                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Age"
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Berth Preference</label>
                                            <select
                                                value={passenger.berthPreference}
                                                onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            >
                                                <option value="No Preference">No Preference</option>
                                                <option value="Lower">Lower</option>
                                                <option value="Middle">Middle</option>
                                                <option value="Upper">Upper</option>
                                                <option value="Side Lower">Side Lower</option>
                                                <option value="Side Upper">Side Upper</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={contactDetails.name}
                                    onChange={(e) => handleContactChange('name', e.target.value)}
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
                                <span>Base Fare ({searchParams.passengers} passengers)</span>
                                <span className="flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {totalFare}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes & Charges</span>
                                <span className="flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {Math.round(totalFare * 0.18)}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total Amount</span>
                                    <span className="flex items-center text-green-700">
                                        <FaRupeeSign className="text-sm" />
                                        {totalFare + Math.round(totalFare * 0.18)}
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

export default TrainBooking;
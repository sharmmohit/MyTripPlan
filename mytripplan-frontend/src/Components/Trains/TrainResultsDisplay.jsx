import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrain, FaClock, FaRupeeSign, FaChair, FaArrowLeft } from 'react-icons/fa';

const TrainResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { trains, searchParams } = location.state || { trains: [], searchParams: {} };

    const classNames = {
        '1A': 'First AC',
        '2A': 'Second AC',
        '3A': 'Third AC',
        'SL': 'Sleeper',
        'CC': 'Chair Car',
        'all': 'All Classes'
    };

    const handleBookNow = (train, classType) => {
        navigate('/train-booking', {
            state: {
                train,
                classType,
                searchParams
            }
        });
    };

    if (!trains || trains.length === 0) {
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
                        <FaTrain className="text-gray-400 text-6xl mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Trains Found</h2>
                        <p className="text-gray-600">No trains available for the selected route and date.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Search
                </button>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Train Search Results</h1>
                    <p className="text-gray-600">
                        {searchParams.fromStation} → {searchParams.toStation} • 
                        {new Date(searchParams.departureDate).toLocaleDateString()} • 
                        {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {trains.map((train, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Train Info */}
                                <div>
                                    <h3 className="font-bold text-lg text-blue-800">{train.train_name}</h3>
                                    <p className="text-sm text-gray-600">Train No: {train.train_number}</p>
                                    <div className="flex items-center mt-2 text-sm text-gray-600">
                                        <FaClock className="mr-1" />
                                        {train.duration}
                                    </div>
                                </div>

                                {/* Timing */}
                                <div>
                                    <div className="text-center">
                                        <p className="font-semibold text-lg">{train.departure_time}</p>
                                        <p className="text-sm text-gray-600">{searchParams.fromStation}</p>
                                    </div>
                                    <div className="text-center my-2">
                                        <div className="w-full h-px bg-gray-300 relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FaTrain className="text-blue-600 bg-white p-1" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">{train.duration}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-lg">{train.arrival_time}</p>
                                        <p className="text-sm text-gray-600">{searchParams.toStation}</p>
                                    </div>
                                </div>

                                {/* Fare & Booking */}
                                <div>
                                    <div className="space-y-2">
                                        {Object.entries(train.fare || {}).map(([classType, fare]) => (
                                            <div key={classType} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm font-medium">
                                                    {classNames[classType]}
                                                </span>
                                                <div className="flex items-center">
                                                    <FaRupeeSign className="text-green-600 text-sm" />
                                                    <span className="font-bold text-green-700">{fare}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleBookNow(train, classType)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainResults;
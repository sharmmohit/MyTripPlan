// src/components/TrainResultsDisplay.jsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for the BOOK NOW button

const TrainResultsDisplay = ({ trainSearchResults, onBackToSearch, searchParams }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Helper to format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', "'");
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${formattedDate} ${weekday}`;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Back button and search summary */}
      <div className="mb-6">
        <button
          onClick={onBackToSearch} // This prop comes from TrainResultsPage
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Modify Search
        </button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Train Search Results</h2>
              <p className="text-sm text-gray-600">
                {searchParams?.fromStation?.city} ({searchParams?.fromStation?.code}) → {searchParams?.toStation?.city} ({searchParams?.toStation?.code})
              </p>
            </div>
            <div className="text-sm text-gray-700">
              <p>Journey Date: {formatDisplayDate(searchParams?.travelDate)}</p>
              <p>Class: {searchParams?.trainClass === 'ALL' ? 'All Classes' : searchParams?.trainClass}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      {/* Defensive check: Ensure trainSearchResults is an array before accessing length */}
      {(trainSearchResults || []).length > 0 ? (
        <div className="space-y-4">
          {trainSearchResults.map((train) => (
            <div key={train.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-2 md:mb-0 md:w-1/4 text-center md:text-left">
                  <p className="text-lg font-semibold text-gray-900">{train.trainName}</p>
                  <p className="text-sm text-gray-600">#{train.trainNumber}</p>
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-xl font-bold text-blue-600">{train.departureTime}</p>
                  <p className="text-sm text-gray-600">{train.departureStationCode}</p> {/* Use departureStationCode */}
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-sm text-gray-500">{train.duration}</p>
                  <p className="text-xs text-gray-500">→</p>
                </div>
                <div className="mb-2 md:mb-0 md:w-1/4 text-center">
                  <p className="text-xl font-bold text-blue-600">{train.arrivalTime}</p>
                  <p className="text-sm text-gray-600">{train.arrivalStationCode}</p> {/* Use arrivalStationCode */}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Available Classes:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(train.classes || {}).map(([clsCode, clsDetails]) => (
                        <span
                          key={clsCode}
                          className={`px-2 py-1 text-xs rounded ${searchParams.trainClass === clsCode || searchParams.trainClass === 'ALL' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {clsCode} (₹{clsDetails.price})
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    onClick={() => navigate('/booking', { state: { train, searchParams } })}
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">No trains found for your search criteria.</p>
          <button
            onClick={onBackToSearch} // This prop comes from TrainResultsPage
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Modify Search
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainResultsDisplay;

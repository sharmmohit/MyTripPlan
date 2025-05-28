// src/components/TravellersClassSelector.jsx
import React from 'react';

const TravellersClassSelector = ({ passengers, setPassengers, cabinClass, setCabinClass, onClose }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-6 z-20 w-80 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Travellers</h3>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300 transition"
          >
            -
          </button>
          <span className="text-xl font-bold text-blue-600">{passengers}</span>
          <button
            type="button"
            onClick={() => setPassengers(passengers + 1)}
            className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold hover:bg-blue-700 transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="cabinClassSelector" className="block text-lg font-semibold text-gray-800 mb-2">Cabin Class</label>
        <select
          id="cabinClassSelector"
          className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value)}
        >
          <option value="economy">Economy</option>
          <option value="premium-economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First Class</option>
        </select>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TravellersClassSelector;
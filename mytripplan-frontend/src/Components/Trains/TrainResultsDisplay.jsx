import React from "react";

const TrainResultsDisplay = ({ trains }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">
        Available Trains
      </h3>
      <div className="grid gap-4">
        {trains.map((train, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition border"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-blue-700">
                  {train.trainName} ({train.trainNumber})
                </h4>
                <p className="text-gray-600">
                  {train.fromStation?.name} ({train.fromStation?.code}) →{" "}
                  {train.toStation?.name} ({train.toStation?.code})
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {train.duration || "Duration not available"}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-700">
              <p>
                Departure:{" "}
                <span className="font-semibold">
                  {train.fromStd || "N/A"}
                </span>
              </p>
              <p>
                Arrival:{" "}
                <span className="font-semibold">
                  {train.toStd || "N/A"}
                </span>
              </p>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>Running Days: {train.runDays?.join(", ") || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainResultsDisplay;


import React from 'react';


const TrainDisplay = ({ trains }) => {
  return (
    <div className="train-display">
      <h3>Available Trains</h3>
      <div className="train-cards">
        {trains.map((train, index) => (
          <div className="train-card" key={index}>
            <h4>{train.train_name} ({train.train_number})</h4>
            <p><strong>Departure:</strong> {train.from_std} from {train.from_station_name}</p>
            <p><strong>Arrival:</strong> {train.to_sta} at {train.to_station_name}</p>
            <p><strong>Travel Time:</strong> {train.travel_time}</p>
            <p><strong>Running Days:</strong> {train.run_days.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainDisplay;

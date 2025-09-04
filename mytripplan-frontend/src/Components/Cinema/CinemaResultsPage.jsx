import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaChair, FaMoneyBillWave, FaStar } from 'react-icons/fa';

const CinemaResultsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Sample data structure (will be replaced with actual state from navigation)
  const cinemaData = state || {
    location: "Mumbai",
    movie: "Kalki 2898 AD",
    date: "2025-05-30",
    cinema: "PVR Phoenix Marketcity",
    cinemas: [
      {
        name: "PVR Phoenix Marketcity",
        address: "LBS Marg, Kurla West, Mumbai",
        distance: "2.5 km",
        rating: 4.3,
        timings: [
          { time: "10:00 AM", type: "Standard", price: 250 },
          { time: "01:30 PM", type: "Premium", price: 350 },
          { time: "04:45 PM", type: "Recliner", price: 500 },
          { time: "08:00 PM", type: "Standard", price: 250 },
          { time: "11:15 PM", type: "Premium", price: 350 }
        ],
        facilities: ["Dolby Atmos", "4K Projection", "Food Court"]
      },
      {
        name: "INOX R-City Mall",
        address: "LBS Marg, Ghatkopar West, Mumbai",
        distance: "4.2 km",
        rating: 4.1,
        timings: [
          { time: "10:30 AM", type: "Standard", price: 230 },
          { time: "02:00 PM", type: "Premium", price: 330 },
          { time: "05:15 PM", type: "Standard", price: 230 },
          { time: "08:30 PM", type: "Recliner", price: 480 }
        ],
        facilities: ["3D", "IMAX", "Café"]
      }
    ]
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{cinemaData.movie}</h1>
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                {cinemaData.location} • {formatDate(cinemaData.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Cinema Cards */}
        {cinemaData.cinemas.map((cinema, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Cinema Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">{cinema.name}</h2>
                  <p className="text-gray-600 text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {cinema.address} • {cinema.distance} away
                  </p>
                </div>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{cinema.rating}</span>
                </div>
              </div>
              
              {/* Facilities */}
              <div className="mt-2 flex flex-wrap gap-2">
                {cinema.facilities.map((facility, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Show Times */}
            <div className="p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <FaClock className="mr-2 text-gray-500" />
                Available Showtimes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {cinema.timings.map((show, idx) => (
                  <div 
                    key={idx} 
                    className="border rounded-lg p-3 hover:border-blue-400 cursor-pointer transition-colors"
                    onClick={() => navigate('/booking', { state: { ...cinemaData, cinema, show } })}
                  >
                    <div className="font-bold text-center">{show.time}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <FaChair className="mr-1" />
                        {show.type}
                      </span>
                      <span className="text-sm font-medium flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        ₹{show.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Movie Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">About the Movie</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 bg-gray-200 aspect-[2/3] rounded-lg flex items-center justify-center text-gray-400">
              Movie Poster
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700 mb-4">
                In a dystopian future, Kalki, a mysterious warrior with extraordinary powers, 
                emerges as humanity's last hope against tyrannical forces. This epic sci-fi 
                adventure blends Indian mythology with futuristic technology in a visually 
                stunning narrative.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">Genre</h4>
                  <p>Sci-Fi, Action</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Duration</h4>
                  <p>2h 48m</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Language</h4>
                  <p>Hindi (Dubbed)</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Rating</h4>
                  <p>UA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaResultsPage;
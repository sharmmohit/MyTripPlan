import React, { useState, useEffect } from 'react';
// Assuming LoginSignup.jsx is in src/components/LoginSignup.jsx
import LoginSignup from './LoginSignup';

// Main Home component for MyTripPlan
const Home = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('round-trip');
  const [fareType, setFareType] = useState('regular');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null); // State to store logged-in user info

  // Check for existing token/user on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
      }
    }
  }, []);

  // Callback function for successful login/signup from LoginSignup component
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false); // Close modal on successful login/signup
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    alert('Logged out successfully!'); // Will replace with custom modal later
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'flights':
        return <PlaceholderTab title="Flights" />;
      case 'hotels':
        return <PlaceholderTab title="Hotels" />;
      case 'trains':
        return <PlaceholderTab title="Trains" />;
      case 'buses':
        return <PlaceholderTab title="Buses" />;
      case 'cabs':
        return <PlaceholderTab title="Cabs" />;
      case 'cinema':
        return <PlaceholderTab title="Cinema" />;
      case 'tour-packages':
        return <PlaceholderTab title="Tour Packages" />;
      default:
        return <PlaceholderTab title="Flights" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md py-3 px-6 md:px-12 relative z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          {/* MyTripPlan Logo with animated icon */}
          <div className="flex items-center">
            {/* Animated bag icon */}
            <span className="text-4xl mr-2 animate-pulse">💼</span>
            <span className="text-4xl font-extrabold text-blue-600 tracking-tighter mr-1">My</span>
            <span className="text-4xl font-extrabold text-orange-500 tracking-tighter">TripPlan</span>
          </div>

          {/* Right-side Navigation - Simplified */}
          <nav className="flex items-center space-x-4 text-gray-700 text-sm mt-2 md:mt-0">
            {user ? (
              <>
                <span className="font-semibold text-base">Hi, {user.firstName || user.email}!</span> {/* Display email if first name not set */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <span className="text-xl mb-1">👤</span>
                <span className="font-semibold text-xs md:text-sm">Login or Create Account</span>
              </button>
            )}
            
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8 -mt-16 md:-mt-12 relative z-0">
        {/* Booking Tabs and Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-16 md:mt-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start border-b border-gray-200 pb-4 mb-6">
            <TabButton label="Flights" icon="✈️" isActive={activeTab === 'flights'} onClick={() => setActiveTab('flights')} />
            <TabButton label="Hotels" icon="🏨" isActive={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
            <TabButton label="Trains" icon="🚆" isActive={activeTab === 'trains'} onClick={() => setActiveTab('trains')} />
            <TabButton label="Buses" icon="🚌" isActive={activeTab === 'buses'} onClick={() => setActiveTab('buses')} />
            <TabButton label="Cabs" icon="🚕" isActive={activeTab === 'cabs'} onClick={() => setActiveTab('cabs')} />
            <TabButton label="Cinema" icon="🎬" isActive={activeTab === 'cinema'} onClick={() => setActiveTab('cinema')} />
            <TabButton label="Tour Packages" icon="🌍" isActive={activeTab === 'tour-packages'} onClick={() => setActiveTab('tour-packages')} />
          </div>

          {/* Render content based on active tab */}
          {renderTabContent()}
        </div>

        {/* Explore More Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Explore More</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ExploreCard icon="📍" title="Where2Go" description="Discover new destinations" />
            <ExploreCard icon="🛡️" title="Insurance" description="For International Trips" />
            <ExploreCard icon="🌍" title="Explore International Flights" description="Cheapest Flights to Paris, Bali, Tokyo & more" />
            <ExploreCard icon="🤝" title="MICE" description="Offsites, Events & Meetings" />
            <ExploreCard icon="💳" title="Gift Cards" description="Give the gift of travel" />
          </div>
        </section>

        {/* Featured Sections / Promotions (Placeholder) */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Exclusive Flight Deals" description="Find the best prices for your next adventure." />
          <Card title="Luxury Hotel Stays" description="Book your dream vacation with top-rated hotels." />
          <Card title="Exciting Tour Packages" description="Explore new destinations with curated packages." />
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 px-6 md:px-12">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MyTripPlan. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-blue-400 mx-2">Privacy Policy</a> |
            <a href="#" className="hover:text-blue-400 mx-2">Terms of Service</a> |
            <a href="#" className="hover:text-blue-400 mx-2">Contact Us</a>
          </p>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      {isAuthModalOpen && (
        <LoginSignup
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

// Reusable Components (defined here for simplicity, could be separate files)

const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out text-center
      ${isActive
        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-bold'
        : 'text-gray-700 hover:bg-gray-100'
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
    onClick={onClick}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const TripTypeButton = ({ id, label, value, currentType, onChange }) => (
  <>
    <input
      type="radio"
      id={id}
      name="trip-type"
      value={value}
      checked={currentType === value}
      onChange={onChange}
      className="hidden"
    />
    <label
      htmlFor={id}
      className={`px-5 py-2 rounded-full font-medium cursor-pointer transition-colors duration-200
        ${currentType === value
          ? 'bg-blue-500 text-white shadow'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
      {label}
    </label>
  </>
);

const SearchInput = ({ label, id, placeholder, defaultValue, description, icon }) => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative group cursor-pointer">
    <label htmlFor={id} className="block text-xs font-semibold text-blue-700 mb-1">{label}</label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full bg-transparent text-lg font-bold text-gray-800 focus:outline-none placeholder-gray-400"
      required
    />
    <span className="block text-xs text-gray-500 mt-1">{description}</span>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors">{icon}</span>
  </div>
);

const DateInput = ({ label, id, value, onChange, min }) => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative group cursor-pointer">
    <label htmlFor={id} className="block text-xs font-semibold text-blue-700 mb-1">{label}</label>
    <input
      type="date"
      id={id}
      className="w-full bg-transparent text-lg font-bold text-gray-800 focus:outline-none appearance-none"
      value={value}
      onChange={onChange}
      min={min}
      required
    />
    <span className="block text-xs text-gray-500 mt-1">
      {value ? new Date(value).toLocaleDateString('en-US', { weekday: 'long' }) : 'Select Date'}
    </span>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors">🗓️</span>
  </div>
);

const FareOption = ({ label, value, currentFare, setFare, description }) => (
  <label htmlFor={`fare-${value}`} className="flex items-center cursor-pointer">
    <input
      type="radio"
      id={`fare-${value}`}
      name="fare-type"
      value={value}
      checked={currentFare === value}
      onChange={() => setFare(value)}
      className="hidden"
    />
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
      ${currentFare === value ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white'}`}>
      {currentFare === value && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
    </div>
    <div className="ml-2">
      <span className="block text-sm font-medium text-gray-800">{label}</span>
      <span className="block text-xs text-gray-500">{description}</span>
    </div>
  </label>
);

const PlaceholderTab = ({ title }) => (
  <div className="p-4 text-center text-gray-600 text-lg min-h-[200px] flex items-center justify-center flex-col">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} Booking</h2>
    <p>Functionality for {title} booking will be implemented soon!</p>
    <p className="mt-2 text-sm">Stay tuned for exciting updates.</p>
  </div>
);

const ExploreCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer">
    <span className="text-3xl mb-2">{icon}</span>
    <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const Card = ({ title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full transition duration-300">
      Learn More
    </button>
  </div>
);

// FlightSearchTab is now a separate component, so it needs to be exported from here
// and imported into Home.jsx if it were in a separate file.
// Since it's defined within Home.jsx, it's fine.
// However, if you want to move it out, you'd export it and import it.
// For now, it's passed props correctly.

export default Home;

import React, { useState, useEffect } from 'react';
import LoginSignup from './LoginSignup';
import FlightSearchTab from './FlightSearchTab';
import TrainSearchTab from './TrainSearchTab';
import BusSearchTab from './BusSearchTab';
import CabSearchTab from './CabSearchTab';

const Home = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('round-trip');
  const [fareType, setFareType] = useState('regular');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearchTab />;
      case 'hotels':
        return <PlaceholderTab title="Hotels" />;
      case 'trains':
        return <TrainSearchTab />;
      case 'buses':
        return <BusSearchTab />;
      case 'cabs':
        return <CabSearchTab />;
      case 'cinema':
        return <PlaceholderTab title="Cinema" />;
      case 'tour-packages':
        return <PlaceholderTab title="Tour Packages" />;
      default:
        return <PlaceholderTab title="Flights" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md py-3 px-6 md:px-12 relative z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <span className="text-4xl mr-2 animate-pulse">💼</span>
            <span className="text-4xl font-extrabold text-blue-600 tracking-tighter mr-1">My</span>
            <span className="text-4xl font-extrabold text-orange-500 tracking-tighter">TripPlan</span>
          </div>

          <nav className="flex items-center space-x-4 text-gray-700 text-sm mt-2 md:mt-0">
            {user ? (
              <>
                <span className="font-semibold text-base">Hi, {user.firstName || user.email}!</span>
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
          <div className="flex flex-wrap gap-2 justify-center md:justify-start border-b border-gray-200 pb-4 mb-6">
            <TabButton label="Flights" icon="✈️" isActive={activeTab === 'flights'} onClick={() => setActiveTab('flights')} />
            <TabButton label="Hotels" icon="🏨" isActive={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
            <TabButton label="Trains" icon="🚆" isActive={activeTab === 'trains'} onClick={() => setActiveTab('trains')} />
            <TabButton label="Buses" icon="🚌" isActive={activeTab === 'buses'} onClick={() => setActiveTab('buses')} />
            <TabButton label="Cabs" icon="🚕" isActive={activeTab === 'cabs'} onClick={() => setActiveTab('cabs')} />
            <TabButton label="Cinema" icon="🎬" isActive={activeTab === 'cinema'} onClick={() => setActiveTab('cinema')} />
            <TabButton label="Tour Packages" icon="🌍" isActive={activeTab === 'tour-packages'} onClick={() => setActiveTab('tour-packages')} />
          </div>

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

        {/* Featured Sections */}
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

// Reusable Components
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

export default Home;
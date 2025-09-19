import React, { useState, useEffect } from 'react';
import { FaPlane, FaHotel, FaTrain, FaBus, FaTaxi, FaFilm, FaTicketAlt, FaGlobeAmericas, FaMapMarkerAlt, FaShieldAlt, FaGift, FaUser, FaBars, FaHome, FaSuitcase, FaPercent, FaUserCircle, FaWallet, FaCog, FaCreditCard, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import FlightSearchTab from './Flights/FlightSearchTab';
import TrainSearchTab from './Trains/TrainSearchTab';
import BusSearchTab from './Buses/BusSearchTab';
import CabSearchTab from './Cabs/CabSearchTab';
import CinemaSearchTab from './Cinema/CinemaSearchTab';
import HotelSearchTab from './HotelSearchTab';
import HotelSearch from './HotelSearch';
import Login from './Login';
import AccountPage from './AccountPage'; // New component for account page

const Home = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('round-trip');
  const [fareType, setFareType] = useState('regular');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mobileBottomNav, setMobileBottomNav] = useState('home');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setShowWelcomeBanner(true);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setShowWelcomeBanner(true);
  };
  
  const handleMyTickets = () => {
    alert('My Tickets functionality will be implemented soon!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileBottomNav('home');
    setShowAccountPage(false);
    alert('Logged out successfully!');
  };

  const handleMobileBottomNav = (navItem) => {
    setMobileBottomNav(navItem);
    
    switch(navItem) {
      case 'home':
        setShowAccountPage(false);
        window.scrollTo(0, 0);
        break;
      case 'trips':
        alert('My Trips functionality will be implemented soon!');
        break;
      case 'offers':
        alert('Offers functionality will be implemented soon!');
        break;
      case 'account':
        if (user) {
          setShowAccountPage(true);
        } else {
          setIsAuthModalOpen(true);
        }
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearchTab />;
      case 'hotels':
        return <HotelSearch/>;
      case 'trains':
        return <TrainSearchTab />;
      case 'buses':
        return <BusSearchTab />;
      case 'cabs':
        return <CabSearchTab />;
      case 'cinema':
        return <CinemaSearchTab />;
      case 'tour-packages':
        return <PlaceholderTab title="Tour Packages" />;
      default:
        return <PlaceholderTab title="Flights" />;
    }
  };

  // If account page is shown, render only the account page
  if (showAccountPage && user) {
    return <AccountPage user={user} onLogout={handleLogout} onBack={() => setShowAccountPage(false)} />;
  }

  return (
    <div className="min-h-screen font-sans antialiased flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 pb-16 md:pb-0">
      {/* Header Section - Changed to white background */}
      <header className="bg-white shadow-sm py-3 px-4 md:px-6 lg:px-12 relative z-20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo on left side */}
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tighter mr-1">Travel</span>
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500 tracking-tighter">Trip</span>
          </div>

          {/* Right side navigation */}
          <nav className="flex items-center space-x-4">
            <button
              onClick={handleMyTickets}
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200 font-medium text-xs md:text-sm"
            >
              <FaTicketAlt className="mr-1 md:mr-2" />
              <span className="font-semibold hidden md:block">My Tickets</span>
            </button>
            {!user && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 font-medium shadow-sm text-xs md:text-sm"
              >
                <FaUser className="mr-1 md:mr-2" />
                <span className="font-semibold">Login</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Welcome Banner */}
      {showWelcomeBanner && user && (
        <div className="bg-blue-600 text-white p-3 md:p-4 relative">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm md:text-base">
              Welcome to Travel Trip, {user.name || user.email}!
            </p>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Toggle - Simplified */}
      <div className="md:hidden bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="text-xl" />
          </button>
          
          {/* Visible travel categories */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('flights')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeTab === 'flights' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Flights
            </button>
            <button
              onClick={() => setActiveTab('trains')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeTab === 'trains' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Trains
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white shadow-lg py-3 px-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <MobileNavButton 
              label="Hotels" 
              icon={<FaHotel className="text-blue-600" size={16} />} 
              isActive={activeTab === 'hotels'} 
              onClick={() => { setActiveTab('hotels'); setIsMobileNavOpen(false); }} 
            />
            <MobileNavButton 
              label="Buses" 
              icon={<FaBus className="text-blue-600" size={16} />} 
              isActive={activeTab === 'buses'} 
              onClick={() => { setActiveTab('buses'); setIsMobileNavOpen(false); }} 
            />
            <MobileNavButton 
              label="Cabs" 
              icon={<FaTaxi className="text-blue-600" size={16} />} 
              isActive={activeTab === 'cabs'} 
              onClick={() => { setActiveTab('cabs'); setIsMobileNavOpen(false); }} 
            />
            <MobileNavButton 
              label="Cinema" 
              icon={<FaFilm className="text-blue-600" size={16} />} 
              isActive={activeTab === 'cinema'} 
              onClick={() => { setActiveTab('cinema'); setIsMobileNavOpen(false); }} 
            />
            <MobileNavButton 
              label="Tours" 
              icon={<FaGlobeAmericas className="text-blue-600" size={16} />} 
              isActive={activeTab === 'tour-packages'} 
              onClick={() => { setActiveTab('tour-packages'); setIsMobileNavOpen(false); }} 
            />
          </div>
        </div>
      )}

      {/* Travel Icons Navigation - Desktop */}
      <div className="hidden md:block bg-white shadow-md py-3 md:py-4 px-2 md:px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="grid grid-cols-7 gap-1 md:gap-2 w-full max-w-5xl">
              <NavTabButton 
                label="Flights" 
                icon={<FaPlane className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'flights'} 
                onClick={() => setActiveTab('flights')} 
              />
              <NavTabButton 
                label="Hotels" 
                icon={<FaHotel className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'hotels'} 
                onClick={() => setActiveTab('hotels')} 
              />
              <NavTabButton 
                label="Trains" 
                icon={<FaTrain className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'trains'} 
                onClick={() => setActiveTab('trains')} 
              />
              <NavTabButton 
                label="Buses" 
                icon={<FaBus className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'buses'} 
                onClick={() => setActiveTab('buses')} 
              />
              <NavTabButton 
                label="Cabs" 
                icon={<FaTaxi className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'cabs'} 
                onClick={() => setActiveTab('cabs')} 
              />
              <NavTabButton 
                label="Cinema" 
                icon={<FaFilm className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'cinema'} 
                onClick={() => setActiveTab('cinema')} 
              />
              <NavTabButton 
                label="Tours" 
                icon={<FaGlobeAmericas className="mx-auto text-blue-600 group-hover:text-orange-500 transition-colors duration-300" size={18} />} 
                isActive={activeTab === 'tour-packages'} 
                onClick={() => setActiveTab('tour-packages')} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-3 md:px-4 py-6 md:py-8 relative z-0">
        {/* Booking Tabs and Search Form */}
        <div className="bg-transparent rounded-xl mb-6 md:mb-8">
          {renderTabContent()}
        </div>

        {/* Explore More Section */}
        <section className="rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Explore More</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <ExploreCard 
              icon={<FaMapMarkerAlt className="text-blue-600 group-hover:text-orange-500 transition-colors duration-300" />} 
              title="Where2Go" 
              description="Discover new destinations" 
            />
            <ExploreCard 
              icon={<FaShieldAlt className="text-blue-600 group-hover:text-orange-500 transition-colors duration-300" />} 
              title="Insurance" 
              description="For International Trips" 
            />
            <ExploreCard 
              icon={<FaPlane className="text-blue-600 group-hover:text-orange-500 transition-colors duration-300" />} 
              title="International Flights" 
              description="Cheapest Flights worldwide" 
            />
            <ExploreCard 
              icon={<HiOutlineOfficeBuilding className="text-blue-600 group-hover:text-orange-500 transition-colors duration-300" />} 
              title="MICE" 
              description="Offsites & Meetings" 
            />
            <ExploreCard 
              icon={<FaGift className="text-blue-600 group-hover:text-orange-500 transition-colors duration-300" />} 
              title="Gift Cards" 
              description="Give the gift of travel" 
            />
          </div>
        </section>

        {/* Featured Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card 
            title="Exclusive Flight Deals" 
            description="Find the best prices for your next adventure." 
            icon={<FaPlane className="text-blue-600 mb-3 md:mb-4 group-hover:text-orange-500 transition-colors duration-300" />}
          />
          <Card 
            title="Luxury Hotel Stays" 
            description="Book your dream vacation with top-rated hotels." 
            icon={<FaHotel className="text-blue-600 mb-3 md:mb-4 group-hover:text-orange-500 transition-colors duration-300" />}
          />
          <Card 
            title="Exciting Tour Packages" 
            description="Explore new destinations with curated packages." 
            icon={<FaGlobeAmericas className="text-blue-600 mb-3 md:mb-4 group-hover:text-orange-500 transition-colors duration-300" />}
          />
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 gap-1 py-2">
          <MobileBottomNavButton 
            icon={<FaHome size={18} className="text-gray-600" />}
            label="Home"
            isActive={mobileBottomNav === 'home'}
            onClick={() => handleMobileBottomNav('home')}
          />
          <MobileBottomNavButton 
            icon={<FaSuitcase size={18} className="text-gray-600" />}
            label="My Trips"
            isActive={mobileBottomNav === 'trips'}
            onClick={() => handleMobileBottomNav('trips')}
          />
          <MobileBottomNavButton 
            icon={<FaPercent size={18} className="text-gray-600" />}
            label="Offers"
            isActive={mobileBottomNav === 'offers'}
            onClick={() => handleMobileBottomNav('offers')}
          />
          <MobileBottomNavButton 
            icon={<FaUserCircle size={18} className="text-gray-600" />}
            label="Account"
            isActive={mobileBottomNav === 'account'}
            onClick={() => handleMobileBottomNav('account')}
          />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 md:py-6 px-4 md:px-6 lg:px-12 mt-6 md:mt-8">
        <div className="container mx-auto text-center text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} TravelTrip. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-blue-400 mx-1 md:mx-2 transition-colors duration-300">Privacy Policy</a> |
            <a href="#" className="hover:text-blue-400 mx-1 md:mx-2 transition-colors duration-300">Terms of Service</a> |
            <a href="#" className="hover:text-blue-400 mx-1 md:mx-2 transition-colors duration-300">Contact Us</a>
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {isAuthModalOpen && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

// Reusable Components
const NavTabButton = ({ label, icon, isActive, onClick }) => (
  <button
    className={`group flex flex-col items-center space-y-1 px-1.5 py-2 md:px-2 md:py-3 rounded-lg transition-all duration-300 ease-in-out text-center
      ${isActive
        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-bold'
        : 'text-gray-700 hover:bg-gray-100'
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
    onClick={onClick}
  >
    <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 mx-auto">
      {icon}
    </span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ label, icon, isActive, onClick }) => (
  <button
    className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 text-sm
      ${isActive
        ? 'bg-blue-100 text-blue-700 font-medium'
        : 'text-gray-700 hover:bg-gray-100'
      }`}
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const MobileBottomNavButton = ({ icon, label, isActive, onClick }) => (
  <button
    className={`flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-lg mx-1
      ${isActive
        ? 'text-blue-600 font-medium'
        : 'text-gray-600'
      }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const PlaceholderTab = ({ title }) => (
  <div className="p-4 text-center text-gray-600 text-base md:text-lg min-h-[180px] md:min-h-[200px] flex items-center justify-center flex-col bg-white rounded-xl shadow-md mt-4">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">{title} Booking</h2>
    <p className="text-sm md:text-base">Functionality for {title} booking will be implemented soon!</p>
    <p className="mt-2 text-xs md:text-sm">Stay tuned for exciting updates.</p>
  </div>
);

const ExploreCard = ({ icon, title, description }) => (
  <div className="group flex flex-col items-center text-center p-3 md:p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer">
    <div className="mb-1.5 md:mb-2">{icon}</div>
    <h4 className="text-xs md:text-sm font-semibold text-gray-800">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

const Card = ({ title, description, icon }) => (
  <div className="group bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
    {icon}
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{description}</p>
    <button className="mt-auto bg-blue-500 hover:bg-orange-500 text-white font-medium py-1.5 px-3 md:py-2 md:px-4 rounded-full transition-all duration-300 text-xs md:text-sm">
      Learn More
    </button>
  </div>
);

export default Home;
import React from 'react';
import { FaWallet, FaCog, FaCreditCard, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

const AccountPage = ({ user, onLogout, onBack }) => {
  const AccountOption = ({ icon, title, onClick, isSignOut = false }) => (
    <div 
      className="flex items-center p-5 bg-white rounded-lg shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md mb-3"
      onClick={onClick}
    >
      <div className="mr-4 text-xl text-blue-600">{icon}</div>
      <div className="flex-1">
        <h3 className={`font-semibold ${isSignOut ? 'text-red-700' : 'text-gray-800'}`}>
          {title}
        </h3>
      </div>
      <div className="text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Account</h1>
        </div>
      </div>

      {/* Welcome Message Box */}
      <div className="container mx-auto p-4">
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-2xl font-bold mb-2">HELLO Tourist!</h2>
          <p className="text-blue-100">{user?.email}</p>
        </div>

        {/* Account Options */}
        <div className="space-y-3">
          <AccountOption 
            icon={<FaWallet />}
            title="Wallet"
            onClick={() => alert('Wallet functionality coming soon!')}
          />
          
          <AccountOption 
            icon={<FaCog />}
            title="Settings"
            onClick={() => alert('Settings functionality coming soon!')}
          />
          
          <AccountOption 
            icon={<FaCreditCard />}
            title="Payment Options"
            onClick={() => alert('Payment options functionality coming soon!')}
          />
          
          <AccountOption 
            icon={<FaSignOutAlt />}
            title="Sign Out"
            onClick={onLogout}
            isSignOut
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
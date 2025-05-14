import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-r from-blue-900 to-indigo-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundBlendMode: "overlay"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-lg">
              Your one-stop marketplace for all types of vehicles: cars, motorcycles, 
              trucks, boats, and more.
            </p>
            
            <SearchBar className="mb-8" />
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/search?type=Car" 
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors"
              >
                Cars
              </Link>
              <Link 
                to="/search?type=Motorcycle" 
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors"
              >
                Motorcycles
              </Link>
              <Link 
                to="/search?type=Truck" 
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors"
              >
                Trucks
              </Link>
              <Link 
                to="/search?type=Boat" 
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors"
              >
                Boats
              </Link>
              <Link 
                to="/search?type=RV" 
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors"
              >
                RVs
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Why Choose Us?</h2>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>Verified vehicles with detailed history reports</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>Direct contact with sellers - no middlemen</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>The largest selection of vehicles in the market</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>Secure transactions and fraud protection</span>
                </li>
              </ul>
              <Link 
                to="/search" 
                className="block text-center mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#f9fafb" 
            fillOpacity="1" 
            d="M0,64L80,80C160,96,320,128,480,122.7C640,117,800,75,960,53.3C1120,32,1280,32,1360,32L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
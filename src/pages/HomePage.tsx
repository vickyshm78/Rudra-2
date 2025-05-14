import React, { useState } from 'react';
import Hero from '../components/common/Hero';
import CategorySection from '../components/common/CategorySection';
import VehicleCard from '../components/common/VehicleCard';
import { getFeaturedVehicles, getVehiclesByType } from '../data/mockData';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, DollarSign, Star, MessageSquare, TrendingUp, Award, PenTool as Tool, ThumbsUp, MapPin, Search, Calendar, Activity, CheckCircle, Car, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const featuredVehicles = getFeaturedVehicles();
  const cars = getVehiclesByType('Car').slice(0, 4);
  
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?query=${searchQuery}&type=${selectedType}`;
  };
  
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Quick Search Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
              Quick Vehicle Search
            </h2>
            <form onSubmit={handleQuickSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Car">Cars</option>
                <option value="SUV">SUVs</option>
                <option value="Truck">Trucks</option>
                <option value="Motorcycle">Motorcycles</option>
              </select>
              <button
                type="submit"
                className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Category Section */}
      <CategorySection />
      
      {/* Featured Listings */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Vehicles</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Handpicked premium listings from our marketplace</p>
            </div>
            <Link 
              to="/search?featured=true" 
              className="flex items-center text-blue-800 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredVehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                featured={true} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Cars */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Cars</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Explore the newest additions to our inventory</p>
            </div>
            <Link 
              to="/search?type=Car" 
              className="flex items-center text-blue-800 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all cars
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-blue-800 dark:bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trust the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-blue-200">Completed Sales</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-200">User Rating</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Why Choose 99CarMart</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            We provide the best vehicle marketplace experience with features designed to make buying and selling easy
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Secure Transactions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every transaction is protected with advanced security measures and buyer protection
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Tool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Vehicle Inspection</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Professional inspection services available for peace of mind
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Quality Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All listings are verified and meet our high-quality standards
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Success Stories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Success Stories</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            See what our satisfied users have to say about their experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold dark:text-white">Robert Johnson</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Found my dream car in just two days! The search filters made it incredibly easy to find exactly what I was looking for."
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold dark:text-white">Sarah Williams</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Sold my motorcycle within a week! The process was seamless and I got a great price."
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold dark:text-white">David Chen</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "The vehicle comparison tool helped me make an informed decision. Couldn't be happier with my purchase!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Download App Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Get the 99CarMart App</h2>
              <p className="text-xl text-blue-200 mb-8">
                Search, buy, and sell vehicles on the go. Download our mobile app for a better experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Download for iOS
                </button>
                <button className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Download for Android
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg" 
                alt="Mobile App" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Stay Updated</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter for the latest vehicle listings and automotive news
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
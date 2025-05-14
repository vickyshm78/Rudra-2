import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Activity, ChevronLeft, ChevronRight, Star, MessageSquare, Phone, Flag, User, Share2, Heart, Info, Check, Shield, Calculator, PenTool as Tool, Camera } from 'lucide-react';
import { getVehicleById, getSimilarVehicles } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import VehicleCard from '../components/common/VehicleCard';
import TourSection from '../components/tours/TourSection';
import FinancingOptions from '../components/common/FinancingOptions';
import PricingInsights from '../components/common/PricingInsights';
import OwnershipCostCalculator from '../components/common/OwnershipCostCalculator';
import InspectionServices from '../components/common/InspectionServices';
import LoanPreApproval from '../components/common/LoanPreApproval';
import SwipeableGallery from '../components/mobile/SwipeableGallery';
import ShareButtons from '../components/mobile/ShareButtons';
import VinScanner from '../components/mobile/VinScanner';
import LocationBasedListings from '../components/mobile/LocationBasedListings';
import LifecycleTracker from '../components/vehicle/LifecycleTracker';
import MaintenancePredictor from '../components/vehicle/MaintenancePredictor';
import InstantValuation from '../components/common/InstantValuation';
import VehicleHistoryReport from '../components/vehicle/VehicleHistoryReport';
import LoanEmiCalculator from '../components/common/LoanEmiCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import CarInspectionBooking from '../components/services/CarInspectionBooking';
import InsuranceComparison from '../components/services/InsuranceComparison';
import RtoServices from '../components/services/RtoServices';
import CarSubscriptionComponent from '../components/services/CarSubscription';
import AccessoriesMarketplace from '../components/services/AccessoriesMarketplace';
import ExtendedWarranty from '../components/services/ExtendedWarranty';
import DoorstepTestDrive from '../components/services/DoorstepTestDrive';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id || '');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showVinScanner, setShowVinScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const similarVehicles = vehicle ? getSimilarVehicles(vehicle) : [];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleVinScan = (vin: string) => {
    // In a real app, this would fetch vehicle details using the VIN
    console.log('Scanned VIN:', vin);
    setShowVinScanner(false);
  };
  
  if (!vehicle) {
    return (
      <div className="mt-20 py-16 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Vehicle Not Found</h1>
        <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/search" 
          className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Browse Vehicles
        </Link>
      </div>
    );
  }
  
  return (
    <div className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-800">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/search" className="hover:text-blue-800">Search</Link>
            <span className="mx-2">/</span>
            <Link to={`/search?type=${vehicle.type}`} className="hover:text-blue-800">{vehicle.type}s</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{vehicle.make} {vehicle.model}</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos and Details */}
          <div className="lg:col-span-2">
            {/* Title and Price */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{vehicle.year}</span>
                    <span className="mx-2">•</span>
                    <Activity className="h-4 w-4 mr-1" />
                    <span>{vehicle.mileage.toLocaleString()} miles</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vehicle.location.city}, {vehicle.location.state}</span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(vehicle.price)}</p>
                </div>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4">
                  <TabsTrigger value="overview" className="py-3">Overview</TabsTrigger>
                  <TabsTrigger value="services" className="py-3">Value-Added Services</TabsTrigger>
                  <TabsTrigger value="history" className="py-3">History & Reports</TabsTrigger>
                  <TabsTrigger value="finance" className="py-3">Finance & Insurance</TabsTrigger>
                </TabsList>
                
                <div className="p-6">
                  <TabsContent value="overview">
                    {/* Image Gallery - Mobile Optimized */}
                    <div className="mb-6">
                      <SwipeableGallery 
                        images={vehicle.images} 
                        title={vehicle.title} 
                      />
                    </div>

                    {/* Share Buttons */}
                    <div className="mb-6">
                      <ShareButtons 
                        url={window.location.href}
                        title={vehicle.title}
                        description={`Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} on 99CarMart`}
                      />
                    </div>

                    {/* VIN Scanner Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => setShowVinScanner(true)}
                        className="flex items-center justify-center w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-lg transition-colors"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Scan VIN for Vehicle History
                      </button>
                    </div>

                    {/* Virtual Tour Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <h2 className="text-xl font-bold mb-4 dark:text-white">Virtual Tour</h2>
                      <TourSection 
                        images={vehicle.images} 
                        videoUrl={vehicle.videoUrl} 
                        title={vehicle.title} 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Make</p>
                          <p className="font-medium">{vehicle.make}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Model</p>
                          <p className="font-medium">{vehicle.model}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Year</p>
                          <p className="font-medium">{vehicle.year}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Vehicle Type</p>
                          <p className="font-medium">{vehicle.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-medium">{vehicle.condition}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{vehicle.location.city}, {vehicle.location.state}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Listed Date</p>
                          <p className="font-medium">{formatDate(vehicle.createdAt)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">VIN</p>
                          <p className="font-medium">{vehicle.vin}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <h2 className="text-xl font-bold mb-4">Description</h2>
                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {vehicle.description}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <h2 className="text-xl font-bold mb-4">Features</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                        {vehicle.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-600 mr-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Doorstep Test Drive */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <DoorstepTestDrive 
                        vehicleId={vehicle.id}
                        vehicleDetails={{
                          make: vehicle.make,
                          model: vehicle.model,
                          year: vehicle.year,
                          location: {
                            city: vehicle.location.city,
                            state: vehicle.location.state
                          }
                        }}
                      />
                    </div>

                    {/* Vehicle Lifecycle */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <LifecycleTracker vehicleId={vehicle.id} />
                    </div>

                    {/* Maintenance Predictor */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <MaintenancePredictor 
                        vehicleId={vehicle.id}
                        mileage={vehicle.mileage}
                      />
                    </div>

                    {/* Nearby Vehicles */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                      <LocationBasedListings />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="services">
                    {/* Car Inspection Booking */}
                    <div className="mb-6">
                      <CarInspectionBooking 
                        vehicleId={vehicle.id}
                        vehicleLocation={{
                          city: vehicle.location.city,
                          state: vehicle.location.state
                        }}
                      />
                    </div>
                    
                    {/* Accessories Marketplace */}
                    <div className="mb-6">
                      <AccessoriesMarketplace 
                        vehicleDetails={{
                          make: vehicle.make,
                          model: vehicle.model,
                          year: vehicle.year
                        }}
                      />
                    </div>
                    
                    {/* Extended Warranty */}
                    <div className="mb-6">
                      <ExtendedWarranty 
                        vehicleDetails={{
                          make: vehicle.make,
                          model: vehicle.model,
                          year: vehicle.year,
                          mileage: vehicle.mileage,
                          condition: vehicle.condition
                        }}
                      />
                    </div>
                    
                    {/* RTO Services */}
                    <div className="mb-6">
                      <RtoServices 
                        vehicleId={vehicle.id}
                        registrationNumber={vehicle.registrationNumber}
                      />
                    </div>
                    
                    {/* Car Subscription */}
                    <div className="mb-6">
                      <CarSubscriptionComponent 
                        vehicleType={vehicle.type}
                        location={{
                          city: vehicle.location.city,
                          state: vehicle.location.state
                        }}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history">
                    {/* Vehicle History Report */}
                    <div className="mb-6">
                      <VehicleHistoryReport 
                        vehicleId={vehicle.id}
                        vin={vehicle.vin}
                        registrationNumber={vehicle.registrationNumber}
                      />
                    </div>
                    
                    {/* Instant Valuation */}
                    <div className="mb-6">
                      <InstantValuation
                        make={vehicle.make}
                        model={vehicle.model}
                        year={vehicle.year}
                        mileage={vehicle.mileage}
                        condition={vehicle.condition}
                        location={vehicle.location}
                      />
                    </div>
                    
                    {/* Ownership Cost Calculator */}
                    <div className="mb-6">
                      <OwnershipCostCalculator
                        vehiclePrice={vehicle.price}
                        make={vehicle.make}
                        model={vehicle.model}
                        year={vehicle.year}
                        mileage={vehicle.mileage}
                      />
                    </div>
                    
                    {/* Pricing Insights */}
                    <div className="mb-6">
                      <PricingInsights
                        price={vehicle.price}
                        marketAverage={vehicle.price * 0.95}
                        similarListings={[
                          { price: vehicle.price * 0.9, mileage: vehicle.mileage * 1.1, year: vehicle.year - 1 },
                          { price: vehicle.price * 1.05, mileage: vehicle.mileage * 0.9, year: vehicle.year },
                          { price: vehicle.price * 0.95, mileage: vehicle.mileage * 1.05, year: vehicle.year }
                        ]}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="finance">
                    {/* Loan & EMI Calculator */}
                    <div className="mb-6">
                      <LoanEmiCalculator vehiclePrice={vehicle.price} />
                    </div>
                    
                    {/* Insurance Comparison */}
                    <div className="mb-6">
                      <InsuranceComparison 
                        vehicleId={vehicle.id}
                        vehicleDetails={{
                          make: vehicle.make,
                          model: vehicle.model,
                          year: vehicle.year,
                          registrationNumber: vehicle.registrationNumber,
                          value: vehicle.price
                        }}
                      />
                    </div>
                    
                    {/* Loan Pre-Approval */}
                    <div className="mb-6">
                      <LoanPreApproval vehiclePrice={vehicle.price} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div>
            {/* Seller Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-bold mb-4">Seller Information</h2>
              <div className="flex items-center mb-4">
                <img 
                  src={vehicle.seller.avatar} 
                  alt={vehicle.seller.name} 
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <Link 
                    to={`/profile/${vehicle.seller.id}`} 
                    className="font-semibold text-lg hover:text-blue-800"
                  >
                    {vehicle.seller.name}
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span>{vehicle.seller.rating} ({vehicle.seller.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500">Member since {formatDate(vehicle.seller.joinedDate)}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg flex justify-center items-center transition-colors duration-300"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Seller
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg flex justify-center items-center transition-colors duration-300">
                  <Phone className="h-5 w-5 mr-2" />
                  {vehicle.seller.phone}
                </button>
              </div>
              
              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Send a message</h3>
                  <form className="space-y-3">
                    <div>
                      <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Message</label>
                      <textarea
                        id="message"
                        placeholder="Hi, I'm interested in your vehicle..."
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg transition-colors duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex justify-center items-center transition-colors duration-300">
                  <Heart className="h-5 w-5 mr-1" />
                  Save
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex justify-center items-center transition-colors duration-300">
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex justify-center items-center transition-colors duration-300">
                  <Info className="h-5 w-5 mr-1" />
                  Report History
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex justify-center items-center transition-colors duration-300">
                  <Flag className="h-5 w-5 mr-1" />
                  Report Ad
                </button>
              </div>
            </div>
            
            {/* Safety Tips */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center text-orange-800">
                <Shield className="h-5 w-5 mr-2" />
                Safety Tips
              </h2>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-start">
                  <span className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs">1</span>
                  </span>
                  <span>Meet in a safe, public location for viewing and transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs">2</span>
                  </span>
                  <span>Never wire money or use gift cards for payment</span>
                </li>
                <li className="flex items-start">
                  <span className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs">3</span>
                  </span>
                  <span>Verify ownership and documentation before purchase</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Similar Vehicles */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                featured={vehicle.featured} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* VIN Scanner Modal */}
      {showVinScanner && (
        <VinScanner
          onScan={handleVinScan}
          onClose={() => setShowVinScanner(false)}
        />
      )}
    </div>
  );
};

export default ListingDetailPage;
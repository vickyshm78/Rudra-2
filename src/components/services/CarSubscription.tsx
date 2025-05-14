import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Car, Clock, MapPin, CheckCircle, X, AlertTriangle, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { CarSubscription } from '../../types';

interface CarSubscriptionProps {
  vehicleType?: string;
  location?: {
    city: string;
    state: string;
  };
}

const CarSubscriptionComponent: React.FC<CarSubscriptionProps> = ({
  vehicleType = 'Car',
  location = { city: 'Mumbai', state: 'Maharashtra' }
}) => {
  const [subscriptions, setSubscriptions] = useState<CarSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    duration: '12',
    vehicleType: vehicleType,
    priceRange: [5000, 50000],
    withDriver: false
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [filters]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock subscription plans
      const mockSubscriptions: CarSubscription[] = [
        {
          id: 'sub1',
          vehicleType: 'Hatchback',
          make: 'Maruti Suzuki',
          model: 'Swift',
          monthlyPrice: 15999,
          securityDeposit: 10000,
          minDuration: 6,
          maxDuration: 36,
          kmLimit: 1500,
          features: [
            'Comprehensive insurance',
            'Maintenance included',
            'Roadside assistance',
            '24x7 customer support',
            'Vehicle replacement option'
          ],
          availableColors: ['Red', 'White', 'Blue', 'Silver'],
          provider: {
            name: 'Revv',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.3
          }
        },
        {
          id: 'sub2',
          vehicleType: 'Sedan',
          make: 'Honda',
          model: 'City',
          monthlyPrice: 22999,
          securityDeposit: 15000,
          minDuration: 6,
          maxDuration: 36,
          kmLimit: 1500,
          features: [
            'Comprehensive insurance',
            'Maintenance included',
            'Roadside assistance',
            '24x7 customer support',
            'Vehicle replacement option',
            'Free car upgrade after 12 months'
          ],
          availableColors: ['White', 'Silver', 'Black'],
          provider: {
            name: 'Zoomcar',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.1
          }
        },
        {
          id: 'sub3',
          vehicleType: 'SUV',
          make: 'Hyundai',
          model: 'Creta',
          monthlyPrice: 28999,
          securityDeposit: 20000,
          minDuration: 12,
          maxDuration: 36,
          kmLimit: 2000,
          features: [
            'Comprehensive insurance',
            'Maintenance included',
            'Roadside assistance',
            '24x7 customer support',
            'Vehicle replacement option',
            'Free car upgrade after 12 months',
            'Flexible return policy'
          ],
          availableColors: ['White', 'Black', 'Blue'],
          provider: {
            name: 'Myles',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.5
          }
        },
        {
          id: 'sub4',
          vehicleType: 'Luxury',
          make: 'Mercedes-Benz',
          model: 'C-Class',
          monthlyPrice: 49999,
          securityDeposit: 50000,
          minDuration: 12,
          maxDuration: 24,
          kmLimit: 1500,
          features: [
            'Comprehensive insurance',
            'Maintenance included',
            'Roadside assistance',
            '24x7 customer support',
            'Vehicle replacement option',
            'Chauffeur option available',
            'Concierge services',
            'Airport transfers included'
          ],
          availableColors: ['Black', 'Silver'],
          provider: {
            name: 'Avis',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.7
          }
        }
      ];
      
      // Filter subscriptions based on user preferences
      const filtered = mockSubscriptions.filter(sub => {
        const priceInRange = sub.monthlyPrice >= filters.priceRange[0] && sub.monthlyPrice <= filters.priceRange[1];
        const durationValid = Number(filters.duration) >= sub.minDuration && Number(filters.duration) <= sub.maxDuration;
        const typeMatch = filters.vehicleType === 'All' || sub.vehicleType === filters.vehicleType;
        
        return priceInRange && durationValid && typeMatch;
      });
      
      setSubscriptions(filtered);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubscribe = (subscriptionId: string) => {
    // In a real app, this would initiate the subscription process
    alert(`Subscription process initiated for plan ${subscriptionId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Car className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Car Subscription Plans
        </h2>

        {/* Filters */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium mb-4 dark:text-white">Customize Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={filters.vehicleType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration
              </label>
              <select
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Budget
              </label>
              <select
                name="priceRange"
                value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setFilters(prev => ({
                    ...prev,
                    priceRange: [min, max]
                  }));
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="5000-20000">₹5,000 - ₹20,000</option>
                <option value="20000-30000">₹20,000 - ₹30,000</option>
                <option value="30000-50000">₹30,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000+</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="withDriver"
                name="withDriver"
                checked={filters.withDriver}
                onChange={handleFilterChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="withDriver" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include driver option
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Subscription Plans */}
            {subscriptions.length > 0 ? (
              <div className="space-y-6">
                {subscriptions.map((subscription) => (
                  <div 
                    key={subscription.id}
                    className="border rounded-lg overflow-hidden transition-colors border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                            <Car className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-white">{subscription.make} {subscription.model}</h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded mr-2">
                                {subscription.vehicleType}
                              </span>
                              <span>by {subscription.provider.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(subscription.monthlyPrice)}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subscription.kmLimit} km/month included
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {subscription.minDuration}-{subscription.maxDuration} months
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(subscription.securityDeposit)} deposit
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          Available in {location.city}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setShowDetails(showDetails === subscription.id ? null : subscription.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                        >
                          {showDetails === subscription.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View Details
                            </>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleSubscribe(subscription.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {showDetails === subscription.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium mb-3 dark:text-white">Included Features</h5>
                            <ul className="space-y-2">
                              {subscription.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-3 dark:text-white">Subscription Details</h5>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Available Colors</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {subscription.availableColors.map((color, index) => (
                                    <span 
                                      key={index}
                                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Additional Options</p>
                                <div className="space-y-1 mt-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Extra KMs</span>
                                    <span className="font-medium dark:text-white">₹10/km</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Driver Option</span>
                                    <span className="font-medium dark:text-white">₹15,000/month</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Swap Vehicle</span>
                                    <span className="font-medium dark:text-white">₹5,000/swap</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t dark:border-gray-600">
                          <h5 className="font-medium mb-3 dark:text-white">Terms & Conditions</h5>
                          <ul className="space-y-1">
                            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                              <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                              Minimum lock-in period of {subscription.minDuration} months
                            </li>
                            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                              <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                              Security deposit refundable at the end of subscription
                            </li>
                            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                              <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                              Early termination fee applicable
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Subscription Plans Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any subscription plans matching your criteria. 
                  Try adjusting your filters or check back later.
                </p>
              </div>
            )}
          </>
        )}

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Benefits of Car Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Zero Down Payment</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Only refundable security deposit, no large upfront payment
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">All-Inclusive Package</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Insurance, maintenance, and roadside assistance included
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Flexibility</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Swap cars or upgrade during your subscription period
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Subscription plans are subject to availability in your location. 
            Additional charges may apply for exceeding the monthly kilometer limit. 
            Security deposit is refundable subject to vehicle condition assessment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarSubscriptionComponent;
import React, { useState, useEffect } from 'react';
import { Shield, Calendar, DollarSign, CheckCircle, X, AlertTriangle, ChevronDown, ChevronUp, Clock, PenTool } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { WarrantyPlan } from '../../types';

interface ExtendedWarrantyProps {
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
}

const ExtendedWarranty: React.FC<ExtendedWarrantyProps> = ({
  vehicleDetails
}) => {
  const [warrantyPlans, setWarrantyPlans] = useState<WarrantyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(24);

  useEffect(() => {
    fetchWarrantyPlans();
  }, [vehicleDetails, selectedDuration]);

  const fetchWarrantyPlans = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate base price factors
      const vehicleAge = new Date().getFullYear() - vehicleDetails.year;
      const mileageFactor = vehicleDetails.mileage / 10000;
      const ageFactor = Math.max(1, vehicleAge);
      
      // Generate mock warranty plans
      const mockPlans: WarrantyPlan[] = [
        {
          id: 'warranty1',
          name: 'Basic Coverage',
          provider: 'Shield Auto Protect',
          coverageType: 'Powertrain',
          durationMonths: selectedDuration,
          price: Math.round(5000 * ageFactor * (mileageFactor * 0.5) * (selectedDuration / 12)),
          deductible: 2000,
          coveredComponents: [
            'Engine',
            'Transmission',
            'Drive Axle',
            'Transfer Case',
            'Seals and Gaskets'
          ],
          exclusions: [
            'Electrical components',
            'Air conditioning',
            'Steering',
            'Brakes',
            'Suspension',
            'Fuel system'
          ],
          transferable: true,
          rating: 4.2,
          reviewCount: 156
        },
        {
          id: 'warranty2',
          name: 'Premium Coverage',
          provider: 'AutoGuard Plus',
          coverageType: 'Comprehensive',
          durationMonths: selectedDuration,
          price: Math.round(8000 * ageFactor * (mileageFactor * 0.6) * (selectedDuration / 12)),
          deductible: 1500,
          coveredComponents: [
            'Engine',
            'Transmission',
            'Drive Axle',
            'Transfer Case',
            'Electrical',
            'Air Conditioning',
            'Steering',
            'Brakes',
            'Suspension',
            'Fuel System',
            'Cooling System'
          ],
          exclusions: [
            'Wear and tear items',
            'Maintenance items',
            'Cosmetic items'
          ],
          transferable: true,
          rating: 4.5,
          reviewCount: 287
        },
        {
          id: 'warranty3',
          name: 'Ultimate Coverage',
          provider: 'TotalCare Warranty',
          coverageType: 'Exclusionary',
          durationMonths: selectedDuration,
          price: Math.round(12000 * ageFactor * (mileageFactor * 0.7) * (selectedDuration / 12)),
          deductible: 1000,
          coveredComponents: [
            'All components except those specifically excluded'
          ],
          exclusions: [
            'Wear and tear items',
            'Maintenance items',
            'Cosmetic items',
            'Pre-existing conditions'
          ],
          transferable: true,
          rating: 4.8,
          reviewCount: 412
        }
      ];
      
      setWarrantyPlans(mockPlans);
      
      // Select the middle plan by default
      if (!selectedPlan && mockPlans.length > 0) {
        setSelectedPlan(mockPlans[1].id);
      }
    } catch (error) {
      console.error('Failed to fetch warranty plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    const plan = warrantyPlans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    // In a real app, this would initiate the purchase process
    alert(`Warranty purchase initiated for ${plan.name} with price ${formatCurrency(plan.price)}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Extended Warranty Plans
        </h2>

        {/* Vehicle Details */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium mb-3 dark:text-white">Vehicle Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Make & Model</p>
              <p className="font-medium dark:text-white">{vehicleDetails.make} {vehicleDetails.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
              <p className="font-medium dark:text-white">{vehicleDetails.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mileage</p>
              <p className="font-medium dark:text-white">{vehicleDetails.mileage.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
              <p className="font-medium dark:text-white">{vehicleDetails.condition}</p>
            </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Warranty Duration
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setSelectedDuration(12)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                selectedDuration === 12
                  ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
              }`}
            >
              <span className="block text-lg font-bold mb-1">1 Year</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">12 months</span>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedDuration(24)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                selectedDuration === 24
                  ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
              }`}
            >
              <span className="block text-lg font-bold mb-1">2 Years</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">24 months</span>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedDuration(36)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                selectedDuration === 36
                  ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
              }`}
            >
              <span className="block text-lg font-bold mb-1">3 Years</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">36 months</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Warranty Plans */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium dark:text-white">Available Plans</h3>
              
              {warrantyPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    selectedPlan === plan.id
                      ? 'border-blue-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div 
                    className={`p-4 ${
                      selectedPlan === plan.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedPlan === plan.id
                            ? 'border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedPlan === plan.id && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium dark:text-white">{plan.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {plan.provider} • {plan.coverageType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(plan.price)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.durationMonths} months
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {plan.durationMonths} months coverage
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(plan.deductible)} deductible
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                        className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                      >
                        {expandedPlan === plan.id ? (
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
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedPlan === plan.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedPlan === plan.id && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3 dark:text-white">Covered Components</h5>
                          <ul className="space-y-2">
                            {plan.coveredComponents.map((component, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {component}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-3 dark:text-white">Exclusions</h5>
                          <ul className="space-y-2">
                            {plan.exclusions.map((exclusion, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                {exclusion}
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t dark:border-gray-600">
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                {plan.transferable ? 'Transferable to new owner' : 'Non-transferable'}
                              </span>
                            </div>
                            <div className="flex items-center text-sm mt-2">
                              <PenTool className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                {plan.rating} out of 5 ({plan.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Purchase Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handlePurchase}
                disabled={!selectedPlan}
                className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors ${
                  !selectedPlan ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Purchase Warranty
              </button>
            </div>
          </>
        )}

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Benefits of Extended Warranty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Financial Protection</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avoid unexpected repair costs and budget with confidence
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Increased Resale Value</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transferable warranty can increase your vehicle's resale value
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Peace of Mind</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drive with confidence knowing you're covered for major repairs
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Warranty coverage is subject to terms and conditions. Please review the complete warranty 
            agreement before purchase. Pre-existing conditions are not covered. A vehicle inspection 
            may be required before warranty activation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtendedWarranty;
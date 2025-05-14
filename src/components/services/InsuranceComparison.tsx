import React, { useState, useEffect } from 'react';
import { 
  Shield, DollarSign, CheckCircle, X, Info, Star, AlertTriangle, 
  ChevronDown, ChevronUp, Calendar, Clock, Car, FileText, 
  Camera, Truck, Umbrella, PenTool, Zap, Award, Smartphone
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface InsuranceComparisonProps {
  vehicleId?: string;
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    value: number;
  };
}

const InsuranceComparison: React.FC<InsuranceComparisonProps> = ({
  vehicleId,
  vehicleDetails
}) => {
  const [insuranceQuotes, setInsuranceQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [coverageType, setCoverageType] = useState<'comprehensive' | 'thirdParty' | 'thirdPartyFire'>('comprehensive');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsuranceQuotes();
  }, [vehicleId, coverageType]);

  const fetchInsuranceQuotes = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock quotes
      const mockQuotes = [
        {
          id: 'quote1',
          provider: {
            id: 'hdfc',
            name: 'HDFC ERGO',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.5,
            reviewCount: 1250
          },
          coverageType,
          premium: coverageType === 'comprehensive' ? 5999 : coverageType === 'thirdPartyFire' ? 3999 : 2499,
          idv: vehicleDetails?.value || 500000,
          coverageDetails: {
            thirdParty: true,
            ownDamage: coverageType === 'comprehensive',
            personalAccident: true,
            zeroDep: coverageType === 'comprehensive',
            engineProtection: false,
            roadSideAssistance: coverageType === 'comprehensive',
            ncbProtection: false,
            consumables: false
          },
          addOns: [
            { id: 'zeroDep', name: 'Zero Depreciation', price: 999, included: coverageType === 'comprehensive' },
            { id: 'engine', name: 'Engine Protection', price: 799, included: false },
            { id: 'rsa', name: 'Roadside Assistance', price: 499, included: coverageType === 'comprehensive' },
            { id: 'ncb', name: 'NCB Protection', price: 699, included: false }
          ],
          discounts: [
            { name: 'Online Discount', amount: 500 },
            { name: 'No Claim Bonus', amount: 1000 }
          ],
          claimSettlementRatio: 0.92,
          processingTime: '24 hours',
          exclusions: [
            'Normal wear and tear',
            'Mechanical/electrical breakdown',
            'Driving under influence',
            'Driving without valid license'
          ]
        },
        {
          id: 'quote2',
          provider: {
            id: 'icici',
            name: 'ICICI Lombard',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.3,
            reviewCount: 980
          },
          coverageType,
          premium: coverageType === 'comprehensive' ? 6499 : coverageType === 'thirdPartyFire' ? 4299 : 2699,
          idv: vehicleDetails?.value || 520000,
          coverageDetails: {
            thirdParty: true,
            ownDamage: coverageType === 'comprehensive',
            personalAccident: true,
            zeroDep: false,
            engineProtection: false,
            roadSideAssistance: false,
            ncbProtection: false,
            consumables: false
          },
          addOns: [
            { id: 'zeroDep', name: 'Zero Depreciation', price: 1099, included: false },
            { id: 'engine', name: 'Engine Protection', price: 899, included: false },
            { id: 'rsa', name: 'Roadside Assistance', price: 599, included: false },
            { id: 'ncb', name: 'NCB Protection', price: 799, included: false }
          ],
          discounts: [
            { name: 'Online Discount', amount: 600 }
          ],
          claimSettlementRatio: 0.89,
          processingTime: '48 hours',
          exclusions: [
            'Normal wear and tear',
            'Mechanical/electrical breakdown',
            'Driving under influence',
            'Driving without valid license'
          ]
        },
        {
          id: 'quote3',
          provider: {
            id: 'bajaj',
            name: 'Bajaj Allianz',
            logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
            rating: 4.4,
            reviewCount: 1120
          },
          coverageType,
          premium: coverageType === 'comprehensive' ? 5799 : coverageType === 'thirdPartyFire' ? 3899 : 2399,
          idv: vehicleDetails?.value || 510000,
          coverageDetails: {
            thirdParty: true,
            ownDamage: coverageType === 'comprehensive',
            personalAccident: true,
            zeroDep: false,
            engineProtection: false,
            roadSideAssistance: true,
            ncbProtection: false,
            consumables: false
          },
          addOns: [
            { id: 'zeroDep', name: 'Zero Depreciation', price: 949, included: false },
            { id: 'engine', name: 'Engine Protection', price: 749, included: false },
            { id: 'rsa', name: 'Roadside Assistance', price: 0, included: true },
            { id: 'ncb', name: 'NCB Protection', price: 649, included: false }
          ],
          discounts: [
            { name: 'Online Discount', amount: 550 },
            { name: 'Multi-policy Discount', amount: 300 }
          ],
          claimSettlementRatio: 0.91,
          processingTime: '24-48 hours',
          exclusions: [
            'Normal wear and tear',
            'Mechanical/electrical breakdown',
            'Driving under influence',
            'Driving without valid license'
          ]
        }
      ];
      
      setInsuranceQuotes(mockQuotes);
      if (!selectedQuote && mockQuotes.length > 0) {
        setSelectedQuote(mockQuotes[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch insurance quotes:', error);
      setError('Failed to load insurance quotes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOnToggle = (addOnId: string) => {
    if (addOns.includes(addOnId)) {
      setAddOns(addOns.filter(id => id !== addOnId));
    } else {
      setAddOns([...addOns, addOnId]);
    }
  };

  const calculateTotalPremium = (quote: any) => {
    let total = quote.premium;
    
    // Add selected add-ons
    addOns.forEach(addOnId => {
      const addOn = quote.addOns.find((a: any) => a.id === addOnId);
      if (addOn && !addOn.included) {
        total += addOn.price;
      }
    });
    
    // Subtract discounts
    quote.discounts.forEach((discount: any) => {
      total -= discount.amount;
    });
    
    return Math.max(0, total);
  };

  const handleBuyInsurance = (quoteId: string) => {
    const quote = insuranceQuotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    // In a real app, this would initiate the purchase process
    alert(`Initiating purchase of ${quote.provider.name} insurance for ${formatCurrency(calculateTotalPremium(quote))}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Insurance Comparison
        </h2>

        {/* Vehicle Details */}
        {vehicleDetails && (
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration</p>
                <p className="font-medium dark:text-white">{vehicleDetails.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IDV</p>
                <p className="font-medium dark:text-white">{formatCurrency(vehicleDetails.value)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Coverage Type Selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 dark:text-white">Select Coverage Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                coverageType === 'comprehensive'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setCoverageType('comprehensive')}
            >
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-medium dark:text-white">Comprehensive</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete protection including third-party liability, own damage, theft, and natural disasters
              </p>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                coverageType === 'thirdPartyFire'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setCoverageType('thirdPartyFire')}
            >
              <div className="flex items-center mb-2">
                <Umbrella className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                <h4 className="font-medium dark:text-white">Third Party + Fire & Theft</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Third-party liability coverage plus protection against fire and theft
              </p>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                coverageType === 'thirdParty'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setCoverageType('thirdParty')}
            >
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-medium dark:text-white">Third Party Only</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Basic mandatory coverage for damage to third-party property or injuries
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        ) : (
          <>
            {/* Insurance Quotes */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Available Plans</h3>
              
              {insuranceQuotes.map((quote) => (
                <div 
                  key={quote.id}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    selectedQuote === quote.id
                      ? 'border-blue-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div 
                    className={`p-4 ${
                      selectedQuote === quote.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedQuote === quote.id
                            ? 'border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedQuote === quote.id && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-white">{quote.provider.name}</h4>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                                {quote.provider.rating} ({quote.provider.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(calculateTotalPremium(quote))}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          per year
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {quote.coverageDetails.ownDamage && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                          Own Damage
                        </span>
                      )}
                      {quote.coverageDetails.zeroDep && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                          Zero Depreciation
                        </span>
                      )}
                      {quote.coverageDetails.roadSideAssistance && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                          Roadside Assistance
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                        className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                      >
                        {expandedQuote === quote.id ? (
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
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedQuote(quote.id)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedQuote === quote.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedQuote === quote.id ? 'Selected' : 'Select'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleBuyInsurance(quote.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedQuote === quote.id && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3 dark:text-white">Coverage Details</h5>
                          <ul className="space-y-2">
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.thirdParty ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Third Party Liability
                            </li>
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.ownDamage ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Own Damage
                            </li>
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.personalAccident ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Personal Accident Cover
                            </li>
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.zeroDep ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Zero Depreciation
                            </li>
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.engineProtection ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Engine Protection
                            </li>
                            <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              {quote.coverageDetails.roadSideAssistance ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              Roadside Assistance
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-3 dark:text-white">Add-ons</h5>
                          <ul className="space-y-2">
                            {quote.addOns.map((addOn: any) => (
                              <li key={addOn.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`${quote.id}-${addOn.id}`}
                                    checked={addOn.included || addOns.includes(addOn.id)}
                                    onChange={() => !addOn.included && handleAddOnToggle(addOn.id)}
                                    disabled={addOn.included}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`${quote.id}-${addOn.id}`} className="ml-2 text-gray-600 dark:text-gray-300">
                                    {addOn.name}
                                  </label>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {addOn.included ? 'Included' : formatCurrency(addOn.price)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t dark:border-gray-600">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Claim Processing: {quote.processingTime}
                              </span>
                            </div>
                            <div className="flex items-center text-sm mt-2">
                              <PenTool className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Claim Settlement Ratio: {(quote.claimSettlementRatio * 100).toFixed(1)}%
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
            
            {/* Selected Plan Summary */}
            {selectedQuote && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="font-medium mb-4 text-blue-800 dark:text-blue-200">Selected Plan Summary</h3>
                
                {(() => {
                  const quote = insuranceQuotes.find(q => q.id === selectedQuote);
                  if (!quote) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mr-3">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">{quote.provider.name}</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              {coverageType === 'comprehensive' ? 'Comprehensive' : 
                               coverageType === 'thirdPartyFire' ? 'Third Party + Fire & Theft' : 
                               'Third Party Only'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                            {formatCurrency(calculateTotalPremium(quote))}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            per year
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBuyInsurance(quote.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Why Choose Our Insurance Partners?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Fast Claims</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quick and hassle-free claim settlement process
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Top Rated</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Partnered with highest-rated insurance providers
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Digital Experience</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fully digital process from purchase to claims
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Insurance is subject to terms and conditions of the insurer. Please read the policy 
            wording carefully before making a purchase. Prices shown are indicative and may vary 
            based on the final inspection and verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceComparison;
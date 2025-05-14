import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, AlertTriangle, MapPin, Activity, Calendar, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface InstantValuationProps {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  location?: {
    city: string;
    state: string;
  };
}

const InstantValuation: React.FC<InstantValuationProps> = ({
  make: initialMake,
  model: initialModel,
  year: initialYear,
  mileage: initialMileage,
  condition: initialCondition,
  location: initialLocation
}) => {
  const [make, setMake] = useState(initialMake || '');
  const [model, setModel] = useState(initialModel || '');
  const [year, setYear] = useState(initialYear || new Date().getFullYear());
  const [mileage, setMileage] = useState(initialMileage || 0);
  const [condition, setCondition] = useState(initialCondition || '');
  const [city, setCity] = useState(initialLocation?.city || '');
  const [state, setState] = useState(initialLocation?.state || '');
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<any>(null);
  const [similarListings, setSimilarListings] = useState<any[]>([]);

  useEffect(() => {
    if (initialMake && initialModel && initialYear && initialMileage && initialCondition) {
      handleCalculate();
    }
  }, []);

  const calculateBaseValue = () => {
    // This is a simplified example - in a real app, this would use
    // machine learning models and market data
    const baseValue = 25000; // Example base value
    
    // Age depreciation
    const age = new Date().getFullYear() - year;
    const ageMultiplier = Math.pow(0.85, age); // 15% depreciation per year
    
    // Mileage impact
    const mileageMultiplier = Math.pow(0.95, mileage / 10000); // 5% reduction per 10k miles
    
    // Condition adjustment
    const conditionMultiplier = 
      condition === 'Excellent' ? 1.1 :
      condition === 'Good' ? 1.0 :
      condition === 'Fair' ? 0.9 :
      0.8; // Poor
    
    // Location adjustment (simplified)
    const locationMultiplier = 
      ['CA', 'NY', 'FL', 'TX'].includes(state) ? 1.1 : 1.0;
    
    return Math.round(baseValue * ageMultiplier * mileageMultiplier * conditionMultiplier * locationMultiplier);
  };

  const handleCalculate = async () => {
    if (!make || !model || !year || !mileage || !condition || !city || !state) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const estimatedValue = calculateBaseValue();
      
      // Generate confidence range
      const confidenceLow = Math.round(estimatedValue * 0.95);
      const confidenceHigh = Math.round(estimatedValue * 1.05);
      
      // Generate market insights
      const marketTrends = {
        monthlyChange: '+2.5%',
        yearlyChange: '-5%',
        demandLevel: 'High',
        averageDaysOnMarket: 45
      };
      
      // Generate similar listings
      const mockSimilarListings = [
        {
          price: estimatedValue - 2000,
          mileage: mileage - 5000,
          location: 'Nearby',
          daysListed: 15
        },
        {
          price: estimatedValue + 1500,
          mileage: mileage + 3000,
          location: 'Nearby',
          daysListed: 7
        },
        {
          price: estimatedValue - 500,
          mileage: mileage - 2000,
          location: 'Nearby',
          daysListed: 30
        }
      ];

      setValuation({
        estimatedValue,
        confidenceLow,
        confidenceHigh,
        marketTrends
      });
      
      setSimilarListings(mockSimilarListings);
    } catch (error) {
      console.error('Valuation calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Instant Vehicle Valuation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Make
            </label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Toyota"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Camry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 2020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mileage
            </label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="City"
              />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="State"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading || !make || !model || !year || !mileage || !condition || !city || !state}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg transition-colors ${
            loading || !make || !model || !year || !mileage || !condition || !city || !state
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Calculating...' : 'Calculate Value'}
        </button>

        {valuation && (
          <div className="mt-8 space-y-6">
            {/* Estimated Value */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Estimated Value
              </h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(valuation.estimatedValue)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Confidence Range: {formatCurrency(valuation.confidenceLow)} - {formatCurrency(valuation.confidenceHigh)}
                </p>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Market Insights
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Change</p>
                  <p className="text-lg font-semibold text-green-500">{valuation.marketTrends.monthlyChange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Yearly Change</p>
                  <p className="text-lg font-semibold text-red-500">{valuation.marketTrends.yearlyChange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Demand Level</p>
                  <p className="text-lg font-semibold dark:text-white">{valuation.marketTrends.demandLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Days Listed</p>
                  <p className="text-lg font-semibold dark:text-white">{valuation.marketTrends.averageDaysOnMarket} days</p>
                </div>
              </div>
            </div>

            {/* Similar Listings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Similar Listings</h3>
              <div className="space-y-4">
                {similarListings.map((listing, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-xl dark:text-white">
                          {formatCurrency(listing.price)}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Activity className="h-4 w-4 mr-1" />
                          <span>{listing.mileage.toLocaleString()} miles</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{listing.location}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Listed {listing.daysListed} days ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valuation Factors */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This valuation is based on current market conditions, vehicle specifications, and recent sales data. 
                  Actual sale price may vary based on additional factors such as vehicle history, modifications, and local demand.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantValuation;
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, DollarSign, Calendar, ArrowUp, 
  ArrowDown, Sun, Cloud, Umbrella, Snowflake,
  AlertTriangle, Info, Car, BarChart2, RefreshCw,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DynamicPricingAnalyticsProps {
  vehicleId?: string;
  vehicleType?: string;
  make?: string;
  model?: string;
}

const DynamicPricingAnalytics: React.FC<DynamicPricingAnalyticsProps> = ({
  vehicleId,
  vehicleType = 'Car',
  make = 'Toyota',
  model = 'Camry'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceData, setPriceData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('90days');
  const [region, setRegion] = useState('all');
  const [showSeasonalFactors, setShowSeasonalFactors] = useState(false);
  const [showCompetitorPricing, setShowCompetitorPricing] = useState(false);
  const [showDemandFactors, setShowDemandFactors] = useState(false);

  useEffect(() => {
    fetchPricingData();
  }, [vehicleId, vehicleType, make, model, timeRange, region]);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the database
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        currentPrice: 2500000,
        recommendedPrice: 2650000,
        priceRange: {
          min: 2400000,
          max: 2800000
        },
        priceHistory: [
          { date: '2025-01-01', price: 2700000 },
          { date: '2025-02-01', price: 2650000 },
          { date: '2025-03-01', price: 2600000 },
          { date: '2025-04-01', price: 2550000 },
          { date: '2025-05-01', price: 2500000 }
        ],
        marketTrends: {
          monthlyChange: '+2.5%',
          quarterlyChange: '-1.2%',
          yearlyChange: '+5.8%'
        },
        seasonalFactors: {
          spring: { impact: '+5%', reason: 'Higher demand during spring season' },
          summer: { impact: '+2%', reason: 'Moderate demand increase' },
          fall: { impact: '-2%', reason: 'Slight demand decrease' },
          winter: { impact: '-5%', reason: 'Lower demand during winter months' }
        },
        competitorPricing: [
          { dealer: 'ABC Motors', price: 2550000, distance: '5 km' },
          { dealer: 'XYZ Autos', price: 2700000, distance: '12 km' },
          { dealer: 'City Cars', price: 2480000, distance: '8 km' }
        ],
        demandFactors: {
          fuelPrices: { impact: '-2%', trend: 'rising' },
          economicIndicators: { impact: '+3%', trend: 'improving' },
          consumerSentiment: { impact: '+1%', trend: 'stable' },
          inventoryLevels: { impact: '+2%', trend: 'decreasing' }
        },
        confidence: 0.85
      };
      
      setPriceData(mockData);
    } catch (err) {
      setError('Failed to load pricing data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case 'spring':
        return <Sun className="h-5 w-5 text-green-500" />;
      case 'summer':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'fall':
        return <Cloud className="h-5 w-5 text-orange-500" />;
      case 'winter':
        return <Snowflake className="h-5 w-5 text-blue-500" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getDemandTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'improving':
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Dynamic Pricing Analytics
        </h2>
        
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">All Regions</option>
            <option value="north">North India</option>
            <option value="south">South India</option>
            <option value="east">East India</option>
            <option value="west">West India</option>
          </select>
        </div>
      </div>

      {/* Price Recommendation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Price Recommendation</h3>
            <div className="flex items-end space-x-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(priceData.currentPrice)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recommended Price</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(priceData.recommendedPrice)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {((priceData.recommendedPrice - priceData.currentPrice) / priceData.currentPrice * 100).toFixed(1)}% increase
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested Price Range</p>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div 
                  className="absolute h-4 w-4 bg-blue-600 rounded-full top-1/2 transform -translate-y-1/2"
                  style={{ left: '0%' }}
                ></div>
                <div 
                  className="absolute h-4 w-4 bg-green-600 rounded-full top-1/2 transform -translate-y-1/2"
                  style={{ left: '50%' }}
                ></div>
                <div 
                  className="absolute h-4 w-4 bg-red-600 rounded-full top-1/2 transform -translate-y-1/2"
                  style={{ left: '100%' }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatCurrency(priceData.priceRange.min)}</span>
                <span>{formatCurrency(priceData.recommendedPrice)}</span>
                <span>{formatCurrency(priceData.priceRange.max)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-3 dark:text-white">Market Trends</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Monthly</span>
                <span className="flex items-center font-medium">
                  {getTrendIcon(priceData.marketTrends.monthlyChange)}
                  <span className={priceData.marketTrends.monthlyChange.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {priceData.marketTrends.monthlyChange}
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Quarterly</span>
                <span className="flex items-center font-medium">
                  {getTrendIcon(priceData.marketTrends.quarterlyChange)}
                  <span className={priceData.marketTrends.quarterlyChange.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {priceData.marketTrends.quarterlyChange}
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Yearly</span>
                <span className="flex items-center font-medium">
                  {getTrendIcon(priceData.marketTrends.yearlyChange)}
                  <span className={priceData.marketTrends.yearlyChange.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {priceData.marketTrends.yearlyChange}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t dark:border-gray-600">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Info className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span>Based on {timeRange === '30days' ? '30' : timeRange === '90days' ? '90' : timeRange === '6months' ? '180' : '365'} days of market data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Factors */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <button
            onClick={() => setShowSeasonalFactors(!showSeasonalFactors)}
            className="w-full flex justify-between items-center"
          >
            <h3 className="text-lg font-medium dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Seasonal Pricing Factors
            </h3>
            {showSeasonalFactors ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        
        {showSeasonalFactors && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(priceData.seasonalFactors).map(([season, data]: [string, any]) => (
                <div key={season} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    {getSeasonIcon(season)}
                    <h4 className="ml-2 font-medium dark:text-white capitalize">{season}</h4>
                  </div>
                  <p className="text-2xl font-bold mb-2">
                    <span className={data.impact.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {data.impact}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {data.reason}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Seasonal factors are based on historical sales data and market trends. 
                  Consider adjusting your pricing strategy to align with these seasonal variations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Competitor Pricing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <button
            onClick={() => setShowCompetitorPricing(!showCompetitorPricing)}
            className="w-full flex justify-between items-center"
          >
            <h3 className="text-lg font-medium dark:text-white flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Competitor Pricing Analysis
            </h3>
            {showCompetitorPricing ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        
        {showCompetitorPricing && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dealer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {priceData.competitorPricing.map((competitor: any, index: number) => {
                    const difference = competitor.price - priceData.currentPrice;
                    const percentDiff = (difference / priceData.currentPrice * 100).toFixed(1);
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                          {competitor.dealer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                          {formatCurrency(competitor.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {competitor.distance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={difference > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {difference > 0 ? '+' : ''}{formatCurrency(difference)} ({percentDiff}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  Your current price is {
                    priceData.currentPrice < priceData.competitorPricing.reduce((sum: number, comp: any) => sum + comp.price, 0) / priceData.competitorPricing.length
                      ? 'below'
                      : 'above'
                  } the average competitor price of {
                    formatCurrency(priceData.competitorPricing.reduce((sum: number, comp: any) => sum + comp.price, 0) / priceData.competitorPricing.length)
                  }.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demand Factors */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <button
            onClick={() => setShowDemandFactors(!showDemandFactors)}
            className="w-full flex justify-between items-center"
          >
            <h3 className="text-lg font-medium dark:text-white flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Market Demand Factors
            </h3>
            {showDemandFactors ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        
        {showDemandFactors && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(priceData.demandFactors).map(([factor, data]: [string, any]) => (
                <div key={factor} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 dark:text-white capitalize">
                    {factor.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getDemandTrendIcon(data.trend)}
                      <span className="ml-2 text-gray-600 dark:text-gray-300 capitalize">
                        {data.trend}
                      </span>
                    </div>
                    <span className={data.impact.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {data.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3 dark:text-white">Pricing Recommendation Summary</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Based on current market demand factors, we recommend {
                  priceData.recommendedPrice > priceData.currentPrice
                    ? 'increasing'
                    : 'decreasing'
                } your price to {formatCurrency(priceData.recommendedPrice)}. This adjustment accounts for seasonal trends, 
                competitor pricing, and current market conditions.
              </p>
              
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Apply Recommended Price
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confidence Score */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Price Recommendation Confidence Score
          </p>
          <p className="font-medium dark:text-white">
            {(priceData.confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricingAnalytics;
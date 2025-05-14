import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface PricingInsightsProps {
  price: number;
  marketAverage: number;
  similarListings: Array<{
    price: number;
    mileage: number;
    year: number;
  }>;
}

const PricingInsights: React.FC<PricingInsightsProps> = ({ 
  price, 
  marketAverage, 
  similarListings 
}) => {
  const priceDiff = ((price - marketAverage) / marketAverage) * 100;
  const isOverpriced = priceDiff > 0;

  const averagePrice = similarListings.reduce((sum, listing) => sum + listing.price, 0) / similarListings.length;
  const lowestPrice = Math.min(...similarListings.map(listing => listing.price));
  const highestPrice = Math.max(...similarListings.map(listing => listing.price));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Pricing Insights</h2>
      
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-full mr-4 ${
          isOverpriced 
            ? 'bg-red-100 dark:bg-red-900/20' 
            : 'bg-green-100 dark:bg-green-900/20'
        }`}>
          {isOverpriced ? (
            <TrendingUp className={`h-6 w-6 text-red-600 dark:text-red-400`} />
          ) : (
            <TrendingDown className={`h-6 w-6 text-green-600 dark:text-green-400`} />
          )}
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            This vehicle is priced
          </p>
          <p className={`text-lg font-semibold ${
            isOverpriced 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {Math.abs(priceDiff).toFixed(1)}% {isOverpriced ? 'above' : 'below'} market average
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Market Average</span>
          <span className="font-semibold dark:text-white">
            ${marketAverage.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Similar Listings Average</span>
          <span className="font-semibold dark:text-white">
            ${averagePrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Price Range</span>
          <span className="font-semibold dark:text-white">
            ${lowestPrice.toLocaleString()} - ${highestPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <p>
          Based on similar vehicles in your area with comparable mileage and features.
          Actual value may vary based on condition and local market factors.
        </p>
      </div>
    </div>
  );
};

export default PricingInsights;
import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, ArrowRight, Check, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CommissionCalculatorProps {
  initialPrice?: number;
  onCalculate?: (commission: number) => void;
}

const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({
  initialPrice = 0,
  onCalculate
}) => {
  const [vehiclePrice, setVehiclePrice] = useState(initialPrice);
  const [commissionType, setCommissionType] = useState<'percentage' | 'fixed'>('percentage');
  const [commissionRate, setCommissionRate] = useState(2); // Default 2%
  const [fixedFee, setFixedFee] = useState(5000); // Default ₹5,000
  const [calculatedCommission, setCalculatedCommission] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateCommission();
  }, [vehiclePrice, commissionType, commissionRate, fixedFee]);

  const calculateCommission = () => {
    let commission = 0;
    
    if (commissionType === 'percentage') {
      commission = (vehiclePrice * commissionRate) / 100;
    } else {
      commission = fixedFee;
    }
    
    setCalculatedCommission(commission);
    
    if (onCalculate) {
      onCalculate(commission);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    setVehiclePrice(value);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setCommissionRate(value);
  };

  const handleFixedFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    setFixedFee(value);
  };

  const getCommissionTiers = () => [
    { min: 0, max: 500000, rate: 2 },
    { min: 500000, max: 1000000, rate: 1.75 },
    { min: 1000000, max: 2500000, rate: 1.5 },
    { min: 2500000, max: 5000000, rate: 1.25 },
    { min: 5000000, max: Infinity, rate: 1 }
  ];

  const getTierRate = (price: number) => {
    const tiers = getCommissionTiers();
    for (const tier of tiers) {
      if (price >= tier.min && price < tier.max) {
        return tier.rate;
      }
    }
    return tiers[0].rate; // Default to first tier
  };

  const calculateTieredCommission = () => {
    const tiers = getCommissionTiers();
    let remainingPrice = vehiclePrice;
    let totalCommission = 0;
    
    for (const tier of tiers) {
      if (remainingPrice <= 0) break;
      
      const tierMax = tier.max === Infinity ? remainingPrice : tier.max;
      const tierMin = tier.min;
      const priceInTier = Math.min(remainingPrice, tierMax - tierMin);
      
      if (priceInTier > 0) {
        const tierCommission = (priceInTier * tier.rate) / 100;
        totalCommission += tierCommission;
        remainingPrice -= priceInTier;
      }
    }
    
    return totalCommission;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 dark:text-white flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Sale Commission Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate the commission for selling your vehicle through our platform
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle Sale Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={vehiclePrice || ''}
                onChange={handlePriceChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter vehicle price"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commission Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={commissionType === 'percentage'}
                  onChange={() => setCommissionType('percentage')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Percentage</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={commissionType === 'fixed'}
                  onChange={() => setCommissionType('fixed')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Fixed Fee</span>
              </label>
            </div>
            
            {commissionType === 'percentage' ? (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={commissionRate || ''}
                  onChange={handleRateChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Suggested rate: {getTierRate(vehiclePrice)}% for this price range
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fixed Fee Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={fixedFee || ''}
                    onChange={handleFixedFeeChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Estimated Commission</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
              <ArrowRight className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(calculatedCommission)}
            </p>
            {commissionType === 'percentage' && (
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {commissionRate}% of {formatCurrency(vehiclePrice)}
              </p>
            )}
          </div>
          
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Commission Breakdown</h4>
              
              {commissionType === 'percentage' ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Vehicle Price</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(vehiclePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Commission Rate</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">{commissionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-blue-200 dark:border-blue-800">
                    <span className="text-blue-700 dark:text-blue-300">Total Commission</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(calculatedCommission)}</span>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Tiered Commission Structure</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      Our tiered commission structure offers lower rates for higher-value vehicles:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {getCommissionTiers().map((tier, index) => (
                        <li key={index} className="flex justify-between">
                          <span>
                            {formatCurrency(tier.min)} - {tier.max === Infinity ? 'Above' : formatCurrency(tier.max)}
                          </span>
                          <span>{tier.rate}%</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between text-sm">
                      <span className="font-medium text-blue-700 dark:text-blue-300">Tiered Commission</span>
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {formatCurrency(calculateTieredCommission())}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Fixed Fee</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(fixedFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Vehicle Price</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(vehiclePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300">Effective Rate</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      {vehiclePrice > 0 ? ((fixedFee / vehiclePrice) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 dark:text-white">What's Included in Our Commission</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Verified Buyer Screening</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We pre-screen all potential buyers to ensure they're serious and qualified
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Secure Payment Processing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our escrow service ensures safe and secure transactions
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Paperwork Assistance</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help with all necessary documentation for a smooth transfer of ownership
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Dedicated Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personal assistance throughout the entire selling process
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Commission rates may vary based on vehicle type, condition, and market factors. 
            The calculator provides an estimate; the final commission will be confirmed before listing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculator;
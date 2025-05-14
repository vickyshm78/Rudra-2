import React, { useState } from 'react';
import { Zap, Check, ArrowRight, Eye, TrendingUp, Clock, Calendar, Camera, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface PremiumListingUpgradeProps {
  listingId: string;
  listingTitle: string;
  currentViews?: number;
  onUpgrade?: (plan: string, duration: number) => void;
}

const PremiumListingUpgrade: React.FC<PremiumListingUpgradeProps> = ({
  listingId,
  listingTitle,
  currentViews = 45,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);

  const plans = [
    {
      id: 'premium',
      name: 'Premium Listing',
      price: 199,
      features: [
        'Featured tag on listing',
        'Priority placement in search results',
        'Highlighted in category pages',
        'Performance statistics',
        'Up to 20 high-quality photos'
      ],
      viewsBoost: '3x',
      color: 'blue'
    },
    {
      id: 'spotlight',
      name: 'Spotlight',
      price: 499,
      features: [
        'All Premium features',
        'Homepage feature rotation',
        'Social media promotion',
        'Email newsletter feature',
        'Up to 30 high-quality photos',
        'Video walkthrough option'
      ],
      viewsBoost: '5x',
      color: 'purple'
    },
    {
      id: 'ultimate',
      name: 'Ultimate Visibility',
      price: 999,
      features: [
        'All Spotlight features',
        'Top of search results',
        'Permanent homepage placement',
        'Featured in similar vehicles',
        'Dedicated promotion to matched buyers',
        'Unlimited photos',
        'Video walkthrough included',
        '360° virtual tour option'
      ],
      viewsBoost: '10x',
      color: 'orange'
    }
  ];

  const durations = [
    { days: 7, label: '7 days', discount: 0 },
    { days: 15, label: '15 days', discount: 0 },
    { days: 30, label: '30 days', discount: 10 },
    { days: 60, label: '60 days', discount: 20 }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const selectedDurationData = durations.find(duration => duration.days === selectedDuration);

  const calculatePrice = () => {
    if (!selectedPlanData || !selectedDurationData) return 0;
    
    const basePrice = selectedPlanData.price;
    const durationMultiplier = selectedDuration / 15; // 15 days is the base
    let price = basePrice * durationMultiplier;
    
    // Apply discount if applicable
    if (selectedDurationData.discount > 0) {
      price = price * (1 - selectedDurationData.discount / 100);
    }
    
    return Math.round(price);
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(selectedPlan, selectedDuration);
    }
  };

  const getPlanColor = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    switch (plan?.color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 border-blue-600';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 border-purple-600';
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700 border-orange-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 border-blue-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 dark:text-white flex items-center">
          <Zap className="h-6 w-6 mr-2 text-yellow-500" />
          Upgrade Your Listing
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Boost visibility and sell your vehicle faster with our premium listing options
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Current Listing</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium dark:text-white">{listingTitle}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{currentViews} views</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Standard visibility</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
                Basic
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Select Upgrade Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-2 border-blue-500 dark:border-blue-400 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className={`p-4 ${
                  selectedPlan === plan.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-white dark:bg-gray-800'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold dark:text-white">{plan.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.id === 'premium' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                        : plan.id === 'spotlight'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                    }`}>
                      {plan.viewsBoost} more views
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold dark:text-white">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      /15 days
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-sm text-blue-600 dark:text-blue-400">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Select Duration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {durations.map((duration) => (
              <div
                key={duration.days}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedDuration === duration.days
                    ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                onClick={() => setSelectedDuration(duration.days)}
              >
                <div className="text-center">
                  <h4 className="font-semibold dark:text-white">{duration.label}</h4>
                  {duration.discount > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs rounded-full">
                      Save {duration.discount}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Upgrade Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Plan</span>
              <span className="font-medium dark:text-white">{selectedPlanData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Duration</span>
              <span className="font-medium dark:text-white">{selectedDurationData?.label}</span>
            </div>
            {selectedDurationData?.discount ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Base Price</span>
                  <span className="font-medium dark:text-white line-through">
                    {formatCurrency(selectedPlanData!.price * (selectedDuration / 15))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Discount</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    -{selectedDurationData.discount}%
                  </span>
                </div>
              </>
            ) : null}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-200">Total</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(calculatePrice())}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Benefits of Upgrading</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium mb-2 dark:text-white">Increased Visibility</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get up to {selectedPlanData?.viewsBoost} more views with premium placement in search results
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium mb-2 dark:text-white">Faster Selling Time</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Premium listings sell up to 70% faster than standard listings
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium mb-2 dark:text-white">Quality Leads</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Attract more serious buyers with enhanced listing features
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpgrade}
            className={`px-6 py-3 rounded-lg font-medium text-white flex items-center ${getPlanColor(selectedPlan)}`}
          >
            <Zap className="h-5 w-5 mr-2" />
            Upgrade Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumListingUpgrade;
import React, { useState } from 'react';
import { Check, X, CreditCard, Package, Zap, Shield, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SubscriptionPlansProps {
  userType: 'individual' | 'dealer';
  onSelectPlan?: (plan: string, price: number, billingCycle: 'monthly' | 'yearly') => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  userType = 'individual',
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const individualPlans = [
    {
      id: 'free',
      name: 'Basic',
      price: { monthly: 0, yearly: 0 },
      description: 'For casual sellers with a single vehicle',
      features: [
        '1 free listing',
        'Standard visibility',
        'Basic analytics',
        'Email support',
        '30-day listing duration'
      ],
      limitations: [
        'No premium placement',
        'Limited photos',
        'No featured tag',
        'No priority support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 199, yearly: 1990 },
      description: 'For sellers who want maximum visibility',
      features: [
        '1 premium listing',
        'Featured tag',
        'Top search placement',
        'Unlimited photos',
        'Detailed analytics',
        'Priority support',
        '60-day listing duration',
        'Social media promotion'
      ],
      limitations: []
    },
    {
      id: 'multi',
      name: 'Multi-Seller',
      price: { monthly: 499, yearly: 4990 },
      description: 'For individuals with multiple vehicles',
      features: [
        'Up to 5 listings',
        '2 premium placements',
        'Featured tag',
        'Top search placement',
        'Unlimited photos',
        'Advanced analytics',
        'Priority support',
        '90-day listing duration',
        'Social media promotion',
        'Dedicated account manager'
      ],
      limitations: []
    }
  ];

  const dealerPlans = [
    {
      id: 'basic',
      name: 'Basic Dealer',
      price: { monthly: 5000, yearly: 50000 },
      description: 'For small dealerships',
      features: [
        'Up to 20 listings',
        '5 premium placements',
        'Dealer badge',
        'Basic analytics dashboard',
        'Email & phone support',
        'Bulk upload tools',
        'Lead management system'
      ],
      limitations: [
        'No API access',
        'Limited branding options',
        'Standard support hours'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Dealer',
      price: { monthly: 10000, yearly: 100000 },
      description: 'For medium to large dealerships',
      features: [
        'Unlimited listings',
        '15 premium placements',
        'Verified dealer badge',
        'Advanced analytics dashboard',
        'Priority support 24/7',
        'Bulk upload tools',
        'Advanced lead management',
        'API access',
        'Custom branding',
        'Dedicated account manager',
        'Marketing tools integration'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 25000, yearly: 250000 },
      description: 'For large dealer groups & OEMs',
      features: [
        'Unlimited listings',
        'Unlimited premium placements',
        'Featured dealer status',
        'Enterprise analytics suite',
        'VIP support 24/7',
        'Advanced API access',
        'White-label options',
        'Custom integration',
        'Dedicated success team',
        'Marketing automation',
        'Exclusive promotions',
        'Market insights reports'
      ],
      limitations: []
    }
  ];

  const plans = userType === 'individual' ? individualPlans : dealerPlans;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan && onSelectPlan) {
      onSelectPlan(planId, plan.price[billingCycle], billingCycle);
    }
  };

  const getYearlySavings = (plan: any) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = monthlyCost - yearlyCost;
    const savingsPercentage = Math.round((savings / monthlyCost) * 100);
    return { savings, savingsPercentage };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">
          {userType === 'individual' ? 'Choose Your Listing Plan' : 'Dealer Subscription Plans'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-2xl">
          {userType === 'individual' 
            ? 'Select the plan that best fits your needs and get your vehicle in front of thousands of potential buyers'
            : 'Powerful tools to manage your inventory, track leads, and grow your dealership business'
          }
        </p>
        
        {/* Billing Toggle */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const { savings, savingsPercentage } = getYearlySavings(plan);
          const isPopular = plan.id === 'premium' || plan.id === 'pro';
          
          return (
            <div 
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border ${
                selectedPlan === plan.id
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400'
                  : isPopular
                    ? 'border-blue-200 dark:border-blue-800'
                    : 'border-gray-200 dark:border-gray-700'
              } relative`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 transform translate-x-8 translate-y-4 rotate-45">
                  POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(plan.price[billingCycle])}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  
                  {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save {formatCurrency(savings)} ({savingsPercentage}%) with annual billing
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.id === 'free' || plan.id === 'basic'
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.id === 'free' ? 'Get Started' : 'Select Plan'}
                </button>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-medium mb-4 dark:text-white">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <li key={`limit-${index}`} className="flex items-start">
                      <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Can I upgrade my plan later?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining period.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 dark:text-white">What happens when my listing expires?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You'll receive notifications before expiration. You can renew or let it expire and create a new listing later.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Are there any hidden fees?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No, the price you see is what you pay. There are no additional or hidden fees.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Can I cancel my subscription?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes, you can cancel your subscription at any time. Refunds are available within 7 days of purchase.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 bg-blue-600 dark:bg-blue-700 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
            <p className="text-blue-100">
              Join thousands of satisfied users and start selling your vehicles today.
            </p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center">
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
import React, { useState } from 'react';
import { Check, X, User, Bell, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface BuyerMembershipPlansProps {
  onSelectPlan?: (plan: string, price: number, billingCycle: 'monthly' | 'yearly') => void;
}

const BuyerMembershipPlans: React.FC<BuyerMembershipPlansProps> = ({ 
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Basic',
      price: { monthly: 0, yearly: 0 },
      description: 'For casual vehicle buyers',
      features: [
        'Basic search functionality',
        'Save up to 5 favorite listings',
        'Email notifications for saved searches',
        'Standard customer support'
      ],
      limitations: [
        'No early access to new listings',
        'Limited search filters',
        'No price drop alerts',
        'No premium support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Buyer',
      price: { monthly: 99, yearly: 999 },
      description: 'For serious vehicle shoppers',
      features: [
        'Early access to new listings (2 hours before public)',
        'Unlimited saved searches and favorites',
        'Price drop alerts',
        'Advanced search filters',
        'Vehicle history report credits (2/month)',
        'Priority customer support',
        'Exclusive deals on services',
        'No ads experience'
      ],
      limitations: []
    },
    {
      id: 'family',
      name: 'Family Plan',
      price: { monthly: 199, yearly: 1999 },
      description: 'For families buying multiple vehicles',
      features: [
        'All Premium features',
        'Family account with up to 5 members',
        'Vehicle history report credits (5/month)',
        'Dedicated account manager',
        'Priority inspection scheduling',
        'Exclusive discounts on insurance',
        'Free RC transfer assistance',
        'VIP customer support'
      ],
      limitations: []
    }
  ];

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
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Buyer Membership Plans</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-2xl">
          Get exclusive benefits and early access to the best vehicle listings with our membership plans
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
          const isPopular = plan.id === 'premium';
          
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
                      : plan.id === 'free'
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Select Plan'}
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

      {/* Benefits Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-blue-800 dark:text-blue-200">Premium Membership Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Early Access</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Get a head start on other buyers with early access to new listings. 
                Many premium vehicles sell within hours of listing!
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Price Drop Alerts</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Receive instant notifications when prices drop on vehicles you're watching.
                Never miss a great deal again!
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Vehicle History Reports</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Access detailed vehicle history reports to make informed decisions.
                Know exactly what you're buying.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Exclusive Discounts</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Save on insurance, inspections, and other services with member-only discounts.
                Membership pays for itself!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
              alt="User" 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <h4 className="font-semibold dark:text-white">Rahul Sharma</h4>
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            "The Premium membership paid for itself when I got early access to a rare Fortuner listing. 
            I was the first to contact the seller and secured the deal before it went public!"
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
              alt="User" 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <h4 className="font-semibold dark:text-white">Priya Patel</h4>
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            "The vehicle history reports saved me from buying a car with hidden damage. 
            The membership fee was nothing compared to what I could have lost!"
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" 
              alt="User" 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <h4 className="font-semibold dark:text-white">Vikram Singh</h4>
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            "The Family Plan is perfect for us. My wife and I were both looking for vehicles, 
            and the shared benefits made the process so much easier and more affordable."
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 bg-blue-600 dark:bg-blue-700 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Ready to upgrade your car buying experience?</h3>
            <p className="text-blue-100">
              Join thousands of smart buyers who save time and money with our premium membership.
            </p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Missing component
const Star = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default BuyerMembershipPlans;
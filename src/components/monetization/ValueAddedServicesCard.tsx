import React, { useState } from 'react';
import { Shield, FileText, Truck, Activity, CreditCard, Package, ArrowRight, Check, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  popular?: boolean;
  path: string;
}

interface ValueAddedServicesCardProps {
  vehicleId?: string;
}

const ValueAddedServicesCard: React.FC<ValueAddedServicesCardProps> = ({ vehicleId }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'insurance' | 'rto' | 'inspection' | 'finance'>('all');

  const services: Service[] = [
    {
      id: 'insurance-comprehensive',
      name: 'Comprehensive Insurance',
      description: 'Full coverage insurance with theft, damage, and third-party protection',
      price: 1999,
      icon: <Shield className="h-5 w-5" />,
      popular: true,
      path: vehicleId ? `/listing/${vehicleId}?tab=finance` : '/insurance'
    },
    {
      id: 'insurance-thirdparty',
      name: 'Third-Party Insurance',
      description: 'Basic mandatory insurance covering third-party damages',
      price: 999,
      icon: <Shield className="h-5 w-5" />,
      path: vehicleId ? `/listing/${vehicleId}?tab=finance` : '/insurance'
    },
    {
      id: 'rto-transfer',
      name: 'RC Transfer Service',
      description: 'Complete assistance with ownership transfer documentation and RTO process',
      price: 1499,
      icon: <FileText className="h-5 w-5" />,
      popular: true,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/rto-services'
    },
    {
      id: 'rto-noc',
      name: 'NOC Generation',
      description: 'Get No Objection Certificate for interstate vehicle transfer',
      price: 999,
      icon: <FileText className="h-5 w-5" />,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/rto-services'
    },
    {
      id: 'inspection-basic',
      name: 'Basic Inspection',
      description: '150-point inspection with detailed report and photos',
      price: 999,
      icon: <Activity className="h-5 w-5" />,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/inspection'
    },
    {
      id: 'inspection-premium',
      name: 'Premium Inspection',
      description: '300-point inspection with detailed report, photos, and video',
      price: 2999,
      icon: <Activity className="h-5 w-5" />,
      popular: true,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/inspection'
    },
    {
      id: 'transport',
      name: 'Vehicle Transport',
      description: 'Secure door-to-door vehicle transportation service',
      price: 4999,
      icon: <Truck className="h-5 w-5" />,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/transport'
    },
    {
      id: 'loan-facilitation',
      name: 'Loan Facilitation',
      description: 'Get the best loan offers from multiple banks with minimal paperwork',
      price: 999,
      icon: <CreditCard className="h-5 w-5" />,
      popular: true,
      path: vehicleId ? `/listing/${vehicleId}?tab=finance` : '/finance'
    },
    {
      id: 'warranty-basic',
      name: 'Extended Warranty',
      description: '1-year extended warranty covering major mechanical and electrical components',
      price: 5999,
      icon: <Shield className="h-5 w-5" />,
      path: vehicleId ? `/listing/${vehicleId}?tab=services` : '/warranty'
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => {
        if (selectedCategory === 'insurance') return service.id.startsWith('insurance');
        if (selectedCategory === 'rto') return service.id.startsWith('rto');
        if (selectedCategory === 'inspection') return service.id.startsWith('inspection');
        if (selectedCategory === 'finance') return service.id.includes('loan') || service.id.includes('warranty');
        return true;
      });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 dark:text-white flex items-center">
          <Package className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Value-Added Services
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enhance your vehicle buying or selling experience with our premium services
        </p>
      </div>

      <div className="p-6">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setSelectedCategory('insurance')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'insurance'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-1" />
            Insurance
          </button>
          <button
            onClick={() => setSelectedCategory('rto')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'rto'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-1" />
            RTO Services
          </button>
          <button
            onClick={() => setSelectedCategory('inspection')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'inspection'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-1" />
            Inspection
          </button>
          <button
            onClick={() => setSelectedCategory('finance')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'finance'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <CreditCard className="h-4 w-4 inline mr-1" />
            Finance
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              className="border rounded-lg overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-700 relative"
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full mr-3 ${
                    service.id.startsWith('insurance')
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : service.id.startsWith('rto')
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : service.id.startsWith('inspection')
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : service.id.includes('loan')
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {service.icon}
                  </div>
                  <h3 className="font-semibold dark:text-white">{service.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px]">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </span>
                  
                  <Link
                    to={service.path}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">Why Choose Our Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Trusted Providers</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All services are delivered by verified and top-rated service providers
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Transparent Pricing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hidden fees or charges - what you see is what you pay
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Convenience</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  One-stop solution for all your vehicle-related service needs
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Money-Back Guarantee</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  100% satisfaction guarantee or your money back
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Service availability may vary by location. Prices are inclusive of all taxes and fees.
            Some services may require additional information or documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueAddedServicesCard;
import React from 'react';
import { Search, ShieldCheck, Car, FileText, DollarSign, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuyingTips: React.FC = () => {
  const tips = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Research Thoroughly",
      description: "Take time to research different models, their features, common issues, and market values.",
      checklist: [
        "Compare different models and years",
        "Read professional reviews",
        "Check owner forums for common issues",
        "Research market values"
      ]
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Vehicle History",
      description: "Always check the vehicle's history before making a purchase decision.",
      checklist: [
        "Get a vehicle history report",
        "Check for accidents and repairs",
        "Verify mileage accuracy",
        "Look for maintenance records"
      ]
    },
    {
      icon: <Tool className="h-8 w-8" />,
      title: "Professional Inspection",
      description: "Have a trusted mechanic inspect the vehicle before purchasing.",
      checklist: [
        "Schedule pre-purchase inspection",
        "Check for mechanical issues",
        "Verify electrical systems",
        "Assess body condition"
      ]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Documentation",
      description: "Ensure all necessary paperwork is in order before finalizing the purchase.",
      checklist: [
        "Title and registration",
        "Service records",
        "Warranty information",
        "Insurance requirements"
      ]
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Negotiate Smart",
      description: "Be prepared to negotiate based on market value and vehicle condition.",
      checklist: [
        "Research fair market value",
        "Factor in repair costs",
        "Get quotes in writing",
        "Be ready to walk away"
      ]
    }
  ];

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Smart Vehicle Buying Tips
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Essential tips and advice to help you make a confident vehicle purchase
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                {tip.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                {tip.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tip.description}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 dark:text-white">Checklist:</h4>
                <ul className="space-y-2">
                  {tip.checklist.map((item, itemIndex) => (
                    <li 
                      key={itemIndex}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-blue-100 mb-6">
            Browse our extensive collection of quality vehicles
          </p>
          <Link
            to="/search"
            className="inline-flex items-center bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Car className="h-5 w-5 mr-2" />
            Browse Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyingTips;
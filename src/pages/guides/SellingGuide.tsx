import React from 'react';
import { Truck, DollarSign, Camera, Shield, FileCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellingGuide: React.FC = () => {
  const steps = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Prepare Your Vehicle",
      description: "Clean your vehicle thoroughly and take high-quality photos from multiple angles. Document any damage or wear.",
      tips: [
        "Wash and detail your vehicle",
        "Take photos in good lighting",
        "Capture interior, exterior, and under-hood shots",
        "Document any modifications or damage"
      ]
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Price It Right",
      description: "Research market values and set a competitive price. Consider factors like condition, mileage, and local demand.",
      tips: [
        "Check similar listings in your area",
        "Use pricing guides and valuation tools",
        "Factor in seasonal demand",
        "Leave room for negotiation"
      ]
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Gather Documentation",
      description: "Collect all necessary paperwork to make the sale process smooth and transparent.",
      tips: [
        "Vehicle title and registration",
        "Maintenance records",
        "Vehicle history report",
        "Warranty information"
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Handle Inquiries",
      description: "Respond promptly to potential buyers and be prepared for viewings and test drives.",
      tips: [
        "Be responsive to messages",
        "Screen buyers before meetings",
        "Meet in safe, public locations",
        "Have all paperwork ready"
      ]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Close the Deal Safely",
      description: "Ensure a secure transaction and proper transfer of ownership.",
      tips: [
        "Verify buyer's identity",
        "Accept secure payment methods",
        "Complete all required paperwork",
        "Transfer title properly"
      ]
    }
  ];

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            How to Sell Your Vehicle
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow our comprehensive guide to sell your vehicle quickly and safely
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {step.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 dark:text-white">Pro Tips:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.tips.map((tip, tipIndex) => (
                          <li 
                            key={tipIndex}
                            className="flex items-center text-gray-600 dark:text-gray-300"
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-blue-800 dark:bg-blue-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Sell Your Vehicle?
          </h2>
          <p className="text-blue-100 mb-6">
            Create your listing now and reach thousands of potential buyers
          </p>
          <Link
            to="/create-listing"
            className="inline-flex items-center bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Truck className="h-5 w-5 mr-2" />
            List Your Vehicle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellingGuide;
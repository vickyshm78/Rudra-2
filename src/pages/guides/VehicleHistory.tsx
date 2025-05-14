import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, Car, PenTool as Tool, Shield } from 'lucide-react';

const VehicleHistory: React.FC = () => {
  const sections = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "What's in a Vehicle History Report?",
      items: [
        "Accident history and damage reports",
        "Previous owners and usage",
        "Service and maintenance records",
        "Title information and status",
        "Mileage verification",
        "Registration history",
        "Recall information"
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Red Flags to Watch For",
      items: [
        "Title washing or branded titles",
        "Odometer rollback",
        "Frequent ownership changes",
        "Salvage or rebuilt status",
        "Inconsistent service history",
        "Unreported accidents",
        "Flood or fire damage"
      ]
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Good Signs in a Vehicle's History",
      items: [
        "Regular maintenance records",
        "Long-term ownership",
        "Clean title status",
        "Documented repairs",
        "Consistent mileage readings",
        "No accident history",
        "Manufacturer warranty work"
      ]
    }
  ];

  const steps = [
    {
      icon: <Car className="h-6 w-6" />,
      title: "Get the VIN",
      description: "Locate and verify the Vehicle Identification Number (VIN) on the vehicle."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Run a Report",
      description: "Use a reputable service to obtain a comprehensive vehicle history report."
    },
    {
      icon: <Tool className="h-6 w-6" />,
      title: "Professional Inspection",
      description: "Have a qualified mechanic inspect the vehicle to verify its condition."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verify Information",
      description: "Cross-reference the report with available service records and documentation."
    }
  ];

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Understanding Vehicle History
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn how to read and interpret vehicle history reports to make informed decisions
          </p>
        </div>

        {/* Process Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            How to Check a Vehicle's History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-16 top-6 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold dark:text-white">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex items-center text-gray-600 dark:text-gray-300"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sample Report */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            Sample Vehicle History Timeline
          </h2>
          <div className="space-y-6">
            {[
              {
                date: "2023-01-15",
                event: "Regular Maintenance",
                description: "Oil change, tire rotation, and brake inspection",
                type: "maintenance"
              },
              {
                date: "2022-08-22",
                event: "Ownership Transfer",
                description: "Vehicle sold to current owner",
                type: "transfer"
              },
              {
                date: "2022-07-10",
                event: "Minor Accident",
                description: "Front bumper damage reported, repairs completed",
                type: "accident"
              },
              {
                date: "2021-12-05",
                event: "Manufacturer Recall",
                description: "Airbag system recall service completed",
                type: "recall"
              }
            ].map((event, index) => (
              <div 
                key={index}
                className="flex items-start"
              >
                <div className="flex-shrink-0 w-32">
                  <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 inline mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold dark:text-white">
                    {event.event}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistory;
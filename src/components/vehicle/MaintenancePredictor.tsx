import React from 'react';
import { PenTool, AlertTriangle, Calendar, CheckCircle, Clock, Car } from 'lucide-react';

interface MaintenancePredictorProps {
  vehicleId: string;
  mileage: number;
  lastService?: {
    date: string;
    type: string;
    mileage: number;
  };
}

const MaintenancePredictor: React.FC<MaintenancePredictorProps> = ({
  mileage,
  lastService
}) => {
  // Calculate next service intervals
  const calculateNextService = () => {
    const baseInterval = 5000; // 5,000 miles or 6 months
    const lastServiceMileage = lastService?.mileage || 0;
    const milesUntilService = baseInterval - (mileage - lastServiceMileage);
    
    return {
      miles: Math.max(0, milesUntilService),
      estimated: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months
    };
  };

  const nextService = calculateNextService();

  const maintenanceItems = [
    {
      name: 'Oil Change',
      status: 'upcoming',
      due: '500 miles',
      priority: 'high'
    },
    {
      name: 'Tire Rotation',
      status: 'upcoming',
      due: '1,500 miles',
      priority: 'medium'
    },
    {
      name: 'Brake Inspection',
      status: 'completed',
      date: '2024-02-15',
      priority: 'low'
    },
    {
      name: 'Air Filter',
      status: 'upcoming',
      due: '3,000 miles',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <PenTool className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Maintenance Predictor
        </h2>
      </div>

      {/* Next Service Alert */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200">
              Next Service Due
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {nextService.miles > 0 ? (
                <>In {nextService.miles.toLocaleString()} miles or by {nextService.estimated.toLocaleDateString()}</>
              ) : (
                'Service overdue'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-medium dark:text-white">Upcoming Maintenance</h3>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {maintenanceItems.map((item, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <AlertTriangle className={`h-5 w-5 mr-3 ${
                      item.priority === 'high' ? 'text-red-500' :
                      item.priority === 'medium' ? 'text-orange-500' :
                      'text-yellow-500'
                    }`} />
                  )}
                  <div>
                    <h4 className="font-medium dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.status === 'completed' ? 
                        `Completed on ${new Date(item.date).toLocaleDateString()}` :
                        `Due in ${item.due}`
                      }
                    </p>
                  </div>
                </div>
                {item.status === 'upcoming' && (
                  <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
                    Schedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IoT Integration Notice */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Connect your vehicle's IoT device for real-time maintenance monitoring and more accurate predictions.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePredictor;
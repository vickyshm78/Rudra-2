import React, { useState } from 'react';
import { Wrench, Calendar, MapPin, Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';

interface InspectionServicesProps {
  vehicleLocation: {
    city: string;
    state: string;
  };
}

const InspectionServices: React.FC<InspectionServicesProps> = ({ vehicleLocation }) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const inspectionServices = [
    {
      id: 'basic',
      name: 'Basic Inspection',
      price: 99,
      duration: '1 hour',
      features: [
        '150-point inspection',
        'Test drive evaluation',
        'Visual inspection',
        'Basic diagnostic scan'
      ]
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Inspection',
      price: 199,
      duration: '2 hours',
      features: [
        '200-point inspection',
        'Extended test drive',
        'Detailed diagnostic scan',
        'Undercarriage inspection',
        'Fluid analysis',
        'Photo documentation'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Inspection',
      price: 299,
      duration: '3 hours',
      features: [
        '300-point inspection',
        'Complete diagnostic analysis',
        'Compression testing',
        'Leak detection',
        'Paint thickness measurement',
        'Video documentation',
        'Market value assessment'
      ]
    }
  ];

  const availableDates = [
    '2025-05-20',
    '2025-05-21',
    '2025-05-22',
    '2025-05-23',
    '2025-05-24'
  ];

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle inspection booking
    alert('Inspection scheduled successfully!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
        <Wrench className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
        Professional Inspection Services
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {inspectionServices.map((service) => (
          <div 
            key={service.id}
            className={`border rounded-lg p-6 cursor-pointer transition-colors ${
              selectedService === service.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold dark:text-white">{service.name}</h3>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${service.price}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Clock className="h-4 w-4 mr-1" />
              {service.duration}
            </div>

            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedService && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Inspection Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Date</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">
                Inspection Location: {vehicleLocation.city}, {vehicleLocation.state}
              </span>
            </div>

            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The seller must be present at the inspection location with the vehicle. 
                Rescheduling is available up to 24 hours before the appointment.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Schedule Inspection
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default InspectionServices;
import React from 'react';
import { Vehicle } from '../../types';
import { Check, X, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface ComparisonTableProps {
  vehicles: Vehicle[];
  onRemove: (id: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ vehicles, onRemove }) => {
  // Common specifications to compare
  const specifications = [
    { label: 'Make', key: 'make' },
    { label: 'Model', key: 'model' },
    { label: 'Year', key: 'year' },
    { label: 'Price', key: 'price', format: (value: number) => formatCurrency(value) },
    { label: 'Mileage', key: 'mileage', format: (value: number) => `${value.toLocaleString()} miles` },
    { label: 'Condition', key: 'condition' },
    { label: 'Location', key: 'location', format: (value: any) => `${value.city}, ${value.state}` }
  ];

  // Common features to compare
  const features = [
    'Air Conditioning',
    'Power Steering',
    'Navigation',
    'Bluetooth',
    'Backup Camera',
    'Sunroof',
    'Leather Seats',
    'Heated Seats',
    'Third Row Seating',
    'Remote Start'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Vehicle Headers */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b dark:border-gray-700">
        <div className="font-semibold text-gray-500 dark:text-gray-400">
          Vehicle Details
        </div>
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <button
              onClick={() => onRemove(vehicle.id)}
              className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={vehicle.images[0]}
              alt={vehicle.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <Link 
              to={`/listing/${vehicle.id}`}
              className="block hover:text-blue-600 dark:hover:text-blue-400"
            >
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{vehicle.title}</h3>
            </Link>
            <p className="text-blue-600 dark:text-blue-400 font-bold">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
        ))}
      </div>

      {/* Specifications */}
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-4 dark:text-white">Specifications</h3>
        {specifications.map((spec) => (
          <div 
            key={spec.key} 
            className="grid grid-cols-4 gap-4 py-2 border-b last:border-0 dark:border-gray-700"
          >
            <div className="font-medium text-gray-600 dark:text-gray-400">
              {spec.label}
            </div>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="dark:text-gray-300">
                {spec.format 
                  ? spec.format(vehicle[spec.key as keyof Vehicle] as any)
                  : vehicle[spec.key as keyof Vehicle]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 dark:text-white">Features</h3>
        {features.map((feature) => (
          <div 
            key={feature} 
            className="grid grid-cols-4 gap-4 py-2 border-b last:border-0 dark:border-gray-700"
          >
            <div className="font-medium text-gray-600 dark:text-gray-400">
              {feature}
            </div>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id}>
                {vehicle.features.includes(feature) ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* View Details Links */}
      <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900">
        <div></div>
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            to={`/listing/${vehicle.id}`}
            className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ComparisonTable;
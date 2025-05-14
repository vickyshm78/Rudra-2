import React from 'react';
import { SearchFilters } from '../../types';
import { X } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onClose
}) => {
  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | number | string[]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const bodyTypes = [
    'Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Van',
    'Pickup', 'Hatchback', 'Minivan'
  ];

  const fuelTypes = [
    'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid',
    'Natural Gas', 'Hydrogen'
  ];

  const transmissions = [
    'Automatic', 'Manual', 'CVT', 'Semi-Automatic', 'Dual Clutch'
  ];

  const drivetrains = [
    'FWD', 'RWD', 'AWD', '4WD', '4x4'
  ];

  const features = [
    'Air Conditioning',
    'Bluetooth',
    'Cruise Control',
    'Navigation System',
    'Leather Seats',
    'Sunroof/Moonroof',
    'Backup Camera',
    'Parking Sensors',
    'Heated Seats',
    'Third Row Seating',
    'Apple CarPlay/Android Auto',
    'Blind Spot Monitoring',
    'Lane Departure Warning',
    'Premium Sound System'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">Advanced Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Body Type
          </label>
          <select
            value={filters.bodyType}
            onChange={(e) => handleInputChange('bodyType', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any</option>
            {bodyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleInputChange('fuelType', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any</option>
            {fuelTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleInputChange('transmission', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any</option>
            {transmissions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Drivetrain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Drivetrain
          </label>
          <select
            value={filters.drivetrain}
            onChange={(e) => handleInputChange('drivetrain', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any</option>
            {drivetrains.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Mileage Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mileage Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minMileage}
              onChange={(e) => handleInputChange('minMileage', e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxMileage}
              onChange={(e) => handleInputChange('maxMileage', e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exterior Color
          </label>
          <input
            type="text"
            value={filters.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            placeholder="Any color"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {features.map(feature => (
            <label
              key={feature}
              className="flex items-center space-x-2 text-sm"
            >
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={(e) => {
                  const newFeatures = e.target.checked
                    ? [...filters.features, feature]
                    : filters.features.filter(f => f !== feature);
                  handleInputChange('features', newFeatures);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
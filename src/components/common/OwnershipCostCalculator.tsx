import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, PenTool, Fuel, Shield } from 'lucide-react';

interface OwnershipCostCalculatorProps {
  vehiclePrice: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
}

const OwnershipCostCalculator: React.FC<OwnershipCostCalculatorProps> = ({
  vehiclePrice,
  make,
  model,
  year,
  mileage
}) => {
  const [annualMileage, setAnnualMileage] = useState(12000);
  const [fuelPrice, setFuelPrice] = useState(3.50);
  const [yearsOfOwnership, setYearsOfOwnership] = useState(5);
  
  const [costs, setCosts] = useState({
    insurance: 0,
    maintenance: 0,
    fuel: 0,
    depreciation: 0,
    total: 0
  });

  useEffect(() => {
    // Calculate estimated costs
    const calculateCosts = () => {
      // Example calculations - in a real app, these would be more sophisticated
      const monthlyInsurance = (vehiclePrice * 0.04) / 12;
      const annualMaintenance = (mileage / 10000) * 600;
      const fuelCostPerMile = 0.12; // Example MPG calculation
      const annualFuelCost = (annualMileage * fuelCostPerMile * fuelPrice);
      const annualDepreciation = vehiclePrice * 0.15;

      const totalAnnualCost = 
        (monthlyInsurance * 12) +
        annualMaintenance +
        annualFuelCost +
        annualDepreciation;

      setCosts({
        insurance: monthlyInsurance * 12,
        maintenance: annualMaintenance,
        fuel: annualFuelCost,
        depreciation: annualDepreciation,
        total: totalAnnualCost
      });
    };

    calculateCosts();
  }, [vehiclePrice, mileage, annualMileage, fuelPrice, yearsOfOwnership]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Cost of Ownership Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Annual Mileage
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              value={annualMileage}
              onChange={(e) => setAnnualMileage(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fuel Price ($/gallon)
          </label>
          <div className="relative">
            <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Years of Ownership
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={yearsOfOwnership}
              onChange={(e) => setYearsOfOwnership(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(year => (
                <option key={year} value={year}>{year} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Annual Cost Breakdown</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Insurance</span>
            </div>
            <span className="font-semibold dark:text-white">
              ${Math.round(costs.insurance).toLocaleString()}/year
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PenTool className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Maintenance</span>
            </div>
            <span className="font-semibold dark:text-white">
              ${Math.round(costs.maintenance).toLocaleString()}/year
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Fuel className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Fuel</span>
            </div>
            <span className="font-semibold dark:text-white">
              ${Math.round(costs.fuel).toLocaleString()}/year
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Depreciation</span>
            </div>
            <span className="font-semibold dark:text-white">
              ${Math.round(costs.depreciation).toLocaleString()}/year
            </span>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Annual Cost</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${Math.round(costs.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          * Estimates are based on average costs for a {year} {make} {model} in your area.
        </p>
        <p>
          * Actual costs may vary based on driving habits, local rates, and market conditions.
        </p>
      </div>
    </div>
  );
};

export default OwnershipCostCalculator;
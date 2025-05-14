import React from 'react';
import { useCompare } from '../hooks/useCompare';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ComparisonTable from '../components/compare/ComparisonTable';

const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="mt-20 py-16 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">No Vehicles to Compare</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Add vehicles to compare by clicking the compare button on vehicle listings.
        </p>
        <Link 
          to="/search" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Browse Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Compare Vehicles</h1>
          <button
            onClick={clearCompare}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear All
          </button>
        </div>

        <ComparisonTable 
          vehicles={compareList} 
          onRemove={removeFromCompare} 
        />
      </div>
    </div>
  );
};

export default ComparePage;
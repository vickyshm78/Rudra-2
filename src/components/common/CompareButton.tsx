import React from 'react';
import { Scale } from 'lucide-react';
import { useCompare } from '../../hooks/useCompare';
import { Vehicle } from '../../types';

interface CompareButtonProps {
  vehicle: Vehicle;
}

const CompareButton: React.FC<CompareButtonProps> = ({ vehicle }) => {
  const { addToCompare, removeFromCompare, isInCompare, isFull } = useCompare();
  const inCompare = isInCompare(vehicle.id);

  const handleClick = () => {
    if (inCompare) {
      removeFromCompare(vehicle.id);
    } else if (!isFull) {
      addToCompare(vehicle);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && isFull}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        inCompare 
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800' 
          : isFull
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
      title={isFull && !inCompare ? 'Maximum 3 vehicles can be compared' : ''}
    >
      <Scale className="h-4 w-4" />
      {inCompare ? 'Remove from Compare' : 'Add to Compare'}
    </button>
  );
};

export default CompareButton;
import React, { useState } from 'react';
import { SearchFilters } from '../../types';
import { X } from 'lucide-react';

interface SaveSearchModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
  filters: SearchFilters;
}

const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  onSave,
  onClose,
  filters
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Save Search</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="search-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search Name
            </label>
            <input
              type="text"
              id="search-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dream Car Search"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Criteria Summary
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {filters.type && <li>Type: {filters.type}</li>}
              {filters.make && <li>Make: {filters.make}</li>}
              {filters.model && <li>Model: {filters.model}</li>}
              {filters.minPrice && <li>Min Price: ${filters.minPrice}</li>}
              {filters.maxPrice && <li>Max Price: ${filters.maxPrice}</li>}
              {filters.yearMin && <li>Min Year: {filters.yearMin}</li>}
              {filters.yearMax && <li>Max Year: {filters.yearMax}</li>}
              {filters.location && <li>Location: {filters.location}</li>}
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveSearchModal;
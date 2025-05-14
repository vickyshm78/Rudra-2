import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  initialQuery?: string;
  initialType?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  initialQuery = '', 
  initialType = '' 
}) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get('query') || '');
  const [vehicleType, setVehicleType] = useState(initialType || searchParams.get('type') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery || searchParams.get('query') || '');
    setVehicleType(initialType || searchParams.get('type') || '');
  }, [initialQuery, initialType, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.append('query', query.trim());
    }
    
    if (vehicleType) {
      params.append('type', vehicleType);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}
    >
      <div className="relative flex-grow w-full">
        <input
          type="text"
          placeholder="Search for vehicles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      
      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        className="w-full sm:w-auto py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        <option value="">All Vehicle Types</option>
        <option value="Car">Cars</option>
        <option value="SUV">SUVs</option>
        <option value="Truck">Trucks</option>
        <option value="Motorcycle">Motorcycles</option>
        <option value="RV">RVs</option>
        <option value="Boat">Boats</option>
        <option value="Construction">Construction</option>
        <option value="Tractor">Tractors</option>
      </select>
      
      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
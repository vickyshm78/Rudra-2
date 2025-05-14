import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sliders, ChevronDown, ChevronUp, Bell, Save, Filter } from 'lucide-react';
import VehicleCard from '../components/common/VehicleCard';
import SearchBar from '../components/common/SearchBar';
import AdvancedFilters from '../components/search/AdvancedFilters';
import SaveSearchModal from '../components/search/SaveSearchModal';
import { getFilteredVehicles } from '../data/mockData';
import { Vehicle, VehicleType, SearchFilters } from '../types';
import { useSavedSearches } from '../hooks/useSavedSearches';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { savedSearches, saveSearch, toggleNotifications } = useSavedSearches();
  
  const initialFilters: SearchFilters = {
    query: queryParams.get('query') || '',
    type: (queryParams.get('type') as VehicleType) || '',
    minPrice: queryParams.get('minPrice') ? Number(queryParams.get('minPrice')) : '',
    maxPrice: queryParams.get('maxPrice') ? Number(queryParams.get('maxPrice')) : '',
    condition: [],
    location: '',
    radius: '',
    yearMin: '',
    yearMax: '',
    make: '',
    model: '',
    bodyType: '',
    fuelType: '',
    transmission: '',
    minMileage: '',
    maxMileage: '',
    features: [],
    color: '',
    drivetrain: ''
  };
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    // Update filters when URL changes
    const queryParams = new URLSearchParams(location.search);
    
    setFilters({
      ...filters,
      query: queryParams.get('query') || '',
      type: (queryParams.get('type') as VehicleType) || ''
    });
  }, [location.search]);
  
  useEffect(() => {
    // Get filtered vehicles
    const filteredVehicles = getFilteredVehicles({
      type: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      query: filters.query,
      condition: filters.condition
    });
    
    // Sort vehicles
    let sortedVehicles = [...filteredVehicles];
    
    if (sortBy === 'newest') {
      sortedVehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      sortedVehicles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'price_low') {
      sortedVehicles.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      sortedVehicles.sort((a, b) => b.price - a.price);
    }
    
    setVehicles(sortedVehicles);
  }, [filters, sortBy]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  
  const handleSaveSearch = (name: string) => {
    saveSearch(name, filters);
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
    setShowAdvancedFilters(false);
  };

  const handleSavedSearchClick = (savedSearch: SearchFilters) => {
    setFilters(savedSearch);
    setShowFilters(false);
  };
  
  return (
    <div className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Vehicle</h1>
          <SearchBar 
            initialQuery={filters.query} 
            initialType={filters.type} 
          />
          
          {/* Advanced Search Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </button>
            
            <button
              onClick={() => setShowSaveSearchModal(true)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Search
            </button>
          </div>
        </div>
        
        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Saved Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{search.name}</h3>
                    <button
                      onClick={() => toggleNotifications(search.id)}
                      className={`p-1 rounded-full ${
                        search.notificationsEnabled
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-400 bg-gray-50'
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {search.filters.type && `Type: ${search.filters.type}`}
                    {search.filters.make && `, Make: ${search.filters.make}`}
                    {search.filters.model && `, Model: ${search.filters.model}`}
                  </p>
                  <button
                    onClick={() => handleSavedSearchClick(search.filters)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Apply Search
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <Sliders className="h-5 w-5 mr-2 text-gray-700" />
                <span className="font-medium">Filters</span>
              </div>
              {showFilters ? (
                <ChevronUp className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mb-6">
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowAdvancedFilters(false)}
              />
            </div>
          )}
          
          {/* Save Search Modal */}
          {showSaveSearchModal && (
            <SaveSearchModal
              filters={filters}
              onSave={handleSaveSearch}
              onClose={() => setShowSaveSearchModal(false)}
            />
          )}
          
          {/* Results */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-wrap justify-between items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">{vehicles.length}</span> vehicles found
                  </p>
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="sort-by" className="mr-2 text-gray-600">Sort by:</label>
                  <select
                    id="sort-by"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    featured={vehicle.featured} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
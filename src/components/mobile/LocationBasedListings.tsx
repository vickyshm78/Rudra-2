import React, { useState, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated';
import { MapPin, Compass, AlertTriangle } from 'lucide-react';
import VehicleCard from '../common/VehicleCard';
import { Vehicle } from '../../types';
import { vehicles } from '../../data/mockData';

const LocationBasedListings: React.FC = () => {
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([]);
  const [radius, setRadius] = useState(50); // Default 50km radius

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (coords) {
      // Filter vehicles within the selected radius
      const nearby = vehicles.filter((vehicle) => {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          vehicle.location.coordinates.latitude,
          vehicle.location.coordinates.longitude
        );
        return distance <= radius;
      });

      setNearbyVehicles(nearby);
    }
  }, [coords, radius]);

  if (!isGeolocationAvailable) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Your browser does not support geolocation
        </div>
      </div>
    );
  }

  if (!isGeolocationEnabled) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Please enable location services to see nearby vehicles
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Nearby Vehicles
        </h2>
        <button
          onClick={() => getPosition()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Compass className="h-4 w-4 mr-2" />
          Update Location
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Radius
        </label>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>
      </div>

      {coords ? (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing vehicles within {radius}km of your location
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          {nearbyVehicles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No vehicles found within {radius}km of your location
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default LocationBasedListings;
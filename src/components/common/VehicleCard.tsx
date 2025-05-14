import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Activity } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  featured?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, featured = false }) => {
  return (
    <Link 
      to={`/listing/${vehicle.id}`}
      className={`block overflow-hidden rounded-lg transition-transform hover:scale-[1.02] ${
        featured 
          ? 'border-2 border-orange-500 bg-white shadow-lg' 
          : 'border border-gray-200 bg-white shadow'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-xs font-semibold py-1 px-2 rounded">
          Featured
        </div>
      )}
      
      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={vehicle.images[0]} 
          alt={vehicle.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-1/3"></div>
        <div className="absolute bottom-2 left-3 text-white font-bold text-lg">
          {formatCurrency(vehicle.price)}
        </div>
      </div>
      
      {/* Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{vehicle.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{vehicle.year}</span>
          <span className="mx-2">•</span>
          <Activity className="h-4 w-4 mr-1" />
          <span>{vehicle.mileage.toLocaleString()} miles</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{vehicle.location.city}, {vehicle.location.state}</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={vehicle.seller.avatar} 
              alt={vehicle.seller.name} 
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-xs text-gray-500">{vehicle.seller.name}</span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 py-1 px-2 rounded">
            {vehicle.condition}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
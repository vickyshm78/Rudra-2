import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { Vehicle } from '../../types';

interface FavoriteButtonProps {
  vehicle: Vehicle;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ vehicle }) => {
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const isFavorite = isInFavorites(vehicle.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(vehicle.id);
    } else {
      addToFavorites(vehicle);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-gray-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;
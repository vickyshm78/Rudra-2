import { useState, useEffect } from 'react';
import { Vehicle } from '../types';

const STORAGE_KEY = 'compareVehicles';
const MAX_COMPARE = 3;

export const useCompare = () => {
  const [compareList, setCompareList] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (vehicle: Vehicle) => {
    if (compareList.length < MAX_COMPARE && !isInCompare(vehicle.id)) {
      setCompareList([...compareList, vehicle]);
    }
  };

  const removeFromCompare = (vehicleId: string) => {
    setCompareList(compareList.filter(v => v.id !== vehicleId));
  };

  const isInCompare = (vehicleId: string) => {
    return compareList.some(v => v.id === vehicleId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    isFull: compareList.length >= MAX_COMPARE
  };
};
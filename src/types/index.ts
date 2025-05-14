export interface Vehicle {
  id: string;
  title: string;
  price: number;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  year: number;
  make: string;
  model: string;
  type: VehicleType;
  mileage: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  features: string[];
  images: string[];
  createdAt: string;
  seller: User;
  featured: boolean;
  videoUrl?: string;
  vin: string;
  registrationNumber: string;
}

export type VehicleType = 
  | 'Motorcycle' 
  | 'Scooter' 
  | 'Car' 
  | 'SUV' 
  | 'Van' 
  | 'Truck' 
  | 'Construction' 
  | 'Tractor' 
  | 'RV' 
  | 'Boat';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinedDate: string;
  rating: number;
  reviewCount: number;
  listings: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SearchFilters {
  query: string;
  type: VehicleType | '';
  minPrice: number | '';
  maxPrice: number | '';
  condition: ('New' | 'Used' | 'Certified Pre-Owned')[] | [];
  location: string;
  radius: number | '';
  yearMin: number | '';
  yearMax: number | '';
  make: string;
  model: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  minMileage: number | '';
  maxMileage: number | '';
  features: string[];
  color: string;
  drivetrain: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchNotification {
  id: string;
  savedSearchId: string;
  vehicleId: string;
  createdAt: string;
  read: boolean;
  vehicle?: Vehicle;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
}

export interface InsuranceQuote {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo: string;
  coverageType: string;
  premium: number;
  deductible: number;
  coverageDetails: {
    thirdParty: boolean;
    ownDamage: boolean;
    personalAccident: boolean;
    zeroDepreciation: boolean;
    roadSideAssistance: boolean;
    engineProtection: boolean;
    ncbProtection: boolean;
    consumables: boolean;
  };
  addOns: {
    name: string;
    description: string;
    price: number;
  }[];
  discounts: {
    name: string;
    description: string;
    amount: number;
  }[];
  totalPremium: number;
}

export interface InspectionSlot {
  id: string;
  date: string;
  timeSlots: {
    id: string;
    time: string;
    available: boolean;
  }[];
}

export interface InspectionBooking {
  id: string;
  vehicleId: string;
  inspectionType: 'basic' | 'comprehensive' | 'premium';
  date: string;
  time: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface CarSubscription {
  id: string;
  vehicleType: string;
  make: string;
  model: string;
  monthlyPrice: number;
  securityDeposit: number;
  minDuration: number;
  maxDuration: number;
  kmLimit: number;
  features: string[];
  availableColors: string[];
  provider: {
    name: string;
    logo: string;
    rating: number;
  };
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  compatibleVehicles: {
    make: string;
    model: string;
    years: number[];
  }[];
  images: string[];
  inStock: boolean;
  deliveryTime: string;
  installationAvailable: boolean;
  installationPrice?: number;
}

export interface WarrantyPlan {
  id: string;
  name: string;
  provider: string;
  coverageType: string;
  durationMonths: number;
  price: number;
  deductible: number;
  coveredComponents: string[];
  exclusions: string[];
  transferable: boolean;
  rating: number;
  reviewCount: number;
}

export interface RtoService {
  id: string;
  name: string;
  description: string;
  price: number;
  processingTime: string;
  requiredDocuments: string[];
  steps: string[];
}
import { Vehicle, User, Review, VehicleType } from '../types';

export const users: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'john.smith@example.com',
    phone: '(123) 456-7890',
    joinedDate: '2022-02-15',
    rating: 4.8,
    reviewCount: 24,
    listings: 5
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Emma Johnson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'emma.johnson@example.com',
    phone: '(234) 567-8901',
    joinedDate: '2021-07-12',
    rating: 4.9,
    reviewCount: 36,
    listings: 8
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Michael Brown',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    email: 'michael.brown@example.com',
    phone: '(345) 678-9012',
    joinedDate: '2022-10-05',
    rating: 4.6,
    reviewCount: 17,
    listings: 3
  }
];

export const reviews: Review[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Emma Johnson',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 5,
    comment: 'Great seller! Vehicle was exactly as described. The transaction was smooth and they were very responsive.',
    date: '2023-06-12'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    userName: 'Michael Brown',
    userAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4,
    comment: 'Positive experience overall. Vehicle was in good condition. The seller was professional and accommodating.',
    date: '2023-04-25'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    userName: 'John Smith',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 5,
    comment: 'Excellent transaction! The vehicle was even better than in the photos. Would definitely recommend!',
    date: '2023-07-18'
  }
];

export const vehicles: Vehicle[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: '2021 Tesla Model 3 Long Range',
    price: 42999,
    condition: 'Used',
    year: 2021,
    make: 'Tesla',
    model: 'Model 3',
    type: 'Car',
    mileage: 15230,
    vin: '5YJ3E1EA1MF123456',
    registrationNumber: 'ABC123XY',
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    description: 'Excellent condition 2021 Tesla Model 3 Long Range. Full self-driving capability, premium white interior, and 19" sport wheels. One owner, always garaged, and regularly serviced at Tesla.',
    features: ['Autopilot', 'Long Range Battery', 'Premium Interior', 'Glass Roof', 'Heated Seats'],
    images: [
      'https://images.pexels.com/photos/12861257/pexels-photo-12861257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/13975561/pexels-photo-13975561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/13053750/pexels-photo-13053750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-08-17',
    seller: users[0],
    featured: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: '2020 Harley-Davidson Road Glide Special',
    price: 24500,
    condition: 'Used',
    year: 2020,
    make: 'Harley-Davidson',
    model: 'Road Glide Special',
    type: 'Motorcycle',
    mileage: 8750,
    vin: '1HD1KTC14LB123456',
    registrationNumber: 'XYZ789AB',
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      coordinates: {
        latitude: 30.2672,
        longitude: -97.7431
      }
    },
    description: 'Beautiful Road Glide Special in Vivid Black. Comes with Screamin\' Eagle Stage II upgrade, custom exhaust, and premium sound system. Well maintained with service records available.',
    features: ['Custom Exhaust', 'Premium Audio', 'Screamin\' Eagle Upgrade', 'Cruise Control', 'ABS'],
    images: [
      'https://images.pexels.com/photos/2393815/pexels-photo-2393815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-08-10',
    seller: users[1],
    featured: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: '2019 Ford F-150 Raptor',
    price: 62000,
    condition: 'Used',
    year: 2019,
    make: 'Ford',
    model: 'F-150 Raptor',
    type: 'Truck',
    mileage: 32000,
    vin: '1FTFW1RG5KFD12345',
    registrationNumber: 'DEF456GH',
    location: {
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      coordinates: {
        latitude: 39.7392,
        longitude: -104.9903
      }
    },
    description: '2019 Ford F-150 Raptor in perfect condition. 3.5L EcoBoost V6, FOX Racing Shocks, and all-terrain tires. Loaded with options including panoramic sunroof, leather interior, and advanced technology package.',
    features: ['FOX Racing Shocks', '3.5L EcoBoost V6', 'Terrain Management System', 'Leather Interior', 'Navigation'],
    images: [
      'https://images.pexels.com/photos/712614/pexels-photo-712614.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-07-29',
    seller: users[2],
    featured: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: '2022 Airstream Interstate 24X',
    price: 245000,
    condition: 'New',
    year: 2022,
    make: 'Airstream',
    model: 'Interstate 24X',
    type: 'RV',
    mileage: 500,
    vin: 'WDAPF4CC1N3123456',
    registrationNumber: 'JKL789MN',
    location: {
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      coordinates: {
        latitude: 45.5051,
        longitude: -122.6750
      }
    },
    description: 'Brand new Airstream Interstate 24X Adventure Van. Built on Mercedes-Benz Sprinter 3500 chassis with 4x4. Luxury interior with advanced off-grid capabilities. Perfect for adventure enthusiasts.',
    features: ['4x4 Capability', 'Solar Panels', 'Advanced Power System', 'Full Kitchen', 'Bathroom with Shower'],
    images: [
      'https://images.pexels.com/photos/2897829/pexels-photo-2897829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2528700/pexels-photo-2528700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2897825/pexels-photo-2897825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-08-14',
    seller: users[0],
    featured: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: '2021 Sea Ray SLX 400',
    price: 695000,
    condition: 'Used',
    year: 2021,
    make: 'Sea Ray',
    model: 'SLX 400',
    type: 'Boat',
    mileage: 120,
    vin: 'SRAY400B121123456',
    registrationNumber: 'PQR123ST',
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      coordinates: {
        latitude: 25.7617,
        longitude: -80.1918
      }
    },
    description: 'Immaculate 2021 Sea Ray SLX 400 with only 120 hours. Twin 450hp Mercury engines, Seakeeper gyroscopic stabilizer, and premium sound system. Perfect for entertaining with spacious deck and cabin.',
    features: ['Twin Mercury 450hp Engines', 'Seakeeper', 'Premium Sound System', 'Cabin with Queen Berth', 'Wet Bar'],
    images: [
      'https://images.pexels.com/photos/673171/pexels-photo-673171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2582501/pexels-photo-2582501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-08-05',
    seller: users[1],
    featured: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: '2020 Caterpillar 336 Excavator',
    price: 289000,
    condition: 'Used',
    year: 2020,
    make: 'Caterpillar',
    model: '336 Excavator',
    type: 'Construction',
    mileage: 1200,
    vin: 'CAT336GC20123456',
    registrationNumber: 'UVW456XY',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298
      }
    },
    description: 'Low-hour 2020 Caterpillar 336 Excavator with all maintenance up to date. Features Cat Grade with 2D, E-fence, Payload, and Assist. Excellent condition with no issues.',
    features: ['Cat Grade with 2D', 'E-fence', 'Payload', 'Assist', '313 HP Engine'],
    images: [
      'https://images.pexels.com/photos/2058749/pexels-photo-2058749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6353745/pexels-photo-6353745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/220274/pexels-photo-220274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: '2023-07-22',
    seller: users[2],
    featured: true
  }
];

// Helper function to get filtered vehicles
export const getFilteredVehicles = (filters: {
  type?: VehicleType | '';
  minPrice?: number | '';
  maxPrice?: number | '';
  query?: string;
  condition?: string[];
}) => {
  return vehicles.filter(vehicle => {
    // Filter by type
    if (filters.type && vehicle.type !== filters.type) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && vehicle.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && vehicle.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchString = `${vehicle.title} ${vehicle.make} ${vehicle.model} ${vehicle.description}`.toLowerCase();
      if (!searchString.includes(query)) {
        return false;
      }
    }
    
    // Filter by condition
    if (filters.condition && filters.condition.length > 0 && !filters.condition.includes(vehicle.condition)) {
      return false;
    }
    
    return true;
  });
};

// Helper function to get a vehicle by ID
export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find(vehicle => vehicle.id === id);
};

// Helper function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to get reviews for a user
export const getReviewsForUser = (userId: string): Review[] => {
  return reviews.filter(review => review.userId === userId);
};

// Helper function to get featured vehicles
export const getFeaturedVehicles = (): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.featured);
};

// Helper function to get vehicles by type
export const getVehiclesByType = (type: VehicleType): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.type === type);
};

// Helper function to get vehicles by seller
export const getVehiclesBySeller = (sellerId: string): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.seller.id === sellerId);
};

// Helper function to get similar vehicles
export const getSimilarVehicles = (vehicle: Vehicle): Vehicle[] => {
  return vehicles
    .filter(v => v.id !== vehicle.id && v.type === vehicle.type)
    .slice(0, 3);
};
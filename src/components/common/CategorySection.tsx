import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Truck, Bike, Ship, Warehouse, Tractor, Home } from 'lucide-react';

interface CategoryProps {
  icon: React.ReactNode;
  name: string;
  type: string;
  description: string;
}

const Category: React.FC<CategoryProps> = ({ icon, name, type, description }) => (
  <Link
    to={`/search?type=${type}`}
    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center"
  >
    <div className="p-3 bg-blue-50 text-blue-800 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{name}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </Link>
);

const CategorySection: React.FC = () => {
  const categories = [
    {
      icon: <Car className="h-6 w-6" />,
      name: "Cars & SUVs",
      type: "Car",
      description: "Find your perfect car from thousands of listings"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      name: "Trucks & Vans",
      type: "Truck",
      description: "Work vehicles for every business and lifestyle"
    },
    {
      icon: <Bike className="h-6 w-6" />,
      name: "Motorcycles",
      type: "Motorcycle",
      description: "Sport bikes, cruisers, and everything on two wheels"
    },
    {
      icon: <Ship className="h-6 w-6" />,
      name: "Boats",
      type: "Boat",
      description: "From speedboats to yachts for your water adventures"
    },
    {
      icon: <Home className="h-6 w-6" />,
      name: "RVs",
      type: "RV",
      description: "Motorhomes and campers for your next road trip"
    },
    {
      icon: <Warehouse className="h-6 w-6" />,
      name: "Construction",
      type: "Construction",
      description: "Heavy machinery and construction equipment"
    },
    {
      icon: <Tractor className="h-6 w-6" />,
      name: "Tractors",
      type: "Tractor",
      description: "Farm equipment for agricultural needs"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Explore by Category</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Whether you're looking for a daily driver, a work vehicle, or something for weekend adventures, 
          we have the perfect ride for you.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Category key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
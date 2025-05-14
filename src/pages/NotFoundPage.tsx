import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="mt-20 py-16 container mx-auto px-4 text-center">
      <AlertTriangle className="h-20 w-20 text-orange-500 mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/" 
          className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <Home className="h-5 w-5 mr-2" />
          Go Home
        </Link>
        <Link 
          to="/search" 
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <Search className="h-5 w-5 mr-2" />
          Browse Vehicles
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
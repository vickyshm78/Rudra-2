import React, { useState, useEffect } from 'react';
import { Car, Calendar, Shield, FileText, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface VehicleLinkedDashboardProps {
  userId: string;
}

interface UserVehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  insurance: {
    provider: string;
    policyNumber: string;
    validUntil: string;
    status: 'active' | 'expiring' | 'expired';
  };
  registration: {
    rto: string;
    validUntil: string;
    status: 'active' | 'expiring' | 'expired';
  };
  puc: {
    validUntil: string;
    status: 'active' | 'expiring' | 'expired';
  };
  serviceHistory: {
    lastService: string;
    nextDue: string;
    status: 'upcoming' | 'overdue' | 'ok';
  };
}

const VehicleLinkedDashboard: React.FC<VehicleLinkedDashboardProps> = ({ userId }) => {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchUserVehicles();
  }, [userId]);

  const fetchUserVehicles = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockVehicles: UserVehicle[] = [
        {
          id: 'v1',
          registrationNumber: 'MH01AB1234',
          make: 'Honda',
          model: 'City',
          year: 2020,
          insurance: {
            provider: 'HDFC ERGO',
            policyNumber: 'HDFC123456789',
            validUntil: '2025-12-31',
            status: 'active'
          },
          registration: {
            rto: 'Mumbai RTO',
            validUntil: '2035-05-15',
            status: 'active'
          },
          puc: {
            validUntil: '2025-06-30',
            status: 'active'
          },
          serviceHistory: {
            lastService: '2024-02-15',
            nextDue: '2025-08-15',
            status: 'ok'
          }
        },
        {
          id: 'v2',
          registrationNumber: 'KA01CD5678',
          make: 'Maruti Suzuki',
          model: 'Swift',
          year: 2019,
          insurance: {
            provider: 'ICICI Lombard',
            policyNumber: 'ICICI987654321',
            validUntil: '2025-07-15',
            status: 'expiring'
          },
          registration: {
            rto: 'Bangalore RTO',
            validUntil: '2034-03-22',
            status: 'active'
          },
          puc: {
            validUntil: '2025-05-10',
            status: 'expiring'
          },
          serviceHistory: {
            lastService: '2024-01-10',
            nextDue: '2025-07-10',
            status: 'upcoming'
          }
        }
      ];
      
      setVehicles(mockVehicles);
      if (mockVehicles.length > 0 && !selectedVehicle) {
        setSelectedVehicle(mockVehicles[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch user vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock vehicle with generated data
      const newVehicleData: UserVehicle = {
        id: `v${Date.now()}`,
        registrationNumber: newVehicle.registrationNumber,
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        insurance: {
          provider: 'Unknown',
          policyNumber: 'Not Available',
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active'
        },
        registration: {
          rto: 'Unknown RTO',
          validUntil: new Date(Date.now() + 15 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active'
        },
        puc: {
          validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active'
        },
        serviceHistory: {
          lastService: 'Not Available',
          nextDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'ok'
        }
      };
      
      setVehicles([...vehicles, newVehicleData]);
      setSelectedVehicle(newVehicleData.id);
      setShowAddVehicle(false);
      setNewVehicle({
        registrationNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear()
      });
    } catch (error) {
      console.error('Failed to add vehicle:', error);
    }
  };

  const getStatusColor = (status: 'active' | 'expiring' | 'expired' | 'upcoming' | 'overdue' | 'ok') => {
    switch (status) {
      case 'active':
      case 'ok':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'expiring':
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'expired':
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: 'active' | 'expiring' | 'expired' | 'upcoming' | 'overdue' | 'ok') => {
    switch (status) {
      case 'active':
      case 'ok':
        return <CheckCircle className="h-4 w-4" />;
      case 'expiring':
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'expired':
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white flex items-center">
            <Car className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            My Vehicles
          </h2>
          
          <button
            onClick={() => setShowAddVehicle(!showAddVehicle)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {showAddVehicle ? 'Cancel' : '+ Add Vehicle'}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showAddVehicle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg overflow-hidden"
          >
            <h3 className="font-medium mb-4 dark:text-white">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., MH01AB1234"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Honda"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., City"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Vehicle Selector */}
        {vehicles.length > 0 && (
          <div className="mb-6">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`flex-shrink-0 p-3 rounded-lg border transition-colors ${
                    selectedVehicle === vehicle.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                      <Car className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium dark:text-white">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Dashboard */}
        {selectedVehicleData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insurance Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium dark:text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Insurance
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(selectedVehicleData.insurance.status)}`}>
                    {getStatusIcon(selectedVehicleData.insurance.status)}
                    <span className="ml-1">
                      {selectedVehicleData.insurance.status === 'active' ? 'Active' :
                       selectedVehicleData.insurance.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                    </span>
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provider</p>
                    <p className="font-medium dark:text-white">{selectedVehicleData.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Policy Number</p>
                    <p className="font-medium dark:text-white">{selectedVehicleData.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="font-medium dark:text-white">{formatDate(selectedVehicleData.insurance.validUntil)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/insurance"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedVehicleData.insurance.status === 'expired' ? 'Renew Now' :
                     selectedVehicleData.insurance.status === 'expiring' ? 'Renew Soon' : 'View Details'}
                  </Link>
                </div>
              </div>
              
              {/* Registration Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Registration
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(selectedVehicleData.registration.status)}`}>
                    {getStatusIcon(selectedVehicleData.registration.status)}
                    <span className="ml-1">
                      {selectedVehicleData.registration.status === 'active' ? 'Active' :
                       selectedVehicleData.registration.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                    </span>
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">RTO</p>
                    <p className="font-medium dark:text-white">{selectedVehicleData.registration.rto}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Registration Number</p>
                    <p className="font-medium dark:text-white">{selectedVehicleData.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="font-medium dark:text-white">{formatDate(selectedVehicleData.registration.validUntil)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/rto-services"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* PUC Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium dark:text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    PUC Certificate
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(selectedVehicleData.puc.status)}`}>
                    {getStatusIcon(selectedVehicleData.puc.status)}
                    <span className="ml-1">
                      {selectedVehicleData.puc.status === 'active' ? 'Active' :
                       selectedVehicleData.puc.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                    </span>
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="font-medium dark:text-white">{formatDate(selectedVehicleData.puc.validUntil)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Next Check</p>
                    <p className="font-medium dark:text-white">{formatDate(selectedVehicleData.puc.validUntil)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/puc-services"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedVehicleData.puc.status === 'expired' ? 'Renew Now' :
                     selectedVehicleData.puc.status === 'expiring' ? 'Renew Soon' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Service History */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Service History
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(selectedVehicleData.serviceHistory.status)}`}>
                  {getStatusIcon(selectedVehicleData.serviceHistory.status)}
                  <span className="ml-1">
                    {selectedVehicleData.serviceHistory.status === 'ok' ? 'Up to Date' :
                     selectedVehicleData.serviceHistory.status === 'upcoming' ? 'Due Soon' : 'Overdue'}
                  </span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Service</p>
                  <p className="font-medium dark:text-white">
                    {selectedVehicleData.serviceHistory.lastService === 'Not Available' 
                      ? 'Not Available' 
                      : formatDate(selectedVehicleData.serviceHistory.lastService)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Next Service Due</p>
                  <p className="font-medium dark:text-white">
                    {formatDate(selectedVehicleData.serviceHistory.nextDue)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to="/service-booking"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {selectedVehicleData.serviceHistory.status === 'overdue' ? 'Book Service Now' :
                   selectedVehicleData.serviceHistory.status === 'upcoming' ? 'Schedule Service' : 'View Service History'}
                </Link>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/insurance"
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              >
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Renew Insurance</span>
              </Link>
              
              <Link
                to="/rto-services"
                className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
              >
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">RC Services</span>
              </Link>
              
              <Link
                to="/service-booking"
                className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
              >
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Book Service</span>
              </Link>
              
              <Link
                to="/vehicle-history"
                className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
              >
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Vehicle History</span>
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Vehicles Added
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add your vehicle to access all services in one place
            </p>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleLinkedDashboard;
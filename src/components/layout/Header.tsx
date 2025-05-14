import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Car, Menu, X, PlusCircle, MessageSquare, Mic, Shield, FileText, Activity, CreditCard, Truck, Calendar, ChevronDown, ChevronUp, DollarSign, Zap, Wrench, Ban as Bank, CheckCircle, Lock, Calculator } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../common/NotificationBell';
import { createClient } from '@supabase/supabase-js';
import LanguageSwitcher from '../common/LanguageSwitcher';
import VoiceSearch from '../common/VoiceSearch';
import { motion } from 'framer-motion';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [userVehicles, setUserVehicles] = useState<{id: string, registrationNumber: string, make: string, model: string}[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [financeMenuOpen, setFinanceMenuOpen] = useState(false);
  const [mobileServicesMenuOpen, setMobileServicesMenuOpen] = useState(false);
  const [mobileFinanceMenuOpen, setMobileFinanceMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        // Fetch user's vehicles
        fetchUserVehicles(user.id);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      setIsAuthenticated(event === 'SIGNED_IN');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserVehicles = async (userId: string) => {
    try {
      // In a real app, this would fetch from the database
      // Mock data for now
      const mockVehicles = [
        { id: 'v1', registrationNumber: 'MH01AB1234', make: 'Honda', model: 'City' },
        { id: 'v2', registrationNumber: 'KA01CD5678', make: 'Maruti', model: 'Swift' }
      ];
      
      setUserVehicles(mockVehicles);
      setSelectedVehicle(mockVehicles[0].id);
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleVoiceSearch = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  // Value-Added Services menu items
  const valueAddedServices = [
    { name: 'Vehicle Inspection', path: '/inspection', icon: <Activity className="h-4 w-4 mr-2" /> },
    { name: 'RTO Services', path: '/rto-services', icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: 'Doorstep Test Drive', path: '/test-drive', icon: <Car className="h-4 w-4 mr-2" /> },
    { name: 'Vehicle Transport', path: '/transport', icon: <Truck className="h-4 w-4 mr-2" /> },
    { name: 'Extended Warranty', path: '/warranty', icon: <Shield className="h-4 w-4 mr-2" /> },
    { name: 'Service Booking', path: '/service-booking', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: 'Maintenance Services', path: '/maintenance', icon: <Wrench className="h-4 w-4 mr-2" /> },
    { name: 'Accessories Marketplace', path: '/accessories', icon: <Zap className="h-4 w-4 mr-2" /> }
  ];

  // Finance & Insurance menu items
  const financeInsuranceItems = [
    { name: 'Insurance', path: '/insurance', icon: <Shield className="h-4 w-4 mr-2" /> },
    { name: 'Loan Calculator', path: '/guides/calculator', icon: <Calculator className="h-4 w-4 mr-2" /> },
    { name: 'Loan Applications', path: '/guides/financing', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { name: 'Bank Comparison', path: '/guides/financing', icon: <Bank className="h-4 w-4 mr-2" /> },
    { name: 'EMI Options', path: '/guides/financing', icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { name: 'Pre-Approved Loans', path: '/guides/financing', icon: <CheckCircle className="h-4 w-4 mr-2" /> },
    { name: 'Escrow Services', path: '/guides/financing', icon: <Lock className="h-4 w-4 mr-2" /> }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' 
          ? 'bg-white dark:bg-gray-900 shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Car 
              className={`h-8 w-8 mr-2 transition-colors duration-300 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-red-600 dark:text-red-500' 
                  : 'text-white'
              }`} 
            />
            <div className="flex flex-col">
              <span 
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-red-600 dark:text-red-500' 
                    : 'text-white'
                }`}
              >
                99CarMart
              </span>
              <span 
                className={`text-xs transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-200'
                }`}
              >
                A Unit of Rudra Group
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/search" 
              className={`transition-colors duration-300 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Browse All
            </Link>
            
            {/* Value-Added Services Dropdown */}
            <div className="relative group">
              <button 
                className={`transition-colors duration-300 flex items-center ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500' 
                    : 'text-white hover:text-gray-200'
                }`}
                onMouseEnter={() => setServicesMenuOpen(true)}
                onMouseLeave={() => setServicesMenuOpen(false)}
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
              >
                Value-Added Services
                {servicesMenuOpen ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>
              
              {servicesMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 grid grid-cols-1 gap-1"
                  onMouseEnter={() => setServicesMenuOpen(true)}
                  onMouseLeave={() => setServicesMenuOpen(false)}
                >
                  {valueAddedServices.map((service) => (
                    <Link 
                      key={service.path}
                      to={service.path} 
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      {service.icon}
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Finance & Insurance Dropdown */}
            <div className="relative group">
              <button 
                className={`transition-colors duration-300 flex items-center ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500' 
                    : 'text-white hover:text-gray-200'
                }`}
                onMouseEnter={() => setFinanceMenuOpen(true)}
                onMouseLeave={() => setFinanceMenuOpen(false)}
                onClick={() => setFinanceMenuOpen(!financeMenuOpen)}
              >
                Finance & Insurance
                {financeMenuOpen ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>
              
              {financeMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 grid grid-cols-1 gap-1"
                  onMouseEnter={() => setFinanceMenuOpen(true)}
                  onMouseLeave={() => setFinanceMenuOpen(false)}
                >
                  {financeInsuranceItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              to="/compare" 
              className={`transition-colors duration-300 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Compare
            </Link>
            
            <Link 
              to="/blog" 
              className={`transition-colors duration-300 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setShowVoiceSearch(true)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            {isAuthenticated && <NotificationBell />}
            <Link 
              to="/create-listing" 
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex justify-center items-center transition-colors duration-300"
            >
              <PlusCircle className="w-5 h-5 mr-1" />
              Sell Vehicle
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    isScrolled || location.pathname !== '/' 
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 hidden group-hover:block">
                  {userVehicles.length > 0 && (
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">My Vehicles</p>
                      {userVehicles.map(vehicle => (
                        <button
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                          className="flex items-center w-full text-left mb-2 last:mb-0"
                        >
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                            <Car className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.registrationNumber}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile/550e8400-e29b-41d4-a716-446655440000" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X 
                className={`h-6 w-6 transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-700 dark:text-white' 
                    : 'text-white'
                }`} 
              />
            ) : (
              <Menu 
                className={`h-6 w-6 transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-gray-700 dark:text-white' 
                    : 'text-white'
                }`} 
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen bg-white dark:bg-gray-900 shadow-md' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 pb-4 space-y-3">
          <Link 
            to="/search"
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse All
          </Link>
          
          {/* Mobile Value-Added Services Dropdown */}
          <div>
            <button
              onClick={() => setMobileServicesMenuOpen(!mobileServicesMenuOpen)}
              className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
            >
              <span>Value-Added Services</span>
              {mobileServicesMenuOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {mobileServicesMenuOpen && (
              <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                {valueAddedServices.map((service) => (
                  <Link 
                    key={service.path}
                    to={service.path} 
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {service.icon}
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Finance & Insurance Dropdown */}
          <div>
            <button
              onClick={() => setMobileFinanceMenuOpen(!mobileFinanceMenuOpen)}
              className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
            >
              <span>Finance & Insurance</span>
              {mobileFinanceMenuOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {mobileFinanceMenuOpen && (
              <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                {financeInsuranceItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link 
            to="/compare" 
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Compare
          </Link>
          
          <Link 
            to="/blog" 
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Link 
              to="/create-listing" 
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Sell Vehicle
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile/550e8400-e29b-41d4-a716-446655440000" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            )}
            <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                onClick={() => {
                  setShowVoiceSearch(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Quick Access Bar - Only show when user is authenticated and has vehicles */}
      {isAuthenticated && userVehicles.length > 0 && selectedVehicle && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`hidden md:block border-t border-gray-200 dark:border-gray-700 ${
            isScrolled || location.pathname !== '/' 
              ? 'bg-white dark:bg-gray-900' 
              : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
          }`}
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="text-sm font-medium bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 pr-8"
                >
                  {userVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/insurance"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Renew Insurance
                </Link>
                <Link
                  to="/rto-services"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  RC Services
                </Link>
                <Link
                  to="/service-booking"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Book Service
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <VoiceSearch 
          onSearch={handleVoiceSearch}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}
    </header>
  );
};

export default Header;
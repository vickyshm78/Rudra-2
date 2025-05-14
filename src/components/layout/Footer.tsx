import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Facebook, Twitter, Instagram, Youtube, Mail, Phone, Shield, 
  FileText, Truck, CreditCard, Activity, Calendar, ChevronDown, ChevronUp, 
  DollarSign, Zap, Wrench, Ban as Bank, CheckCircle, Lock, Calculator
} from 'lucide-react';

const Footer: React.FC = () => {
  const [servicesExpanded, setServicesExpanded] = React.useState(false);
  const [financeExpanded, setFinanceExpanded] = React.useState(false);

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
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Car className="h-8 w-8 mr-2 text-red-500" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-red-500">99CarMart</span>
                <span className="text-xs text-gray-400">A Unit of Rudra Group</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted destination for quality vehicles. We offer a wide selection of cars,
              motorcycles, trucks, and more, all backed by our commitment to excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Value-Added Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Value-Added Services</h3>
              <button 
                className="md:hidden text-gray-400"
                onClick={() => setServicesExpanded(!servicesExpanded)}
              >
                {servicesExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
            <ul className={`space-y-2 ${servicesExpanded ? 'block' : 'hidden md:block'}`}>
              {valueAddedServices.map((service) => (
                <li key={service.path}>
                  <Link to={service.path} className="text-gray-400 hover:text-white transition-colors flex items-center">
                    {service.icon}
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Finance & Insurance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Finance & Insurance</h3>
              <button 
                className="md:hidden text-gray-400"
                onClick={() => setFinanceExpanded(!financeExpanded)}
              >
                {financeExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
            <ul className={`space-y-2 ${financeExpanded ? 'block' : 'hidden md:block'}`}>
              {financeInsuranceItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors flex items-center">
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guides/selling" className="text-gray-400 hover:text-white transition-colors">
                  Selling Guide
                </Link>
              </li>
              <li>
                <Link to="/guides/buying" className="text-gray-400 hover:text-white transition-colors">
                  Buying Tips
                </Link>
              </li>
              <li>
                <Link to="/guides/financing" className="text-gray-400 hover:text-white transition-colors">
                  Financing Options
                </Link>
              </li>
              <li>
                <Link to="/guides/history" className="text-gray-400 hover:text-white transition-colors">
                  Vehicle History
                </Link>
              </li>
              <li>
                <Link to="/guides/calculator" className="text-gray-400 hover:text-white transition-colors">
                  Price Calculator
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-400">info@99carmart.com</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-400">1-800-99MARTS (996-2787)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Dealer Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dealer-signup" className="text-gray-400 hover:text-white transition-colors">
                    Become a Dealer
                  </Link>
                </li>
                <li>
                  <Link to="/dealer-login" className="text-gray-400 hover:text-white transition-colors">
                    Dealer Login
                  </Link>
                </li>
                <li>
                  <Link to="/dealer-tools" className="text-gray-400 hover:text-white transition-colors">
                    Dealer Tools
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-gray-200 py-2 px-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 flex-grow"
                />
                <button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 99CarMart. A Unit of Rudra Group. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-gray-500 hover:text-gray-300 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
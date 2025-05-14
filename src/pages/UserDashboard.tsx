import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Car, Heart, MessageSquare, Bell, Settings, 
  FileText, TrendingUp, Eye, Edit, Trash2,
  AlertTriangle, CheckCircle, X, Search,
  Filter, Download, Upload, User, Calendar,
  Shield, DollarSign
} from 'lucide-react';
import { Vehicle } from '../types';
import { vehicles } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';
import VehicleLinkedDashboard from '../components/common/VehicleLinkedDashboard';
import { UserDashboardActionBar } from '../components/common/StickyActionBar';
import DocumentScanner from '../components/common/DocumentScanner';
import { useToast } from '../components/common/MicroInteractions';
import ProgressSteps from '../components/common/ProgressSteps';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { favorites } = useFavorites();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [documentType, setDocumentType] = useState<'rc' | 'insurance' | 'pan' | 'aadhaar'>('rc');
  const { showToast, ToastComponent } = useToast();
  
  // Mock user data
  const userData = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    joinedDate: '2022-02-15',
    listings: vehicles.filter(v => v.seller.id === '550e8400-e29b-41d4-a716-446655440000'),
    stats: {
      totalViews: 1234,
      totalMessages: 45,
      activeListings: 5,
      completedSales: 12,
      totalEarnings: 125000,
      averageRating: 4.8
    },
    preferences: {
      emailNotifications: true,
      darkMode: false,
      language: 'English',
      currency: 'USD'
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user data, notifications, messages, etc.
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleDeleteListing = (listingId: string) => {
    setSelectedListing(listingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;

    try {
      // In a real app, this would delete the listing from the database
      showToast('Listing deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedListing(null);
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update user settings
    showToast('Settings saved successfully!', 'success');
    setShowSettingsModal(false);
  };

  const handleDocumentScan = (data: any) => {
    console.log('Scanned document data:', data);
    showToast(`Document scanned successfully! ${data.fields?.registrationNumber || ''}`, 'success');
    setShowDocumentScanner(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 mr-2" />
            <p className="text-red-600 dark:text-red-500">{error}</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Vehicle Dashboard */}
            <VehicleLinkedDashboard userId={userData.id} />
            
            {/* Document Scanner Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold dark:text-white mb-4">Quick Document Scan</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Scan your documents to auto-fill forms and save time. We support RC, insurance policy, PAN, and Aadhaar.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setDocumentType('rc');
                    setShowDocumentScanner(true);
                  }}
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Scan RC Book</span>
                </button>
                
                <button
                  onClick={() => {
                    setDocumentType('insurance');
                    setShowDocumentScanner(true);
                  }}
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
                >
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Scan Insurance</span>
                </button>
                
                <button
                  onClick={() => {
                    setDocumentType('pan');
                    setShowDocumentScanner(true);
                  }}
                  className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                >
                  <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Scan PAN Card</span>
                </button>
                
                <button
                  onClick={() => {
                    setDocumentType('aadhaar');
                    setShowDocumentScanner(true);
                  }}
                  className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex flex-col items-center text-center hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
                >
                  <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Scan Aadhaar</span>
                </button>
              </div>
            </div>
            
            {/* Guided Workflow Example */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold dark:text-white mb-4">RC Transfer Process</h2>
              
              <ProgressSteps 
                steps={[
                  "Document Collection",
                  "Form Filling",
                  "Payment",
                  "RTO Submission",
                  "Verification",
                  "RC Delivery"
                ]}
                currentStep={3}
                editable={true}
                onStepClick={(step) => {
                  showToast(`Navigating to step ${step + 1}`, 'info');
                }}
              />
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current Step: Payment</h3>
                <p className="text-blue-600 dark:text-blue-300 text-sm">
                  Complete the payment for your RC transfer. You can pay online or at the RTO office.
                </p>
                <button
                  onClick={() => showToast('Proceeding to payment...', 'info')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Active Listings</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {userData.stats.activeListings}
                    </h3>
                  </div>
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Views</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {userData.stats.totalViews}
                    </h3>
                  </div>
                  <Eye className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Earnings</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {formatCurrency(userData.stats.totalEarnings)}
                    </h3>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Average Rating</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {userData.stats.averageRating}
                    </h3>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold dark:text-white">Your Listings</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Views</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.listings.map((listing: Vehicle) => (
                      <tr key={listing.id} className="border-t dark:border-gray-700">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={listing.images[0]} 
                              alt={listing.title}
                              className="w-12 h-12 rounded object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium dark:text-white">{listing.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {listing.year} • {listing.mileage.toLocaleString()} miles
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 dark:text-white">
                          {formatCurrency(listing.price)}
                        </td>
                        <td className="p-4 dark:text-white">
                          {Math.floor(Math.random() * 1000)}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Active
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Link
                              to={`/listing/${listing.id}/edit`}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Messages</h2>
            </div>
            <div className="p-6">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium dark:text-white">{message.sender.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {message.subject}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {message.date}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Messages
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    You don't have any messages yet
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
            </div>
            <div className="p-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-700'
                          : 'bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {notification.type === 'success' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {notification.type === 'warning' && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          {notification.type === 'info' && (
                            <Bell className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium dark:text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold dark:text-white">Account Settings</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center">
                      <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <button
                        type="button"
                        className="ml-5 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.name}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        defaultValue={userData.preferences.language}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                        <option>Bengali</option>
                        <option>Marathi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency
                      </label>
                      <select
                        defaultValue={userData.preferences.currency}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option>INR</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email_notifications"
                            type="checkbox"
                            defaultChecked={userData.preferences.emailNotifications}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label
                            htmlFor="email_notifications"
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Email notifications
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Receive email notifications about your listings and messages
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold dark:text-white">Security</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Password
                    </h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Change Password
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-4">
                Danger Zone
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center">
            <img 
              src={userData.avatar} 
              alt={userData.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{userData.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Member since {userData.joinedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Car className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'listings'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Car className="h-5 w-5" />
                  <span>My Listings</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'messages'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold dark:text-white">Delete Listing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Scanner Modal */}
      {showDocumentScanner && (
        <DocumentScanner
          onScan={handleDocumentScan}
          onClose={() => setShowDocumentScanner(false)}
          documentType={documentType}
        />
      )}

      {/* Mobile Action Bar */}
      <UserDashboardActionBar />

      {/* Toast Component */}
      <ToastComponent />
    </div>
  );
};

export default UserDashboard;
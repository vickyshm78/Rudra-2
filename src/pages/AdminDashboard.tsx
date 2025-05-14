import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, Car, DollarSign, TrendingUp, Settings, 
  Bell, Shield, FileText, BarChart2, Search,
  AlertTriangle, CheckCircle, Ban, Edit, Trash2,
  Filter, Download, Upload, PenTool, 
  Plus, Image, Calendar, Tag, Eye, X
} from 'lucide-react';
import VehicleFeaturesManager from '../components/admin/VehicleFeaturesManager';
import VehicleSpecificationsManager from '../components/admin/VehicleSpecificationsManager';
import DealerDashboard from '../components/admin/DealerDashboard';
import LeadManagementSystem from '../components/admin/LeadManagementSystem';
import DynamicPricingAnalytics from '../components/admin/DynamicPricingAnalytics';
import PerformanceDashboard from '../components/admin/PerformanceDashboard';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  status: 'draft' | 'published';
  publishDate: string;
  views: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingApprovals: 0,
    reportedListings: 0,
    newUsers: 0,
    totalTransactions: 0
  });

  // Mock blog posts data
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Top 10 Electric Vehicles of 2025',
      content: 'Full content here...',
      excerpt: 'A comprehensive guide to the best electric vehicles available in 2025.',
      author: 'John Smith',
      category: 'Electric Vehicles',
      tags: ['EV', 'Technology', 'Sustainability'],
      image: 'https://images.pexels.com/photos/7516509/pexels-photo-7516509.jpeg',
      status: 'published',
      publishDate: '2025-05-15',
      views: 1234
    },
    {
      id: '2',
      title: 'Essential Car Maintenance Tips',
      content: 'Full content here...',
      excerpt: 'Learn how to keep your vehicle in top condition with these maintenance tips.',
      author: 'Emma Johnson',
      category: 'Maintenance',
      tags: ['Maintenance', 'Tips', 'DIY'],
      image: 'https://images.pexels.com/photos/3807171/pexels-photo-3807171.jpeg',
      status: 'draft',
      publishDate: '2025-05-20',
      views: 856
    }
  ]);

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminError || !adminData) {
        navigate('/admin/login');
      }
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact' });

      // Fetch vehicles count
      const { count: vehiclesCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' });

      setStats({
        totalUsers: usersCount || 0,
        totalListings: vehiclesCount || 0,
        totalRevenue: 125000,
        activeListings: vehiclesCount || 0,
        pendingApprovals: 12,
        reportedListings: 5,
        newUsers: 24,
        totalTransactions: 156
      });
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    setSelectedPost(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      // In a real app, this would delete the post from the database
      alert('Post deleted successfully!');
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the post to the database
    alert('Post saved successfully!');
    setShowPostModal(false);
    setEditingPost(null);
  };

  const handleExportData = () => {
    // In a real app, this would export data to CSV/Excel
    alert('Data exported successfully!');
  };

  const handleImportData = () => {
    // In a real app, this would open a file picker for importing data
    alert('Please select a file to import');
  };

  const renderBlogContent = () => {
    return (
      <div className="space-y-6">
        {/* Blog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Posts</p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {blogPosts.length}
                </h3>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Published Posts</p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {blogPosts.filter(post => post.status === 'published').length}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Draft Posts</p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {blogPosts.filter(post => post.status === 'draft').length}
                </h3>
              </div>
              <PenTool className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Views</p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {blogPosts.reduce((sum, post) => sum + post.views, 0)}
                </h3>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold dark:text-white">Blog Posts</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <button 
                  onClick={() => {
                    setEditingPost(null);
                    setShowPostModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Post
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id} className="border-t dark:border-gray-700">
                    <td className="p-4">
                      <div className="flex items-center">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-12 h-12 rounded object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium dark:text-white">{post.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {post.publishDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 dark:text-white">
                      {post.author}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 dark:text-white">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
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
  };

  const renderDealerContent = () => {
    return (
      <div className="space-y-6">
        {activeSubTab === 'dashboard' && <DealerDashboard dealerId="dealer-123" />}
        {activeSubTab === 'leads' && <LeadManagementSystem dealerId="dealer-123" />}
        {activeSubTab === 'pricing' && <DynamicPricingAnalytics />}
        {activeSubTab === 'performance' && <PerformanceDashboard dealerId="dealer-123" />}
        
        {!activeSubTab && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('dashboard')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Dealer Dashboard</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive overview of dealer performance, inventory, and sales metrics.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('leads')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Lead Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Track, manage, and follow up on customer leads with our advanced LMS.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('pricing')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Dynamic Pricing</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered pricing recommendations based on market trends and demand.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('performance')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full text-orange-600 dark:text-orange-400 mr-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Performance Analytics</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed analytics on listing performance, conversion rates, and customer engagement.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConfigContent = () => {
    return (
      <div className="space-y-6">
        {activeSubTab === 'features' && <VehicleFeaturesManager />}
        {activeSubTab === 'specifications' && <VehicleSpecificationsManager />}
        
        {!activeSubTab && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('features')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Vehicle Features</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage the available features that can be selected for vehicle listings.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSubTab('specifications')}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Vehicle Specifications</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Configure the technical specifications that can be added to vehicle listings.
              </p>
            </div>
          </div>
        )}
      </div>
    );
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
      case 'blog':
        return renderBlogContent();
      case 'dealer':
        return renderDealerContent();
      case 'config':
        return renderConfigContent();
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Users</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {stats.totalUsers}
                    </h3>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <p className="text-green-500 text-sm">
                    +{stats.newUsers} new this week
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Active Listings</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {stats.activeListings}
                    </h3>
                  </div>
                  <Car className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-4">
                  <p className="text-orange-500 text-sm">
                    {stats.pendingApprovals} pending approval
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      ${stats.totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-green-500 text-sm">
                    +12.5% from last month
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Transactions</p>
                    <h3 className="text-2xl font-bold dark:text-white">
                      {stats.totalTransactions}
                    </h3>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-4">
                  <p className="text-green-500 text-sm">
                    23 completed today
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold dark:text-white">Recent Activity</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportData}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                  <button 
                    onClick={handleImportData}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Import
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="dark:text-white">New listing approved</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2023 Tesla Model 3</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="dark:text-white">Listing reported</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2019 BMW X5</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">15 minutes ago</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                  <div className="flex items-center">
                    <Ban className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="dark:text-white">User suspended</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Multiple policy violations</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
                </div>
              </div>
            </div>
            
            {/* Admin Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setActiveTab('dealer');
                  setActiveSubTab('');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                    <Car className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold dark:text-white">Dealer Management</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage dealer accounts, inventory, and performance analytics.
                </p>
              </div>
              
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setActiveTab('config');
                  setActiveSubTab('');
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold dark:text-white">System Configuration</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure vehicle features, specifications, and system settings.
                </p>
              </div>
              
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('blog')}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold dark:text-white">Content Management</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage blog posts, guides, and other content on the platform.
                </p>
              </div>
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('dealer');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dealer'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Car className="h-5 w-5" />
                  <span>Dealer Management</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('users');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('listings');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'listings'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Car className="h-5 w-5" />
                  <span>Listings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('blog');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'blog'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Blog</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('config');
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'config'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuration</span>
                </button>
              </nav>
              
              {/* Dealer Management Submenu */}
              {activeTab === 'dealer' && (
                <div className="mt-4 pl-4 border-l-2 border-blue-500 dark:border-blue-400 space-y-2">
                  <button
                    onClick={() => setActiveSubTab('dashboard')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'dashboard'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <BarChart2 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSubTab('leads')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'leads'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Lead Management</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSubTab('pricing')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'pricing'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Dynamic Pricing</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSubTab('performance')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'performance'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Performance</span>
                  </button>
                </div>
              )}
              
              {/* Configuration Submenu */}
              {activeTab === 'config' && (
                <div className="mt-4 pl-4 border-l-2 border-blue-500 dark:border-blue-400 space-y-2">
                  <button
                    onClick={() => setActiveSubTab('features')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'features'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Vehicle Features</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSubTab('specifications')}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      activeSubTab === 'specifications'
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Vehicle Specifications</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold dark:text-white">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'dealer' && 'Dealer Management'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'listings' && 'Listing Management'}
                {activeTab === 'blog' && 'Blog Management'}
                {activeTab === 'config' && 'System Configuration'}
                
                {activeTab === 'dealer' && activeSubTab === 'dashboard' && ' - Dashboard'}
                {activeTab === 'dealer' && activeSubTab === 'leads' && ' - Lead Management'}
                {activeTab === 'dealer' && activeSubTab === 'pricing' && ' - Dynamic Pricing'}
                {activeTab === 'dealer' && activeSubTab === 'performance' && ' - Performance Analytics'}
                
                {activeTab === 'config' && activeSubTab === 'features' && ' - Vehicle Features'}
                {activeTab === 'config' && activeSubTab === 'specifications' && ' - Vehicle Specifications'}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow">
                  <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow">
                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

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
              <h3 className="text-lg font-semibold dark:text-white">Delete Post</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
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

      {/* Post Editor Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold dark:text-white">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue={editingPost?.title}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  defaultValue={editingPost?.excerpt}
                  rows={2}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  defaultValue={editingPost?.content}
                  rows={10}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    defaultValue={editingPost?.category}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electric Vehicles">Electric Vehicles</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Buying Tips">Buying Tips</option>
                    <option value="Industry News">Industry News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    defaultValue={editingPost?.status}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    defaultValue={editingPost?.publishDate}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    defaultValue={editingPost?.tags.join(', ')}
                    placeholder="Enter tags separated by commas"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  {editingPost?.image && (
                    <img
                      src={editingPost.image}
                      alt="Featured"
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Image className="h-5 w-5 mr-2" />
                    Choose Image
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
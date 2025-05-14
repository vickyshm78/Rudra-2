import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart2, TrendingUp, DollarSign, Users, 
  Calendar, Clock, Car, Eye, MessageSquare,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw,
  Package, Truck, FileText, CreditCard, Zap,
  PieChart, Activity, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DealerDashboardProps {
  dealerId: string;
}

const DealerDashboard: React.FC<DealerDashboardProps> = ({ dealerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [dealerId, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the database
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        summary: {
          totalListings: 45,
          activeListings: 32,
          premiumListings: 12,
          totalViews: 12500,
          totalLeads: 320,
          totalSales: 18,
          totalRevenue: 36000000,
          subscriptionRevenue: 10000,
          valueAddedServicesRevenue: 250000,
          commissionRevenue: 720000
        },
        revenueBreakdown: {
          listingFees: 120000,
          subscriptions: 10000,
          insurance: 180000,
          rtoServices: 85000,
          inspections: 65000,
          testDrives: 25000,
          loanReferrals: 150000,
          accessories: 75000,
          warranties: 90000,
          saleCommissions: 720000
        },
        recentTransactions: [
          { id: 't1', type: 'Premium Listing', amount: 2000, date: '2025-05-15', status: 'completed' },
          { id: 't2', type: 'Insurance Commission', amount: 12500, date: '2025-05-14', status: 'completed' },
          { id: 't3', type: 'RC Transfer Service', amount: 1999, date: '2025-05-12', status: 'processing' },
          { id: 't4', type: 'Sale Commission', amount: 50000, date: '2025-05-10', status: 'completed' },
          { id: 't5', type: 'Inspection Service', amount: 999, date: '2025-05-08', status: 'completed' }
        ],
        topSellingVehicles: [
          { id: 'v1', title: '2022 Toyota Fortuner', price: 3500000, commission: 70000 },
          { id: 'v2', title: '2023 Hyundai Creta', price: 1800000, commission: 36000 },
          { id: 'v3', title: '2021 Maruti Swift', price: 800000, commission: 16000 }
        ],
        servicePerformance: {
          insurance: { count: 24, revenue: 180000, growth: 15 },
          rtoServices: { count: 18, revenue: 85000, growth: 8 },
          inspections: { count: 32, revenue: 65000, growth: 12 },
          testDrives: { count: 45, revenue: 25000, growth: 20 },
          loanReferrals: { count: 15, revenue: 150000, growth: 10 }
        }
      };
      
      setDashboardData(mockData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <BarChart2 className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Dealer Dashboard
        </h2>
        
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {formatCurrency(dashboardData.summary.totalRevenue)}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              From all monetization channels
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Active Listings</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.activeListings}
              </h3>
            </div>
            <Car className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {dashboardData.summary.premiumListings} premium listings
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Leads</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.totalLeads}
              </h3>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {(dashboardData.summary.totalLeads / dashboardData.summary.totalViews * 100).toFixed(1)}% conversion rate
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Sales</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.totalSales}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {formatCurrency(dashboardData.summary.commissionRevenue)} in commissions
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium dark:text-white">Listing Fees</h4>
            </div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(dashboardData.revenueBreakdown.listingFees)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(dashboardData.revenueBreakdown.listingFees / dashboardData.summary.totalRevenue * 100)}% of total
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium dark:text-white">Sale Commissions</h4>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(dashboardData.revenueBreakdown.saleCommissions)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(dashboardData.revenueBreakdown.saleCommissions / dashboardData.summary.totalRevenue * 100)}% of total
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium dark:text-white">Insurance</h4>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(dashboardData.revenueBreakdown.insurance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(dashboardData.revenueBreakdown.insurance / dashboardData.summary.totalRevenue * 100)}% of total
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
              <h4 className="font-medium dark:text-white">Loan Referrals</h4>
            </div>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(dashboardData.revenueBreakdown.loanReferrals)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(dashboardData.revenueBreakdown.loanReferrals / dashboardData.summary.totalRevenue * 100)}% of total
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h4 className="font-medium dark:text-white">Other Services</h4>
            </div>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(
                dashboardData.revenueBreakdown.rtoServices + 
                dashboardData.revenueBreakdown.inspections + 
                dashboardData.revenueBreakdown.testDrives + 
                dashboardData.revenueBreakdown.accessories + 
                dashboardData.revenueBreakdown.warranties
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round((
                dashboardData.revenueBreakdown.rtoServices + 
                dashboardData.revenueBreakdown.inspections + 
                dashboardData.revenueBreakdown.testDrives + 
                dashboardData.revenueBreakdown.accessories + 
                dashboardData.revenueBreakdown.warranties
              ) / dashboardData.summary.totalRevenue * 100)}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Value-Added Services Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-medium dark:text-white">Insurance</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.servicePerformance.insurance.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                  {formatCurrency(dashboardData.servicePerformance.insurance.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {dashboardData.servicePerformance.insurance.growth}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  <button>View Details</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-medium dark:text-white">RTO Services</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.servicePerformance.rtoServices.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                  {formatCurrency(dashboardData.servicePerformance.rtoServices.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {dashboardData.servicePerformance.rtoServices.growth}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  <button>View Details</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium dark:text-white">Inspections</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.servicePerformance.inspections.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                  {formatCurrency(dashboardData.servicePerformance.inspections.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {dashboardData.servicePerformance.inspections.growth}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  <button>View Details</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                    <span className="font-medium dark:text-white">Test Drives</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.servicePerformance.testDrives.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                  {formatCurrency(dashboardData.servicePerformance.testDrives.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {dashboardData.servicePerformance.testDrives.growth}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  <button>View Details</button>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <span className="font-medium dark:text-white">Loan Referrals</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.servicePerformance.loanReferrals.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                  {formatCurrency(dashboardData.servicePerformance.loanReferrals.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {dashboardData.servicePerformance.loanReferrals.growth}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                  <button>View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium dark:text-white">Recent Transactions</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {dashboardData.recentTransactions.map((transaction: any) => (
              <div key={transaction.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium dark:text-white">{transaction.type}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'completed' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monetization Opportunities */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">Revenue Opportunities</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Upgrade to Pro Subscription</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Upgrade to Pro plan for ₹10,000/month to unlock unlimited listings and premium features.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Promote Insurance Partnerships</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Increase insurance referrals by adding insurance quotes to all listings. Potential revenue: ₹50,000/month.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Boost Premium Listings</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Convert 10 more listings to premium for an additional ₹20,000 in revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Package, Shield, FileText, 
  CreditCard, Truck, ShoppingBag, Users, BarChart2,
  ArrowRight, Download, Calendar, Clock, Check
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import RevenueAnalytics from '../../components/monetization/RevenueAnalytics';
import SubscriptionPlans from '../../components/monetization/SubscriptionPlans';
import PremiumListingUpgrade from '../../components/monetization/PremiumListingUpgrade';
import ValueAddedServicesCard from '../../components/monetization/ValueAddedServicesCard';
import CommissionCalculator from '../../components/monetization/CommissionCalculator';
import AffiliateMarketplace from '../../components/monetization/AffiliateMarketplace';
import EscrowPaymentService from '../../components/monetization/EscrowPaymentService';
import BuyerMembershipPlans from '../../components/monetization/BuyerMembershipPlans';

const MonetizationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeRange, setTimeRange] = useState<string>('30days');

  // Mock data for the dashboard
  const dashboardData = {
    summary: {
      totalRevenue: 36000000,
      revenueGrowth: 12.5,
      transactionCount: 1250,
      activeListings: 8500,
      premiumListings: 1200,
      premiumPercentage: 14.1
    },
    revenueByChannel: [
      { channel: 'Listing Fees', amount: 12000000, growth: 8.5 },
      { channel: 'Sale Commissions', amount: 7200000, growth: 15.2 },
      { channel: 'Insurance', amount: 5400000, growth: 18.7 },
      { channel: 'RTO Services', amount: 3600000, growth: 12.3 },
      { channel: 'Inspections', amount: 2400000, growth: 9.8 },
      { channel: 'Loan Referrals', amount: 3000000, growth: 22.5 },
      { channel: 'Other Services', amount: 2400000, growth: 7.2 }
    ],
    topSellingServices: [
      { name: 'Comprehensive Insurance', count: 450, revenue: 5400000 },
      { name: 'RC Transfer', count: 720, revenue: 3600000 },
      { name: 'Premium Inspection', count: 320, revenue: 1600000 },
      { name: 'Loan Facilitation', count: 300, revenue: 3000000 }
    ],
    recentTransactions: [
      { id: 't1', type: 'Premium Listing', amount: 2000, date: '2025-05-15', status: 'completed' },
      { id: 't2', type: 'Insurance Commission', amount: 12500, date: '2025-05-14', status: 'completed' },
      { id: 't3', type: 'RC Transfer Service', amount: 1999, date: '2025-05-12', status: 'processing' },
      { id: 't4', type: 'Sale Commission', amount: 50000, date: '2025-05-10', status: 'completed' },
      { id: 't5', type: 'Inspection Service', amount: 999, date: '2025-05-08', status: 'completed' }
    ]
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
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
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-green-500 text-sm">
              {dashboardData.summary.revenueGrowth}% from previous period
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Transactions</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.transactionCount.toLocaleString()}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Across all revenue channels
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Active Listings</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.activeListings.toLocaleString()}
              </h3>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {dashboardData.summary.premiumListings.toLocaleString()} premium ({dashboardData.summary.premiumPercentage}%)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Growth Rate</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {dashboardData.summary.revenueGrowth}%
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Year-over-year growth
            </p>
          </div>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Revenue by Channel</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.revenueByChannel.map((channel, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {channel.channel === 'Listing Fees' && <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />}
                      {channel.channel === 'Sale Commissions' && <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />}
                      {channel.channel === 'Insurance' && <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />}
                      {channel.channel === 'RTO Services' && <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />}
                      {channel.channel === 'Inspections' && <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />}
                      {channel.channel === 'Loan Referrals' && <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />}
                      {channel.channel === 'Other Services' && <Package className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />}
                      <span className="font-medium dark:text-white">{channel.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {formatCurrency(channel.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {channel.growth}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {((channel.amount / dashboardData.summary.totalRevenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Selling Services & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white">Top Selling Services</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {dashboardData.topSellingServices.map((service, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-white">{service.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.count} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(service.revenue)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {((service.revenue / dashboardData.summary.totalRevenue) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white">Recent Transactions</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
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
      </div>

      {/* Monetization Opportunities */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">Revenue Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h4 className="font-medium dark:text-white">Premium Listings</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Convert more standard listings to premium to increase visibility and revenue.
            </p>
            <button
              onClick={() => setActiveTab('premium-listings')}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
            >
              View Premium Options
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h4 className="font-medium dark:text-white">Value-Added Services</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Promote insurance, inspections, and other high-margin services to users.
            </p>
            <button
              onClick={() => setActiveTab('value-added-services')}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium dark:text-white">Membership Plans</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Promote premium buyer and seller membership plans for recurring revenue.
            </p>
            <button
              onClick={() => setActiveTab('membership-plans')}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
            >
              View Plans
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Monetization Dashboard</h1>
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
            
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 className="h-5 w-5 inline mr-2" />
              Overview
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="h-5 w-5 inline mr-2" />
              Revenue Analytics
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'premium-listings'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('premium-listings')}
            >
              <Package className="h-5 w-5 inline mr-2" />
              Premium Listings
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'value-added-services'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('value-added-services')}
            >
              <Shield className="h-5 w-5 inline mr-2" />
              Value-Added Services
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'commissions'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('commissions')}
            >
              <DollarSign className="h-5 w-5 inline mr-2" />
              Commissions
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'membership-plans'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('membership-plans')}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Membership Plans
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'affiliate'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('affiliate')}
            >
              <ShoppingBag className="h-5 w-5 inline mr-2" />
              Affiliate Program
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'analytics' && <RevenueAnalytics adminView={true} />}
          {activeTab === 'premium-listings' && (
            <PremiumListingUpgrade 
              listingId="listing-123"
              listingTitle="2022 Honda City ZX"
              currentViews={45}
            />
          )}
          {activeTab === 'value-added-services' && <ValueAddedServicesCard />}
          {activeTab === 'commissions' && <CommissionCalculator initialPrice={2500000} />}
          {activeTab === 'membership-plans' && (
            <div className="space-y-12">
              <SubscriptionPlans userType="dealer" />
              <BuyerMembershipPlans />
            </div>
          )}
          {activeTab === 'affiliate' && <AffiliateMarketplace />}
        </div>
      </div>
    </div>
  );
};

// Missing component
const ArrowUp = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
};

export default MonetizationDashboard;
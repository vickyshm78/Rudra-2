import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart2, TrendingUp, DollarSign, Calendar, 
  ArrowUp, ArrowDown, PieChart, Download, RefreshCw,
  Package, Shield, FileText, CreditCard, Truck, Activity
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RevenueAnalyticsProps {
  dealerId?: string;
  adminView?: boolean;
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  dealerId,
  adminView = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dealerId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the database
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        summary: {
          totalRevenue: 36000000,
          previousPeriodRevenue: 32000000,
          revenueGrowth: 12.5,
          transactionCount: 1250,
          averageOrderValue: 28800
        },
        revenueByChannel: [
          { name: 'Listing Fees', value: 12000000 },
          { name: 'Sale Commissions', value: 7200000 },
          { name: 'Insurance', value: 5400000 },
          { name: 'RTO Services', value: 3600000 },
          { name: 'Inspections', value: 2400000 },
          { name: 'Loan Referrals', value: 3000000 },
          { name: 'Other Services', value: 2400000 }
        ],
        revenueByMonth: [
          { name: 'Jan', revenue: 2500000 },
          { name: 'Feb', revenue: 2800000 },
          { name: 'Mar', revenue: 3200000 },
          { name: 'Apr', revenue: 3000000 },
          { name: 'May', revenue: 3600000 },
          { name: 'Jun', revenue: 3400000 },
          { name: 'Jul', revenue: 3800000 },
          { name: 'Aug', revenue: 4000000 },
          { name: 'Sep', revenue: 3700000 },
          { name: 'Oct', revenue: 3900000 },
          { name: 'Nov', revenue: 4200000 },
          { name: 'Dec', revenue: 4500000 }
        ],
        servicePerformance: [
          { name: 'Insurance', count: 450, revenue: 5400000, growth: 15 },
          { name: 'RTO Services', count: 720, revenue: 3600000, growth: 8 },
          { name: 'Inspections', count: 600, revenue: 2400000, growth: 12 },
          { name: 'Loan Referrals', count: 300, revenue: 3000000, growth: 20 },
          { name: 'Accessories', count: 850, revenue: 1700000, growth: 18 },
          { name: 'Warranties', count: 180, revenue: 900000, growth: 5 }
        ],
        topPerformers: adminView ? [
          { id: 'd1', name: 'Premium Motors', revenue: 4500000, transactions: 120, growth: 18 },
          { id: 'd2', name: 'City Cars', revenue: 3800000, transactions: 95, growth: 12 },
          { id: 'd3', name: 'AutoElite', revenue: 3200000, transactions: 85, growth: 15 }
        ] : null
      };
      
      setAnalyticsData(mockData);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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
          Revenue Analytics
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
            <option value="ytd">Year to Date</option>
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
                {formatCurrency(analyticsData.summary.totalRevenue)}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-green-500 text-sm">
              {analyticsData.summary.revenueGrowth}% from previous period
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Transactions</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {analyticsData.summary.transactionCount.toLocaleString()}
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
              <p className="text-gray-500 dark:text-gray-400">Average Order Value</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {formatCurrency(analyticsData.summary.averageOrderValue)}
              </h3>
            </div>
            <BarChart2 className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Per transaction
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Growth Rate</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {analyticsData.summary.revenueGrowth}%
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

      {/* Revenue by Month Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsData.revenueByMonth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: any) => [`₹${(value / 1000000).toFixed(2)}M`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue" 
                stroke="#3B82F6" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-6 dark:text-white">Revenue by Channel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.revenueByChannel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.revenueByChannel.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-6 dark:text-white">Service Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.servicePerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Service: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium dark:text-white">Service Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Avg. Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData.servicePerformance.map((service: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {service.name === 'Insurance' && <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />}
                      {service.name === 'RTO Services' && <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />}
                      {service.name === 'Inspections' && <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />}
                      {service.name === 'Loan Referrals' && <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />}
                      {service.name === 'Accessories' && <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />}
                      {service.name === 'Warranties' && <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />}
                      <span className="font-medium dark:text-white">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {service.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {formatCurrency(service.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {service.growth}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(service.revenue / service.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers (Admin View Only) */}
      {adminView && analyticsData.topPerformers && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white">Top Performing Dealers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dealer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.topPerformers.map((dealer: any) => (
                  <tr key={dealer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                          <Truck className="h-5 w-5" />
                        </div>
                        <span className="font-medium dark:text-white">{dealer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                      {formatCurrency(dealer.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {dealer.transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        {dealer.growth}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                      <button>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Opportunities */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">Revenue Growth Opportunities</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Increase Insurance Conversions</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Currently converting at 8%. Improving to 12% would generate an additional {formatCurrency(2700000)} in revenue.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Promote Premium Listings</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Converting 20% more standard listings to premium would add {formatCurrency(1800000)} in annual revenue.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Expand Loan Referral Network</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Adding 3 more banking partners could increase loan referral revenue by {formatCurrency(1500000)}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing component
const AlertTriangle = (props: any) => {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
};

export default RevenueAnalytics;
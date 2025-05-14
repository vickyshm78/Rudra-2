import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart2, TrendingUp, DollarSign, Users, 
  Calendar, Clock, Car, Eye, MessageSquare,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface PerformanceDashboardProps {
  dealerId?: string;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ dealerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, [dealerId, timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the database
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        summary: {
          totalListings: 45,
          activeListings: 32,
          totalViews: 12500,
          totalLeads: 320,
          totalSales: 18,
          totalRevenue: 36000000,
          conversionRate: 5.6,
          averageSellingTime: 28
        },
        trends: {
          views: {
            current: 4200,
            previous: 3800,
            change: 10.5
          },
          leads: {
            current: 120,
            previous: 105,
            change: 14.3
          },
          sales: {
            current: 7,
            previous: 6,
            change: 16.7
          },
          revenue: {
            current: 14000000,
            previous: 12000000,
            change: 16.7
          }
        },
        topPerformers: [
          { id: 'v1', title: '2022 Toyota Fortuner', views: 850, leads: 32, daysListed: 14, price: 3500000 },
          { id: 'v2', title: '2023 Hyundai Creta', views: 720, leads: 28, daysListed: 7, price: 1800000 },
          { id: 'v3', title: '2021 Maruti Swift', views: 680, leads: 25, daysListed: 10, price: 800000 }
        ],
        underperformers: [
          { id: 'v4', title: '2019 Honda City', views: 120, leads: 2, daysListed: 45, price: 950000 },
          { id: 'v5', title: '2018 Mahindra XUV500', views: 150, leads: 3, daysListed: 60, price: 1100000 },
          { id: 'v6', title: '2020 Tata Nexon', views: 180, leads: 4, daysListed: 30, price: 950000 }
        ],
        conversionFunnel: {
          views: 12500,
          inquiries: 320,
          testDrives: 85,
          negotiations: 42,
          sales: 18
        },
        geographicPerformance: {
          'Delhi NCR': { views: 3200, leads: 85, sales: 5 },
          'Mumbai': { views: 2800, leads: 72, sales: 4 },
          'Bangalore': { views: 2100, leads: 55, sales: 3 },
          'Chennai': { views: 1800, leads: 48, sales: 2 },
          'Other': { views: 2600, leads: 60, sales: 4 }
        }
      };
      
      setPerformanceData(mockData);
    } catch (err) {
      setError('Failed to load performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPerformanceData();
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
          Performance Dashboard
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
              <p className="text-gray-500 dark:text-gray-400">Total Views</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {performanceData.summary.totalViews.toLocaleString()}
              </h3>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-green-500 text-sm">
              {performanceData.trends.views.change}% from previous period
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Leads</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {performanceData.summary.totalLeads.toLocaleString()}
              </h3>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-green-500 text-sm">
              {performanceData.trends.leads.change}% from previous period
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {performanceData.summary.conversionRate}%
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Leads to sales ratio
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold dark:text-white">
                {formatCurrency(performanceData.summary.totalRevenue)}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-green-500 text-sm">
              {performanceData.trends.revenue.change}% from previous period
            </p>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Conversion Funnel</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Views</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {performanceData.conversionFunnel.views.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inquiries</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {performanceData.conversionFunnel.inquiries.toLocaleString()} 
                ({(performanceData.conversionFunnel.inquiries / performanceData.conversionFunnel.views * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(performanceData.conversionFunnel.inquiries / performanceData.conversionFunnel.views * 100).toFixed(1)}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Drives</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {performanceData.conversionFunnel.testDrives.toLocaleString()} 
                ({(performanceData.conversionFunnel.testDrives / performanceData.conversionFunnel.views * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(performanceData.conversionFunnel.testDrives / performanceData.conversionFunnel.views * 100).toFixed(1)}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Negotiations</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {performanceData.conversionFunnel.negotiations.toLocaleString()} 
                ({(performanceData.conversionFunnel.negotiations / performanceData.conversionFunnel.views * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(performanceData.conversionFunnel.negotiations / performanceData.conversionFunnel.views * 100).toFixed(1)}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {performanceData.conversionFunnel.sales.toLocaleString()} 
                ({(performanceData.conversionFunnel.sales / performanceData.conversionFunnel.views * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(performanceData.conversionFunnel.sales / performanceData.conversionFunnel.views * 100).toFixed(1)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers & Underperformers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white">Top Performing Listings</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {performanceData.topPerformers.map((vehicle: any) => (
                <div key={vehicle.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-white">{vehicle.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(vehicle.price)} • {vehicle.daysListed} days listed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
                        <Eye className="h-4 w-4 mr-1" />
                        {vehicle.views} views
                      </div>
                      <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {vehicle.leads} leads
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white">Underperforming Listings</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {performanceData.underperformers.map((vehicle: any) => (
                <div key={vehicle.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-white">{vehicle.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(vehicle.price)} • {vehicle.daysListed} days listed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
                        <Eye className="h-4 w-4 mr-1" />
                        {vehicle.views} views
                      </div>
                      <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {vehicle.leads} leads
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm text-blue-600 dark:text-blue-400">
                      View Recommendations
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 dark:text-white">Geographic Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(performanceData.geographicPerformance).map(([region, data]: [string, any]) => (
                <tr key={region}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {data.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {data.leads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {data.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {(data.sales / data.leads * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">Performance Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Adjust Pricing Strategy</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Consider reducing prices for underperforming listings by 5-10% to increase interest.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Refresh Listings</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Update photos and descriptions for listings older than 30 days to improve engagement.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Lead Response Time</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Improve response time to new leads. Currently averaging 5 hours; aim for under 1 hour.
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

export default PerformanceDashboard;
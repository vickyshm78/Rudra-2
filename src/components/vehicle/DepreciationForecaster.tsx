import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrendingDown, Calendar, DollarSign, AlertTriangle, Info, ChevronDown, ChevronUp, MapPin, PenTool as Tool, Sun, BarChart2, ArrowUp, ArrowDown, Zap, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface DepreciationForecasterProps {
  vehicleId: string;
  initialValue: number;
  make: string;
  model: string;
  year: number;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const DepreciationForecaster: React.FC<DepreciationForecasterProps> = ({
  vehicleId,
  initialValue,
  make,
  model,
  year
}) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'market' | 'mods' | 'regional'>('forecast');

  useEffect(() => {
    fetchDepreciationForecast();
  }, [vehicleId]);

  const fetchDepreciationForecast = async () => {
    try {
      const { data, error } = await supabase
        .from('depreciation_forecasts')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .single();

      if (error) throw error;
      setForecast(data);
    } catch (err) {
      setError('Failed to load depreciation forecast');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateOptimalSellTime = () => {
    if (!forecast?.forecast_data?.yearly_values) return null;

    const values = forecast.forecast_data.yearly_values;
    let maxRetention = 0;
    let optimalYear = year;

    values.forEach((value: any, index: number) => {
      const yearsSince = index + 1;
      const retentionRate = value.value / initialValue;
      if (retentionRate > maxRetention) {
        maxRetention = retentionRate;
        optimalYear = year + yearsSince;
      }
    });

    return {
      year: optimalYear,
      retentionRate: maxRetention
    };
  };

  // Calculate seasonal value adjustments
  const getSeasonalAdjustment = (season: string) => {
    const adjustments = {
      spring: 1.05, // 5% increase
      summer: 1.02, // 2% increase
      fall: 0.98,   // 2% decrease
      winter: 0.95  // 5% decrease
    };
    return adjustments[season as keyof typeof adjustments] || 1;
  };

  // Calculate modification impact
  const calculateModificationImpact = (modType: string, cost: number) => {
    const impacts = {
      performance: 0.7,  // 70% value retention
      cosmetic: 0.5,    // 50% value retention
      safety: 0.85,     // 85% value retention
      comfort: 0.6      // 60% value retention
    };
    return cost * (impacts[modType as keyof typeof impacts] || 0.5);
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

  const optimalSellTime = calculateOptimalSellTime();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <TrendingDown className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Depreciation Forecast
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['forecast', 'market', 'mods', 'regional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showDetails ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Value Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(initialValue)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">3-Year Value</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(forecast?.forecast_data?.yearly_values[2]?.value || 0)}
          </p>
          <p className="text-sm text-red-500">
            -{Math.round((1 - (forecast?.forecast_data?.yearly_values[2]?.value || 0) / initialValue) * 100)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">5-Year Value</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(forecast?.forecast_data?.yearly_values[4]?.value || 0)}
          </p>
          <p className="text-sm text-red-500">
            -{Math.round((1 - (forecast?.forecast_data?.yearly_values[4]?.value || 0) / initialValue) * 100)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Position</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            Top 20%
          </p>
          <p className="text-sm text-green-500">Strong retention</p>
        </div>
      </div>

      {/* Optimal Sell Time */}
      {optimalSellTime && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200">
                Optimal Sell Time
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Best value retention at {optimalSellTime.year} (
                {Math.round(optimalSellTime.retentionRate * 100)}% of original value)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Value Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-4 dark:text-white flex items-center">
            <Sun className="h-5 w-5 mr-2 text-orange-500" />
            Seasonal Value Impact
          </h3>
          <div className="space-y-4">
            {['spring', 'summer', 'fall', 'winter'].map((season) => {
              const adjustment = getSeasonalAdjustment(season);
              const impact = initialValue * (adjustment - 1);
              return (
                <div key={season} className="flex justify-between items-center">
                  <span className="capitalize dark:text-white">{season}</span>
                  <span className={`${
                    impact >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {impact >= 0 ? '+' : ''}{formatCurrency(impact)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modification Value Impact */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-4 dark:text-white flex items-center">
            <Tool className="h-5 w-5 mr-2 text-purple-500" />
            Modification Value Impact
          </h3>
          <div className="space-y-4">
            {[
              { type: 'performance', cost: 5000 },
              { type: 'cosmetic', cost: 3000 },
              { type: 'safety', cost: 2000 },
              { type: 'comfort', cost: 1500 }
            ].map((mod) => {
              const impact = calculateModificationImpact(mod.type, mod.cost);
              return (
                <div key={mod.type} className="flex justify-between items-center">
                  <span className="capitalize dark:text-white">{mod.type}</span>
                  <span className="text-blue-500">
                    {Math.round((impact / mod.cost) * 100)}% retained value
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Market Analysis */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-4 dark:text-white flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
              Market Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Market Position
                </h4>
                <div className="flex items-center space-x-2">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                  <span className="dark:text-white">Above Average</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  20% better value retention than similar vehicles
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Demand Trend
                </h4>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="dark:text-white">High Demand</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Growing interest in this model
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Market Supply
                </h4>
                <div className="flex items-center space-x-2">
                  <ArrowDown className="h-5 w-5 text-blue-500" />
                  <span className="dark:text-white">Limited Supply</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Favorable for value retention
                </p>
              </div>
            </div>
          </div>

          {/* Value Protection Tips */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-4 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Value Protection Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium dark:text-white">Maintenance</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Regular service intervals</li>
                  <li>• Keep detailed maintenance records</li>
                  <li>• Address issues promptly</li>
                  <li>• Use OEM parts</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium dark:text-white">Protection</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Garage storage</li>
                  <li>• Paint protection</li>
                  <li>• Interior care</li>
                  <li>• Mileage management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Regional Price Variations */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-4 dark:text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Regional Price Variations
            </h3>
            <div className="space-y-3">
              {[
                { region: 'North India', adjustment: 1.05 },
                { region: 'South India', adjustment: 1.02 },
                { region: 'East India', adjustment: 0.98 },
                { region: 'West India', adjustment: 1.03 }
              ].map((region) => {
                const difference = initialValue * (region.adjustment - 1);
                return (
                  <div key={region.region} className="flex justify-between items-center">
                    <span className="dark:text-white">{region.region}</span>
                    <span className={`${
                      difference >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Forecast Confidence Score
              </p>
              <p className="font-medium dark:text-white">
                {(forecast?.confidence_score * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepreciationForecaster;
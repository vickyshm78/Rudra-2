import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, FileText, Calendar, User, MapPin, Car, CheckCircle, Shield, Wrench, Ban as Bank, PenTool } from 'lucide-react';

// Check that environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize supabase client only if environment variables are available
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

interface VehicleHistoryReportProps {
  vehicleId: string;
}

const VehicleHistoryReport: React.FC<VehicleHistoryReportProps> = ({ vehicleId }) => {
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicleHistory();
  }, [vehicleId]);

  const fetchVehicleHistory = async () => {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        throw new Error('Supabase configuration is missing. Please check your environment variables.');
      }
      
      setLoading(true);
      setError(null);

      const { data, error: historyError } = await supabase
        .from('vehicle_history_reports')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

      if (historyError) throw historyError;
      
      setHistoryData(data);
    } catch (err) {
      setError('Error fetching vehicle history: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching vehicle history:', err);
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 mr-2" />
          <p className="text-red-600 dark:text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" />
          <p className="text-yellow-600 dark:text-yellow-500">
            No history report available for this vehicle.
          </p>
        </div>
      </div>
    );
  }

  const {
    vin,
    report_date,
    report_data: {
      ownership_history = [],
      accident_history = [],
      service_history = [],
      registration_info = {},
      insurance_history = [],
      hypothecation_info = {}
    }
  } = historyData;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Vehicle History Report
        </h2>

        {/* Basic Information */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">VIN</p>
              <p className="font-medium dark:text-white">{vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Report Date</p>
              <p className="font-medium dark:text-white">
                {new Date(report_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Ownership History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Ownership History
          </h3>
          <div className="space-y-4">
            {ownership_history.map((owner: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium dark:text-white">Owner {index + 1}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From: {new Date(owner.from).toLocaleDateString()}
                  {owner.to ? ` To: ${new Date(owner.to).toLocaleDateString()}` : ' (Current)'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">State: {owner.state}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            Registration Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Number</p>
                <p className="font-medium dark:text-white">{registration_info.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valid Until</p>
                <p className="font-medium dark:text-white">
                  {new Date(registration_info.valid_until).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">RTO</p>
                <p className="font-medium dark:text-white">{registration_info.rto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium dark:text-white">{registration_info.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Insurance History
          </h3>
          <div className="space-y-4">
            {insurance_history.map((insurance: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Policy Number</p>
                    <p className="font-medium dark:text-white">{insurance.policy_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                    <p className="font-medium dark:text-white">{insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valid From</p>
                    <p className="font-medium dark:text-white">
                      {new Date(insurance.valid_from).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valid Until</p>
                    <p className="font-medium dark:text-white">
                      {new Date(insurance.valid_until).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accident History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
            Accident History
          </h3>
          {accident_history.length > 0 ? (
            <div className="space-y-4">
              {accident_history.map((accident: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium dark:text-white">
                    {new Date(accident.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {accident.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Severity: {accident.severity}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Repairs: {accident.repairs}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-green-600 dark:text-green-400">
                  No accidents reported
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Service History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
            Service History
          </h3>
          <div className="space-y-4">
            {service_history.map((service: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium dark:text-white">
                  {new Date(service.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Type: {service.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mileage: {service.mileage.toLocaleString()} km
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Workshop: {service.workshop}
                </p>
                {service.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hypothecation Information */}
        {hypothecation_info && Object.keys(hypothecation_info).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
              <Bank className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Hypothecation Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Financier</p>
                  <p className="font-medium dark:text-white">{hypothecation_info.financier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Agreement Date</p>
                  <p className="font-medium dark:text-white">
                    {new Date(hypothecation_info.agreement_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium dark:text-white">{hypothecation_info.status}</p>
                </div>
                {hypothecation_info.termination_date && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Termination Date</p>
                    <p className="font-medium dark:text-white">
                      {new Date(hypothecation_info.termination_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleHistoryReport;
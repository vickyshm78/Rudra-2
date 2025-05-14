import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, Wrench, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface LifecycleTrackerProps {
  vehicleId: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ vehicleId }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLifecycleEvents();
  }, [vehicleId]);

  const fetchLifecycleEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_lifecycles')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError('Failed to load vehicle history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'inspection':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'incident':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'ownership':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
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
          <Clock className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Vehicle Timeline
        </h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        {/* Events */}
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="relative pl-16">
              {/* Event icon */}
              <div className="absolute left-4 -translate-x-1/2 bg-white dark:bg-gray-800 p-1 rounded-full">
                {getEventIcon(event.event_type)}
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium dark:text-white">
                      {event.event_data.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                  {event.verified && (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300">
                  {event.event_data.description}
                </p>

                {event.event_data.details && (
                  <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Object.entries(event.event_data.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.blockchain_hash && (
                  <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      Blockchain Hash: {event.blockchain_hash}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Timeline Events
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This vehicle's history will be recorded here as events occur
          </p>
        </div>
      )}
    </div>
  );
};

export default LifecycleTracker;
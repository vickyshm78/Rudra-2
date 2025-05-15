import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';

// Check for environment variables and provide proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if both URL and key are available
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface Feature {
  id: string;
  category: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  is_active: boolean;
}

const VehicleFeaturesManager: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    // Check if Supabase client is properly initialized
    if (!supabase) {
      setConfigError('Supabase configuration is missing. Please check your environment variables.');
      setLoading(false);
      return;
    }
    
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    if (!supabase) {
      setError('Supabase client is not initialized');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vehicle_features_config')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (err) {
      setError('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (feature: Feature) => {
    if (!supabase) {
      setError('Supabase client is not initialized');
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_features_config')
        .upsert(feature);

      if (error) throw error;
      
      setEditingFeature(null);
      fetchFeatures();
    } catch (err) {
      setError('Failed to save feature');
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) {
      setError('Supabase client is not initialized');
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_features_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchFeatures();
    } catch (err) {
      setError('Failed to delete feature');
    }
  };

  // Display configuration error if Supabase is not properly configured
  if (configError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Configuration Error</h2>
        <p className="text-red-700 dark:text-red-300">{configError}</p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Please check that your <code>.env</code> file includes:</p>
          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs">
            VITE_SUPABASE_URL=your_supabase_url<br/>
            VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
          </pre>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Vehicle Features</h2>
        <button
          onClick={() => setEditingFeature({
            id: '',
            category: '',
            name: '',
            display_name: '',
            description: '',
            icon: '',
            is_active: true
          })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-lg font-medium dark:text-white capitalize mb-4">
                {category}
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Display Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {features
                      .filter(feature => feature.category === category)
                      .map(feature => (
                        <tr key={feature.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {feature.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {feature.display_name}
                          </td>
                          <td className="px-6 py-4 text-sm dark:text-white">
                            {feature.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              feature.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {feature.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingFeature(feature)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(feature.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {editingFeature.id ? 'Edit Feature' : 'Add Feature'}
              </h3>
              <button
                onClick={() => setEditingFeature(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave(editingFeature);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingFeature.category}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      category: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingFeature.name}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      name: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editingFeature.display_name}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      display_name: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingFeature.description}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      description: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={editingFeature.icon}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      icon: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingFeature.is_active}
                    onChange={(e) => setEditingFeature({
                      ...editingFeature,
                      is_active: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleFeaturesManager;
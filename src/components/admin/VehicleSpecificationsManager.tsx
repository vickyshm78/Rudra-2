import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Specification {
  id: string;
  category: string;
  name: string;
  display_name: string;
  unit: string;
  is_required: boolean;
  is_active: boolean;
}

const VehicleSpecificationsManager: React.FC = () => {
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [editingSpec, setEditingSpec] = useState<Specification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpecifications();
  }, []);

  const fetchSpecifications = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_specifications_config')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSpecifications(data || []);
    } catch (err) {
      setError('Failed to load specifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (spec: Specification) => {
    try {
      const { error } = await supabase
        .from('vehicle_specifications_config')
        .upsert(spec);

      if (error) throw error;
      
      setEditingSpec(null);
      fetchSpecifications();
    } catch (err) {
      setError('Failed to save specification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_specifications_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchSpecifications();
    } catch (err) {
      setError('Failed to delete specification');
    }
  };

  const categories = Array.from(new Set(specifications.map(s => s.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Vehicle Specifications</h2>
        <button
          onClick={() => setEditingSpec({
            id: '',
            category: '',
            name: '',
            display_name: '',
            unit: '',
            is_required: false,
            is_active: true
          })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Specification
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Required</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {specifications
                      .filter(spec => spec.category === category)
                      .map(spec => (
                        <tr key={spec.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {spec.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {spec.display_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {spec.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                            {spec.is_required ? 'Yes' : 'No'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              spec.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {spec.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingSpec(spec)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(spec.id)}
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
      {editingSpec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {editingSpec.id ? 'Edit Specification' : 'Add Specification'}
              </h3>
              <button
                onClick={() => setEditingSpec(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave(editingSpec);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingSpec.category}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
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
                    value={editingSpec.name}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
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
                    value={editingSpec.display_name}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
                      display_name: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={editingSpec.unit}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
                      unit: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., km, kg, liters"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingSpec.is_required}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
                      is_required: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Required
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingSpec.is_active}
                    onChange={(e) => setEditingSpec({
                      ...editingSpec,
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
                  onClick={() => setEditingSpec(null)}
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

export default VehicleSpecificationsManager;
import React from 'react';
import FormDemo from '../components/ui/form-demo';

const FormDesignDemo: React.FC = () => {
  return (
    <div className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Accessible Form Design</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-4">Design Specifications</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>High contrast ratios for text fields (minimum 4.5:1)</li>
              <li>Clear visual indicators for all input states</li>
              <li>Consistent padding (12px vertical, 16px horizontal)</li>
              <li>Subtle shadows and borders for depth</li>
              <li>Clear, visible labels above input fields</li>
              <li>Placeholder text with reduced opacity</li>
              <li>Sufficient spacing between form elements</li>
              <li>Immediate validation feedback</li>
              <li>Visible cursor indicator</li>
              <li>Responsive design across all screen sizes</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Input States</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default State</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder:text-gray-400/70 focus:outline-none"
                    placeholder="Default input field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Focus State</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-blue-500 shadow-sm placeholder:text-gray-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Focused input field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hover State</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-400 shadow-sm placeholder:text-gray-400/70 focus:outline-none hover:border-gray-500"
                    placeholder="Hover over input field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disabled State</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed placeholder:text-gray-400/70 focus:outline-none"
                    placeholder="Disabled input field"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Error State</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-red-500 shadow-sm placeholder:text-gray-400/70 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Error in input field"
                  />
                  <p className="mt-1 text-sm text-red-600">This field has an error</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Success State</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full px-4 py-3 rounded-lg border border-green-500 shadow-sm placeholder:text-gray-400/70 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Success in input field"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-green-600">This field is valid</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Form Demo</h2>
              <FormDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDesignDemo;
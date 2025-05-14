import React, { useState } from 'react';
import { DollarSign, Percent, Calendar, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';

interface LoanPreApprovalProps {
  vehiclePrice: number;
}

const LoanPreApproval: React.FC<LoanPreApprovalProps> = ({ vehiclePrice }) => {
  const [formData, setFormData] = useState({
    income: '',
    creditScore: '',
    employment: '',
    downPayment: Math.round(vehiclePrice * 0.2).toString(), // 20% default
    term: '60'
  });

  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Loan Pre-Approval</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                placeholder="Enter your annual income"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Credit Score
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="creditScore"
                value={formData.creditScore}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select credit score range</option>
                <option value="excellent">Excellent (750+)</option>
                <option value="good">Good (700-749)</option>
                <option value="fair">Fair (650-699)</option>
                <option value="poor">Poor (below 650)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employment Status
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="employment"
                value={formData.employment}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select employment status</option>
                <option value="fulltime">Full-time employed</option>
                <option value="parttime">Part-time employed</option>
                <option value="selfemployed">Self-employed</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Down Payment
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                min="0"
                max={vehiclePrice}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round((Number(formData.downPayment) / vehiclePrice) * 100)}% of vehicle price
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loan Term
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="term"
                value={formData.term}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="36">36 months (3 years)</option>
                <option value="48">48 months (4 years)</option>
                <option value="60">60 months (5 years)</option>
                <option value="72">72 months (6 years)</option>
                <option value="84">84 months (7 years)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Check Pre-Approval
          </button>
        </div>
      </form>

      {showResults && (
        <div className="mt-8 space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Pre-Approved!
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                <span className="font-semibold dark:text-white">
                  ${(vehiclePrice - Number(formData.downPayment)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Estimated APR</span>
                <span className="font-semibold dark:text-white">4.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Monthly Payment</span>
                <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                  $425
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2 dark:text-white">Next Steps</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                Complete full application online
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                Submit required documents
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                Receive final approval within 24 hours
              </li>
            </ul>
          </div>

          <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>
              This is a preliminary approval based on the information provided. 
              Final approval and rates are subject to verification of income and credit history.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPreApproval;
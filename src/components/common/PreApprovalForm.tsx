import React, { useState } from 'react';
import { DollarSign, User, Briefcase, CreditCard, Calendar, CheckCircle, AlertTriangle, Shield, Mail, Phone, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface PreApprovalFormProps {
  vehiclePrice: number;
  onApproval: (data: any) => void;
}

const PreApprovalForm: React.FC<PreApprovalFormProps> = ({ vehiclePrice, onApproval }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    income: '',
    employmentType: '',
    employmentDuration: '',
    creditScore: '',
    downPayment: Math.round(vehiclePrice * 0.2).toString(),
    loanTerm: '60'
  });
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approvalData, setApprovalData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate pre-approval based on income and credit score
      const monthlyIncome = Number(formData.income);
      const creditScore = Number(formData.creditScore);
      const downPayment = Number(formData.downPayment);
      
      // Simple approval logic (in a real app, this would be much more complex)
      const maxEmi = monthlyIncome * 0.5; // 50% of income can go to EMI
      const interestRate = creditScore > 750 ? 8.5 : 
                          creditScore > 700 ? 9.0 :
                          creditScore > 650 ? 9.5 : 10.0;
      
      const loanAmount = vehiclePrice - downPayment;
      const loanTermMonths = Number(formData.loanTerm);
      const monthlyRate = interestRate / 1200;
      
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
                 (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
      
      const isApproved = emi <= maxEmi;
      
      const approvalResult = {
        approved: isApproved,
        maxLoanAmount: isApproved ? loanAmount : Math.round(maxEmi * loanTermMonths * 0.8),
        interestRate,
        emi: Math.round(emi),
        loanTerm: loanTermMonths,
        downPayment,
        processingFee: Math.round(loanAmount * 0.01), // 1% processing fee
        requiredDocuments: [
          'Identity Proof (Aadhaar/PAN)',
          'Address Proof',
          'Income Proof',
          'Bank Statements (6 months)',
          formData.employmentType === 'salaried' ? 'Salary Slips (3 months)' : 'Business Proof'
        ]
      };
      
      setApproved(isApproved);
      setApprovalData(approvalResult);
      onApproval(approvalResult);
      
    } catch (error) {
      console.error('Pre-approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === i 
                  ? 'bg-blue-600 text-white' 
                  : step > i 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {step > i ? <CheckCircle className="h-5 w-5" /> : i}
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {i === 1 ? 'Personal' : i === 2 ? 'Financial' : 'Loan'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-4 right-4 h-1 bg-gray-200 dark:bg-gray-700"></div>
        <div 
          className="absolute top-0 left-4 h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">Personal Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderFinancialInfoStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">Financial Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monthly Income
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your monthly income"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Employment Type
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select employment type</option>
            <option value="salaried">Salaried</option>
            <option value="self-employed">Self-employed</option>
            <option value="business-owner">Business Owner</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Employment Duration
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            name="employmentDuration"
            value={formData.employmentDuration}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select duration</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="more-than-5">More than 5 years</option>
          </select>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select credit score range</option>
            <option value="800">Excellent (800+)</option>
            <option value="750">Very Good (750-799)</option>
            <option value="700">Good (700-749)</option>
            <option value="650">Fair (650-699)</option>
            <option value="600">Poor (below 650)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderLoanDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">Loan Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vehicle Price
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={formatCurrency(vehiclePrice)}
            disabled
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          />
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <p className="text-sm text-blue-600 dark:text-blue-300">
            By submitting this form, you authorize us to perform a soft credit check which will not affect your credit score.
          </p>
        </div>
      </div>
    </div>
  );

  const renderApprovalResult = () => (
    <div className="space-y-6">
      {approved ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
              Congratulations! You're Pre-Approved
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loan Amount</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(approvalData.maxLoanAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interest Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {approvalData.interestRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(approvalData.emi)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing Fee</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(approvalData.processingFee)}
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-3 dark:text-white">Required Documents</h4>
            <ul className="space-y-2">
              {approvalData.requiredDocuments.map((doc: string, index: number) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors">
              Complete Application
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              Alternative Loan Options Available
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Based on the information provided, we're unable to pre-approve the full loan amount. 
            However, we can offer you the following alternatives:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2 dark:text-white">Reduced Loan Amount</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(approvalData.maxLoanAmount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                With {approvalData.interestRate}% interest rate
              </p>
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                Apply for This Amount
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2 dark:text-white">Increase Down Payment</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(vehiclePrice - approvalData.maxLoanAmount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Required down payment (vs. {formatCurrency(Number(formData.downPayment))})
              </p>
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                Apply with Higher Down Payment
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-3 dark:text-white">Improve Your Chances</h4>
            <ul className="space-y-2">
              <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                Add a co-applicant with a higher income or better credit score
              </li>
              <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                Consider a longer loan term to reduce monthly payments
              </li>
              <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                Provide additional income documentation or collateral
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
        <Shield className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
        Loan Pre-Approval
      </h2>

      {!approvalData ? (
        <form onSubmit={handleSubmit}>
          {renderStepIndicator()}
          
          <div className="mb-6">
            {step === 1 && renderPersonalInfoStep()}
            {step === 2 && renderFinancialInfoStep()}
            {step === 3 && renderLoanDetailsStep()}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : step < 3 ? 'Continue' : 'Check Pre-Approval'}
            </button>
          </div>
        </form>
      ) : (
        renderApprovalResult()
      )}
    </div>
  );
};

export default PreApprovalForm;
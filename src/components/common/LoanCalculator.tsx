import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Ban as Bank, Star, AlertTriangle, ChevronDown, ChevronUp, Shield, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface LoanCalculatorProps {
  vehiclePrice: number;
  userProfile?: {
    income?: number;
    creditScore?: number;
    employmentType?: string;
    employmentDuration?: number;
  };
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  baseRate: number;
  maxTerm: number;
  processingFee: number;
  minDownPayment: number;
  features: string[];
  rating: number;
  reviews: number;
}

const banks: Bank[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    baseRate: 8.5,
    maxTerm: 84,
    processingFee: 0.5,
    minDownPayment: 10,
    features: [
      'Quick approval',
      'No prepayment penalty',
      'Digital documentation',
      'Doorstep service'
    ],
    rating: 4.5,
    reviews: 1250
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    baseRate: 8.7,
    maxTerm: 84,
    processingFee: 0.4,
    minDownPayment: 15,
    features: [
      'Lowest interest rates',
      'Minimal documentation',
      'Online application',
      'Special rates for govt employees'
    ],
    rating: 4.3,
    reviews: 1850
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    baseRate: 8.9,
    maxTerm: 72,
    processingFee: 0.5,
    minDownPayment: 10,
    features: [
      'Instant approval',
      'Flexible EMI options',
      '24x7 customer support',
      'Mobile app tracking'
    ],
    rating: 4.4,
    reviews: 1420
  }
];

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ vehiclePrice, userProfile }) => {
  const [selectedBank, setSelectedBank] = useState<Bank>(banks[0]);
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2));
  const [loanTerm, setLoanTerm] = useState(60);
  const [showDetails, setShowDetails] = useState(false);
  const [preApproved, setPreApproved] = useState(false);
  const [maxEligibleLoan, setMaxEligibleLoan] = useState(0);

  useEffect(() => {
    if (userProfile) {
      calculatePreApproval();
    }
  }, [userProfile]);

  const calculatePreApproval = () => {
    if (!userProfile?.income) return;

    // Simple pre-approval calculation
    // In a real app, this would use more sophisticated criteria
    const monthlyIncome = userProfile.income;
    const maxEmi = monthlyIncome * 0.5; // 50% of income can go to EMI
    const rate = selectedBank.baseRate / 1200; // Monthly interest rate
    const term = selectedBank.maxTerm; // Maximum term

    // PMT formula reversed to calculate maximum loan amount
    const maxLoan = maxEmi * (1 - Math.pow(1 + rate, -term)) / rate;
    
    setMaxEligibleLoan(Math.round(maxLoan));
    setPreApproved(maxLoan >= (vehiclePrice - downPayment));
  };

  const calculateEMI = (bank: Bank) => {
    const loanAmount = vehiclePrice - downPayment;
    const monthlyRate = bank.baseRate / 1200;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
               (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return Math.round(emi);
  };

  const calculateTotalCost = (bank: Bank) => {
    const emi = calculateEMI(bank);
    const totalAmount = emi * loanTerm;
    const processingFeeAmount = ((vehiclePrice - downPayment) * bank.processingFee) / 100;
    return {
      total: totalAmount + processingFeeAmount,
      interest: totalAmount - (vehiclePrice - downPayment),
      processingFee: processingFeeAmount
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Loan Calculator
        </h2>
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

      {/* Pre-approval Status */}
      {userProfile && preApproved && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Pre-approved for {formatCurrency(maxEligibleLoan)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Quick approval with minimal documentation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bank Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedBank.id === bank.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
            onClick={() => setSelectedBank(bank)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold dark:text-white">{bank.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {bank.rating}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {bank.baseRate}%
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Processing Fee: {bank.processingFee}%</p>
              <p>Max Term: {bank.maxTerm} months</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loan Calculator Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Down Payment
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min={vehiclePrice * (selectedBank.minDownPayment / 100)}
              max={vehiclePrice}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Min: {selectedBank.minDownPayment}% ({formatCurrency(vehiclePrice * selectedBank.minDownPayment / 100)})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Loan Term
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {[12, 24, 36, 48, 60, 72, 84].map((months) => (
                <option 
                  key={months} 
                  value={months}
                  disabled={months > selectedBank.maxTerm}
                >
                  {months} months ({Math.floor(months / 12)} years)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly EMI
          </label>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(calculateEMI(selectedBank))}
            </p>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Cost Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Principal Amount</span>
                <span className="font-medium dark:text-white">
                  {formatCurrency(vehiclePrice - downPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="font-medium dark:text-white">
                  {formatCurrency(calculateTotalCost(selectedBank).interest)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                <span className="font-medium dark:text-white">
                  {formatCurrency(calculateTotalCost(selectedBank).processingFee)}
                </span>
              </div>
              <div className="pt-3 border-t dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Cost</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculateTotalCost(selectedBank).total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Features */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
              <Bank className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              {selectedBank.name} Features
            </h3>
            <div className="gri grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  {selectedBank.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
              Required Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 dark:text-white">Salaried Individuals</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Identity Proof (Aadhaar/PAN/Passport)</li>
                  <li>• Address Proof</li>
                  <li>• Last 3 months' salary slips</li>
                  <li>• Last 6 months' bank statements</li>
                  <li>• Form 16 or IT returns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 dark:text-white">Self-Employed</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Identity Proof (Aadhaar/PAN/Passport)</li>
                  <li>• Address Proof</li>
                  <li>• Business proof</li>
                  <li>• Last 2 years' IT returns</li>
                  <li>• Last 6 months' bank statements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The EMI calculated is an approximation. Actual EMI may vary based on the final loan amount, 
                interest rate offered by the bank, and other charges. Please contact the bank directly for 
                the most accurate information.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Apply Button */}
      <div className="flex justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors"
        >
          Apply for Loan
        </button>
      </div>
    </div>
  );
};

export default LoanCalculator;
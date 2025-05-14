import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Percent, AlertTriangle, ChevronDown, ChevronUp, Clock, Shield, FileText, Ban as Bank, CreditCard } from 'lucide-react';

interface FinancingOptionsProps {
  vehiclePrice: number;
}

const FinancingOptions: React.FC<FinancingOptionsProps> = ({ vehiclePrice }) => {
  const [downPayment, setDownPayment] = useState<number>(Math.round(vehiclePrice * 0.2)); // 20% default down payment
  const [loanTerm, setLoanTerm] = useState<number>(60); // 60 months default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% default APR for India
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedLender, setSelectedLender] = useState<string>('sbi');
  const [showEligibility, setShowEligibility] = useState<boolean>(false);
  const [income, setIncome] = useState<number>(0);
  const [otherEmi, setOtherEmi] = useState<number>(0);

  // Lender options with typical Indian bank rates
  const lenders = {
    sbi: { name: 'State Bank of India', rate: 8.5, maxTerm: 84 },
    hdfc: { name: 'HDFC Bank', rate: 8.7, maxTerm: 84 },
    icici: { name: 'ICICI Bank', rate: 8.9, maxTerm: 84 },
    axis: { name: 'Axis Bank', rate: 9.0, maxTerm: 72 },
    pnb: { name: 'Punjab National Bank', rate: 8.6, maxTerm: 84 }
  };

  useEffect(() => {
    calculateLoan();
  }, [vehiclePrice, downPayment, loanTerm, interestRate]);

  const calculateLoan = () => {
    try {
      if (downPayment < 0 || downPayment > vehiclePrice) {
        setMonthlyPayment(0);
        setTotalInterest(0);
        setTotalCost(0);
        return;
      }

      const principal = vehiclePrice - downPayment;
      const monthlyRate = (interestRate / 100) / 12;
      const numberOfPayments = loanTerm;

      if (monthlyRate === 0) {
        const payment = principal / numberOfPayments;
        setMonthlyPayment(payment);
        setTotalInterest(0);
        setTotalCost(principal);
      } else {
        // EMI calculation using the formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalAmount = payment * numberOfPayments;
        const totalInterest = totalAmount - principal;
        
        setMonthlyPayment(payment);
        setTotalInterest(totalInterest);
        setTotalCost(totalAmount);
      }
    } catch (error) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalCost(0);
    }
  };

  const calculateEligibility = () => {
    // 50% of income can go towards EMI as per Indian banking norms
    const maxEmi = (income * 0.5) - otherEmi;
    const eligibleAmount = maxEmi * loanTerm;
    return Math.min(eligibleAmount, vehiclePrice - downPayment);
  };

  const calculateTaxBenefits = () => {
    // Section 80C benefits for principal repayment (up to ₹1.5L)
    const yearlyPrincipal = (monthlyPayment * 12) - (totalInterest / loanTerm * 12);
    const section80C = Math.min(yearlyPrincipal, 150000);
    
    return {
      section80C,
      taxSaving: section80C * 0.3 // Assuming 30% tax bracket
    };
  };

  const handleDownPaymentChange = (value: string) => {
    const newValue = Math.min(Math.max(0, Number(value)), vehiclePrice);
    setDownPayment(newValue);
  };

  const handleInterestRateChange = (value: string) => {
    const newValue = Math.min(Math.max(0, Number(value)), 30); // Cap at 30%
    setInterestRate(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            EMI Calculator
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {/* Lender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Lender
                </label>
                <select
                  value={selectedLender}
                  onChange={(e) => {
                    setSelectedLender(e.target.value);
                    setInterestRate(lenders[e.target.value as keyof typeof lenders].rate);
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {Object.entries(lenders).map(([key, lender]) => (
                    <option key={key} value={key}>
                      {lender.name} ({lender.rate}%)
                    </option>
                  ))}
                </select>
              </div>

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
                    min="0"
                    max={vehiclePrice}
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((downPayment / vehiclePrice) * 100)}% of vehicle price
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value={12}>12 months (1 year)</option>
                    <option value={24}>24 months (2 years)</option>
                    <option value={36}>36 months (3 years)</option>
                    <option value={48}>48 months (4 years)</option>
                    <option value={60}>60 months (5 years)</option>
                    <option value={72}>72 months (6 years)</option>
                    <option value={84}>84 months (7 years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interest Rate (% per annum)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={interestRate}
                    onChange={(e) => handleInterestRateChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(monthlyPayment)}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Principal:</span>
                  <span className="font-medium dark:text-white">{formatCurrency(vehiclePrice - downPayment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Interest:</span>
                  <span className="font-medium dark:text-white">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Cost:</span>
                  <span className="font-medium dark:text-white">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Loan Duration:</span>
                  <span className="font-medium dark:text-white flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {loanTerm} months
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start mt-4 text-sm text-gray-500 dark:text-gray-400">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>
                This is an estimate only. Actual EMI may vary based on credit score, 
                additional fees, and lender terms.
              </p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Loan Eligibility Calculator */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                Loan Eligibility Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Enter monthly income"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Other EMIs/Month
                  </label>
                  <input
                    type="number"
                    value={otherEmi}
                    onChange={(e) => setOtherEmi(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Enter other EMIs"
                  />
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  Maximum Eligible Loan Amount: {formatCurrency(calculateEligibility())}
                </p>
              </div>
            </div>

            {/* Tax Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-500" />
                Tax Benefits
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Section 80C Benefit (Principal):</span>
                    <span className="font-medium dark:text-white">
                      {formatCurrency(calculateTaxBenefits().section80C)}/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Tax Saving:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(calculateTaxBenefits().taxSaving)}/year
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lender Comparison */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <Bank className="h-5 w-5 mr-2 text-blue-500" />
                Lender Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left">Lender</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                      <th className="px-4 py-2 text-left">Max Term</th>
                      <th className="px-4 py-2 text-left">Processing Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(lenders).map(([key, lender]) => (
                      <tr key={key} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">{lender.name}</td>
                        <td className="px-4 py-2">{lender.rate}%</td>
                        <td className="px-4 py-2">{lender.maxTerm} months</td>
                        <td className="px-4 py-2">Up to 1%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Costs */}
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-orange-500" />
                Additional Costs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 dark:text-white">One-time Charges</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Processing Fee: 0.5-1% of loan amount</li>
                    <li>• Documentation Charges: ₹500-2,000</li>
                    <li>• Stamp Duty: As per state laws</li>
                    <li>• Insurance Premium: 3-4% of vehicle cost</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 dark:text-white">Recurring Charges</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Annual Insurance Renewal</li>
                    <li>• Road Tax (as applicable)</li>
                    <li>• Maintenance Costs</li>
                    <li>• Fuel Expenses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancingOptions;
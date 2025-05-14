import React, { useState } from 'react';
import { Ban as Bank, Star, Check, Info, DollarSign, Calendar, Percent, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface BankComparisonProps {
  vehiclePrice: number;
  downPayment: number;
  loanTerm: number;
}

interface BankOffer {
  id: string;
  name: string;
  logo: string;
  interestRate: number;
  processingFee: number;
  maxLoanAmount: number;
  maxTenure: number;
  disbursalTime: string;
  prepaymentPenalty: string;
  specialOffers: string[];
  rating: number;
  reviews: number;
}

const banks: BankOffer[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    interestRate: 8.5,
    processingFee: 0.5,
    maxLoanAmount: 10000000,
    maxTenure: 84,
    disbursalTime: '24-48 hours',
    prepaymentPenalty: 'None after 6 months',
    specialOffers: [
      'Rate discount for existing customers',
      'Zero documentation for pre-approved customers',
      'Special offers for premium car models'
    ],
    rating: 4.5,
    reviews: 1250
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    interestRate: 8.7,
    processingFee: 0.4,
    maxLoanAmount: 15000000,
    maxTenure: 84,
    disbursalTime: '3-5 days',
    prepaymentPenalty: 'None',
    specialOffers: [
      'Lower rates for government employees',
      'Special scheme for electric vehicles',
      'No foreclosure charges'
    ],
    rating: 4.3,
    reviews: 1850
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    interestRate: 8.9,
    processingFee: 0.5,
    maxLoanAmount: 12000000,
    maxTenure: 84,
    disbursalTime: '24 hours',
    prepaymentPenalty: '2% within first year',
    specialOffers: [
      'Instant approval for select customers',
      'Special rates for luxury vehicles',
      'Flexible repayment options'
    ],
    rating: 4.4,
    reviews: 1420
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    interestRate: 9.0,
    processingFee: 0.5,
    maxLoanAmount: 10000000,
    maxTenure: 84,
    disbursalTime: '2-3 days',
    prepaymentPenalty: '3% within first year',
    specialOffers: [
      'Up to 100% on-road funding',
      'Special rates for premium customers',
      'Step-up EMI option available'
    ],
    rating: 4.2,
    reviews: 980
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    logo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    interestRate: 9.2,
    processingFee: 0.6,
    maxLoanAmount: 8000000,
    maxTenure: 72,
    disbursalTime: '24-48 hours',
    prepaymentPenalty: 'None after 12 months',
    specialOffers: [
      'Special rates for existing customers',
      'Digital approval process',
      'Flexible EMI options'
    ],
    rating: 4.1,
    reviews: 750
  }
];

const BankComparison: React.FC<BankComparisonProps> = ({ vehiclePrice, downPayment, loanTerm }) => {
  const [selectedBanks, setSelectedBanks] = useState<string[]>(['hdfc', 'sbi', 'icici']);
  const [sortBy, setSortBy] = useState<'rate' | 'emi' | 'total'>('rate');

  const calculateEMI = (bank: BankOffer) => {
    const loanAmount = vehiclePrice - downPayment;
    const monthlyRate = bank.interestRate / 1200;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
               (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return Math.round(emi);
  };

  const calculateTotalCost = (bank: BankOffer) => {
    const emi = calculateEMI(bank);
    const totalAmount = emi * loanTerm;
    const processingFeeAmount = ((vehiclePrice - downPayment) * bank.processingFee) / 100;
    return totalAmount + processingFeeAmount;
  };

  const toggleBankSelection = (bankId: string) => {
    if (selectedBanks.includes(bankId)) {
      setSelectedBanks(selectedBanks.filter(id => id !== bankId));
    } else {
      setSelectedBanks([...selectedBanks, bankId]);
    }
  };

  const sortedBanks = [...banks].sort((a, b) => {
    if (sortBy === 'rate') {
      return a.interestRate - b.interestRate;
    } else if (sortBy === 'emi') {
      return calculateEMI(a) - calculateEMI(b);
    } else {
      return calculateTotalCost(a) - calculateTotalCost(b);
    }
  });

  const filteredBanks = sortedBanks.filter(bank => selectedBanks.includes(bank.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <Bank className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Compare Bank Offers
        </h2>
      </div>

      {/* Bank Selection */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-3 dark:text-white">Select Banks to Compare</h3>
        <div className="flex flex-wrap gap-2">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => toggleBankSelection(bank.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedBanks.includes(bank.id)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {bank.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setSortBy('rate')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              sortBy === 'rate'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Percent className="h-4 w-4 inline mr-1" />
            Rate
          </button>
          <button
            onClick={() => setSortBy('emi')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'emi'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            EMI
          </button>
          <button
            onClick={() => setSortBy('total')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              sortBy === 'total'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-1" />
            Total Cost
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly EMI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Processing Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBanks.map((bank) => (
                <tr key={bank.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bank className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {bank.name}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="ml-1">{bank.rating} ({bank.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{bank.interestRate}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Fixed</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateEMI(bank))}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      for {loanTerm} months
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{bank.processingFee}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(((vehiclePrice - downPayment) * bank.processingFee) / 100)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateTotalCost(bank))}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Principal + Interest + Fees
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBanks.slice(0, 2).map((bank) => (
          <div key={bank.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-3 dark:text-white">{bank.name} Special Features</h3>
            <ul className="space-y-2">
              {bank.specialOffers.map((offer, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {offer}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-2" />
                Disbursal Time: {bank.disbursalTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The interest rates and EMIs shown are indicative and may vary based on your credit profile, 
            income, and other factors. Please check with the respective banks for the most accurate and 
            up-to-date information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankComparison;
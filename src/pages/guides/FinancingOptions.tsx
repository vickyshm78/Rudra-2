import React from 'react';
import { DollarSign, Ban as Bank, Calculator, FileText, ShieldCheck, TrendingUp } from 'lucide-react';

const FinancingOptions: React.FC = () => {
  const options = [
    {
      icon: <Bank className="h-8 w-8" />,
      title: "Traditional Bank Loans",
      description: "Secure a loan directly from a bank or credit union.",
      pros: [
        "Generally lower interest rates",
        "Flexible terms",
        "Build banking relationship",
        "No dealer markup"
      ],
      cons: [
        "Stricter qualification requirements",
        "Longer approval process",
        "May require excellent credit",
        "Additional paperwork"
      ]
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Dealer Financing",
      description: "Finance your vehicle through the dealership's lending partners.",
      pros: [
        "Convenient one-stop shopping",
        "Special manufacturer incentives",
        "Quick approval process",
        "Multiple lender options"
      ],
      cons: [
        "Potentially higher interest rates",
        "Dealer markup on rates",
        "Pressure to buy add-ons",
        "Less negotiating power"
      ]
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Online Lenders",
      description: "Secure financing through online financial institutions.",
      pros: [
        "Competitive rates",
        "Easy comparison shopping",
        "Quick online approval",
        "Minimal paperwork"
      ],
      cons: [
        "Limited personal interaction",
        "May have higher fees",
        "Security concerns",
        "Less flexibility"
      ]
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Credit Unions",
      description: "Member-owned financial institutions offering vehicle loans.",
      pros: [
        "Lower interest rates",
        "More flexible terms",
        "Personalized service",
        "Member benefits"
      ],
      cons: [
        "Membership required",
        "Limited locations",
        "Fewer technology options",
        "Slower processing"
      ]
    }
  ];

  const tips = [
    "Check your credit score before applying",
    "Get pre-approved before shopping",
    "Compare multiple loan offers",
    "Understand all terms and fees",
    "Consider the total cost, not just monthly payments",
    "Watch out for prepayment penalties",
    "Don't forget about insurance costs",
    "Keep loan term as short as affordable"
  ];

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Vehicle Financing Options
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Understanding your financing options to make the best decision for your budget
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <div className="flex items-center mb-4">
            <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-2xl font-semibold dark:text-white">
              Loan Calculator
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Estimate your monthly payments based on vehicle price, down payment, interest rate, and term.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="$25,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Down Payment
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="$5,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Term (months)
              </label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>36</option>
                <option>48</option>
                <option>60</option>
                <option>72</option>
                <option>84</option>
              </select>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Calculate
          </button>
        </div>

        {/* Financing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {options.map((option, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold dark:text-white">
                  {option.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {option.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {option.pros.map((pro, proIndex) => (
                      <li 
                        key={proIndex}
                        className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {option.cons.map((con, conIndex) => (
                      <li 
                        key={conIndex}
                        className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-blue-800 dark:bg-blue-900 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-white mr-2" />
            <h2 className="text-2xl font-semibold text-white">
              Smart Financing Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className="bg-white/10 rounded-lg p-4"
              >
                <p className="text-white text-sm">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingOptions;
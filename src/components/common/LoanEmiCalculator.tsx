import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LoanCalculator from './LoanCalculator';
import BankComparison from './BankComparison';
import PreApprovalForm from './PreApprovalForm';
import { Calculator, Ban as Bank, Shield } from 'lucide-react';

interface LoanEmiCalculatorProps {
  vehiclePrice: number;
}

const LoanEmiCalculator: React.FC<LoanEmiCalculatorProps> = ({ vehiclePrice }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2));
  const [loanTerm, setLoanTerm] = useState(60);
  const [approvalData, setApprovalData] = useState<any>(null);

  const handleApproval = (data: any) => {
    setApprovalData(data);
    // If approved, update the calculator with the approved terms
    if (data.approved) {
      setDownPayment(vehiclePrice - data.maxLoanAmount);
      setLoanTerm(data.loanTerm);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="calculator" className="flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              EMI Calculator
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center">
              <Bank className="h-4 w-4 mr-2" />
              Compare Banks
            </TabsTrigger>
            <TabsTrigger value="pre-approval" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Get Pre-Approved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <LoanCalculator 
              vehiclePrice={vehiclePrice} 
              userProfile={approvalData ? {
                income: Number(approvalData.income),
                creditScore: Number(approvalData.creditScore)
              } : undefined}
            />
          </TabsContent>
          
          <TabsContent value="comparison">
            <BankComparison 
              vehiclePrice={vehiclePrice}
              downPayment={downPayment}
              loanTerm={loanTerm}
            />
          </TabsContent>
          
          <TabsContent value="pre-approval">
            <PreApprovalForm 
              vehiclePrice={vehiclePrice}
              onApproval={handleApproval}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoanEmiCalculator;
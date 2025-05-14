import React, { useState } from 'react';
import { Shield, DollarSign, CheckCircle, AlertTriangle, ArrowRight, Clock, User, Car, FileText, CreditCard, Lock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface EscrowPaymentServiceProps {
  vehicleId?: string;
  vehicleDetails?: {
    title: string;
    price: number;
    seller: {
      name: string;
      id: string;
    };
  };
  onInitiate?: (amount: number, buyerId: string, sellerId: string) => void;
}

const EscrowPaymentService: React.FC<EscrowPaymentServiceProps> = ({
  vehicleId,
  vehicleDetails,
  onInitiate
}) => {
  const [step, setStep] = useState(1);
  const [agreedPrice, setAgreedPrice] = useState(vehicleDetails?.price || 0);
  const [escrowFee, setEscrowFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi' | 'wallet'>('bank');
  const [loading, setLoading] = useState(false);
  const [transactionInitiated, setTransactionInitiated] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Calculate escrow fee (0.5% of transaction amount, min ₹499, max ₹9,999)
  const calculateEscrowFee = (amount: number) => {
    const fee = amount * 0.005;
    return Math.max(499, Math.min(fee, 9999));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseInt(e.target.value) || 0;
    setAgreedPrice(price);
    setEscrowFee(calculateEscrowFee(price));
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleInitiateTransaction();
    }
  };

  const handleInitiateTransaction = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a transaction ID
      const mockTransactionId = `ESC-${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);
      setTransactionInitiated(true);
      
      if (onInitiate && vehicleDetails) {
        onInitiate(agreedPrice, 'buyer-123', vehicleDetails.seller.id);
      }
    } catch (error) {
      console.error('Transaction initiation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize escrow fee when component mounts or vehicle details change
  React.useEffect(() => {
    if (vehicleDetails?.price) {
      setAgreedPrice(vehicleDetails.price);
      setEscrowFee(calculateEscrowFee(vehicleDetails.price));
    }
  }, [vehicleDetails]);

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
              {i === 1 ? 'Transaction Details' : i === 2 ? 'Payment Method' : 'Review & Confirm'}
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

  const renderTransactionDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium dark:text-white">Transaction Details</h3>
      
      {vehicleDetails ? (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <Car className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div>
              <p className="font-medium dark:text-white">{vehicleDetails.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Seller: {vehicleDetails.seller.name}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Agreed Purchase Price *
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="number"
            value={agreedPrice || ''}
            onChange={handlePriceChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter agreed price"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter the final price agreed between you and the seller
        </p>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How Escrow Works</h4>
        <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-start">
            <span className="bg-blue-200 dark:bg-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">1</span>
            <span>Buyer deposits the agreed amount into our secure escrow account</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 dark:bg-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">2</span>
            <span>Seller is notified that funds are secured</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 dark:bg-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">3</span>
            <span>Buyer receives the vehicle and confirms satisfaction</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 dark:bg-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">4</span>
            <span>Funds are released to the seller</span>
          </li>
        </ol>
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium dark:text-white">Payment Method</h3>
      
      <div className="space-y-4">
        <div
          className={`border rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'bank'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('bank')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'bank'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {paymentMethod === 'bank' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Bank Transfer (NEFT/RTGS/IMPS)</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Secure transfer from your bank account
              </p>
            </div>
          </div>
        </div>
        
        <div
          className={`border rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'upi'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('upi')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'upi'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {paymentMethod === 'upi' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium dark:text-white">UPI Payment</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)
              </p>
            </div>
          </div>
        </div>
        
        <div
          className={`border rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'wallet'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('wallet')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'wallet'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {paymentMethod === 'wallet' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Digital Wallet</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pay using your digital wallet (Paytm, Amazon Pay, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Important</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You will be redirected to our secure payment gateway after confirming this transaction.
              Do not share your payment details with anyone, including the seller.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewConfirm = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium dark:text-white">Review & Confirm</h3>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <h4 className="font-medium mb-4 dark:text-white">Transaction Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Vehicle</span>
            <span className="font-medium dark:text-white">{vehicleDetails?.title || 'Selected Vehicle'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Seller</span>
            <span className="font-medium dark:text-white">{vehicleDetails?.seller.name || 'Seller'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Agreed Price</span>
            <span className="font-medium dark:text-white">{formatCurrency(agreedPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Escrow Fee</span>
            <span className="font-medium dark:text-white">{formatCurrency(escrowFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Payment Method</span>
            <span className="font-medium dark:text-white capitalize">{paymentMethod}</span>
          </div>
          <div className="pt-3 border-t dark:border-gray-600 flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-200">Total Amount</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(agreedPrice + escrowFee)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Buyer Protection</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your payment is held securely in escrow until you confirm receipt and satisfaction with the vehicle.
              If there are any issues, our dispute resolution team will assist you.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
        </label>
      </div>
    </div>
  );

  const renderTransactionSuccess = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Transaction Initiated Successfully!
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your escrow transaction has been initiated. Please complete the payment using the selected method to secure the vehicle.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span className="font-medium dark:text-white">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium dark:text-white">{formatCurrency(agreedPrice + escrowFee)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium dark:bg-yellow-900/30 dark:text-yellow-300">
                Awaiting Payment
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-3 dark:text-white">Next Steps</h4>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">1</span>
              <span className="text-gray-700 dark:text-gray-300">
                Complete the payment using your selected payment method
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">2</span>
              <span className="text-gray-700 dark:text-gray-300">
                Once payment is confirmed, the seller will be notified
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">3</span>
              <span className="text-gray-700 dark:text-gray-300">
                Arrange with the seller to inspect and receive the vehicle
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 w-5 h-5 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 mr-2 flex-shrink-0">4</span>
              <span className="text-gray-700 dark:text-gray-300">
                Confirm receipt and satisfaction to release funds to the seller
              </span>
            </li>
          </ol>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Proceed to Payment
          </button>
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View Transaction Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 dark:text-white flex items-center">
          <Lock className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Secure Escrow Payment Service
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Our escrow service ensures a safe and secure transaction for both buyers and sellers
        </p>
      </div>

      <div className="p-6">
        {transactionInitiated ? (
          renderTransactionSuccess()
        ) : (
          <>
            {renderStepIndicator()}
            
            <div className="mb-6">
              {step === 1 && renderTransactionDetails()}
              {step === 2 && renderPaymentMethod()}
              {step === 3 && renderReviewConfirm()}
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
                type="button"
                onClick={handleContinue}
                disabled={loading || (step === 1 && agreedPrice <= 0)}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                  loading || (step === 1 && agreedPrice <= 0)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : step < 3 ? 'Continue' : 'Initiate Transaction'}
              </button>
            </div>
          </>
        )}

        {/* Benefits */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Why Use Our Escrow Service?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Secure Transactions</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your money is held securely until you're satisfied with the vehicle
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Fraud Protection</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Protects both buyers and sellers from fraud and scams
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Dispute Resolution</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Professional mediation if any issues arise during the transaction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium mb-3 dark:text-white">Escrow Fee Structure</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Transaction Amount</span>
              <span className="text-gray-600 dark:text-gray-300">Fee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Up to ₹1,00,000</span>
              <span className="text-gray-600 dark:text-gray-300">0.5% (min ₹499)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">₹1,00,001 - ₹10,00,000</span>
              <span className="text-gray-600 dark:text-gray-300">0.5% (max ₹9,999)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Above ₹10,00,000</span>
              <span className="text-gray-600 dark:text-gray-300">₹9,999 (fixed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowPaymentService;
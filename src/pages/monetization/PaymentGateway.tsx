import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, CheckCircle, AlertTriangle, ArrowLeft, User, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const PaymentGateway: React.FC = () => {
  const { serviceId, amount } = useParams<{ serviceId: string; amount: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [serviceDetails, setServiceDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch service details based on serviceId
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    // In a real app, this would fetch from the database
    // For now, we'll use mock data
    const mockServices: Record<string, any> = {
      'premium-listing': {
        name: 'Premium Listing Upgrade',
        description: 'Upgrade your listing to premium for increased visibility',
        icon: <CreditCard className="h-6 w-6" />
      },
      'insurance': {
        name: 'Comprehensive Insurance',
        description: 'Full coverage insurance for your vehicle',
        icon: <Shield className="h-6 w-6" />
      },
      'inspection': {
        name: 'Vehicle Inspection',
        description: 'Professional 150-point vehicle inspection',
        icon: <CheckCircle className="h-6 w-6" />
      },
      'rto-transfer': {
        name: 'RC Transfer Service',
        description: 'Complete assistance with ownership transfer',
        icon: <User className="h-6 w-6" />
      }
    };

    setServiceDetails(mockServices[serviceId || ''] || {
      name: 'Service Payment',
      description: 'Payment for selected service',
      icon: <CreditCard className="h-6 w-6" />
    });
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    // Validate based on payment method
    if (paymentMethod === 'card') {
      if (cardDetails.number.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardDetails.name) {
        setError('Please enter the cardholder name');
        return;
      }
      if (cardDetails.expiry.length !== 5) {
        setError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        setError('Please enter a valid UPI ID');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        setError('Please select a bank');
        return;
      }
    } else if (paymentMethod === 'wallet') {
      if (!selectedWallet) {
        setError('Please select a wallet');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a transaction ID
      const mockTransactionId = `TXN${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);
      setPaymentComplete(true);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium dark:text-white">Select Payment Method</h3>
      
      <div className="space-y-4">
        <div
          className={`border rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'card'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'card'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {paymentMethod === 'card' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Credit/Debit Card</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pay securely with your credit or debit card
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
            paymentMethod === 'netbanking'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('netbanking')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'netbanking'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {paymentMethod === 'netbanking' && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Net Banking</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pay directly from your bank account
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
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium dark:text-white">Payment Details</h3>
      
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={(e) => {
                  const formattedValue = formatCardNumber(e.target.value);
                  setCardDetails({...cardDetails, number: formattedValue});
                }}
                maxLength={19}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              name="name"
              value={cardDetails.name}
              onChange={handleCardInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="John Smith"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    const formattedValue = formatExpiry(e.target.value);
                    setCardDetails({...cardDetails, expiry: formattedValue});
                  }}
                  maxLength={5}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="MM/YY"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  maxLength={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {paymentMethod === 'upi' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="username@upi"
            required
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your UPI ID (e.g., name@okicici, name@okhdfc)
          </p>
        </div>
      )}
      
      {paymentMethod === 'netbanking' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Bank
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select your bank</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="kotak">Kotak Mahindra Bank</option>
            <option value="other">Other Banks</option>
          </select>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You will be redirected to your bank's website to complete the payment
          </p>
        </div>
      )}
      
      {paymentMethod === 'wallet' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Wallet
          </label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select your wallet</option>
            <option value="paytm">Paytm</option>
            <option value="phonepe">PhonePe</option>
            <option value="amazonpay">Amazon Pay</option>
            <option value="mobikwik">MobiKwik</option>
            <option value="freecharge">Freecharge</option>
          </select>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You will be redirected to complete the payment
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your payment information is secure. We use industry-standard encryption to protect your data.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPaymentSuccess = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Payment Successful!
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your payment has been processed successfully. Thank you for your purchase!
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span className="font-medium dark:text-white">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium dark:text-white">{formatCurrency(Number(amount || 0))}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
              <span className="font-medium dark:text-white capitalize">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
              <span className="font-medium dark:text-white">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {serviceDetails?.icon || <CreditCard className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />}
              <h2 className="text-xl font-bold ml-2 dark:text-white">
                {serviceDetails?.name || 'Payment Gateway'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {serviceDetails?.description || 'Complete your payment securely'}
            </p>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-3 dark:text-white">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">{serviceDetails?.name || 'Service'}</span>
                <span className="font-medium dark:text-white">{formatCurrency(Number(amount || 0))}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">Total</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(Number(amount || 0))}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {paymentComplete ? (
                renderPaymentSuccess()
              ) : (
                <>
                  {step === 1 ? renderPaymentMethodSelection() : renderPaymentDetails()}
                  
                  <div className="mt-6 flex justify-between">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Back
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      {loading ? 'Processing...' : step === 1 ? 'Continue' : `Pay ${formatCurrency(Number(amount || 0))}`}
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Security Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Encrypted Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
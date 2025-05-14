import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, DollarSign, AlertTriangle, Truck, User, MapPin, Calendar } from 'lucide-react';
import { RtoService } from '../../types';

interface RtoServicesProps {
  vehicleId?: string;
  registrationNumber?: string;
}

const RtoServices: React.FC<RtoServicesProps> = ({ vehicleId, registrationNumber }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    preferredDate: '',
    documentPickup: false
  });
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const services: RtoService[] = [
    {
      id: 'rc-transfer',
      name: 'RC Transfer',
      description: 'Transfer vehicle ownership to your name',
      price: 1499,
      processingTime: '7-10 working days',
      requiredDocuments: [
        'Form 29 (Notice of Transfer)',
        'Form 30 (Report of Transfer)',
        'Original RC',
        'Valid Insurance Certificate',
        'PUC Certificate',
        'ID & Address Proof',
        'NOC from financier (if applicable)'
      ],
      steps: [
        'Document verification',
        'Application submission at RTO',
        'Fee payment',
        'Biometric verification',
        'RC transfer approval',
        'New RC delivery'
      ]
    },
    {
      id: 'noc',
      name: 'NOC from RTO',
      description: 'Get No Objection Certificate for interstate transfer',
      price: 999,
      processingTime: '5-7 working days',
      requiredDocuments: [
        'Form 28',
        'Original RC',
        'Valid Insurance Certificate',
        'PUC Certificate',
        'ID & Address Proof',
        'NOC from financier (if applicable)'
      ],
      steps: [
        'Document verification',
        'Application submission at RTO',
        'Fee payment',
        'Vehicle inspection',
        'NOC issuance',
        'Document delivery'
      ]
    },
    {
      id: 'hypothecation',
      name: 'Hypothecation Removal',
      description: "Remove financier's name from RC after loan closure",
      price: 1299,
      processingTime: '5-7 working days',
      requiredDocuments: [
        'Form 35',
        'Original RC',
        'NOC from financier',
        'Loan closure letter',
        'ID & Address Proof'
      ],
      steps: [
        'Document verification',
        'Application submission at RTO',
        'Fee payment',
        'Verification process',
        'Hypothecation removal',
        'Updated RC delivery'
      ]
    },
    {
      id: 'address-change',
      name: 'Address Change in RC',
      description: 'Update your address in vehicle registration certificate',
      price: 899,
      processingTime: '3-5 working days',
      requiredDocuments: [
        'Form 33',
        'Original RC',
        'New address proof',
        'ID Proof'
      ],
      steps: [
        'Document verification',
        'Application submission at RTO',
        'Fee payment',
        'Address verification',
        'Updated RC delivery'
      ]
    }
  ];

  const selectedServiceData = services.find(service => service.id === selectedService);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleBookService();
    }
  };

  const handleBookService = async () => {
    if (!selectedServiceData) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = {
        id: `booking-${Date.now()}`,
        service: selectedServiceData,
        customerDetails: formData,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        trackingId: `RTO${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setBookingData(booking);
      setBookingComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Select RTO Service</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedService === service.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold dark:text-white">{service.name}</h4>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                {service.processingTime}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {service.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {service.processingTime}
              </div>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                ₹{service.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedService && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium mb-3 dark:text-white">Required Documents</h4>
          <ul className="space-y-1">
            {selectedServiceData?.requiredDocuments.map((doc, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderCustomerDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Your Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Enter your address"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter city"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter state"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter pincode"
            required
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="documentPickup"
          name="documentPickup"
          checked={formData.documentPickup}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="documentPickup" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I need doorstep document pickup service (additional ₹299)
        </label>
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Service Booked Successfully!
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Booking Details</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {bookingData.service.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.service.description}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    ₹{bookingData.service.price}{bookingData.customerDetails.documentPickup ? ' + ₹299' : ''}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.customerDetails.documentPickup ? 'Including document pickup' : 'Service fee'}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(bookingData.customerDetails.preferredDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Preferred date
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Tracking Information</h4>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-800 mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Tracking ID</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                {bookingData.trackingId}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estimated completion by {new Date(bookingData.estimatedCompletion).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-3 dark:text-white">What's Next?</h4>
          <ul className="space-y-2">
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                1
              </div>
              You'll receive a confirmation SMS and email with booking details
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                2
              </div>
              Our RTO expert will contact you within 24 hours to collect required documents
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                3
              </div>
              Track your application status using the tracking ID provided
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
        >
          Book Another Service
        </button>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {[1, 2].map((i) => (
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
              {i === 1 ? 'Select Service' : 'Your Details'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-4 right-4 h-1 bg-gray-200 dark:bg-gray-700"></div>
        <div 
          className="absolute top-0 left-4 h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${((step - 1) / 1) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Digital RTO Services
        </h2>

        {bookingComplete ? (
          renderBookingConfirmation()
        ) : (
          <div>
            {renderStepIndicator()}
            
            <div className="mb-6">
              {step === 1 && renderServiceSelection()}
              {step === 2 && renderCustomerDetails()}
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
                disabled={
                  loading || 
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.preferredDate))
                }
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                  loading || 
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.preferredDate))
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : step < 2 ? 'Continue' : 'Book Service'}
              </button>
            </div>
          </div>
        )}
        
        {/* Features */}
        {!bookingComplete && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Why Choose Our RTO Services?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">100% Paperless</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Digital documentation and e-signatures for all processes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Doorstep Service</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Document pickup and delivery at your location
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Dedicated Agent</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Personal RTO expert assigned to your case
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        {!bookingComplete && (
          <div className="mt-6 flex items-start text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>
              Processing times are estimates and may vary based on RTO workload and document completeness. 
              Additional government fees may apply and will be communicated before processing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RtoServices;
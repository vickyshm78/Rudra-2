import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Wrench, Shield, CheckCircle, Truck, Camera, AlertTriangle, User, Star, Phone, RefreshCcw, PenTool } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { InspectionSlot } from '../../types';

interface CarInspectionBookingProps {
  vehicleId: string;
  vehicleLocation: {
    city: string;
    state: string;
  };
  onBookingComplete?: (bookingData: any) => void;
}

const CarInspectionBooking: React.FC<CarInspectionBookingProps> = ({ 
  vehicleId, 
  vehicleLocation,
  onBookingComplete
}) => {
  const [step, setStep] = useState(1);
  const [inspectionType, setInspectionType] = useState<'basic' | 'comprehensive' | 'premium'>('comprehensive');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [location, setLocation] = useState<'seller' | 'custom'>('seller');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(vehicleLocation.city);
  const [state, setState] = useState(vehicleLocation.state);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<InspectionSlot[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Generate available slots for the next 7 days
    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    const slots: InspectionSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Generate time slots from 9 AM to 6 PM
      const timeSlots = [];
      for (let hour = 9; hour <= 18; hour++) {
        if (hour !== 13) { // Skip 1 PM (lunch hour)
          timeSlots.push({
            id: `${dateStr}-${hour}`,
            time: `${hour}:00`,
            available: Math.random() > 0.3 // Randomly mark some slots as unavailable
          });
        }
      }
      
      slots.push({
        id: dateStr,
        date: dateStr,
        timeSlots
      });
    }
    
    setAvailableSlots(slots);
  };

  const inspectionPackages = [
    {
      type: 'basic',
      name: 'Basic Inspection',
      price: 999,
      points: 150,
      duration: '1 hour',
      features: [
        'Exterior visual inspection',
        'Interior visual inspection',
        'Basic mechanical check',
        'Test drive evaluation',
        'Diagnostic scan',
        'Photo documentation'
      ]
    },
    {
      type: 'comprehensive',
      name: 'Comprehensive Inspection',
      price: 1999,
      points: 200,
      duration: '2 hours',
      features: [
        'All Basic Inspection features',
        'Detailed engine diagnostics',
        'Transmission evaluation',
        'Suspension & steering check',
        'Electrical systems test',
        'Undercarriage inspection',
        'Video documentation'
      ]
    },
    {
      type: 'premium',
      name: 'Premium Inspection',
      price: 2999,
      points: 300,
      duration: '3 hours',
      features: [
        'All Comprehensive Inspection features',
        'Compression testing',
        'Leak detection',
        'Paint thickness measurement',
        'Advanced electronics testing',
        'Emission testing',
        'Market value assessment',
        'Detailed inspection report'
      ]
    }
  ];

  const selectedPackage = inspectionPackages.find(pkg => pkg.type === inspectionType);

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleBookInspection();
    }
  };

  const handleBookInspection = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = {
        id: `booking-${Date.now()}`,
        vehicleId,
        inspectionType,
        date: selectedDate,
        time: selectedTime,
        location: {
          address: location === 'seller' ? 'Seller\'s Location' : address,
          city,
          state,
          pincode: location === 'seller' ? '000000' : pincode
        },
        price: selectedPackage?.price || 0,
        status: 'confirmed',
        inspectorDetails: {
          name: 'Rahul Sharma',
          rating: 4.8,
          inspectionsCompleted: 342,
          phone: '+91 98765 43210'
        },
        bookingTime: new Date().toISOString()
      };
      
      setBookingData(booking);
      setBookingComplete(true);
      
      if (onBookingComplete) {
        onBookingComplete(booking);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInspectionTypeStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Select Inspection Package</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inspectionPackages.map((pkg) => (
          <div
            key={pkg.type}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              inspectionType === pkg.type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
            onClick={() => setInspectionType(pkg.type as any)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold dark:text-white">{pkg.name}</h4>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                {pkg.points} Points
              </div>
            </div>
            
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ₹{pkg.price}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <Clock className="h-4 w-4 mr-1" />
              {pkg.duration}
            </div>
            
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Select Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Inspection Date
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedDate(slot.date)}
                className={`p-2 text-center border rounded-lg text-sm ${
                  selectedDate === slot.date
                    ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                {format(new Date(slot.date), 'dd MMM')}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(slot.date), 'EEE')}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Inspection Time
          </label>
          {selectedDate ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots
                .find(slot => slot.date === selectedDate)
                ?.timeSlots.map((timeSlot) => (
                  <button
                    key={timeSlot.id}
                    type="button"
                    disabled={!timeSlot.available}
                    onClick={() => setSelectedTime(timeSlot.time)}
                    className={`p-2 text-center border rounded-lg text-sm ${
                      !timeSlot.available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                        : selectedTime === timeSlot.time
                          ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {timeSlot.time}
                  </button>
                ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
              Please select a date first
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Inspection Location</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setLocation('seller')}
            className={`flex-1 p-4 border rounded-lg ${
              location === 'seller'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                location === 'seller'
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {location === 'seller' && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
              <div className="text-left">
                <p className="font-medium dark:text-white">Seller's Location</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {vehicleLocation.city}, {vehicleLocation.state}
                </p>
              </div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setLocation('custom')}
            className={`flex-1 p-4 border rounded-lg ${
              location === 'custom'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                location === 'custom'
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {location === 'custom' && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
              <div className="text-left">
                <p className="font-medium dark:text-white">Custom Location</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Specify a different address
                </p>
              </div>
            </div>
          </button>
        </div>
        
        {location === 'custom' && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter street address"
                required={location === 'custom'}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder="Enter city"
                  required={location === 'custom'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder="Enter state"
                  required={location === 'custom'}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter pincode"
                required={location === 'custom'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Inspection Booked Successfully!
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Booking Details</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {format(new Date(bookingData.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.time}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {bookingData.location.address}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.location.city}, {bookingData.location.state}
                    {bookingData.location.pincode !== '000000' && ` - ${bookingData.location.pincode}`}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Wrench className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedPackage?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPackage?.points} point inspection
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Inspector Details</h4>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {bookingData.inspectorDetails.name}
                </p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.inspectorDetails.rating} • {bookingData.inspectorDetails.inspectionsCompleted} inspections
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your inspector will call you at the provided number before arrival.
            </p>
            <button className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
              <Phone className="h-4 w-4 mr-1" />
              {bookingData.inspectorDetails.phone}
            </button>
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
              The inspector will arrive at the scheduled time with specialized equipment
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                3
              </div>
              After inspection, you'll receive a detailed report within 6 hours
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
          Book Another Inspection
        </button>
      </div>
    </div>
  );

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
              {i === 1 ? 'Package' : i === 2 ? 'Date & Time' : 'Location'}
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Wrench className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          AI-Powered Car Inspection
        </h2>

        {bookingComplete ? (
          renderBookingConfirmation()
        ) : (
          <div>
            {renderStepIndicator()}
            
            <div className="mb-6">
              {step === 1 && renderInspectionTypeStep()}
              {step === 2 && renderDateTimeStep()}
              {step === 3 && renderLocationStep()}
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
                  (step === 1 && !inspectionType) ||
                  (step === 2 && (!selectedDate || !selectedTime)) ||
                  (step === 3 && location === 'custom' && (!address || !city || !state || !pincode))
                }
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                  loading || 
                  (step === 1 && !inspectionType) ||
                  (step === 2 && (!selectedDate || !selectedTime)) ||
                  (step === 3 && location === 'custom' && (!address || !city || !state || !pincode))
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : step < 3 ? 'Continue' : 'Book Inspection'}
              </button>
            </div>
          </div>
        )}
        
        {/* Features */}
        {!bookingComplete && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Why Choose Our Inspection Service?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Certified Technicians</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    All inspections performed by ASE-certified professionals
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Detailed Documentation</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    High-resolution photos and videos of all inspection points
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
                    Inspectors come to your preferred location
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
              The seller must be present at the inspection location with the vehicle and all relevant documents. 
              Rescheduling is available up to 24 hours before the appointment with no additional charge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarInspectionBooking;
import React, { useState, useEffect } from 'react';
import { Car, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface DoorstepTestDriveProps {
  vehicleId: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    location: {
      city: string;
      state: string;
    };
  };
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

const DoorstepTestDrive: React.FC<DoorstepTestDriveProps> = ({
  vehicleId,
  vehicleDetails
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(vehicleDetails.location.city);
  const [state, setState] = useState(vehicleDetails.location.state);
  const [pincode, setPincode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<DateSlot[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  useEffect(() => {
    checkEligibility();
    generateTimeSlots();
  }, [vehicleDetails]);

  const checkEligibility = async () => {
    setLoading(true);
    try {
      // Simulate API call to check if doorstep test drive is available in this location
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's say it's available in most major cities
      const eligibleCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
      const isAvailable = eligibleCities.includes(vehicleDetails.location.city);
      
      setIsEligible(isAvailable);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      setIsEligible(false);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    // Generate available slots for the next 5 days
    const slots: DateSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 5; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Generate time slots from 10 AM to 7 PM
      const timeSlots = [];
      for (let hour = 10; hour <= 19; hour++) {
        if (hour !== 13 && hour !== 14) { // Skip 1 PM and 2 PM (lunch hours)
          timeSlots.push({
            id: `${dateStr}-${hour}`,
            time: `${hour}:00`,
            available: Math.random() > 0.3 // Randomly mark some slots as unavailable
          });
        }
      }
      
      slots.push({
        date: dateStr,
        timeSlots
      });
    }
    
    setAvailableSlots(slots);
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleBookTestDrive();
    }
  };

  const handleBookTestDrive = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = {
        id: `booking-${Date.now()}`,
        vehicleId,
        vehicleDetails: {
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          year: vehicleDetails.year
        },
        date: selectedDate,
        time: selectedTime,
        location: {
          address,
          city,
          state,
          pincode
        },
        customerDetails: {
          name,
          phone,
          email
        },
        driverDetails: {
          name: 'Rajesh Kumar',
          rating: 4.8,
          completedDrives: 156,
          phone: '+91 98765 43210'
        },
        status: 'confirmed',
        bookingTime: new Date().toISOString()
      };
      
      setBookingData(booking);
      setBookingComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Select Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Test Drive Date
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.date}
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
            Test Drive Time
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
      <h3 className="text-lg font-semibold dark:text-white">Test Drive Location</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Enter street address"
          required
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
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter state"
            required
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
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Enter pincode"
          required
        />
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Your Contact Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full name"
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your phone number"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <p className="text-sm text-blue-600 dark:text-blue-300">
            A valid driver's license will be required at the time of the test drive. 
            Our representative will contact you to confirm the details.
          </p>
        </div>
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Test Drive Booked Successfully!
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Test Drive Details</h4>
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
                    {bookingData.location.city}, {bookingData.location.state} - {bookingData.location.pincode}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Car className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {bookingData.vehicleDetails.year} {bookingData.vehicleDetails.make} {bookingData.vehicleDetails.model}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Will be delivered to your location
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Driver Details</h4>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {bookingData.driverDetails.name}
                </p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    {bookingData.driverDetails.rating} • {bookingData.driverDetails.completedDrives} drives
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your driver will call you before arrival.
            </p>
            <button className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
              <Phone className="h-4 w-4 mr-1" />
              {bookingData.driverDetails.phone}
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
              The driver will arrive with the vehicle at the scheduled time
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                3
              </div>
              You'll need to show your driver's license before the test drive
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2 mt-0.5">
                4
              </div>
              Enjoy your test drive! The driver will answer any questions you have
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
          Book Another Test Drive
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
              {i === 1 ? 'Date & Time' : i === 2 ? 'Location' : 'Contact'}
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

  if (loading && isEligible === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Car className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Doorstep Test Drive
        </h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Car className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Doorstep Test Drive
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Service Not Available
              </h3>
              <p className="text-yellow-700 dark:text-yellow-200">
                We're sorry, but doorstep test drive is not available in {vehicleDetails.location.city} at this time.
              </p>
              <p className="text-yellow-600 dark:text-yellow-300 mt-2">
                Please contact the seller directly to arrange a test drive, or visit our nearest dealership.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center">
          <Car className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Doorstep Test Drive
        </h2>

        {bookingComplete ? (
          renderBookingConfirmation()
        ) : (
          <div>
            {renderStepIndicator()}
            
            <div className="mb-6">
              {step === 1 && renderDateTimeStep()}
              {step === 2 && renderLocationStep()}
              {step === 3 && renderContactStep()}
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
                  (step === 1 && (!selectedDate || !selectedTime)) ||
                  (step === 2 && (!address || !city || !state || !pincode)) ||
                  (step === 3 && (!name || !phone || !email))
                }
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                  loading || 
                  (step === 1 && (!selectedDate || !selectedTime)) ||
                  (step === 2 && (!address || !city || !state || !pincode)) ||
                  (step === 3 && (!name || !phone || !email))
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : step < 3 ? 'Continue' : 'Book Test Drive'}
              </button>
            </div>
          </div>
        )}
        
        {/* Features */}
        {!bookingComplete && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  1
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Book Your Slot</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a convenient date, time, and location
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  2
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Vehicle Delivery</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Our driver brings the vehicle to your doorstep
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  3
                </div>
                <div>
                  <h4 className="font-medium dark:text-white">Enjoy Your Test Drive</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Test the vehicle with our expert's guidance
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
              A valid driver's license is required for the test drive. The test drive duration is approximately 
              30 minutes. Cancellation is available up to 4 hours before the scheduled time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Missing component
const Info = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

const Star = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default DoorstepTestDrive;
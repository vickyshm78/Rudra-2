import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, MapPin, Check } from 'lucide-react';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    make: '',
    model: '',
    year: '',
    price: '',
    condition: '',
    mileage: '',
    description: '',
    city: '',
    state: '',
    features: [] as string[]
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file uploads
    // For demo purposes, we'll use placeholder images
    
    if (images.length >= 10) {
      alert('You can upload a maximum of 10 images');
      return;
    }
    
    const placeholderImages = [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setImages([...images, randomImage]);
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // In a real app, this would submit the form data to the server
      alert('Listing created successfully!');
      navigate('/search');
    }
  };
  
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Common features for different vehicle types
  const commonFeatures = [
    'Air Conditioning', 'Power Steering', 'Bluetooth', 
    'Cruise Control', 'Navigation System', 'Leather Interior', 
    'Sunroof', 'Backup Camera', 'Heated Seats'
  ];
  
  return (
    <div className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Create a New Listing</h1>
        <p className="text-gray-600 mb-8">Fill out the details below to list your vehicle for sale</p>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`flex-1 relative ${
                  i < step ? 'text-blue-800' : i === step ? 'text-blue-800' : 'text-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <div 
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-medium ${
                      i < step 
                        ? 'border-blue-800 bg-blue-800 text-white' 
                        : i === step 
                          ? 'border-blue-800 text-blue-800' 
                          : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {i < step ? <Check className="h-5 w-5" /> : i}
                  </div>
                  {i < 4 && (
                    <div 
                      className={`flex-1 h-0.5 ${
                        i < step ? 'bg-blue-800' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>
                <div className="absolute top-10 left-0 right-0 text-center text-sm">
                  {i === 1 && 'Basic Info'}
                  {i === 2 && 'Vehicle Details'}
                  {i === 3 && 'Photos'}
                  {i === 4 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., 2021 Tesla Model 3 Long Range"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="RV">RV</option>
                    <option value="Boat">Boat</option>
                    <option value="Construction">Construction Vehicle</option>
                    <option value="Tractor">Tractor</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      placeholder="e.g., Toyota"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Camry"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2022"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 25000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Vehicle Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                    Mileage *
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g., 15000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                    min="0"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g., CA"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Provide a detailed description of your vehicle..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Features
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {commonFeatures.map((feature) => (
                      <label 
                        key={feature} 
                        className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-800 focus:ring-blue-800 rounded mr-3"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Vehicle Photos</h2>
                <p className="text-gray-600 mb-4">
                  Add photos of your vehicle. High-quality images from different angles will help your listing stand out.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="images"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Camera className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-1">Drag photos here or click to upload</p>
                    <p className="text-gray-500 text-sm">You can upload up to 10 photos</p>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Uploaded Photos ({images.length}/10)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Vehicle ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Listing</h2>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">{formData.title}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
                      <p className="font-medium">{formData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <p className="font-medium">${parseInt(formData.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Make & Model</p>
                      <p className="font-medium">{formData.make} {formData.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Year</p>
                      <p className="font-medium">{formData.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Condition</p>
                      <p className="font-medium">{formData.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mileage</p>
                      <p className="font-medium">{parseInt(formData.mileage).toLocaleString()} miles</p>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {formData.city}, {formData.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
                  </div>
                  
                  {formData.features.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature) => (
                          <span 
                            key={feature}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {images.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Photos ({images.length})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Vehicle ${index + 1}`} 
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Listing Fee Information</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Basic listings are free for 30 days. Premium features are available for an additional fee.
                  </p>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1 bg-white p-3 rounded border border-gray-200 cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Basic Listing</h4>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <p className="text-sm text-gray-600">Standard visibility in search results</p>
                    </div>
                    <div className="flex-1 bg-white p-3 rounded border border-blue-300 cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Featured Listing</h4>
                        <span className="text-blue-800 font-medium">$29.99</span>
                      </div>
                      <p className="text-sm text-gray-600">Higher visibility and premium badge</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-300"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors duration-300"
              >
                {step < 4 ? 'Continue' : 'Submit Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, MessageSquare, User, Settings, Flag, X, AlertTriangle, Heart, Share2, Info, Ban } from 'lucide-react';
import { getUserById, getVehiclesBySeller, getReviewsForUser } from '../data/mockData';
import { formatDate } from '../utils/formatters';
import VehicleCard from '../components/common/VehicleCard';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = getUserById(id || '');
  const [activeTab, setActiveTab] = useState('listings');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [message, setMessage] = useState('');
  
  if (!user) {
    return (
      <div className="mt-20 py-16 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const userVehicles = getVehiclesBySeller(user.id);
  const userReviews = getReviewsForUser(user.id);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setMessage('');
    setShowContactModal(false);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Report submitted successfully!');
    setReportReason('');
    setShowReportModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile - 99CarMart`,
        text: `Check out ${user.name}'s vehicle listings on 99CarMart`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleSave = () => {
    // In a real app, this would save the profile to favorites
    alert('Profile saved to favorites!');
  };

  const handleBlock = () => {
    // In a real app, this would block the user
    alert('User blocked successfully!');
  };

  return (
    <div className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Avatar and Stats */}
            <div className="flex items-center md:w-1/3 mb-6 md:mb-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full mr-6 object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(user.rating) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {user.rating} ({user.reviewCount} reviews)
                  </span>
                </div>
                <p className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {formatDate(user.joinedDate)}
                </p>
              </div>
            </div>
            
            {/* Contact and Actions */}
            <div className="md:w-2/3 md:flex md:justify-end">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Save Profile
                </button>
                <button 
                  onClick={handleShare}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Flag className="h-5 w-5 mr-2" />
                  Report
                </button>
                <button 
                  onClick={handleBlock}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Ban className="h-5 w-5 mr-2" />
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Contact {user.name}</h2>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleContact}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Report User</h2>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-start mb-4 text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <p className="text-sm">
                  Please only report users for valid reasons. False reports may result in account suspension.
                </p>
              </div>
              <form onSubmit={handleReport}>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam or misleading content</option>
                  <option value="offensive">Offensive behavior</option>
                  <option value="fraud">Suspected fraud</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Provide additional details..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'listings'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('listings')}
            >
              Listings ({userVehicles.length})
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({userReviews.length})
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'about'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <>
              {userVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userVehicles.map(vehicle => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle} 
                      featured={vehicle.featured} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                  <p className="text-gray-600">
                    This user hasn't posted any vehicles for sale.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-start">
                        <img 
                          src={review.userAvatar} 
                          alt={review.userName} 
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{review.userName}</h4>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < review.rating 
                                          ? 'text-yellow-500 fill-current' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.date)}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">
                    This user hasn't received any reviews yet.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-4">About {user.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-20">Email:</span>
                      <span>{user.email}</span>
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-20">Phone:</span>
                      <span>{user.phone}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Statistics</h4>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-32">Member Since:</span>
                      <span>{formatDate(user.joinedDate)}</span>
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-32">Total Listings:</span>
                      <span>{user.listings}</span>
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-32">Rating:</span>
                      <span>{user.rating} / 5</span>
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="font-medium w-32">Reviews:</span>
                      <span>{user.reviewCount}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-800">About</h4>
                <p className="text-gray-700">
                  {user.id === '550e8400-e29b-41d4-a716-446655440000' && (
                    "Hi! I'm John, an automotive enthusiast with a passion for quality vehicles. I've been buying and selling cars for over 10 years, and I take pride in offering only well-maintained vehicles. Feel free to reach out with any questions about my listings!"
                  )}
                  {user.id === '550e8400-e29b-41d4-a716-446655440001' && (
                    "Hello! I'm Emma, and I love motorcycles and classic cars. I maintain all my vehicles meticulously and am always honest about their condition. I believe in transparent dealings and providing all information upfront."
                  )}
                  {user.id === '550e8400-e29b-41d4-a716-446655440002' && (
                    "I'm Michael, a truck specialist with a background in mechanical engineering. I personally inspect and test all vehicles before listing them. I'm happy to answer technical questions and provide detailed information about any of my listings."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, AlertTriangle } from 'lucide-react';

interface PushNotificationsProps {
  userId: string;
}

const PushNotifications: React.FC<PushNotificationsProps> = ({ userId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if (!('Notification' in window)) {
      setError('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      setIsSubscribed(true);
    }
  };

  const handleSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsSubscribed(true);
        
        // Show test notification
        new Notification('99CarMart Notifications Enabled', {
          body: "You'll now receive updates about your saved searches and watched vehicles",
          icon: '/vite.svg' // Replace with your app icon
        });
      } else {
        setError('Permission denied for notifications');
      }
    } catch (err) {
      setError('Failed to enable notifications');
      console.error(err);
    }
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold dark:text-white">Push Notifications</h2>
        </div>
        <button
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isSubscribed
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubscribed ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Unsubscribe
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2 dark:text-white">You'll be notified about:</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              New matches for your saved searches
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Price drops on your watched vehicles
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Messages from sellers
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Status updates on your listings
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PushNotifications;
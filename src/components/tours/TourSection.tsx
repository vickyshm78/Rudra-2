import React, { useState } from 'react';
import { View as View360, Video } from 'lucide-react';
import VirtualTour from './VirtualTour';
import VideoWalkthrough from './VideoWalkthrough';

interface TourSectionProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

const TourSection: React.FC<TourSectionProps> = ({ images, videoUrl, title }) => {
  const [activeTab, setActiveTab] = useState<'360' | 'video'>('360');

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('360')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === '360'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <View360 className="h-5 w-5 mr-2" />
          360° View
        </button>
        {videoUrl && (
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'video'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Video className="h-5 w-5 mr-2" />
            Video Tour
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {activeTab === '360' ? (
          <VirtualTour images={images} title={title} />
        ) : (
          videoUrl && <VideoWalkthrough videoUrl={videoUrl} title={title} />
        )}
      </div>
    </div>
  );
};

export default TourSection;
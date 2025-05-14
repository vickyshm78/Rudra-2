import React from 'react';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon
} from 'react-share';
import { Share2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Share2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold dark:text-white">Share This Vehicle</h3>
      </div>
      
      <div className="flex space-x-4">
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <FacebookShareButton url={url} quote={description}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={40} round />
        </TelegramShareButton>
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share this vehicle with friends and family to get their opinion or help them find their next ride!
        </p>
      </div>
    </div>
  );
};

export default ShareButtons;
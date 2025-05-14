import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface SwipeableGalleryProps {
  images: string[];
  title: string;
}

const SwipeableGallery: React.FC<SwipeableGalleryProps> = ({ images, title }) => {
  const items = images.map(image => ({
    original: image,
    thumbnail: image,
    originalAlt: title,
    thumbnailAlt: title
  }));

  const handlers = useSwipeable({
    onSwipedLeft: () => {/* Handle left swipe */},
    onSwipedRight: () => {/* Handle right swipe */},
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div {...handlers} className="relative">
      <ImageGallery
        items={items}
        showPlayButton={false}
        showFullscreenButton={true}
        showNav={true}
        showThumbnails={true}
        renderLeftNav={(onClick, disabled) => (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-r-lg"
            onClick={onClick}
            disabled={disabled}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-l-lg"
            onClick={onClick}
            disabled={disabled}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      />
    </div>
  );
};

export default SwipeableGallery;
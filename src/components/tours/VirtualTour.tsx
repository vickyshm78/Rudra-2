import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface VirtualTourProps {
  images: string[];
  title: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({ images, title }) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const sensitivity = 0.5; // Adjust rotation sensitivity
    const newAngle = (currentAngle + deltaX * sensitivity) % 360;
    
    setCurrentAngle(newAngle);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotateLeft = () => {
    setCurrentAngle((prev) => (prev - 45) % 360);
  };

  const rotateRight = () => {
    setCurrentAngle((prev) => (prev + 45) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const currentImageIndex = Math.abs(Math.floor(currentAngle / (360 / images.length)) % images.length);

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden"
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <img
          src={images[currentImageIndex]}
          alt={`${title} - View ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
          style={{ transform: `rotate(${currentAngle}deg)` }}
          draggable="false"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={rotateLeft}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          View {currentImageIndex + 1} of {images.length}
        </div>
        <button
          onClick={rotateRight}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
      >
        {isFullscreen ? (
          <Minimize2 className="h-6 w-6" />
        ) : (
          <Maximize2 className="h-6 w-6" />
        )}
      </button>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        Click and drag to rotate
      </div>
    </div>
  );
};

export default VirtualTour;
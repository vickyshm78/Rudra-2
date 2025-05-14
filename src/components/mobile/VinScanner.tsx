import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X, Search, AlertTriangle } from 'lucide-react';

interface VinScannerProps {
  onScan: (vin: string) => void;
  onClose: () => void;
}

const VinScanner: React.FC<VinScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        const result = await codeReader.current.decodeFromImage(imageSrc);
        if (result) {
          const vin = result.getText();
          // Basic VIN validation (17 characters, alphanumeric)
          if (/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
            setScanning(false);
            onScan(vin);
          } else {
            setError('Invalid VIN format. Please try again.');
          }
        }
      } catch (err) {
        // No VIN found in this frame, continue scanning
      }
    }
  }, [onScan]);

  const handleError = (err: any) => {
    setError('Error accessing camera. Please check permissions.');
    console.error(err);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Scan VIN
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        ) : null}

        {scanning ? (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'environment' }}
              onUserMedia={() => {
                // Start continuous scanning
                const interval = setInterval(capture, 500);
                return () => clearInterval(interval);
              }}
              onUserMediaError={handleError}
              className="w-full"
            />
            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-center">
              <Search className="h-8 w-8 text-green-500 mr-2" />
              <p className="text-green-600 font-medium">VIN scanned successfully!</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Position the VIN barcode within the frame to scan
          </p>
        </div>
      </div>
    </div>
  );
};

export default VinScanner;
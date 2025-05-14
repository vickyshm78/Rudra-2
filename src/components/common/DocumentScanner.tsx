import React, { useState, useRef } from 'react';
import { Camera, X, FileText, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';

interface DocumentScannerProps {
  onScan: (data: {
    text: string;
    fields?: {
      registrationNumber?: string;
      ownerName?: string;
      vehicleMake?: string;
      vehicleModel?: string;
      registrationDate?: string;
      engineNumber?: string;
      chassisNumber?: string;
    };
    image?: string;
  }) => void;
  onClose: () => void;
  documentType: 'rc' | 'insurance' | 'pan' | 'aadhaar';
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ onScan, onClose, documentType }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setError(null);
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      const worker = await createWorker({
        logger: progress => {
          if (progress.status === 'recognizing text') {
            setProgress(progress.progress * 100);
          }
        },
      });
      
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(capturedImage);
      await worker.terminate();
      
      // Extract relevant fields based on document type
      const fields = extractFields(text, documentType);
      
      onScan({ text, fields, image: capturedImage });
    } catch (err) {
      console.error('OCR processing error:', err);
      setError('Failed to process the document. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractFields = (text: string, docType: string) => {
    const lowerText = text.toLowerCase();
    
    switch (docType) {
      case 'rc':
        return {
          registrationNumber: extractRegNumber(text),
          ownerName: extractOwnerName(text),
          vehicleMake: extractVehicleMake(text),
          vehicleModel: extractVehicleModel(text),
          registrationDate: extractRegDate(text),
          engineNumber: extractEngineNumber(text),
          chassisNumber: extractChassisNumber(text)
        };
      
      case 'insurance':
        return {
          policyNumber: extractPolicyNumber(text),
          insurer: extractInsurer(text),
          validUntil: extractValidUntil(text),
          vehicleNumber: extractRegNumber(text)
        };
      
      case 'pan':
        return {
          panNumber: extractPanNumber(text),
          name: extractNameFromPan(text)
        };
      
      case 'aadhaar':
        return {
          aadhaarNumber: extractAadhaarNumber(text),
          name: extractNameFromAadhaar(text),
          dob: extractDobFromAadhaar(text),
          address: extractAddressFromAadhaar(text)
        };
      
      default:
        return {};
    }
  };

  // Extraction helper functions
  const extractRegNumber = (text: string) => {
    // Match common Indian registration number patterns
    const regexPatterns = [
      /[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,2}\s?[0-9]{4}/g, // Format: MH 01 AB 1234
      /[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}/g           // Format: MH01AB1234
    ];
    
    for (const regex of regexPatterns) {
      const match = text.match(regex);
      if (match && match.length > 0) {
        return match[0];
      }
    }
    
    return undefined;
  };

  const extractOwnerName = (text: string) => {
    const nameRegex = /(?:name|owner)[:\s]+([A-Za-z\s]+)/i;
    const match = text.match(nameRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractVehicleMake = (text: string) => {
    const makeRegex = /(?:make|manufacturer)[:\s]+([A-Za-z\s]+)/i;
    const match = text.match(makeRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractVehicleModel = (text: string) => {
    const modelRegex = /(?:model)[:\s]+([A-Za-z0-9\s]+)/i;
    const match = text.match(modelRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractRegDate = (text: string) => {
    const dateRegex = /(?:registration date|reg date)[:\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i;
    const match = text.match(dateRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractEngineNumber = (text: string) => {
    const engineRegex = /(?:engine|engine no|engine number)[:\s]+([A-Za-z0-9]+)/i;
    const match = text.match(engineRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractChassisNumber = (text: string) => {
    const chassisRegex = /(?:chassis|chassis no|chassis number)[:\s]+([A-Za-z0-9]+)/i;
    const match = text.match(chassisRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractPolicyNumber = (text: string) => {
    const policyRegex = /(?:policy|policy no|policy number)[:\s]+([A-Za-z0-9\-\/]+)/i;
    const match = text.match(policyRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractInsurer = (text: string) => {
    const insurerRegex = /(?:insurer|insurance company)[:\s]+([A-Za-z\s]+)/i;
    const match = text.match(insurerRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractValidUntil = (text: string) => {
    const validRegex = /(?:valid until|valid till|expiry|expiry date)[:\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i;
    const match = text.match(validRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractPanNumber = (text: string) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
    const match = text.match(panRegex);
    return match ? match[0] : undefined;
  };

  const extractNameFromPan = (text: string) => {
    const nameRegex = /(?:name|customer name)[:\s]+([A-Za-z\s]+)/i;
    const match = text.match(nameRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractAadhaarNumber = (text: string) => {
    const aadhaarRegex = /[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}/g;
    const match = text.match(aadhaarRegex);
    return match ? match[0] : undefined;
  };

  const extractNameFromAadhaar = (text: string) => {
    const nameRegex = /(?:name|customer name)[:\s]+([A-Za-z\s]+)/i;
    const match = text.match(nameRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractDobFromAadhaar = (text: string) => {
    const dobRegex = /(?:DOB|Date of Birth)[:\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i;
    const match = text.match(dobRegex);
    return match ? match[1].trim() : undefined;
  };

  const extractAddressFromAadhaar = (text: string) => {
    const addressRegex = /(?:address)[:\s]+([A-Za-z0-9\s,\-\.]+)/i;
    const match = text.match(addressRegex);
    return match ? match[1].trim() : undefined;
  };

  const getDocumentInstructions = () => {
    switch (documentType) {
      case 'rc':
        return 'Position your RC Book within the frame. Ensure all corners are visible and text is clear.';
      case 'insurance':
        return 'Position your Insurance Policy within the frame. Focus on the policy number and validity date.';
      case 'pan':
        return 'Position your PAN Card within the frame. Ensure the PAN number and name are clearly visible.';
      case 'aadhaar':
        return 'Position your Aadhaar Card within the frame. Make sure your name and Aadhaar number are visible.';
      default:
        return 'Position your document within the frame and ensure all text is clearly visible.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg overflow-hidden shadow-xl"
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-600 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {documentType === 'rc' ? 'RC Scanner' : 
             documentType === 'insurance' ? 'Insurance Scanner' :
             documentType === 'pan' ? 'PAN Scanner' : 'Aadhaar Scanner'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {!capturedImage ? (
            <>
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {getDocumentInstructions()}
                </p>
              </div>
              
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'environment' }}
                  className="w-full rounded-lg"
                  height={300}
                />
                <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-lg pointer-events-none"></div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <UploadCloud className="h-5 w-5 mr-2" />
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                
                <button
                  onClick={capture}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured document" 
                  className="w-full rounded-lg"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p className="text-white">Processing document...</p>
                    <div className="w-48 h-2 bg-gray-300 rounded-full mt-2">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={resetCapture}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 mr-2" />
                  Retake
                </button>
                
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isProcessing ? 'Processing...' : 'Process Document'}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentScanner;
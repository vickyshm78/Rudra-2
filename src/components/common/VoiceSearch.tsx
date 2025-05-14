import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchProps {
  onSearch?: (query: string) => void;
  onClose?: () => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let recognition: any = null;
    
    if (isListening) {
      if (!('webkitSpeechRecognition' in window)) {
        setError('Voice recognition is not supported in your browser.');
        setIsListening(false);
        return;
      }
      
      // @ts-ignore
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => {
        setTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };
      
      recognition.onerror = (event: any) => {
        setError(`Error occurred in recognition: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.start();
    }
    
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      setTranscript('');
    }
  };

  const handleSearch = () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    
    // Process the voice command
    const lowerTranscript = transcript.toLowerCase();
    
    setTimeout(() => {
      if (onSearch) {
        onSearch(transcript);
      }
      
      // Handle navigation commands
      if (lowerTranscript.includes('search for') || lowerTranscript.includes('find')) {
        const query = lowerTranscript
          .replace('search for', '')
          .replace('find', '')
          .trim();
        
        navigate(`/search?query=${encodeURIComponent(query)}`);
      } else if (lowerTranscript.includes('book test drive')) {
        navigate('/test-drive');
      } else if (lowerTranscript.includes('insurance')) {
        navigate('/insurance');
      } else if (lowerTranscript.includes('rc transfer') || lowerTranscript.includes('registration')) {
        navigate('/rto-services');
      } else {
        // Default to search
        navigate(`/search?query=${encodeURIComponent(transcript)}`);
      }
      
      setIsProcessing(false);
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg overflow-hidden shadow-xl"
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white flex items-center">
            <Mic className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Voice Search
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          <div className="mb-6 text-center">
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Mic className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-75"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Listening...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="not-listening"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <MicOff className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Tap the microphone to start</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {transcript && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 text-center">"{transcript}"</p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            
            {transcript && (
              <button
                onClick={handleSearch}
                disabled={isProcessing}
                className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Search className="h-5 w-5 mr-2" />
                {isProcessing ? 'Processing...' : 'Search'}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Try saying:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                "Search for Honda City"
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                "Book test drive for Hyundai Venue in Delhi"
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                "Find SUVs under 15 lakhs"
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceSearch;
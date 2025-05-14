import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Camera, FileText, Car, Calendar, Clock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SmartAssistantProps {
  vehicleId?: string;
  userHistory?: {
    recentSearches?: string[];
    recentViews?: string[];
    savedVehicles?: string[];
    lastInsuranceCheck?: string;
    lastRcTransfer?: string;
  };
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ vehicleId, userHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'user' | 'assistant', text: string, actions?: {text: string, action: string}[]}[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setMessages([
        {
          type: 'assistant',
          text: "Hi there! I'm your 99CarMart assistant. How can I help you today?",
          actions: [
            { text: 'Check insurance status', action: 'insurance' },
            { text: 'Book a test drive', action: 'testdrive' },
            { text: 'RC transfer help', action: 'rctransfer' }
          ]
        }
      ]);

      // Generate personalized suggestions based on user history
      if (userHistory) {
        const personalizedSuggestions = [];
        
        if (userHistory.lastInsuranceCheck) {
          const lastCheck = new Date(userHistory.lastInsuranceCheck);
          const daysSinceCheck = Math.floor((Date.now() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceCheck > 300) {
            personalizedSuggestions.push('Your insurance might be due for renewal soon. Would you like to check insurance options?');
          }
        }
        
        if (userHistory.recentViews && userHistory.recentViews.length > 0) {
          personalizedSuggestions.push(`I noticed you viewed some vehicles recently. Need help comparing them?`);
        }
        
        if (personalizedSuggestions.length > 0) {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                type: 'assistant',
                text: personalizedSuggestions[0]
              }
            ]);
          }, 1000);
        }
      }
    }
  }, [isOpen, userHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    // Process user input
    processUserInput(input);
    
    // Clear input
    setInput('');
  };

  const processUserInput = async (text: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response = '';
      let actions = [];
      
      // Simple keyword-based responses
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('insurance') || lowerText.includes('policy')) {
        response = 'I can help you with insurance! Would you like to check new quotes or renew an existing policy?';
        actions = [
          { text: 'Get new quotes', action: 'insurance_new' },
          { text: 'Renew policy', action: 'insurance_renew' }
        ];
      } else if (lowerText.includes('test drive') || lowerText.includes('try the car')) {
        response = 'Would you like to schedule a test drive? I can help you book one at your preferred location and time.';
        actions = [
          { text: 'Book test drive', action: 'testdrive' }
        ];
      } else if (lowerText.includes('rc') || lowerText.includes('registration') || lowerText.includes('transfer')) {
        response = 'I can guide you through the RC transfer process. What would you like to know?';
        actions = [
          { text: 'RC transfer process', action: 'rc_process' },
          { text: 'Required documents', action: 'rc_documents' },
          { text: 'Book RC transfer service', action: 'rc_service' }
        ];
      } else if (lowerText.includes('warranty') || lowerText.includes('extended warranty')) {
        response = 'Extended warranty provides additional protection for your vehicle. Would you like to explore warranty options?';
        actions = [
          { text: 'View warranty plans', action: 'warranty' }
        ];
      } else if (lowerText.includes('finance') || lowerText.includes('loan') || lowerText.includes('emi')) {
        response = 'I can help you with financing options. Would you like to check your loan eligibility or calculate EMI?';
        actions = [
          { text: 'Check loan eligibility', action: 'loan_eligibility' },
          { text: 'Calculate EMI', action: 'loan_emi' }
        ];
      } else {
        response = "I'm not sure I understand. Could you please rephrase or select one of these common topics?";
        actions = [
          { text: 'Insurance', action: 'insurance' },
          { text: 'Test Drive', action: 'testdrive' },
          { text: 'RC Transfer', action: 'rctransfer' },
          { text: 'Financing', action: 'finance' }
        ];
      }
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: response,
        actions: actions
      }]);
      
      // Generate suggestions based on the conversation
      generateSuggestions(lowerText);
    } catch (error) {
      console.error('Error processing input:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (input: string) => {
    const commonSuggestions = [
      'How do I renew my insurance?',
      'What documents are needed for RC transfer?',
      'How can I book a test drive?',
      'What are the EMI options?',
      'Tell me about extended warranty'
    ];
    
    // Filter suggestions based on input to avoid repetition
    const filteredSuggestions = commonSuggestions.filter(suggestion => 
      !input.includes(suggestion.toLowerCase())
    );
    
    // Select up to 3 random suggestions
    const selectedSuggestions = filteredSuggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setSuggestions(selectedSuggestions);
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'insurance':
      case 'insurance_new':
      case 'insurance_renew':
        setMessages(prev => [...prev, { 
          type: 'user', 
          text: 'I want to check insurance options'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            text: 'I can help you with insurance. Let me take you to our insurance comparison page.',
          }]);
          setTimeout(() => {
            navigate('/insurance');
          }, 1000);
        }, 500);
        break;
      
      case 'testdrive':
        setMessages(prev => [...prev, { 
          type: 'user', 
          text: 'I want to book a test drive'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            text: 'Great! I can help you book a doorstep test drive. Let me take you to the booking page.',
          }]);
          setTimeout(() => {
            if (vehicleId) {
              navigate(`/listing/${vehicleId}?tab=services`);
            } else {
              navigate('/search');
            }
          }, 1000);
        }, 500);
        break;
      
      case 'rctransfer':
      case 'rc_process':
      case 'rc_documents':
      case 'rc_service':
        setMessages(prev => [...prev, { 
          type: 'user', 
          text: 'I need help with RC transfer'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            text: 'I can guide you through the RC transfer process. Let me take you to our RTO services page.',
          }]);
          setTimeout(() => {
            navigate('/rto-services');
          }, 1000);
        }, 500);
        break;
      
      case 'warranty':
        setMessages(prev => [...prev, { 
          type: 'user', 
          text: 'I want to check warranty options'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            text: 'Extended warranty is a great investment. Let me show you our warranty plans.',
          }]);
          setTimeout(() => {
            if (vehicleId) {
              navigate(`/listing/${vehicleId}?tab=services`);
            } else {
              navigate('/warranty');
            }
          }, 1000);
        }, 500);
        break;
      
      case 'loan_eligibility':
      case 'loan_emi':
      case 'finance':
        setMessages(prev => [...prev, { 
          type: 'user', 
          text: 'I want to check financing options'
        }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            text: 'I can help you explore financing options. Let me take you to our loan calculator.',
          }]);
          setTimeout(() => {
            if (vehicleId) {
              navigate(`/listing/${vehicleId}?tab=finance`);
            } else {
              navigate('/finance');
            }
          }, 1000);
        }, 500);
        break;
      
      default:
        break;
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }
    
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // @ts-ignore
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Car className="h-6 w-6 mr-2" />
                <h3 className="font-semibold">99CarMart Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index % 3) }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    
                    {message.actions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => handleActionClick(action.action)}
                            className="text-xs px-2 py-1 bg-white dark:bg-gray-600 text-blue-600 dark:text-white rounded-full hover:bg-blue-50 dark:hover:bg-gray-500 transition-colors"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(suggestion);
                      setMessages(prev => [...prev, { type: 'user', text: suggestion }]);
                      processUserInput(suggestion);
                    }}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {/* Input area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  } text-gray-700 dark:text-gray-300`}
                >
                  <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : ''}`} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartAssistant;
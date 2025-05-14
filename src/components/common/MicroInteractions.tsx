import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import confetti from 'react-confetti';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      }`}
    >
      {type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
      {type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
      {type === 'info' && <Info className="h-5 w-5 mr-2" />}
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

interface SuccessConfettiProps {
  duration?: number;
}

export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ duration = 3000 }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  return showConfetti ? <confetti /> : null;
};

interface PulseButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PulseButton: React.FC<PulseButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`relative ${className}`}
      onClick={onClick}
    >
      <span className="absolute inset-0 rounded-lg bg-blue-400 opacity-30 animate-ping"></span>
      {children}
    </motion.button>
  );
};

interface ShakeElementProps {
  children: React.ReactNode;
  shake: boolean;
  onComplete?: () => void;
}

export const ShakeElement: React.FC<ShakeElementProps> = ({ children, shake, onComplete }) => {
  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({ front, back, isFlipped }) => {
  return (
    <div className="relative w-full h-full perspective">
      <motion.div
        className="w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        <div className="absolute w-full h-full backface-hidden">
          {front}
        </div>
        <div className="absolute w-full h-full backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };
  
  const hideToast = () => {
    setToast(null);
  };
  
  const ToastComponent = () => (
    <AnimatePresence>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </AnimatePresence>
  );
  
  return { showToast, hideToast, ToastComponent };
};
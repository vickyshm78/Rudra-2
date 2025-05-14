import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  editable?: boolean;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  steps, 
  currentStep, 
  onStepClick,
  editable = false
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center relative"
            onClick={() => editable && onStepClick && index < currentStep && onStepClick(index)}
          >
            {/* Step connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 w-full h-0.5 left-1/2 bg-gray-200 dark:bg-gray-700 z-0">
                {index < currentStep - 1 && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 h-full bg-blue-600 z-10"
                  />
                )}
              </div>
            )}
            
            {/* Step circle */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                index < currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-100 border-2 border-blue-600 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              } ${editable && index < currentStep ? 'cursor-pointer' : ''}`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Step label */}
            <span 
              className={`mt-2 text-xs text-center max-w-[80px] ${
                index <= currentStep 
                  ? 'text-blue-600 font-medium dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
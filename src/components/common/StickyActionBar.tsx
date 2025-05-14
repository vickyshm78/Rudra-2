import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Calendar, DollarSign, Shield, FileText, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StickyActionBarProps {
  actions: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    to?: string;
    highlight?: boolean;
  }[];
}

const StickyActionBar: React.FC<StickyActionBarProps> = ({ actions }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {actions.map((action, index) => (
            action.to ? (
              <Link
                key={index}
                to={action.to}
                className={`flex flex-col items-center p-2 ${
                  action.highlight 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex flex-col items-center p-2 ${
                  action.highlight 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </button>
            )
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Predefined action bars for common scenarios
export const VehicleDetailActionBar: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  return (
    <StickyActionBar
      actions={[
        {
          icon: <Phone className="h-5 w-5" />,
          label: 'Call',
          onClick: () => alert('Calling seller...'),
        },
        {
          icon: <MessageSquare className="h-5 w-5" />,
          label: 'Chat',
          onClick: () => alert('Opening chat...'),
        },
        {
          icon: <Calendar className="h-5 w-5" />,
          label: 'Test Drive',
          to: `/listing/${vehicleId}?tab=services`,
          highlight: true,
        },
        {
          icon: <DollarSign className="h-5 w-5" />,
          label: 'Finance',
          to: `/listing/${vehicleId}?tab=finance`,
        },
        {
          icon: <Shield className="h-5 w-5" />,
          label: 'Insurance',
          to: `/listing/${vehicleId}?tab=finance`,
        },
      ]}
    />
  );
};

export const RtoServiceActionBar: React.FC = () => {
  return (
    <StickyActionBar
      actions={[
        {
          icon: <FileText className="h-5 w-5" />,
          label: 'RC Transfer',
          to: '/rto-services?service=rc-transfer',
          highlight: true,
        },
        {
          icon: <Car className="h-5 w-5" />,
          label: 'Ownership',
          to: '/rto-services?service=ownership',
        },
        {
          icon: <Shield className="h-5 w-5" />,
          label: 'Insurance',
          to: '/insurance',
        },
        {
          icon: <Phone className="h-5 w-5" />,
          label: 'Support',
          onClick: () => alert('Calling support...'),
        },
      ]}
    />
  );
};

export const UserDashboardActionBar: React.FC = () => {
  return (
    <StickyActionBar
      actions={[
        {
          icon: <Car className="h-5 w-5" />,
          label: 'My Vehicles',
          to: '/dashboard/vehicles',
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: 'Documents',
          to: '/dashboard/documents',
        },
        {
          icon: <Shield className="h-5 w-5" />,
          label: 'Insurance',
          to: '/dashboard/insurance',
          highlight: true,
        },
        {
          icon: <DollarSign className="h-5 w-5" />,
          label: 'Finance',
          to: '/dashboard/finance',
        },
        {
          icon: <MessageSquare className="h-5 w-5" />,
          label: 'Support',
          onClick: () => alert('Opening support chat...'),
        },
      ]}
    />
  );
};

export default StickyActionBar;
"use client";  // Add this line at the top

import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';

type NotificationType = 'information' | 'success' | 'warning' | 'critical';

interface NotificationWithButtonProps {
  type: NotificationType;
  message: string;
  description: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  onClose: () => void;
  onPrimaryButtonClick: () => void;
  onSecondaryButtonClick: () => void;
  duration?: number;
}

interface NotificationFlashProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  information: {
    container: 'text-blue-900 bg-blue-100 border-blue-200',
    primaryButton: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
    secondaryButton: 'bg-blue-200 hover:bg-blue-300 focus:ring-blue-400',
    iconColor: 'text-blue-600',
    flashBg: 'bg-blue-500',
  },
  success: {
    container: 'text-green-900 bg-green-100 border-green-200',
    primaryButton: 'bg-green-700 hover:bg-green-800 focus:ring-green-500',
    secondaryButton: 'bg-green-200 hover:bg-green-300 focus:ring-green-400',
    iconColor: 'text-green-600',
    flashBg: 'bg-green-600',
  },
  warning: {
    container: 'text-yellow-900 bg-yellow-100 border-yellow-200',
    primaryButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    secondaryButton: 'bg-yellow-200 hover:bg-yellow-300 focus:ring-yellow-400',
    iconColor: 'text-yellow-600',
    flashBg: 'bg-yellow-600',
  },
  critical: {
    container: 'text-red-900 bg-red-100 border-red-200',
    primaryButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    secondaryButton: 'bg-red-200 hover:bg-red-300 focus:ring-red-400',
    iconColor: 'text-red-600',
    flashBg: 'bg-red-600',
  },
};

export const NotificationWithButton: React.FC<NotificationWithButtonProps> = ({
  type,
  message,
  description,
  primaryButtonLabel,
  secondaryButtonLabel,
  onClose,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, duration / 100);

    if (progress === 0) {
      onClose();
    }

    return () => {
      clearInterval(interval);
    };
  }, [progress, duration, onClose]);

  const styles = typeStyles[type];

  return (
    <div className={`p-4 ${styles.container} border rounded-md shadow-lg fixed bottom-4 right-4`} style={{ zIndex: 1000 }}>
      <Progress percent={progress} showInfo={false} strokeColor={styles.iconColor} />
      <div className="flex justify-between flex-wrap mt-2">
        <div className="w-0 flex-1 flex">
          <div className="mr-3 pt-1">
            {/* Add icon here based on the type */}
          </div>
          <div>
            <h4 className="text-md leading-6 font-medium">{message}</h4>
            <p className="text-sm">{description}</p>
            <div className="flex mt-3">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${styles.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonLabel}
              </button>
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-2 ${styles.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonLabel}
              </button>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="rounded-md focus:outline-none focus:ring-2"
            onClick={onClose}
          >
            {/* Close icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationFlash: React.FC<NotificationFlashProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, duration / 100);

    if (progress === 0) {
      onClose();
    }

    return () => {
      clearInterval(interval);
    };
  }, [progress, duration, onClose]);

  const styles = typeStyles[type];

  return (
    <div className="fixed bottom-4 right-4 p-8 space-y-4" style={{ zIndex: 1000 }}>
      <div className="flex w-96 shadow-lg rounded-lg">
        <div className={`py-4 px-6 rounded-l-lg flex items-center ${styles.flashBg}`}>
          {/* Add flash icon here based on the type */}
        </div>
        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
          <div>{message}</div>
          <div className="w-1/4">
            <Progress percent={progress} showInfo={false} strokeColor={styles.flashBg} />
          </div>
          <button onClick={onClose}>
            {/* Close icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationWithButton;

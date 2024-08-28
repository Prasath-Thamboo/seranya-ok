"use client"; // Ensure this component is a client component

import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import {
  AiOutlineInfoCircle,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";

type NotificationType = "information" | "success" | "warning" | "critical";

interface NotificationWithButtonProps {
  type: NotificationType;
  message: string;
  description?: string;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  onClose: () => void;
  onPrimaryButtonClick: () => void;
  onSecondaryButtonClick?: () => void;
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
    container: "text-white bg-blue-700/50 border-blue-200 shadow-blue-500/50",
    primaryButton:
      "bg-blue-700 hover:bg-white hover:text-blue-700 focus:ring-blue-500 transition-all transform hover:scale-105",
    secondaryButton:
      "bg-blue-700/50 border-blue-500 hover:bg-white hover:text-blue-600 focus:ring-blue-400 transition-all transform hover:scale-105",
    icon: <AiOutlineInfoCircle size={24} className="text-white" />,
    progressColor: "#1545C7",
  },
  success: {
    container: "text-white bg-green-700/50 border-green-200 shadow-green-500/50",
    primaryButton:
      "bg-green-700 hover:bg-white hover:text-green-700 focus:ring-green-500 transition-all transform hover:scale-105",
    secondaryButton:
      "bg-green-700/50 border-green-500 hover:bg-white hover:text-green-600 focus:ring-green-400 transition-all transform hover:scale-105",
    icon: <AiOutlineCheckCircle size={24} className="text-white" />,
    progressColor: "#11B462",
  },
  warning: {
    container: "text-white bg-yellow-700/50 border-yellow-200 shadow-yellow-500/50",
    primaryButton:
      "bg-yellow-500 hover:bg-white hover:text-yellow-500 focus:ring-yellow-500 transition-all transform hover:scale-105",
    secondaryButton:
      "bg-yellow-700/50 border-yellow-500 hover:bg-white hover:text-yellow-600 focus:ring-yellow-400 transition-all transform hover:scale-105",
    icon: <AiOutlineWarning size={24} className="text-white" />,
    progressColor: "#FFE604",
  },
  critical: {
    container: "text-white bg-red-700/50 border-red-200 shadow-red-500/50",
    primaryButton:
      "bg-red-600 hover:bg-white hover:text-red-600 focus:ring-red-500 transition-all transform hover:scale-105",
    secondaryButton:
      "bg-red-700/50 border-red-500 hover:bg-white hover:text-red-600 focus:ring-red-400 transition-all transform hover:scale-105",
    icon: <AiOutlineCloseCircle size={24} className="text-white" />,
    progressColor: "#E70E0E",
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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, duration / 100);

    if (progress <= 0) {
      setTimeout(() => {
        setVisible(false);
        onClose();
      }, 200); // Smooth fade out over 200ms
    }

    return () => {
      clearInterval(interval);
    };
  }, [progress, duration, onClose]);

  const styles = typeStyles[type];

  return visible ? (
    <div
      className={`relative p-4 w-96 ${styles.container} border rounded-md shadow-lg transition-all duration-200 ease-out transform hover:scale-105 hover:opacity-75 flex items-center`}
      style={{ opacity: progress > 0 ? 1 : 0, transition: "opacity 2s" }}
    >
      <div className="mr-4">{styles.icon}</div>
      <div className="flex-1">
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={styles.progressColor}
          className="mb-2 w-full"
        />
        <h4 className="text-md leading-6 font-medium">{message}</h4>
        {description && <p className="text-sm">{description}</p>}
        <div className="flex mt-2">
          <button
            type="button"
            className={`inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${styles.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
            onClick={onPrimaryButtonClick}
          >
            {primaryButtonLabel}
          </button>
          {secondaryButtonLabel && (
            <button
              type="button"
              className={`inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ml-2 ${styles.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonLabel}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        className="absolute top-2 right-2 rounded-full text-gray-300 hover:text-white hover:shadow-neon focus:outline-none focus:ring-2 transition-all"
        onClick={() => {
          setVisible(false);
          onClose(); // Trigger immediate close
        }}
      >
        <IoCloseSharp size={24} />
      </button>
    </div>
  ) : null;
};

export const NotificationFlash: React.FC<NotificationFlashProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, duration / 100);

    if (progress <= 0) {
      setTimeout(() => {
        setVisible(false);
        onClose();
      }, 200); // Smooth fade out over 200ms
    }

    return () => {
      clearInterval(interval);
    };
  }, [progress, duration, onClose]);

  const styles = typeStyles[type];

  return visible ? (
    <div
      className={`relative p-4 w-96 ${styles.container} border rounded-md shadow-lg transition-all duration-200 ease-out transform hover:scale-105 hover:opacity-75 flex items-center`}
      style={{ opacity: progress > 0 ? 1 : 0, transition: "opacity 2s" }}
    >
      <div className="mr-4">{styles.icon}</div>
      <div className="flex-1">
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={styles.progressColor}
          className="mb-2 w-full"
        />
        <h4 className="text-md leading-6 font-medium font-kanit">{message}</h4>
      </div>
      <button
        type="button"
        className="absolute top-2 right-2 rounded-full text-gray-300 hover:text-white hover:shadow-neon focus:outline-none focus:ring-2 transition-all"
        onClick={() => {
          setVisible(false);
          onClose(); // Trigger immediate close
        }}
      >
        <IoCloseSharp size={24} />
      </button>
    </div>
  ) : null;
};

// Composant NotificationList modifié pour inclure les deux types de notifications
interface NotificationListProps {
  notifications: Array<{
    id: string;
    type: NotificationType;
    message: string;
    description?: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
  }>;
  onRemoveNotification: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onRemoveNotification,
}) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {notifications.map((notification) =>
        notification.primaryButtonLabel ? (
          <NotificationWithButton
            key={notification.id}
            type={notification.type}
            message={notification.message}
            description={notification.description}
            primaryButtonLabel={notification.primaryButtonLabel}
            secondaryButtonLabel={notification.secondaryButtonLabel}
            onPrimaryButtonClick={notification.onPrimaryButtonClick!}
            onSecondaryButtonClick={notification.onSecondaryButtonClick}
            onClose={() => onRemoveNotification(notification.id)}
          />
        ) : (
          <NotificationFlash
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => onRemoveNotification(notification.id)}
          />
        )
      )}
    </div>
  );
};

export default NotificationList;

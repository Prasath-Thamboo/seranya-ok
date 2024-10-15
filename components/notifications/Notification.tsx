"use client"; // Ensure this component is a client component

import React, { useEffect, useState } from "react";
import { AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineWarning, AiOutlineCloseCircle } from "react-icons/ai";
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

const typeStyles: Record<NotificationType, {
  container: string;
  iconContainer: string;
  icon: React.ReactElement;
  title: string;
  description: string;
}> = {
  information: {
    container: "bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 dark:bg-blue-800/30",
    iconContainer: "inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 dark:border-blue-900 dark:bg-blue-800 dark:text-blue-400",
    icon: <AiOutlineInfoCircle className="shrink-0 text-xl" />,
    title: "text-gray-800 font-semibold dark:text-white font-iceberg",
    description: "text-sm text-gray-700 dark:text-neutral-400 font-iceberg",
  },
  success: {
    container: "bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30",
    iconContainer: "inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400",
    icon: <AiOutlineCheckCircle className="shrink-0 text-xl" />,
    title: "text-gray-800 font-semibold dark:text-white font-iceberg",
    description: "text-sm text-gray-700 dark:text-neutral-400 font-iceberg",
  },
  warning: {
    container: "bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 dark:bg-yellow-800/30",
    iconContainer: "inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-yellow-100 bg-yellow-200 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800 dark:text-yellow-400",
    icon: <AiOutlineWarning className="shrink-0 text-xl" />,
    title: "text-gray-800 font-semibold dark:text-white font-iceberg",
    description: "text-sm text-gray-700 dark:text-neutral-400 font-iceberg",
  },
  critical: {
    container: "bg-red-50 border-l-4 border-red-500 rounded-lg p-4 dark:bg-red-800/30",
    iconContainer: "inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400",
    icon: <AiOutlineCloseCircle className="shrink-0 text-xl" />,
    title: "text-gray-800 font-semibold dark:text-white font-iceberg",
    description: "text-sm text-gray-700 dark:text-neutral-400 font-iceberg",
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
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeOutTime = 500; // Duration de l'animation de fade-out en ms
    const timeout = setTimeout(() => {
      setFading(true);
      const timeout2 = setTimeout(() => {
        onClose();
      }, fadeOutTime);
      return () => clearTimeout(timeout2);
    }, duration - fadeOutTime);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const styles = typeStyles[type];

  return (
    <div
      className={`space-y-2 ${styles.container} transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      role="alert"
      tabIndex={-1}
    >
      <div className="flex items-center">
        <div className="shrink-0">
          <span className={styles.iconContainer}>{styles.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={styles.title}>{message}</h3>
          {description && <p className={styles.description}>{description}</p>}
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              className="bg-teal-500 hover:bg-teal-700 text-white font-iceberg py-2 px-4 rounded transition-all"
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonLabel}
            </button>
            {secondaryButtonLabel && (
              <button
                type="button"
                className="bg-teal-200 hover:bg-teal-300 text-teal-800 font-iceberg py-2 px-4 rounded transition-all"
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonLabel}
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          className="ml-4 text-gray-500 hover:text-gray-900"
          onClick={() => onClose()}
        >
          <IoCloseSharp size={24} />
        </button>
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
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeOutTime = 500; // Duration de l'animation de fade-out en ms
    const timeout = setTimeout(() => {
      setFading(true);
      const timeout2 = setTimeout(() => {
        onClose();
      }, fadeOutTime);
      return () => clearTimeout(timeout2);
    }, duration - fadeOutTime);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const styles = typeStyles[type];

  return (
    <div
      className={`space-y-2 ${styles.container} transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      role="alert"
      tabIndex={-1}
    >
      <div className="flex items-center">
        <div className="shrink-0">
          <span className={styles.iconContainer}>{styles.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={styles.title}>{message}</h3>
        </div>
        <button
          type="button"
          className="ml-4 text-gray-500 hover:text-gray-900"
          onClick={() => onClose()}
        >
          <IoCloseSharp size={24} />
        </button>
      </div>
    </div>
  );
};

// Composant NotificationList pour afficher la liste des notifications
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
    <div className="fixed bottom-4 right-4 space-y-4 z-50 w-80">
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

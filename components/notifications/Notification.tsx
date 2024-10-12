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
  icon: React.JSX.Element;
  title: string;
  description: string;
}> = {
  information: {
    container: "bg-blue-50 border-t-2 border-blue-500 rounded-lg p-4 dark:bg-blue-800/30",
    iconContainer: "inline-flex justify-center items-center size-8 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 dark:border-blue-900 dark:bg-blue-800 dark:text-blue-400",
    icon: <AiOutlineInfoCircle className="shrink-0 size-4" />,
    title: "text-gray-800 font-semibold dark:text-white",
    description: "text-sm text-gray-700 dark:text-neutral-400",
  },
  success: {
    container: "bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30",
    iconContainer: "inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400",
    icon: <AiOutlineCheckCircle className="shrink-0 size-4" />,
    title: "text-gray-800 font-semibold dark:text-white",
    description: "text-sm text-gray-700 dark:text-neutral-400",
  },
  warning: {
    container: "bg-yellow-50 border-t-2 border-yellow-500 rounded-lg p-4 dark:bg-yellow-800/30",
    iconContainer: "inline-flex justify-center items-center size-8 rounded-full border-4 border-yellow-100 bg-yellow-200 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800 dark:text-yellow-400",
    icon: <AiOutlineWarning className="shrink-0 size-4" />,
    title: "text-gray-800 font-semibold dark:text-white",
    description: "text-sm text-gray-700 dark:text-neutral-400",
  },
  critical: {
    container: "bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30",
    iconContainer: "inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400",
    icon: <AiOutlineCloseCircle className="shrink-0 size-4" />,
    title: "text-gray-800 font-semibold dark:text-white",
    description: "text-sm text-gray-700 dark:text-neutral-400",
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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const styles = typeStyles[type];

  return visible ? (
    <div className={`space-y-5 ${styles.container}`} role="alert" tabIndex={-1}>
      <div className="flex">
        <div className="shrink-0">
          <span className={styles.iconContainer}>{styles.icon}</span>
        </div>
        <div className="ms-3">
          <h3 className={styles.title}>{message}</h3>
          {description && <p className={styles.description}>{description}</p>}
          <div className="mt-4 space-x-2">
            <button
              type="button"
              className="bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition-all"
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonLabel}
            </button>
            {secondaryButtonLabel && (
              <button
                type="button"
                className="bg-teal-200 text-teal-800 font-semibold py-2 px-4 rounded transition-all hover:bg-teal-300"
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export const NotificationFlash: React.FC<NotificationFlashProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const styles = typeStyles[type];

  return visible ? (
    <div className={`space-y-5 ${styles.container}`} role="alert" tabIndex={-1}>
      <div className="flex">
        <div className="shrink-0">
          <span className={styles.iconContainer}>{styles.icon}</span>
        </div>
        <div className="ms-3">
          <h3 className={styles.title}>{message}</h3>
        </div>
      </div>
    </div>
  ) : null;
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

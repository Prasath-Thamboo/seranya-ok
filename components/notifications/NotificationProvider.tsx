"use client";

import React, { createContext, useContext, useState } from "react";
import { NotificationList } from "@/components/notifications/Notification";

interface NotificationContextType {
  addNotification: (
    type: "information" | "success" | "warning" | "critical", 
    message: string,
    options?: {
      description?: string;
      primaryButtonLabel?: string;
      secondaryButtonLabel?: string;
      onPrimaryButtonClick?: () => void;
      onSecondaryButtonClick?: () => void;
    }
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "information" | "success" | "warning" | "critical";
      message: string;
      description?: string;
      primaryButtonLabel?: string;
      secondaryButtonLabel?: string;
      onPrimaryButtonClick?: () => void;
      onSecondaryButtonClick?: () => void;
    }>
  >([]);

  const addNotification = (
    type: "information" | "success" | "warning" | "critical", 
    message: string,
    options?: {
      description?: string;
      primaryButtonLabel?: string;
      secondaryButtonLabel?: string;
      onPrimaryButtonClick?: () => void;
      onSecondaryButtonClick?: () => void;
    }
  ) => {
    setNotifications((prev) => [
      ...prev,
      { id: `${Date.now()}`, type, message, ...options },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationList notifications={notifications} onRemoveNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

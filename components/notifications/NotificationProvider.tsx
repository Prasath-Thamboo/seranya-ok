"use client";

import React, { createContext, useContext, useState } from "react";
import { NotificationList } from "@/components/notifications/Notification";

interface NotificationContextType {
  addNotification: (type: "information" | "success" | "warning" | "critical", message: string) => void;
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
    }>
  >([]);

  const addNotification = (type: "information" | "success" | "warning" | "critical", message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: `${Date.now()}`, type, message },
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

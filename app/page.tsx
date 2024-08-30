"use client"; // Ajoutez ceci pour indiquer que c'est un composant client

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationList from "@/components/notifications/Notification"; // Assurez-vous que l'import est correct
import Carousel from "@/components/Carousel"; // Import the Carousel component

export default function Home() {
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
    withButtons: boolean = true
  ) => {
    const id = uuidv4();
    setNotifications((prev) => [
      ...prev,
      {
        id,
        type,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
        ...(withButtons
          ? {
              description: `This is a ${type} notification with buttons`,
              primaryButtonLabel: "Primary",
              secondaryButtonLabel: "Secondary",
              onPrimaryButtonClick: () => alert(`${type} Primary clicked!`),
              onSecondaryButtonClick: () => alert(`${type} Secondary clicked!`),
            }
          : {}),
      },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const carouselItems = [
    {
      image: "https://picsum.photos/800/400?random=1",
      title: "Bienvenue à Spectral",
      subtitle: "Nous vous offrons les meilleures solutions",
    },
    {
      image: "https://picsum.photos/800/400?random=2",
      title: "Innovation et Excellence",
      subtitle: "Notre expertise à votre service",
    },
    {
      image: "https://picsum.photos/800/400?random=3",
      title: "Rejoignez-nous",
      subtitle: "Votre succès est notre priorité",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-start min-h-screen w-full font-kanit">
      {/* Carousel */}
      <Carousel items={carouselItems} height="85vh" width="100vw" />

      <div className="space-y-4 mt-12 p-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => addNotification("information")}
        >
          Trigger Information Notification (With Buttons)
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={() => addNotification("success")}
        >
          Trigger Success Notification (With Buttons)
        </button>
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded-md"
          onClick={() => addNotification("warning")}
        >
          Trigger Warning Notification (With Buttons)
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md"
          onClick={() => addNotification("critical")}
        >
          Trigger Critical Notification (With Buttons)
        </button>
        <button
          className="px-4 py-2 bg-blue-400 text-white rounded-md"
          onClick={() => addNotification("information", false)}
        >
          Trigger Information Flash Notification (No Buttons)
        </button>
        <button
          className="px-4 py-2 bg-green-400 text-white rounded-md"
          onClick={() => addNotification("success", false)}
        >
          Trigger Success Flash Notification (No Buttons)
        </button>
        <button
          className="px-4 py-2 bg-yellow-400 text-white rounded-md"
          onClick={() => addNotification("warning", false)}
        >
          Trigger Warning Flash Notification (No Buttons)
        </button>
        <button
          className="px-4 py-2 bg-red-400 text-white rounded-md"
          onClick={() => addNotification("critical", false)}
        >
          Trigger Critical Flash Notification (No Buttons)
        </button>
      </div>

      <NotificationList
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </main>
  );
}

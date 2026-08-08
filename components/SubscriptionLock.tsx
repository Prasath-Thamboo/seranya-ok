"use client";

import React from "react";
import { FaLock } from "react-icons/fa";

interface SubscriptionLockProps {
  message?: string;
  minHeight?: number;
  className?: string;
}

// Overlay "réservé aux abonnés" — même patron visuel que ClassDetailClient/UnitDetailClient.
// Le parent doit être positionné en `relative` pour que l'overlay le recouvre.
const SubscriptionLock: React.FC<SubscriptionLockProps> = ({
  message = "Contenu réservé aux abonnés",
  minHeight = 200,
  className = "",
}) => {
  const handleSubscriptionClick = () => {
    window.location.href = "/subscription";
  };

  return (
    <div
      className={`absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-lg ${className}`}
      style={{ minHeight }}
    >
      <FaLock className="text-5xl text-gray-400 mb-4" />
      <p className="text-lg text-white mb-4 text-center px-4">{message}</p>
      <button
        onClick={handleSubscriptionClick}
        className="bg-indigo-600 text-white px-6 py-2.5 text-base rounded-lg hover:bg-indigo-500 transition-colors duration-200"
      >
        S&apos;abonner
      </button>
    </div>
  );
};

export default SubscriptionLock;

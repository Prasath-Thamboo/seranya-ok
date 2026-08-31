"use client";

import React from "react";
import { FiLock } from "react-icons/fi";

interface SubscriptionLockProps {
  message?: string;
  minHeight?: number;
  className?: string;
}

// Voile clair "verre dépoli chaud" — réservé aux abonnés.
// Le parent doit être positionné en `relative`.
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
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl surface-overlay ${className}`}
      style={{ minHeight }}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <FiLock className="h-5 w-5" />
      </span>
      <p className="mb-5 max-w-xs px-4 text-center text-sm text-ink-soft">{message}</p>
      <button
        onClick={handleSubscriptionClick}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-sans text-ink-invert transition-colors duration-200 hover:bg-accent-hover"
      >
        S&apos;abonner
      </button>
    </div>
  );
};

export default SubscriptionLock;

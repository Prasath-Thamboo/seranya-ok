"use client";

import { useEffect, useState } from "react";
import { getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";

export function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
    if (!token) return;

    fetchCurrentUser()
      .then((user: any) => setIsSubscribed(!!user?.isSubscribed))
      .catch(() => {});
  }, []);

  return { isLoggedIn, isSubscribed };
}

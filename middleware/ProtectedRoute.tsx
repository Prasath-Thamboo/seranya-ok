"use client"; // Mark this file as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { UserRole } from "@/lib/models/UserModels";
import { useNotification } from "@/components/notifications/NotificationProvider";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[]; // Roles that are allowed to access the route
  /**
   * Where to send an authenticated user whose role isn't allowed here.
   * Kept distinct from the "not logged in" case, which always goes to
   * /auth/login: an EDITOR hitting an ADMIN-only page is still a valid
   * session, just not for this route, so bouncing them to the login
   * screen would be confusing.
   */
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, fallbackPath = "/auth/login" }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const user = await fetchCurrentUser();

        // Ensure user and user.role are defined
        if (user?.role && allowedRoles.includes(user.role)) {
          setIsAuthorized(true);
        } else {
          addNotification(
            "critical",
            "Accès refusé",
            { description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette page." },
          );
          // router.push (not window.location.href) keeps the app mounted so the
          // notification above survives the redirect instead of being wiped by a reload.
          router.push(fallbackPath);
        }
      } catch (error) {
        // Not authenticated at all: always go to login.
        addNotification(
          "critical",
          "Connexion requise",
          { description: "Vous devez être connecté avec un compte autorisé pour accéder à cette page." },
        );
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRoles, fallbackPath]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authorization
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;

"use client"; // Mark this file as a client component

import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { UserRole } from "@/lib/models/UserModels";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[]; // Roles that are allowed to access the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const user = await fetchCurrentUser();

        // Ensure user and user.role are defined
        if (user?.role && allowedRoles.includes(user.role)) {
          setIsAuthorized(true);
        } else {
          // Redirect to login if not authorized
          window.location.href = "/auth/login";
        }
      } catch (error) {
        // Redirect to login on error
        window.location.href = "/auth/login";
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authorization
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;

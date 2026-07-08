"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { UserRole } from "@/lib/models/UserModels";

export default function AdminDiscussionsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} fallbackPath="/admin/posts">
      {children}
    </ProtectedRoute>
  );
}

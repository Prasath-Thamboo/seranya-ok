"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ReactNode } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute"; // Import the ProtectedRoute component
import { UserRole } from "@/lib/models/UserModels"; // Import the UserRole enum

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="relative flex h-screen overflow-hidden bg-sunken font-sans text-ink">
        {/* Sidebar */}
        <div className="z-30 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
          <Header />
          <main className="relative z-0 flex-1 overflow-y-auto bg-sunken">
            <div className="container mx-auto px-6 py-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

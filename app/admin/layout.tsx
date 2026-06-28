"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ReactNode } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute"; // Import the ProtectedRoute component
import { UserRole } from "@/lib/models/UserModels"; // Import the UserRole enum

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="flex h-screen overflow-hidden bg-gray-50 relative">
        {/* Sidebar */}
        <div className="z-30 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 relative z-10">
            <div className="container px-6 py-6 mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

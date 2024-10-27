"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ReactNode } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute"; // Import the ProtectedRoute component
import { UserRole } from "@/lib/models/UserModels"; // Import the UserRole enum

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="flex h-screen bg-gray-100 relative">
        {/* Sidebar */}
        <div className="z-30">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full transition-all duration-300"> {/* Adjusted margin to accommodate sidebar */}
          <Header />
          <main className="h-full overflow-y-auto bg-gray-100 relative z-10"> {/* Ensure main content is below sidebar toggle */}
            <div className="container px-6 mx-auto grid">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ReactNode, useState } from "react";
import ProtectedRoute from "@/middleware/ProtectedRoute"; // Import the ProtectedRoute component
import { UserRole } from "@/lib/models/UserModels"; // Import the UserRole enum

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.EDITOR]}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <div className={`flex flex-col flex-1 w-full transition-all duration-300`}>
          <Header />
          <main className="h-full overflow-y-auto bg-gray-100">
            <div className="container px-6 mx-auto grid">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

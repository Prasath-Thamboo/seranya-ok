import React from 'react';
import { SidebarContent } from './SidebarContent';

export default function Sidebar({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) {
  return (
    <aside
      className={`z-20 overflow-y-auto bg-black flex-shrink-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-80'
      }`}
    >
      <SidebarContent collapsed={collapsed} toggleSidebar={toggleSidebar} />
    </aside>
  );
}

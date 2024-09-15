import React, { useState, useEffect } from 'react';
import { SidebarContent } from './SidebarContent';

export default function Sidebar({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Cacher la sidebar si l'écran est trop étroit (mobile)
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`z-20 overflow-y-auto bg-black flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'} ${
        isMobile ? 'hidden' : 'block' // Masquer la sidebar en mode mobile
      }`}
    >
      <SidebarContent collapsed={collapsed} toggleSidebar={toggleSidebar} />
    </aside>
  );
}

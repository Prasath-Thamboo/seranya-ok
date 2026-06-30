"use client";

import React, { useState, useEffect } from 'react';
import { FaUsers, FaNewspaper, FaPlay, FaBookOpen, FaComments } from 'react-icons/fa';
import { Menu } from 'antd';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { getAccessToken, fetchCurrentUser, logoutUser } from "@/lib/queries/AuthQueries";
import Badge from "@/components/Badge";
import CustomModal from "@/components/CustomModal";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiFillHome } from 'react-icons/ai';

export function SidebarContent({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) {
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Basculer vers mobile-friendly sidebar
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser({
            ...userData,
            role: userData.role || UserRole.USER,
          });
        })
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const showLogoutModal = () => setIsLogoutModalVisible(true);
  const hideLogoutModal = () => setIsLogoutModalVisible(false);

  const handleProfileClick = () => {
    router.push('/admin/me');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-black text-white flex items-center justify-between z-50 shadow-lg px-4">
        <div className="flex items-center space-x-6">
          <FaUsers className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-200" onClick={() => router.push('/admin/users')} />
          <FaNewspaper className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-200" onClick={() => router.push('/admin/posts')} />
        </div>

        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer border-2 border-white bg-black" onClick={() => router.push('/admin')}>
          <Image src="/logos/seranyaicon.png" alt="Home" width={40} height={40} className="rounded-full" />
        </div>

        <div className="flex items-center space-x-6">
          <FaPlay className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-200" onClick={() => router.push('/admin/tutoriels')} />
          <FaBookOpen className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-200" onClick={() => router.push('/admin/encyclopedie')} />
          <FaComments className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-200" onClick={() => router.push('/admin/discussions')} />
        </div>
      </nav>
    );
  }

  return (
    <div
      className={`relative flex flex-col h-full text-white bg-black shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-80'
      } overflow-hidden`}  // Empêche le dépassement du contenu
    >
      {/* Toggle Button */}
      <div
        className="absolute top-24 right-0 transform translate-x-1/2 bg-black text-white rounded-full p-1 cursor-pointer shadow-lg border-2 border-white"
        style={{
          right: collapsed ? '-10px' : '-15px',
        }}
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <BiChevronRight className="w-6 h-6" />
        ) : (
          <BiChevronLeft className="w-6 h-6" />
        )}
      </div>

      {/* Logo Section */}
      <div
        className={`flex items-center justify-center my-10 cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        onClick={handleLogoClick} // Redirection au clic sur le logo
      >
        <Image
          src={collapsed ? "/logos/seranyaicon.png" : "/logos/seranyaicon.png"} // Changement du logo en fonction de l'état
          alt="Seranya Logo"
          width={collapsed ? 35 : 180} // Ajuster la taille du logo en fonction du statut collapsed
          height={50}
          className="mx-auto"
        />
      </div>

      {/* Navigation Section */}
      <Menu
        mode="inline"
        className="font-iceberg"
        style={{ background: 'black', borderRight: 'none' }}
      >
        {/* Groupe 1 — Administration */}
        <Menu.Item
          key="dashboard"
          icon={<AiFillHome className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin')}
        >
          {!collapsed && <span className="uppercase">Tableau de bord</span>}
        </Menu.Item>

        <Menu.Item
          key="users"
          icon={<FaUsers className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin/users')}
        >
          {!collapsed && <span className="uppercase">Utilisateurs</span>}
        </Menu.Item>

        {/* Séparateur */}
        <Menu.Divider style={{ borderColor: '#374151', margin: '8px 16px' }} />

        {/* Groupe 2 — Contenu */}
        <Menu.Item
          key="posts"
          icon={<FaNewspaper className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin/posts')}
        >
          {!collapsed && <span className="uppercase">Articles</span>}
        </Menu.Item>

        <Menu.Item
          key="tutoriels"
          icon={<FaPlay className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin/tutoriels')}
        >
          {!collapsed && <span className="uppercase">Tutoriels</span>}
        </Menu.Item>

        <Menu.Item
          key="encyclopedie"
          icon={<FaBookOpen className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin/encyclopedie')}
        >
          {!collapsed && <span className="uppercase">Encyclopédie</span>}
        </Menu.Item>

        {/* Séparateur */}
        <Menu.Divider style={{ borderColor: '#374151', margin: '8px 16px' }} />

        {/* Groupe 3 — Communauté */}
        <Menu.Item
          key="discussions"
          icon={<FaComments className="w-5 h-5" />}
          className="menu-item"
          onClick={() => router.push('/admin/discussions')}
        >
          {!collapsed && <span className="uppercase">Discussions</span>}
        </Menu.Item>
      </Menu>

      {/* Fixed Bottom Section */}
      <div className="mt-auto">
        <div
          className={`flex flex-col items-center justify-center mb-2 relative transition-all duration-300 p-4 rounded-lg w-full cursor-pointer`}
          onClick={handleProfileClick}
        >
          <div className="flex flex-col items-center justify-center">
            <Image
              src={typeof user?.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full object-cover mb-2"
            />
            {!collapsed && (
              <div className="flex items-center">
                <span className="text-lg font-iceberg font-semibold mr-2">{user?.pseudo}</span>
                <Badge role={user?.role || UserRole.USER} />
              </div>
            )}
          </div>
        </div>

        {/* Logout Button Section */}
        <div className={`flex justify-center items-center mb-4 ${collapsed ? 'p-2' : 'p-4'}`}>
          <button
            className={`bg-transparent text-white font-iceberg font-bold flex items-center ${collapsed ? '' : 'w-full justify-center'}`}
            onClick={showLogoutModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 13v-2H7.414l2.293-2.293-1.414-1.414L3.586 12l4.707 4.707 1.414-1.414L7.414 13H16z" />
              <path d="M20 3h-6v2h6v14h-6v2h6a2 2 0 002-2V5a2 2 0 00-2-2z" />
            </svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <CustomModal
        visible={isLogoutModalVisible}
        onCancel={hideLogoutModal}
        onConfirm={handleLogout}
        title="Déconnexion"
        subtitle="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Déconnexion"
        cancelText="Annuler"
        iconType="warning"
      />
    </div>
  );
}

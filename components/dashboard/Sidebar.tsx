"use client";

import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaCubes, FaBook, FaVideo, FaBookOpen } from 'react-icons/fa';
import { Menu } from 'antd';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { getAccessToken, fetchCurrentUser, logoutUser } from "@/lib/queries/AuthQueries";
import Badge from "@/components/Badge";
import CustomModal from "@/components/CustomModal";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiFillHome } from 'react-icons/ai';
import { FaFolderOpen } from "react-icons/fa6";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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
    // Layout pour mobile
    return (
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-black text-white flex items-center justify-between z-50 shadow-lg px-4">
        {/* Icônes à gauche */}
        <div className="flex items-center space-x-6">
          {user?.role === UserRole.ADMIN && (
            <FaUsers className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/users')} />
          )}
          <FaVideo className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/tutoriels')} />
        </div>

        {/* Logo central */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer border-2 border-white bg-black" onClick={() => router.push('/admin')}>
          <Image
            src="/logos/seranyaicon.png"
            alt="Home"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Icônes à droite */}
        <div className="flex items-center space-x-6">
          <FaBookOpen className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/encyclopedie')} />
          <FaComments className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/discussion')} />
        </div>
      </nav>
    );
  }

  return (
    <aside
      className={`relative z-20 flex flex-col h-full text-white bg-gray-950 border-r border-gray-800 shadow-xl transition-all duration-300 ${
        collapsed ? 'w-[4.5rem]' : 'w-72'
      } ${isMobile ? 'hidden' : 'block'}`}
    >
      {/* Bouton de repli */}
      <button
        className="absolute top-20 -right-3 bg-gray-950 text-white rounded-full p-1 cursor-pointer shadow-lg border border-gray-700 hover:border-green-400 transition-colors z-10"
        onClick={toggleSidebar}
        aria-label="Réduire le menu"
      >
        {collapsed ? (
          <BiChevronRight className="w-5 h-5" />
        ) : (
          <BiChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Section Logo */}
      <div
        className="flex items-center justify-center py-6 px-4 border-b border-gray-800 cursor-pointer"
        onClick={handleLogoClick}
      >
        <Image
          src="/logos/seranyaicon.png"
          alt="Seranya Logo"
          width={collapsed ? 32 : 140}
          height={45}
          className="mx-auto transition-all duration-300"
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
      <Menu
        mode="inline"
        className="font-iceberg"
        style={{ background: 'transparent', borderRight: 'none' }}
      >
        {user?.role === UserRole.ADMIN && (
          <Menu.Item
            key="dashboard"
            icon={<AiFillHome className="w-5 h-5 text-shadow-white" />}
            className="menu-item"
            onClick={() => router.push('/admin')}
          >
            {!collapsed && <span className="uppercase text-shadow-white">Tableau de bord</span>}
          </Menu.Item>
        )}

        <Menu.Item
          key="posts"
          icon={<FaFolderOpen className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin/posts')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Articles</span>}
        </Menu.Item>

        {user?.role === UserRole.ADMIN && (
          <Menu.Item
            key="users"
            icon={<FaUsers className="w-5 h-5 text-shadow-white" />}
            className="menu-item"
            onClick={() => router.push('/admin/users')}
          >
            {!collapsed && <span className="uppercase text-shadow-white">Utilisateurs</span>}
          </Menu.Item>
        )}

        <Menu.Item
          key="encyclopedie"
          icon={<FaBookOpen className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin/encyclopedie')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Encyclopédie</span>}
        </Menu.Item>

        <Menu.Item
          key="tutoriels"
          icon={<FaVideo className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin/tutoriels')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Tutoriels</span>}
        </Menu.Item>

        {user?.role === UserRole.ADMIN && (
          <Menu.Item
            key="units"
            icon={<FaCubes className="w-5 h-5 text-shadow-white" />}
            className="menu-item"
            onClick={() => router.push('/admin/units')}
          >
            {!collapsed && <span className="uppercase text-shadow-white">Entités</span>}
          </Menu.Item>
        )}

        {user?.role === UserRole.ADMIN && (
          <Menu.Item
            key="classes"
            icon={<FaBook className="w-5 h-5 text-shadow-white" />}
            className="menu-item"
            onClick={() => router.push('/admin/classes')}
          >
            {!collapsed && <span className="uppercase text-shadow-white">Familles</span>}
          </Menu.Item>
        )}

        <Menu.Item
          key="chat"
          icon={<FaComments className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin/discussion')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Discussion</span>}
        </Menu.Item>
      </Menu>
      </div>

      {/* Section Profil et Déconnexion */}
      <div className="border-t border-gray-800">
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-900 transition-colors"
          onClick={handleProfileClick}
        >
          <Image
            src={typeof user?.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
            alt="User Avatar"
            width={38}
            height={38}
            className="rounded-full object-cover ring-2 ring-gray-700 flex-shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-iceberg font-semibold text-white truncate">{user?.pseudo}</span>
              <Badge role={user?.role || UserRole.USER} />
            </div>
          )}
        </div>

        <div className="px-3 pb-4">
          <button
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 font-kanit text-sm transition-colors ${collapsed ? 'justify-center' : ''}`}
            onClick={showLogoutModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 13v-2H7.414l2.293-2.293-1.414-1.414L3.586 12l4.707 4.707 1.414-1.414L7.414 13H16z" />
              <path d="M20 3h-6v2h6v14h-6v2h6a2 2 0 002-2V5a2 2 0 00-2-2z" />
            </svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

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
    </aside>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaUsers, FaComments, FaUsersCog, FaCubes, FaUserCircle } from 'react-icons/fa';
import { Menu } from 'antd';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import { getAccessToken, fetchCurrentUser, logoutUser } from "@/lib/queries/AuthQueries";
import Badge from "@/components/Badge";
import CustomModal from "@/components/CustomModal";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import { useRouter } from 'next/navigation';

export function SidebarContent({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) {
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser({
            ...userData,
            profileImage: userData.profileImage || '/images/backgrounds/placeholder.jpg',
            role: userData.role || UserRole.USER,
          });
        })
        .catch(() => {
          setUser(null);
        });
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

  return (
    <div
      className={`relative flex flex-col h-full text-white bg-black shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-80'
      }`}
      style={{
        boxShadow: '4px 0 8px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}
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
          src="/logos/spectral-high-resolution-logo-white-transparent.png" // Logo Spectral
          alt="Spectral Logo"
          width={collapsed ? 35 : 180} // Ajuster la taille du logo en fonction du statut collapsed
          height={50}
          className="mx-auto"
        />
      </div>

      {/* Navigation Section */}
      <Menu
        mode="inline"
        className="font-iceberg" // Police Iceberg pour toute la barre de navigation
        style={{ background: 'black', borderRight: 'none' }}
      >
        <Menu.Item
          key="dashboard"
          icon={<AiFillHome className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
        >
          {!collapsed && <span className="uppercase text-shadow-white">Tableau de bord</span>}
        </Menu.Item>

        <Menu.SubMenu
          key="users"
          icon={<FaUsers className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Utilisateurs</span>}
          className="menu-item"
        >
          <Menu.Item
            key="general-users"
            className="submenu-item"
            style={{ borderLeft: '4px solid black' }}
            onClick={() => router.push('/admin/users')}
          >
            <span className="uppercase">Général</span>
          </Menu.Item>
          <Menu.Item
            key="manage-users"
            className="submenu-item"
            style={{ borderLeft: '4px solid black' }}
          >
            <span className="uppercase">Gérer</span>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="units"
          icon={<FaCubes className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Units</span>}
          className="menu-item"
        >
          <Menu.Item
            key="general-units"
            className="submenu-item"
            style={{ borderLeft: '4px solid black' }}
          >
            <a href="/admin/units" className="uppercase">Général</a>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="chat"
          icon={<FaComments className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
        >
          {!collapsed && <span className="uppercase text-shadow-white">Discussion</span>}
        </Menu.Item>
        <Menu.Item
          key="team"
          icon={<FaUsersCog className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
        >
          {!collapsed && <span className="uppercase text-shadow-white">Équipe</span>}
        </Menu.Item>
      </Menu>

      {/* Fixed Bottom Section */}
      <div className="mt-auto">
        <div
          className={`flex flex-col items-center justify-center mb-2 relative transition-all duration-300 p-4 rounded-lg w-full cursor-pointer ${isHovered ? 'bg-gray-700 text-white' : 'bg-gray-900'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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

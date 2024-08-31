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
    const token = getAccessToken();
    if (token) {
      try {
        await logoutUser(token);
        setUser(null);
        router.push('/auth/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
  };

  const showLogoutModal = () => setIsLogoutModalVisible(true);
  const hideLogoutModal = () => setIsLogoutModalVisible(false);

  const handleProfileClick = () => {
    router.push('/admin/me'); // Redirection vers la page du profil utilisateur
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

      {/* Header Section */}
      <div
        className={`flex items-center justify-start h-24 px-6 mb-4 transition-all duration-300 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 text-shadow-white transition-all duration-300 ${
            collapsed ? 'mr-0' : 'mr-2'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        {!collapsed && (
          <span className="text-xl font-medium font-kanit text-shadow-white">
            Spectral Dashboard
          </span>
        )}
      </div>

      {/* Navigation Section */}
      <Menu
        mode="inline"
        className="font-kanit"
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
            onClick={() => router.push('/admin/users')} // Ajout du lien ici
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
        {/* User Info Section with Hover Effect */}
        <div
          className={`flex flex-col items-center justify-center mb-2 relative transition-all duration-300 p-4 rounded-lg w-full cursor-pointer ${isHovered ? 'bg-gray-700 text-white' : 'bg-gray-900'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleProfileClick}
        >
          <div className={`transition-all duration-300 flex flex-col items-center justify-center w-full`}>
            {isHovered ? (
              <>
                <FaUserCircle className="w-6 h-6 mb-2" />
                <span className="font-oxanium uppercase">Aller à mon profil</span>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Image
                  src={typeof user?.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full object-cover mb-2"
                />
                {!collapsed && (
                  <div className="flex items-center">
                    <span className="text-lg font-semibold mr-2">{user?.pseudo}</span>
                    <Badge role={user?.role || UserRole.USER} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button Section */}
        <div className={`flex justify-center items-center mb-4 ${collapsed ? 'p-2' : 'p-4'}`}>
          <button
            className={`bg-transparent text-white font-kanit font-bold flex items-center ${collapsed ? '' : 'w-full justify-center'}`}
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

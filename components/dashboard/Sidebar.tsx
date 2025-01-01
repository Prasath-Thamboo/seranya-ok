"use client";

import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaCubes, FaBook } from 'react-icons/fa';
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
          const profileImageUrl = `${process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/users/${userData.id}/ProfileImage.png`;
          setUser({
            ...userData,
            profileImage: profileImageUrl,
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
          <FaUsers className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/users')} />
          <FaCubes className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/units')} />
        </div>

        {/* Logo central */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer border-2 border-white bg-black" onClick={() => router.push('/admin')}>
          <Image
            src="/logos/seranyaicon.png" // Utilisation du logo simplifié en mobile
            alt="Home"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Icônes à droite */}
        <div className="flex items-center space-x-6">
          <FaBook className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/classes')} />
          <FaComments className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors duration-200" onClick={() => router.push('/admin/discussion')} />
        </div>
      </nav>
    );
  }

  return (
    <aside
      className={`relative z-20 flex flex-col h-full text-white bg-black shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-80'
      } ${isMobile ? 'hidden' : 'block'} `}
    >
      {/* Bouton de repli */}
      <div
        className="absolute top-24 right-0 transform translate-x-1/2 bg-black text-white rounded-full p-1 cursor-pointer shadow-lg border-2 border-white"
        style={{
          right: collapsed ? '0px' : '0px',
        }}
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <BiChevronRight className="w-6 h-6" />
        ) : (
          <BiChevronLeft className="w-6 h-6" />
        )}
      </div>

      {/* Section Logo */}
      <div
        className={`flex items-center justify-center my-10 cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        onClick={handleLogoClick}
      >
        <Image
          src={collapsed ? "/logos/seranyaicon.png" : "/logos/seranyaicon.png"}
          alt="Seranya Logo"
          width={collapsed ? 35 : 180}
          height={50}
          className="mx-auto"
        />
      </div>

      {/* Navigation */}
      <Menu
        mode="inline"
        className="font-iceberg"
        style={{ background: 'black', borderRight: 'none', boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.5)' }}
      >
        <Menu.Item
          key="dashboard"
          icon={<AiFillHome className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Tableau de bord</span>}
        </Menu.Item>

        <Menu.SubMenu
          key="posts"
          icon={<FaFolderOpen className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Articles</span>}
          className="menu-item"
        >
          <Menu.Item key="general-posts" className="submenu-item" onClick={() => router.push('/admin/posts')}>
            <span className="uppercase">Général</span>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="users"
          icon={<FaUsers className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Utilisateurs</span>}
          className="menu-item"
        >
          <Menu.Item key="general-users" className="submenu-item" onClick={() => router.push('/admin/users')}>
            <span className="uppercase">Général</span>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="units"
          icon={<FaCubes className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Units</span>}
          className="menu-item"
        >
          <Menu.Item key="general-units" className="submenu-item" onClick={() => router.push('/admin/units')}>
            <span className="uppercase">Général</span>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="classes"
          icon={<FaBook className="w-5 h-5 text-shadow-white" />}
          title={!collapsed && <span className="uppercase text-shadow-white">Classes</span>}
          className="menu-item"
        >
          <Menu.Item key="general-classes" className="submenu-item" onClick={() => router.push('/admin/classes')}>
            <span className="uppercase">Général</span>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="chat"
          icon={<FaComments className="w-5 h-5 text-shadow-white" />}
          className="menu-item"
          onClick={() => router.push('/admin/discussion')}
        >
          {!collapsed && <span className="uppercase text-shadow-white">Discussion</span>}
        </Menu.Item>
      </Menu>

  {/* Section Profil et Déconnexion */}
  <div className="mt-auto">
        <div className="flex flex-col items-center justify-center mb-2 relative transition-all duration-300 p-4 rounded-lg w-full cursor-pointer" onClick={handleProfileClick}>
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

        <div className={`flex justify-center items-center mb-4 ${collapsed ? 'p-2' : 'p-4'}`}>
          <button
            className={`bg-transparent text-white font-iceberg font-bold flex items-center ${collapsed ? '' : 'w-full justify-center'}`}
            onClick={showLogoutModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
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
"use client";

import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaVideo, FaBookOpen, FaNewspaper, FaSearch } from 'react-icons/fa';
import { Menu } from 'antd';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { getAccessToken, fetchCurrentUser, logoutUser } from "@/lib/queries/AuthQueries";
import Badge from "@/components/Badge";
import CustomModal from "@/components/CustomModal";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiFillHome } from 'react-icons/ai';

const MOBILE_BREAKPOINT = 770;

type MenuEntry =
  | { key: string; label: string; path: string; icon: React.ReactNode; visible: boolean; divider?: false }
  | { key: string; divider: true; visible: boolean };

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
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

  // Referme le menu mobile si l'écran repasse en desktop/tablette large
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Rechargement complet pour que toute la page reflète la déconnexion.
      window.location.href = '/auth/login';
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

  const menuItems: MenuEntry[] = [
    {
      key: 'dashboard',
      label: 'Tableau de bord',
      path: '/admin',
      icon: <AiFillHome className="w-5 h-5" />,
      visible: user?.role === UserRole.ADMIN,
    },
    {
      key: 'users',
      label: 'Utilisateurs',
      path: '/admin/users',
      icon: <FaUsers className="w-5 h-5" />,
      visible: user?.role === UserRole.ADMIN,
    },
    { key: 'divider-1', divider: true, visible: user?.role === UserRole.ADMIN },
    {
      key: 'posts',
      label: 'Articles',
      path: '/admin/posts',
      icon: <FaNewspaper className="w-5 h-5" />,
      visible: true,
    },
    {
      key: 'tutoriels',
      label: 'Tutoriels',
      path: '/admin/tutoriels',
      icon: <FaVideo className="w-5 h-5" />,
      visible: true,
    },
    {
      key: 'encyclopedie',
      label: 'Encyclopédie',
      path: '/admin/encyclopedie',
      icon: <FaBookOpen className="w-5 h-5" />,
      visible: true,
    },
    {
      key: 'chat',
      label: 'Discussions',
      path: '/admin/discussions',
      icon: <FaComments className="w-5 h-5" />,
      visible: user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR,
    },
    { key: 'divider-2', divider: true, visible: user?.role === UserRole.ADMIN },
    {
      key: 'search',
      label: 'Recherche',
      path: '/admin/search',
      icon: <FaSearch className="w-5 h-5" />,
      visible: user?.role === UserRole.ADMIN,
    },
  ];

  const visibleItems = menuItems.filter((item) => item.visible);

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Bouton hamburger flottant */}
        <button
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-200 active:scale-95"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? <AiOutlineClose className="w-6 h-6" /> : <AiOutlineMenu className="w-6 h-6" />}
        </button>

        {/* Panneau du menu (reprend le menu desktop, en plus compact) */}
        <nav
          className={`fixed bottom-0 left-0 w-full max-h-[75vh] overflow-y-auto bg-gray-950 text-white z-50 rounded-t-2xl shadow-2xl border-t border-gray-800 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya Logo"
              width={100}
              height={32}
              onClick={() => {
                handleLogoClick();
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer"
            />
            <button
              className="p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>
          </div>

          <div className="py-2">
            {visibleItems.map((item) =>
              item.divider ? (
                <div key={item.key} className="h-px bg-gray-800 my-2 mx-4" />
              ) : (
                <button
                  key={item.key}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-iceberg uppercase text-gray-200 hover:bg-gray-900 hover:text-green-400 transition-colors"
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="border-t border-gray-800 px-4 py-3 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer min-w-0"
              onClick={() => {
                handleProfileClick();
                setMobileMenuOpen(false);
              }}
            >
              <Image
                src={typeof user?.profileImage === 'string' ? user.profileImage : '/images/backgrounds/placeholder.jpg'}
                alt="User Avatar"
                width={28}
                height={28}
                className="rounded-full object-cover ring-2 ring-gray-700 flex-shrink-0"
              />
              <span className="text-xs font-iceberg font-semibold text-white truncate">{user?.pseudo}</span>
            </div>
            <button
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 font-kanit transition-colors flex-shrink-0"
              onClick={() => {
                showLogoutModal();
                setMobileMenuOpen(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 13v-2H7.414l2.293-2.293-1.414-1.414L3.586 12l4.707 4.707 1.414-1.414L7.414 13H16z" />
                <path d="M20 3h-6v2h6v14h-6v2h6a2 2 0 002-2V5a2 2 0 00-2-2z" />
              </svg>
              Déconnexion
            </button>
          </div>
        </nav>

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
      </>
    );
  }

  return (
    <aside
      className={`relative z-20 flex flex-col h-full text-white bg-gray-950 border-r border-gray-800 shadow-xl transition-all duration-300 ${
        collapsed ? 'w-[4.5rem]' : 'w-72'
      }`}
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
        {visibleItems.map((item) =>
          item.divider ? (
            <Menu.Divider key={item.key} style={{ borderColor: '#374151', margin: '8px 16px' }} />
          ) : (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className="menu-item"
              onClick={() => router.push(item.path)}
            >
              {!collapsed && <span className="uppercase">{item.label}</span>}
            </Menu.Item>
          )
        )}
      </Menu>
      </div>

      {/* Section Profil et Déconnexion */}
      <div className="border-t border-gray-800">
        <div
          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-900 transition-colors ${collapsed ? 'justify-center' : ''}`}
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

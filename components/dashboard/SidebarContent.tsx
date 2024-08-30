"use client";

import React, { useState, useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaUsers, FaComments, FaUsersCog, FaCubes } from 'react-icons/fa'; // Importation de l'icône FaCubes pour Units
import { Menu } from 'antd';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import { getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";
import Badge from "@/components/Badge";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels"; // Assurez-vous d'importer le bon modèle

export function SidebarContent({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) {
  const [user, setUser] = useState<RegisterUserModel | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser({
            ...userData,
            profileImage: userData.profileImage || '/images/backgrounds/placeholder.jpg',
            role: userData.role || UserRole.USER, // Défaut à 'USER' si role est undefined
          });
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

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

      {/* Space Used Info Section */}
      {!collapsed && (
        <div className="flex flex-col w-full p-4 space-y-2 text-gray-400 bg-gray-700 bg-opacity-20 rounded-lg my-4">
          <h3 className="text-sm font-semibold">Used Space</h3>
          <p className="text-sm">Admin is updated and I am not</p>
        </div>
      )}

      {/* User Info Section */}
      <div className="mt-auto w-full">
        <div className="flex items-center py-6 text-gray-400 border-t border-gray-700 px-6 font-kanit transition-all duration-300">
          {user ? (
            <div className="flex items-center">
              <Image
                src={typeof user.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
                alt="User Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              {!collapsed && (
                <div className="ml-4 flex items-center">
                  <span className="text-lg font-semibold text-white">{user.pseudo}</span>
                  <div className="ml-2">
                    <Badge role={user.role || UserRole.USER} /> {/* Assurez-vous que role est une chaîne */}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-sm">Non connecté</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

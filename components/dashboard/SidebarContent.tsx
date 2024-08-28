import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';

export function SidebarContent() {
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200 font-oxanium" href="#">
        Windmill Dashboard
      </a>
      <ul className="mt-6">
        <li className="relative px-6 py-3">
          <a
            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 font-kanit"
            href="#"
          >
            <AiFillHome className="w-5 h-5" />
            <span className="ml-4">Dashboard</span>
          </a>
        </li>
        <li className="relative px-6 py-3">
          <a
            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 font-kanit"
            href="#"
          >
            <FaUsers className="w-5 h-5" />
            <span className="ml-4">Users</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

import React from 'react';
import { FiBell } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6M5 11a7 7 0 1114 0A7 7 0 015 11z" />
              </svg>
            </div>
            <input
              className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray focus:placeholder-gray-500 dark:focus:shadow-outline-gray dark:bg-gray-700 focus:bg-white dark:focus:bg-white dark:text-gray-200 form-input font-kanit"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative">
            <button className="relative align-middle rounded-md focus:outline-none">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 transform bg-red-600 border-2 border-white rounded-full"></span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

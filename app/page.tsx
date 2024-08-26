"use client";  // Ensure this component is a client component

import React from 'react';
import { Progress } from 'antd';
import { AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineWarning, AiOutlineCloseCircle } from 'react-icons/ai';
import Image from 'next/image';

// Styles based on notification types
const typeStyles = {
  information: {
    container: 'text-white bg-blue-700/50 border-blue-200 shadow-blue-500/50',
    primaryButton: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
    secondaryButton: 'bg-blue-200 hover:bg-blue-300 focus:ring-blue-400',
    iconColor: 'text-blue-600',
    flashBg: 'text-white bg-blue-700/50 border-blue-200 shadow-blue-500/50',
    progressColor: '#1545C7', // Darker blue
    shadow: 'shadow-blue-500/50',
    flashIconBg: 'bg-blue-600 text-white', // Icon background for flash notifications
  },
  success: {
    container: 'text-white bg-green-700/50 border-green-200 shadow-green-500/50',
    primaryButton: 'bg-green-700 hover:bg-green-800 focus:ring-green-500',
    secondaryButton: 'bg-green-200 hover:bg-green-300 focus:ring-green-400',
    iconColor: 'text-green-600',
    flashBg: 'text-white bg-green-700/50 border-green-200 shadow-green-500/50',
    progressColor: '#11B462', // Darker green
    shadow: 'shadow-green-500/50',
    flashIconBg: 'bg-green-600 text-white', // Icon background for flash notifications
  },
  warning: {
    container: 'text-white bg-yellow-700/50 border-yellow-200 shadow-yellow-500/50',
    primaryButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    secondaryButton: 'bg-yellow-200 hover:bg-yellow-300 focus:ring-yellow-400',
    iconColor: 'text-yellow-600',
    flashBg: 'text-white bg-yellow-700/50 border-yellow-200 shadow-yellow-500/50',
    progressColor: '#FFE604', // Darker yellow
    shadow: 'shadow-yellow-500/50',
    flashIconBg: 'bg-yellow-600 text-white', // Icon background for flash notifications
  },
  critical: {
    container: 'text-white bg-red-700/50 border-red-200 shadow-red-500/50',
    primaryButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    secondaryButton: 'bg-red-200 hover:bg-red-300 focus:ring-red-400',
    iconColor: 'text-red-600',
    flashBg: 'text-white bg-red-700/50 border-red-200 shadow-red-500/50',
    progressColor: '#E70E0E', // Darker red
    shadow: 'shadow-red-500/50',
    flashIconBg: 'bg-red-600 text-white', // Icon background for flash notifications
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-kanit">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Existing content */}
      </div>

      {/* Hardcoded NotificationsWithButton */}
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Information NotificationWithButton */}
        <div className={`p-4 ${typeStyles.information.container} border rounded-md shadow-lg ${typeStyles.information.shadow}`}>
          <Progress percent={100} showInfo={false} strokeColor={typeStyles.information.progressColor} className="shadow-blue-500/50" />
          <div className="flex justify-between flex-wrap mt-2">
            <div className="w-0 flex-1 flex">
              <div className="mr-3 pt-1">
                <AiOutlineInfoCircle size={24} className={typeStyles.information.iconColor} />
              </div>
              <div>
                <h4 className="text-md leading-6 font-medium">Information Notification</h4>
                <p className="text-sm">This is an example of an information notification.</p>
                <div className="flex mt-3">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${typeStyles.information.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-2 ${typeStyles.information.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-md focus:outline-none focus:ring-2"
              >
                <AiOutlineCloseCircle size={24} className={typeStyles.information.iconColor} />
              </button>
            </div>
          </div>
        </div>

        {/* Success NotificationWithButton */}
        <div className={`p-4 ${typeStyles.success.container} border rounded-md shadow-lg ${typeStyles.success.shadow}`}>
          <Progress percent={100} showInfo={false} strokeColor={typeStyles.success.progressColor} className="shadow-green-500/50" />
          <div className="flex justify-between flex-wrap mt-2">
            <div className="w-0 flex-1 flex">
              <div className="mr-3 pt-1">
                <AiOutlineCheckCircle size={24} className={typeStyles.success.iconColor} />
              </div>
              <div>
                <h4 className="text-md leading-6 font-medium">Success Notification</h4>
                <p className="text-sm">This is an example of a success notification.</p>
                <div className="flex mt-3">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${typeStyles.success.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-2 ${typeStyles.success.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-md focus:outline-none focus:ring-2"
              >
                <AiOutlineCloseCircle size={24} className={typeStyles.success.iconColor} />
              </button>
            </div>
          </div>
        </div>

        {/* Warning NotificationWithButton */}
        <div className={`p-4 ${typeStyles.warning.container} border rounded-md shadow-lg ${typeStyles.warning.shadow}`}>
          <Progress percent={100} showInfo={false} strokeColor={typeStyles.warning.progressColor} className="shadow-yellow-500/50" />
          <div className="flex justify-between flex-wrap mt-2">
            <div className="w-0 flex-1 flex">
              <div className="mr-3 pt-1">
                <AiOutlineWarning size={24} className={typeStyles.warning.iconColor} />
              </div>
              <div>
                <h4 className="text-md leading-6 font-medium">Warning Notification</h4>
                <p className="text-sm">This is an example of a warning notification.</p>
                <div className="flex mt-3">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${typeStyles.warning.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-2 ${typeStyles.warning.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-md focus:outline-none focus:ring-2"
              >
                <AiOutlineCloseCircle size={24} className={typeStyles.warning.iconColor} />
              </button>
            </div>
          </div>
        </div>

        {/* Critical NotificationWithButton */}
        <div className={`p-4 ${typeStyles.critical.container} border rounded-md shadow-lg ${typeStyles.critical.shadow}`}>
          <Progress percent={100} showInfo={false} strokeColor={typeStyles.critical.progressColor} className="shadow-red-500/50" />
          <div className="flex justify-between flex-wrap mt-2">
            <div className="w-0 flex-1 flex">
              <div className="mr-3 pt-1">
                <AiOutlineCloseCircle size={24} className={typeStyles.critical.iconColor} />
              </div>
              <div>
                <h4 className="text-md leading-6 font-medium">Critical Notification</h4>
                <p className="text-sm">This is an example of a critical notification.</p>
                <div className="flex mt-3">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${typeStyles.critical.primaryButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-2 ${typeStyles.critical.secondaryButton} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm`}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-md focus:outline-none focus:ring-2"
              >
                <AiOutlineCloseCircle size={24} className={typeStyles.critical.iconColor} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hardcoded NotificationFlash */}
      <div className="w-full max-w-4xl mx-auto space-y-4 mt-8">
        {/* Information NotificationFlash */}
        <div className={`p-4 ${typeStyles.information.flashBg} border rounded-md shadow-lg ${typeStyles.information.shadow}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${typeStyles.information.flashIconBg}`}>
              <AiOutlineInfoCircle size={24} className="text-white" />
            </div>
            <div className="w-full ml-4">
              <Progress percent={100} showInfo={false} strokeColor={typeStyles.information.progressColor} className="shadow-blue-500/50" />
              <div className="mt-2">Information Flash Notification</div>
            </div>
            <button>
              <AiOutlineCloseCircle size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Success NotificationFlash */}
        <div className={`p-4 ${typeStyles.success.flashBg} border rounded-md shadow-lg ${typeStyles.success.shadow}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${typeStyles.success.flashIconBg}`}>
              <AiOutlineCheckCircle size={24} className="text-white" />
            </div>
            <div className="w-full ml-4">
              <Progress percent={100} showInfo={false} strokeColor={typeStyles.success.progressColor} className="shadow-green-500/50" />
              <div className="mt-2">Success Flash Notification</div>
            </div>
            <button>
              <AiOutlineCloseCircle size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Warning NotificationFlash */}
        <div className={`p-4 ${typeStyles.warning.flashBg} border rounded-md shadow-lg ${typeStyles.warning.shadow}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${typeStyles.warning.flashIconBg}`}>
              <AiOutlineWarning size={24} className="text-white" />
            </div>
            <div className="w-full ml-4">
              <Progress percent={100} showInfo={false} strokeColor={typeStyles.warning.progressColor} className="shadow-yellow-500/50" />
              <div className="mt-2">Warning Flash Notification</div>
            </div>
            <button>
              <AiOutlineCloseCircle size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Critical NotificationFlash */}
        <div className={`p-4 ${typeStyles.critical.flashBg} border rounded-md shadow-lg ${typeStyles.critical.shadow}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${typeStyles.critical.flashIconBg}`}>
              <AiOutlineCloseCircle size={24} className="text-white" />
            </div>
            <div className="w-full ml-4">
              <Progress percent={100} showInfo={false} strokeColor={typeStyles.critical.progressColor} className="shadow-red-500/50" />
              <div className="mt-2">Critical Flash Notification</div>
            </div>
            <button>
              <AiOutlineCloseCircle size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}

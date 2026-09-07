"use client";

import React from "react";
import { ConfigProvider } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import enUS from "antd/lib/locale/en_US";
import { useLocale } from "next-intl";
import "antd/dist/reset.css";
import ClientLayout from "@/components/ClientLayout";
import CookieConsent from "@/components/CookieConsent";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { LoadingProvider } from "@/components/LoadingContext";
import { FooterProvider } from "@/context/FooterContext";
import { ColorProvider } from "@/context/ColorContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return (
    <ConfigProvider locale={locale === "en" ? enUS : frFR}>
      <LoadingProvider>
        <NotificationProvider>
          <ColorProvider>
            <FooterProvider>
              <ClientLayout>
                <CookieConsent />
                {children}
              </ClientLayout>
            </FooterProvider>
          </ColorProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ConfigProvider>
  );
}

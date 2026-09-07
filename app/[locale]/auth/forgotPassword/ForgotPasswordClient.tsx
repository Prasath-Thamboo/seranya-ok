"use client";

import { Form, Input } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { generateResetToken } from "@/lib/queries/AuthQueries";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addNotification } = useNotification();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await generateResetToken(values.email);
      setSent(true);
    } catch (error) {
      addNotification("critical", t("forgotPassword.sendError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-page font-sans text-ink">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-line bg-raised px-8 py-9 shadow-md">
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya"
              width={156}
              height={56}
              className="mx-auto cursor-pointer transition-opacity hover:opacity-80"
            />
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mb-4 text-5xl text-accent">✓</div>
            <h1 className="mb-2 text-center font-serif text-2xl font-medium text-ink">{t("forgotPassword.sentTitle")}</h1>
            <p className="mb-8 font-sans text-sm text-ink-soft">
              {t("forgotPassword.sentBody")}
            </p>
            <Link
              href="/auth/login"
              className="inline-block rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert transition-colors hover:bg-accent-hover"
            >
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-center font-serif text-2xl font-medium text-ink">{t("forgotPassword.title")}</h1>
            <p className="mb-6 text-center font-sans text-sm text-ink-muted">
              {t("forgotPassword.subtitle")}
            </p>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<span className="font-sans text-sm text-ink-soft">{t("fields.email")}</span>}
                name="email"
                rules={[
                  { required: true, message: t("forgotPassword.emailRequired") },
                  { type: "email", message: t("forgotPassword.emailInvalid") },
                ]}
              >
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="custom-input"
                  style={{ height: "2.75rem", borderRadius: "0.75rem" }}
                />
              </Form.Item>

              <Form.Item className="mb-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover"
                >
                  <FiSend className="h-5 w-5" />
                  {loading ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
                </button>
              </Form.Item>
            </Form>

            <div className="mt-2 border-t border-line pt-4 text-center">
              <Link href="/auth/login" className="font-sans text-sm text-accent transition-colors hover:text-accent-hover">
                {t("backToLogin")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

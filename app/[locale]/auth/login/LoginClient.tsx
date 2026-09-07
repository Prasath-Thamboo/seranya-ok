"use client";

import { Form, Input, Checkbox } from "antd";
import Image from "next/image";
import { CgLogIn } from "react-icons/cg";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { loginUser, getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { useEffect, useState } from "react";
import { useNotification } from "@/components/notifications/NotificationProvider";


export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const [form] = Form.useForm(); // Hook pour gérer le formulaire

  useEffect(() => {
    if (!getAccessToken()) return;

    fetchCurrentUser()
      .then(() => router.replace("/"))
      .catch(() => {
        // Token présent mais invalide/expiré : on reste sur /login
        // (fetchCurrentUser a déjà nettoyé le token invalide du localStorage)
      });
  }, [router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values);

      if (response && response.token) {
        localStorage.setItem("access_token", response.token);
        addNotification("success", t("login.success"));
        router.push("/");
      } else {
        throw new Error("Token non fourni ou réponse incorrecte");
      }
    } catch (error) {
      console.error("Error during login:", error);
      addNotification("critical", t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-page lg:flex-row">
      {/* Image */}
      <div className="absolute inset-0 lg:relative lg:inset-auto lg:h-full lg:w-2/3 lg:flex-shrink-0">
        <Image
          src="/images/backgrounds/seranyayoga1.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/10 via-transparent to-page lg:block" />
        <div className="absolute inset-0 bg-page/70 lg:hidden" />
      </div>

      {/* Formulaire */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-4 py-10 lg:w-1/3 lg:flex-shrink-0 lg:bg-page">
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-line bg-raised px-8 py-9 shadow-md lg:mx-0 lg:border-0 lg:bg-transparent lg:shadow-none">
          <div className="mb-5">
            <Link href="/">
              <Image
                src="/logos/seranyaicon.png"
                alt="Seranya"
                width={172}
                height={62}
                className="mx-auto cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
          </div>

          <h1 className="mb-2 text-center font-serif text-3xl font-medium text-ink">{t("login.title")}</h1>
          <p className="mb-6 text-center font-sans text-sm text-ink-muted">{t("login.subtitle")}</p>

          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label={<span className="font-sans text-sm text-ink-soft">{t("fields.email")}</span>}
              name="email"
              rules={[{ required: true, message: t("login.emailRequired") }]}
            >
              <Input
                type="email"
                placeholder="votre@email.com"
                className="custom-input"
                style={{ height: "2.75rem", borderRadius: "0.75rem" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-sans text-sm text-ink-soft">{t("fields.password")}</span>}
              name="password"
              rules={[{ required: true, message: t("login.passwordRequired") }]}
            >
              <Input.Password
                placeholder="••••••••"
                className="custom-input"
                style={{ height: "2.75rem", borderRadius: "0.75rem" }}
              />
            </Form.Item>

            <div className="mb-2 flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <Checkbox className="font-sans text-sm text-ink-soft">{t("login.rememberMe")}</Checkbox>
              </Form.Item>
              <Link href="/auth/forgotPassword" className="font-sans text-sm text-accent transition-colors hover:text-accent-hover">
                {t("login.forgotPassword")}
              </Link>
            </div>

            <Form.Item className="mb-4 mt-6">
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover"
                type="submit"
                disabled={loading}
              >
                <CgLogIn className="h-5 w-5" />
                {loading ? t("login.submitting") : t("login.submit")}
              </button>
            </Form.Item>

            <div className="border-t border-line pt-6 text-center">
              <span className="font-sans text-sm text-ink-soft">
                {t("login.noAccount")}{" "}
                <Link href="/auth/register" className="font-medium text-accent transition-colors hover:text-accent-hover">
                  {t("login.createAccount")}
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

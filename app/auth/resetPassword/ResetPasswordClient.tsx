"use client";

import { Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { resetPassword } from "@/lib/queries/AuthQueries";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Utiliser Suspense pour gérer le rendu de `useSearchParams`
  const SearchParamsComponent = () => {
    const searchParams = useSearchParams();
    useEffect(() => {
      if (searchParams) {
        const token = searchParams.get("token");
        setResetToken(token);
      }
    }, [searchParams]);

    return null; // Ce composant n'affiche rien, il sert uniquement à récupérer les params
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get("/api/getRandomImage");
        setBackgroundImage(response.data.imagePath);
      } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
      }
    };

    fetchRandomImage();
  }, []);

  const onFinish = async (values: any) => {
    if (!resetToken) {
      addNotification("critical", "Token de réinitialisation manquant");
      return;
    }
  
    if (values.newPassword !== values.confirmPassword) {
      addNotification("critical", "Les mots de passe ne correspondent pas.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await resetPassword({
        newPassword: values.newPassword,
        resetToken,
      });

      if (response) {
        addNotification("success", "Mot de passe réinitialisé avec succès !");
        router.push("/auth/login");
      }
    } catch (error) {
      addNotification(
        "critical",
        "Erreur lors de la réinitialisation. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-page font-sans text-ink lg:flex-row">
      <div className="relative h-64 w-full lg:h-screen lg:w-2/3">
        {backgroundImage && (
          <Image src={backgroundImage} alt="" fill style={{ objectFit: "cover" }} />
        )}
        <div className="absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-page to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-page lg:hidden" />
      </div>

      <div className="flex h-auto w-full items-center justify-center lg:h-screen lg:w-1/3">
        <div className="w-full max-w-md p-8">
          <div className="mb-6">
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
          <h1 className="mb-8 text-center font-serif text-3xl font-medium text-ink">
            Réinitialiser le mot de passe
          </h1>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className="font-sans text-sm text-ink-soft">Nouveau mot de passe</span>}
              name="newPassword"
              rules={[{ required: true, message: "Veuillez entrer un nouveau mot de passe !" }]}
            >
              <Input.Password
                placeholder="Nouveau mot de passe"
                className="custom-input"
                style={{ height: "3rem", borderRadius: "0.75rem" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-sans text-sm text-ink-soft">Confirmer le mot de passe</span>}
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Veuillez confirmer votre mot de passe !" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Les mots de passe ne correspondent pas !"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirmer le mot de passe"
                className="custom-input"
                style={{ height: "3rem", borderRadius: "0.75rem" }}
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover disabled:opacity-60"
              >
                {loading ? "Réinitialisation…" : "Réinitialiser le mot de passe"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* Ajout de Suspense pour encapsuler le composant qui utilise `useSearchParams` */}
      <Suspense fallback={<div>Loading params...</div>}>
        <SearchParamsComponent />
      </Suspense>
    </div>
  );
}

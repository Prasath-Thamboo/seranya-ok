"use client";

import { Form, Input, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import { useNotification } from "@/components/notifications/NotificationProvider";

const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_LOCAL;

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
      const response = await axios.post(`${backendUrl}/auth/reset-password`, {
        newPassword: values.newPassword,
        resetToken,
      });
  
      if (response && response.data) {
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
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <div className="relative w-full lg:w-2/3 h-64 lg:h-screen">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            className="lg:block"
          />
        )}
        <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-white/90 to-transparent"></div>
      </div>

      <div className="flex w-full lg:w-1/3 h-auto lg:h-screen justify-center items-center bg-white">
        <div className="max-w-md w-full text-black p-8">
          <h1 className="text-4xl font-bold mb-8 text-center font-oxanium uppercase text-black">
            Réinitialiser le mot de passe
          </h1>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="font-kanit"
          >
            <Form.Item
              label={<span className="text-black font-kanit">Nouveau mot de passe</span>}
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer un nouveau mot de passe !",
                },
              ]}
            >
              <Input.Password
                placeholder="Nouveau mot de passe"
                className="custom-input bg-white text-black font-kanit"
                style={{ height: "3rem" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-black font-kanit">Confirmer le mot de passe</span>}
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Veuillez confirmer votre mot de passe !",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Les mots de passe ne correspondent pas !")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirmer le mot de passe"
                className="custom-input bg-white text-black font-kanit"
                style={{ height: "3rem" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-black text-white font-kanit uppercase font-bold"
                loading={loading}
              >
                Réinitialiser le mot de passe
              </Button>
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

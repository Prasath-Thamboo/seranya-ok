"use client";

import { Form, Input, Button, Checkbox } from "antd";
import Image from "next/image";
import { CgLogIn } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/queries/AuthQueries";
import { useState } from "react";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { metadata } from "./metadata";


export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const [form] = Form.useForm(); // Hook pour gérer le formulaire

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values);

      if (response && response.token) {
        localStorage.setItem("access_token", response.token);
        addNotification("success", "Connexion réussie!");
        router.push("/");
      } else {
        throw new Error("Token non fourni ou réponse incorrecte");
      }
    } catch (error) {
      console.error("Error during login:", error);
      addNotification(
        "critical",
        "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative flex flex-col lg:flex-row">
      {/* Background image section */}
      <div className="absolute inset-0 lg:relative lg:inset-auto lg:w-2/3 lg:h-full lg:flex-shrink-0">
        <Image
          src="/images/backgrounds/seranyayoga1.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/90 hidden lg:block" />
        <div className="absolute inset-0 bg-black/65 lg:hidden" />
      </div>

      {/* Login form section */}
      <div className="relative z-10 flex flex-1 lg:w-1/3 lg:flex-shrink-0 overflow-hidden justify-center items-center lg:bg-black">
        <div className="max-w-sm w-full text-white px-8 py-8 mx-4 lg:mx-0 bg-black/50 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-2xl lg:rounded-none border border-white/10 lg:border-0">
          {/* Logo */}
          <div className="mb-4">
            <Link href="/">
              <Image
                src="/logos/seranyaicon.png"
                alt="Seranya Logo"
                width={180}
                height={65}
                className="mx-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center font-iceberg uppercase tracking-widest text-white">
            Connexion
          </h1>
          <p className="text-gray-400 text-sm text-center font-kanit mb-5">
            Bienvenue dans votre espace
          </p>

          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label={<span className="text-gray-300 font-kanit text-sm">Email</span>}
              name="email"
              rules={[{ required: true, message: "Veuillez entrer votre email!" }]}
            >
              <Input
                type="email"
                placeholder="votre@email.com"
                className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                style={{ height: "2.75rem", borderRadius: "0.375rem" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-300 font-kanit text-sm">Mot de passe</span>}
              name="password"
              rules={[{ required: true, message: "Veuillez entrer votre mot de passe!" }]}
            >
              <Input.Password
                placeholder="••••••••"
                className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400"
                style={{ height: "2.75rem", borderRadius: "0.375rem" }}
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-2">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <Checkbox className="text-gray-400 font-kanit text-sm">Se souvenir de moi</Checkbox>
              </Form.Item>
              <Link href="/auth/resetPassword" className="text-green-400 hover:text-green-300 text-sm font-kanit transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <Form.Item className="mt-6 mb-4">
              <button
                className="w-full h-12 font-iceberg uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 rounded-md transition-all duration-200 bg-green-500 text-white hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                type="submit"
                disabled={loading}
              >
                <CgLogIn className="w-5 h-5" />
                {loading ? "Connexion..." : "Connexion"}
              </button>
            </Form.Item>

            <div className="text-center border-t border-gray-800 pt-6">
              <span className="text-gray-400 font-kanit text-sm">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-green-400 hover:text-green-300 transition-colors font-semibold">
                  Créer un compte
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

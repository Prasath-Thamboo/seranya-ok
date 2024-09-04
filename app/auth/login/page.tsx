"use client";

import { Form, Input, Button, Checkbox } from "antd";
import Image from "next/image";
import { CgLogIn } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/queries/AuthQueries";
import { useState } from "react";
import { useNotification } from "@/components/notifications/NotificationProvider";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

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
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Background image section */}
      <div className="relative w-full lg:w-2/3 h-64 lg:h-screen">
        <Image
          src="/images/backgrounds/THEDarkSlayer.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          className="lg:block"
        />
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black/90 to-transparent"></div>
      </div>

      {/* Login form section */}
      <div className="flex w-full lg:w-1/3 h-auto lg:h-screen justify-center items-center bg-black">
        <div className="max-w-md w-full text-white p-8">
          <h1 className="text-4xl font-bold mb-8 text-center font-oxanium uppercase text-white">
            Connexion
          </h1>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label={<span className="text-white font-kanit">Email</span>}
              name="email"
              rules={[{ required: true, message: "Veuillez entrer votre email!" }]}
            >
              <Input
                type="email"
                placeholder="Email"
                className="custom-input bg-white text-black font-kanit"
                style={{ height: "3rem" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white font-kanit">Mot de passe</span>}
              name="password"
              rules={[{ required: true, message: "Veuillez entrer votre mot de passe!" }]}
            >
              <Input.Password
                placeholder="Mot de passe"
                className="custom-input bg-white text-black font-kanit"
                style={{ height: "3rem" }}
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className="text-white font-kanit">Se souvenir de moi</Checkbox>
              </Form.Item>
            </div>

            <Form.Item className="flex justify-center mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-white text-black font-kanit text-lg py-3 px-10 flex items-center justify-center border border-white uppercase font-bold"
                icon={<CgLogIn className="mr-2 w-6 h-6" />}
                loading={loading}
              >
                Connexion
              </Button>
            </Form.Item>

            <div className="mt-8 text-center">
              <span className="text-white font-kanit">
                <Link href="/auth/register" className="text-white hover:text-gray-300">
                  Créer un compte
                </Link>
                {" | "}
                <Link href="/forgot-password" className="text-white hover:text-gray-300">
                  Mot de passe oublié?
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

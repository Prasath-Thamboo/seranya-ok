"use client";

import { Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { generateResetToken } from "@/lib/queries/AuthQueries";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addNotification } = useNotification();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await generateResetToken(values.email);
      setSent(true);
    } catch (error) {
      addNotification(
        "critical",
        "Erreur lors de l'envoi. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="max-w-md w-full text-white px-8 py-8 mx-4">
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya Logo"
              width={160}
              height={58}
              className="mx-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2 text-center font-iceberg uppercase tracking-widest text-white">
              Email envoyé
            </h1>
            <p className="text-gray-400 font-kanit text-sm mb-8">
              Si cet email est enregistré, un lien de réinitialisation vient de lui être envoyé. Vérifiez votre boîte de réception (et vos spams).
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-3 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2 text-center font-iceberg uppercase tracking-widest text-white">
              Mot de passe oublié
            </h1>
            <p className="text-gray-400 text-sm text-center font-kanit mb-6">
              Indiquez votre email pour recevoir un lien de réinitialisation.
            </p>

            <Form layout="vertical" onFinish={onFinish} className="font-kanit">
              <Form.Item
                label={<span className="text-gray-300 font-kanit text-sm">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Veuillez entrer votre email !" },
                  { type: "email", message: "Email invalide." },
                ]}
              >
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                  style={{ height: "2.75rem", borderRadius: "0.375rem" }}
                />
              </Form.Item>

              <Form.Item className="mt-4 mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-iceberg uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 rounded-md transition-all duration-200 bg-green-500 text-white hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                >
                  <FiSend className="w-5 h-5" />
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </button>
              </Form.Item>
            </Form>

            <div className="text-center border-t border-gray-800 pt-4 mt-2">
              <Link href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors font-kanit text-sm">
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { Form, Input, Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { CgUserAdd } from 'react-icons/cg';
import { useState } from 'react';
import { registerUser } from '@/lib/queries/AuthQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        pseudo: values.pseudo,
        email: values.email,
        password: values.password,
        phone: values.phone,
      } as RegisterUserModel);
      setSuccess(true);
    } catch (error) {
      setError('Inscription échouée. Veuillez réessayer.');
      console.error('Failed to register:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="max-w-md w-full text-center px-8">
          <Image src="/logos/seranyaicon.png" alt="Seranya" width={160} height={60} className="mx-auto mb-6" />
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-iceberg uppercase tracking-widest text-white mb-3">Inscription réussie !</h2>
          <p className="text-gray-400 font-kanit text-sm mb-8">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien dans votre email pour activer votre compte.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row">
      {/* Background image section */}
      <div className="relative w-full lg:w-1/2 h-36 lg:h-full flex-shrink-0">
        <Image
          src="/images/backgrounds/seranyayoga.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/90 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 lg:hidden" />
      </div>

      {/* Register form section */}
      <div className="flex flex-1 lg:w-1/2 lg:flex-shrink-0 overflow-hidden justify-center items-center bg-black">
        <div className="max-w-md w-full text-white px-8 py-6">
          {/* Logo */}
          <div className="mb-4">
            <Link href="/">
              <Image src="/logos/seranyaicon.png" alt="Seranya Logo" width={160} height={58} className="mx-auto hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-center font-iceberg uppercase tracking-widest text-white">
            Inscription
          </h1>
          <p className="text-gray-400 text-sm text-center font-kanit mb-5">
            Créez votre espace Seranya
          </p>

          <Form name="register" onFinish={onFinish} layout="vertical">
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label={<span className="text-gray-300 font-kanit text-sm">Pseudo</span>}
                name="pseudo"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input
                  placeholder="VotrePseudo"
                  className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                  style={{ height: '2.5rem', borderRadius: '0.375rem' }}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-300 font-kanit text-sm">Téléphone</span>}
                name="phone"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input
                  placeholder="+33 6 00 00 00 00"
                  className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                  style={{ height: '2.5rem', borderRadius: '0.375rem' }}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-300 font-kanit text-sm">Email</span>}
                name="email"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                  style={{ height: '2.5rem', borderRadius: '0.375rem' }}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-300 font-kanit text-sm">Mot de passe</span>}
                name="password"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input.Password
                  placeholder="••••••••"
                  className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400"
                  style={{ height: '2.5rem', borderRadius: '0.375rem' }}
                />
              </Form.Item>
            </div>

            {error && <p className="text-red-400 font-kanit text-sm mb-3">{error}</p>}

            <Form.Item className="mt-4 mb-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-iceberg uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 rounded-md transition-all duration-200 bg-green-500 text-white hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
              >
                <CgUserAdd className="w-5 h-5" />
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </Form.Item>

            <div className="text-center border-t border-gray-800 pt-4">
              <span className="text-gray-400 font-kanit text-sm">
                Déjà inscrit ?{' '}
                <Link href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors font-semibold">
                  Se connecter
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

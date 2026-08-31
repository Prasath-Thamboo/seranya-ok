"use client";

import { Form, Input } from 'antd';
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
      } as RegisterUserModel);
      setSuccess(true);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Inscription échouée. Veuillez réessayer.');
      console.error('Failed to register:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-page font-sans text-ink">
        <div className="w-full max-w-md px-8 text-center">
          <Image src="/logos/seranyaicon.png" alt="Seranya" width={156} height={58} className="mx-auto mb-6" />
          <div className="mb-4 text-5xl text-accent">✓</div>
          <h2 className="mb-3 font-serif text-2xl font-medium text-ink">Inscription réussie</h2>
          <p className="mb-8 font-sans text-sm text-ink-soft">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert transition-colors hover:bg-accent-hover"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-page lg:flex-row">
      {/* Image */}
      <div className="absolute inset-0 lg:relative lg:inset-auto lg:h-full lg:w-1/2 lg:flex-shrink-0">
        <Image src="/images/backgrounds/seranyayoga.jpg" alt="" fill style={{ objectFit: 'cover' }} priority />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/10 via-transparent to-page lg:block" />
        <div className="absolute inset-0 bg-page/70 lg:hidden" />
      </div>

      {/* Formulaire */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-4 py-10 lg:w-1/2 lg:flex-shrink-0 lg:bg-page">
        <div className="mx-4 w-full max-w-md rounded-2xl border border-line bg-raised px-8 py-9 shadow-md lg:mx-0 lg:border-0 lg:bg-transparent lg:shadow-none">
          <div className="mb-5">
            <Link href="/">
              <Image src="/logos/seranyaicon.png" alt="Seranya" width={156} height={56} className="mx-auto cursor-pointer transition-opacity hover:opacity-80" />
            </Link>
          </div>

          <h1 className="mb-2 text-center font-serif text-3xl font-medium text-ink">Inscription</h1>
          <p className="mb-6 text-center font-sans text-sm text-ink-muted">Créez votre espace Seranya</p>

          <Form name="register" onFinish={onFinish} layout="vertical">
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label={<span className="font-sans text-sm text-ink-soft">Pseudo</span>}
                name="pseudo"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input placeholder="VotrePseudo" className="custom-input" style={{ height: '2.5rem', borderRadius: '0.75rem' }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-sans text-sm text-ink-soft">Email</span>}
                name="email"
                rules={[{ required: true, message: 'Requis' }]}
                className="mb-3"
              >
                <Input type="email" placeholder="votre@email.com" className="custom-input" style={{ height: '2.5rem', borderRadius: '0.75rem' }} />
              </Form.Item>

              <Form.Item
                label={<span className="font-sans text-sm text-ink-soft">Mot de passe</span>}
                name="password"
                rules={[
                  { required: true, message: 'Le mot de passe est requis.' },
                  { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères.' },
                ]}
                className="col-span-2 mb-3"
              >
                <Input.Password placeholder="••••••••" className="custom-input" style={{ height: '2.5rem', borderRadius: '0.75rem' }} />
              </Form.Item>
            </div>

            {error && <p className="mb-3 font-sans text-sm text-danger">{error}</p>}

            <Form.Item className="mb-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover"
              >
                <CgUserAdd className="h-5 w-5" />
                {loading ? 'Inscription…' : "S'inscrire"}
              </button>
            </Form.Item>

            <div className="border-t border-line pt-4 text-center">
              <span className="font-sans text-sm text-ink-soft">
                Déjà inscrit ?{' '}
                <Link href="/auth/login" className="font-medium text-accent transition-colors hover:text-accent-hover">
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

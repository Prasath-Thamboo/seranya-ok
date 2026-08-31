"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LuSend, LuMail, LuMessageSquare, LuTag } from 'react-icons/lu';
import { useNotification } from '@/components/notifications/NotificationProvider';
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";

const { TextArea } = Input;

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function ContactPage() {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRandomBackground()
      .then(setBackgroundImage)
      .catch(() => setBackgroundImage('/images/backgrounds/placeholder.jpg'));
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/mailer/contact`, values);
      addNotification('success', 'Votre message a été envoyé avec succès !');
      form.resetFields();
    } catch {
      addNotification('critical', "Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  const label = (icon: React.ReactNode, text: string) => (
    <span className="flex items-center gap-2 font-sans text-sm text-ink-soft">
      {icon} {text}
    </span>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-page font-sans text-ink">
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Panneau gauche — infos */}
        <motion.div
          className="flex flex-col justify-center px-10 py-24 lg:w-2/5 lg:border-r lg:border-line"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p variants={fadeUp} className="mb-3 text-xs font-sans uppercase tracking-[0.22em] text-accent">
            Contact
          </motion.p>
          <motion.h1 variants={fadeUp} className="mb-6 font-serif text-4xl font-medium leading-tight text-ink lg:text-5xl">
            Parlons-nous
          </motion.h1>
          <motion.p variants={fadeUp} className="mb-12 max-w-sm text-base leading-relaxed text-ink-soft">
            Un problème technique, une question sur l&apos;univers Seranya, ou simplement une idée à
            partager ? Nous vous répondrons dans les plus brefs délais.
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: <LuMail className="h-5 w-5 text-accent" />, label: 'Email', value: 'contact@seranya-blog.com' },
              { icon: <LuMessageSquare className="h-5 w-5 text-accent" />, label: 'Réponse', value: 'Sous 24 heures' },
            ].map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-raised">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.18em] text-ink-muted">{item.label}</p>
                  <p className="text-sm text-ink">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panneau droit — formulaire */}
        <motion.div
          className="flex flex-1 items-center justify-center bg-sunken px-8 py-24 lg:px-16"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="w-full max-w-lg">
            <motion.h2 variants={fadeUp} className="mb-8 font-serif text-2xl font-medium text-ink">
              Envoyer un message
            </motion.h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <motion.div variants={fadeUp}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Requis' }, { type: 'email', message: 'Email invalide' }]}
                  label={label(<LuMail className="h-4 w-4 text-accent" />, 'Email')}
                >
                  <Input
                    placeholder="votre@email.com"
                    className="custom-input"
                    style={{ height: '2.75rem', borderRadius: '0.75rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="subject"
                  rules={[{ required: true, message: 'Requis' }]}
                  label={label(<LuTag className="h-4 w-4 text-accent" />, 'Sujet')}
                >
                  <Input
                    placeholder="De quoi s'agit-il ?"
                    className="custom-input"
                    style={{ height: '2.75rem', borderRadius: '0.75rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Requis' }]}
                  label={label(<LuMessageSquare className="h-4 w-4 text-accent" />, 'Message')}
                >
                  <TextArea
                    rows={6}
                    placeholder="Décrivez votre question ou votre message…"
                    className="custom-input"
                    style={{ borderRadius: '0.75rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover disabled:opacity-60"
                >
                  <LuSend className="h-4 w-4" />
                  {loading ? 'Envoi…' : 'Envoyer'}
                </button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

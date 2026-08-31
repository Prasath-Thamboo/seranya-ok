"use client";

import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LuSend, LuMail, LuUser, LuShield, LuFileText } from 'react-icons/lu';
import { useNotification } from '@/components/notifications/NotificationProvider';

const { TextArea } = Input;

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const REQUEST_TYPES = [
  { value: 'Accès', label: "Accès à mes données" },
  { value: 'Rectification', label: 'Rectification de mes données' },
  { value: 'Suppression', label: 'Suppression de mes données' },
  { value: 'Opposition', label: 'Opposition au traitement' },
  { value: 'Portabilité', label: 'Portabilité de mes données' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function RgpdRequestPage() {
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/mailer/data-request`, values);
      addNotification('success', 'Votre demande a été envoyée avec succès ! Un email de confirmation vous a été adressé.');
      form.resetFields();
    } catch {
      addNotification('critical', "Erreur lors de l'envoi de votre demande.");
    } finally {
      setLoading(false);
    }
  };

  const label = (icon: React.ReactNode, text: string) => (
    <span className="flex items-center gap-2 font-sans text-sm text-ink-soft">{icon} {text}</span>
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
            Données personnelles
          </motion.p>
          <motion.h1 variants={fadeUp} className="mb-6 font-serif text-4xl font-medium leading-tight text-ink lg:text-5xl">
            Exercer vos droits
          </motion.h1>
          <motion.p variants={fadeUp} className="mb-8 max-w-sm text-base leading-relaxed text-ink-soft">
            Conformément au RGPD, vous pouvez à tout moment demander l&apos;accès, la rectification, la
            suppression, la portabilité de vos données ou vous opposer à leur traitement. Nous nous
            engageons à répondre dans un délai maximum d&apos;un mois.
          </motion.p>

          <div className="mb-10 space-y-6">
            {[
              { icon: <LuShield className="h-5 w-5 text-accent" />, label: 'Délai de réponse', value: '1 mois maximum' },
              { icon: <LuMail className="h-5 w-5 text-accent" />, label: 'Contact DPO', value: 'contact@seranya-blog.com' },
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

          <motion.p variants={fadeUp} className="max-w-sm text-xs leading-relaxed text-ink-muted">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
            auprès de la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">cnil.fr</a>).
            Voir aussi notre <a href="/confidentialite" className="text-accent hover:underline">politique de confidentialité</a> et nos{" "}
            <a href="/mentions" className="text-accent hover:underline">mentions légales</a>.
          </motion.p>
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
              Formulaire de demande
            </motion.h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <motion.div variants={fadeUp}>
                <Form.Item name="name" rules={[{ required: true, message: 'Requis' }]} label={label(<LuUser className="h-4 w-4 text-accent" />, 'Nom complet')}>
                  <Input placeholder="Votre nom et prénom" className="custom-input" style={{ height: '2.75rem', borderRadius: '0.75rem' }} />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Requis' }, { type: 'email', message: 'Email invalide' }]}
                  label={label(<LuMail className="h-4 w-4 text-accent" />, 'Email associé à votre compte')}
                >
                  <Input placeholder="votre@email.com" className="custom-input" style={{ height: '2.75rem', borderRadius: '0.75rem' }} />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item name="requestType" rules={[{ required: true, message: 'Requis' }]} label={label(<LuShield className="h-4 w-4 text-accent" />, 'Type de demande')}>
                  <Select
                    placeholder="Choisissez le droit que vous souhaitez exercer"
                    className="custom-select"
                    style={{ height: '2.75rem' }}
                    options={REQUEST_TYPES}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item name="message" rules={[{ required: true, message: 'Requis' }]} label={label(<LuFileText className="h-4 w-4 text-accent" />, 'Détails de votre demande')}>
                  <TextArea
                    rows={6}
                    placeholder="Précisez votre demande (données concernées, contexte…)"
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
                  {loading ? 'Envoi…' : 'Envoyer ma demande'}
                </button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

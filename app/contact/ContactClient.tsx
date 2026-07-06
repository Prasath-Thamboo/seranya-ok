"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiMessageSquare, FiTag } from 'react-icons/fi';
import { useNotification } from '@/components/notifications/NotificationProvider';
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";

const { TextArea } = Input;

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
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

  return (
    <div className="relative min-h-screen bg-black text-white font-kanit overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-20"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* Panneau gauche — infos */}
        <motion.div
          className="flex flex-col justify-center px-10 py-20 lg:w-2/5 lg:border-r border-gray-800"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p variants={fadeUp} className="text-green-400 font-iceberg uppercase tracking-widest text-sm mb-3">
            Contact
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-iceberg uppercase tracking-wide text-white mb-6 leading-tight">
            Parlons-nous
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-base leading-relaxed mb-12 max-w-sm">
            Un problème technique, une question sur l&apos;univers Seranya, ou simplement une idée à partager ? Nous vous répondrons dans les plus brefs délais.
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: <FiMail className="w-5 h-5 text-green-400" />, label: 'Email', value: 'contact@seranya.fr' },
              { icon: <FiMessageSquare className="w-5 h-5 text-green-400" />, label: 'Réponse', value: 'Sous 24 heures' },
            ].map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-iceberg">{item.label}</p>
                  <p className="text-white text-sm">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panneau droit — formulaire */}
        <motion.div
          className="flex items-center justify-center flex-1 px-8 py-20 lg:px-16"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="w-full max-w-lg">
            <motion.h2 variants={fadeUp} className="text-2xl font-iceberg uppercase tracking-wide text-white mb-8">
              Envoyer un message
            </motion.h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <motion.div variants={fadeUp}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Requis' }, { type: 'email', message: 'Email invalide' }]}
                  label={
                    <span className="flex items-center gap-2 text-gray-300 font-kanit text-sm">
                      <FiMail className="w-4 h-4 text-green-400" /> Email
                    </span>
                  }
                >
                  <Input
                    placeholder="votre@email.com"
                    className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                    style={{ height: '2.75rem', borderRadius: '0.375rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="subject"
                  rules={[{ required: true, message: 'Requis' }]}
                  label={
                    <span className="flex items-center gap-2 text-gray-300 font-kanit text-sm">
                      <FiTag className="w-4 h-4 text-green-400" /> Sujet
                    </span>
                  }
                >
                  <Input
                    placeholder="De quoi s'agit-il ?"
                    className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400"
                    style={{ height: '2.75rem', borderRadius: '0.375rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Requis' }]}
                  label={
                    <span className="flex items-center gap-2 text-gray-300 font-kanit text-sm">
                      <FiMessageSquare className="w-4 h-4 text-green-400" /> Message
                    </span>
                  }
                >
                  <TextArea
                    rows={6}
                    placeholder="Décrivez votre question ou votre message..."
                    className="custom-input bg-gray-900 text-white font-kanit border-gray-700 hover:border-green-400 focus:border-green-400 resize-none"
                    style={{ borderRadius: '0.375rem' }}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95 disabled:opacity-60"
                >
                  <FiSend className="w-4 h-4" />
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

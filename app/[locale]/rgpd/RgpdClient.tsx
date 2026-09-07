"use client";

import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LuSend, LuMail, LuUser, LuShield, LuFileText } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useNotification } from '@/components/notifications/NotificationProvider';

const { TextArea } = Input;

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const REQUEST_TYPE_KEYS = [
  { value: 'Accès', key: 'access' },
  { value: 'Rectification', key: 'rectification' },
  { value: 'Suppression', key: 'deletion' },
  { value: 'Opposition', key: 'objection' },
  { value: 'Portabilité', key: 'portability' },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function RgpdRequestPage() {
  const t = useTranslations('rgpd');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/mailer/data-request`, values);
      addNotification('success', t('success'));
      form.resetFields();
    } catch {
      addNotification('critical', t('error'));
    } finally {
      setLoading(false);
    }
  };

  const label = (icon: React.ReactNode, text: string) => (
    <span className="flex items-center gap-2 font-sans text-sm text-ink-soft">{icon} {text}</span>
  );

  const requestTypes = REQUEST_TYPE_KEYS.map((r) => ({
    value: r.value,
    label: t(`types.${r.key}`),
  }));

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
            {t('eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="mb-6 font-serif text-4xl font-medium leading-tight text-ink lg:text-5xl">
            {t('title')}
          </motion.h1>
          <motion.p variants={fadeUp} className="mb-8 max-w-sm text-base leading-relaxed text-ink-soft">
            {t('intro')}
          </motion.p>

          <div className="mb-10 space-y-6">
            {[
              { icon: <LuShield className="h-5 w-5 text-accent" />, label: t('responseTimeLabel'), value: t('responseTimeValue') },
              { icon: <LuMail className="h-5 w-5 text-accent" />, label: t('dpoContactLabel'), value: 'contact@seranya-blog.com' },
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
            {t.rich('cnilNotice', {
              cnil: (chunks) => (
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  {chunks}
                </a>
              ),
              privacy: (chunks) => (
                <Link href="/confidentialite" className="text-accent hover:underline">{chunks}</Link>
              ),
              legal: (chunks) => (
                <Link href="/mentions" className="text-accent hover:underline">{chunks}</Link>
              ),
            })}
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
              {t('formTitle')}
            </motion.h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <motion.div variants={fadeUp}>
                <Form.Item name="name" rules={[{ required: true, message: t('required') }]} label={label(<LuUser className="h-4 w-4 text-accent" />, t('nameLabel'))}>
                  <Input placeholder={t('namePlaceholder')} className="custom-input" style={{ height: '2.75rem', borderRadius: '0.75rem' }} />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: t('required') }, { type: 'email', message: t('emailInvalid') }]}
                  label={label(<LuMail className="h-4 w-4 text-accent" />, t('emailLabel'))}
                >
                  <Input placeholder={t('emailPlaceholder')} className="custom-input" style={{ height: '2.75rem', borderRadius: '0.75rem' }} />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item name="requestType" rules={[{ required: true, message: t('required') }]} label={label(<LuShield className="h-4 w-4 text-accent" />, t('requestTypeLabel'))}>
                  <Select
                    placeholder={t('requestTypePlaceholder')}
                    className="custom-select"
                    style={{ height: '2.75rem' }}
                    options={requestTypes}
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item name="message" rules={[{ required: true, message: t('required') }]} label={label(<LuFileText className="h-4 w-4 text-accent" />, t('messageLabel'))}>
                  <TextArea
                    rows={6}
                    placeholder={t('messagePlaceholder')}
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
                  {loading ? t('submitting') : t('submit')}
                </button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

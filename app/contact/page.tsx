"use client";

// app/contact/page.tsx
import React from 'react';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <section className="bg-white dark:bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md w-full font-kanit">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Contactez-nous
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Un problème technique? Une question sur l'univers? Contactez-nous!
        </p>
        <Form
          name="contact"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-4"
        >
          <Form.Item
            label="Votre email"
            name="email"
            className="font-kanit"
            rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
          >
            <Input placeholder="name@domain.com" className="font-kanit" style={{ height: "3rem" }} />
          </Form.Item>

          <Form.Item
            label="Sujet"
            name="subject"
            className="font-kanit"
            rules={[{ required: true, message: 'Veuillez entrer le sujet!' }]}
          >
            <Input placeholder="Quel est le sujet de votre message?" className="font-kanit" style={{ height: "3rem" }} />
          </Form.Item>

          <Form.Item
            label="Votre message"
            name="message"
            className="font-kanit"
            rules={[{ required: true, message: 'Veuillez entrer votre message!' }]}
          >
            <TextArea rows={6} placeholder="Décrivez votre problème ou votre question ici..." className="font-kanit" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full font-kanit h-12 uppercase font-bold">
              Envoyer le message
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ContactPage;

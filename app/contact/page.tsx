"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Charger une image de fond aléatoire
  useEffect(() => {
    const loadRandomBackgroundImage = async () => {
      try {
        const response = await fetch('/api/getRandomImage');
        const data = await response.json();
        setBackgroundImage(data.imagePath);
      } catch (error) {
        console.error("Failed to load random background image:", error);
      }
    };

    loadRandomBackgroundImage();
  }, []);

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <section
      className="bg-white dark:bg-gray-900 flex justify-center items-center min-h-screen relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      {/* Filtre pour rendre l'image de fond plus sombre */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md w-full relative z-10">
        {/* Texte avec Iceberg et Uppercase */}
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-white uppercase font-iceberg">
          Contact
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-300 sm:text-xl">
          Un problème technique? Une question sur l&apos;univers? Contactez-nous!
        </p>

        {/* Formulaire de contact */}
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
            className="font-kanit text-white"
            rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
          >
            <Input
              placeholder="name@domain.com"
              className="font-kanit bg-black bg-opacity-70 text-white placeholder-gray-500 hover:bg-black focus:bg-black"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            label="Sujet"
            name="subject"
            className="font-kanit text-white"
            rules={[{ required: true, message: 'Veuillez entrer le sujet!' }]}
          >
            <Input
              placeholder="Quel est le sujet de votre message?"
              className="font-kanit bg-black bg-opacity-70 text-white placeholder-gray-500 hover:bg-black focus:bg-black"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            label="Votre message"
            name="message"
            className="font-kanit text-white"
            rules={[{ required: true, message: 'Veuillez entrer votre message!' }]}
          >
            <TextArea
              rows={6}
              placeholder="Décrivez votre problème ou votre question ici..."
              className="font-kanit bg-black bg-opacity-70 text-white placeholder-gray-500 hover:bg-black focus:bg-black"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full font-kanit h-12 uppercase font-bold bg-black text-white hover:bg-gray-800 shadow-[0px_0px_15px_3px_rgba(255,255,255,0.8)] border-none"
            >
              Envoyer le message
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ContactPage;

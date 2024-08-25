"use client";

import { Form, Input, Button } from 'antd';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaXTwitter } from 'react-icons/fa6';
import { CgUserAdd } from 'react-icons/cg'; // Icône pour le bouton d'inscription
import Link from 'next/link';
import DividersWithHeading from '@/components/DividersWhithHeading'; // Import du composant

export default function RegisterPage() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row w-full">
      {/* Section de gauche avec le formulaire */}
      <div className="flex w-full lg:w-1/3 h-full justify-center items-center bg-black">
        <div className="max-w-3xl w-full text-white p-6 lg:p-8">
          {/* Titre principal avec la police Oxanium et l'effet d'ombre néon */}
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center font-oxanium uppercase text-white text-shadow-neon-white">
            Inscription
          </h1>

          <Form
            name="register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <Form.Item
                label={<span className="text-white font-kanit text-shadow-neon-white-light">Pseudo</span>}
                name="pseudo"
                rules={[{ required: true, message: 'Veuillez entrer votre pseudo!' }]}
              >
                <Input placeholder="Votre pseudo" className="custom-input bg-white text-black font-kanit" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white font-kanit text-shadow-neon-white-light">Téléphone</span>}
                name="phone"
                rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone!' }]}
              >
                <Input placeholder="Votre téléphone" className="custom-input bg-white text-black font-kanit" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white font-kanit text-shadow-neon-white-light">Email</span>}
                name="email"
                rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
              >
                <Input type="email" placeholder="Votre email" className="custom-input bg-white text-black font-kanit" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white font-kanit text-shadow-neon-white-light">Mot de passe</span>}
                name="password"
                rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
              >
                <Input.Password placeholder="Votre mot de passe" className="custom-input bg-white text-black font-kanit" />
              </Form.Item>
            </div>

            <Form.Item className="flex justify-center mt-4 lg:mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-black text-white font-kanit text-lg py-4 lg:py-6 px-4 lg:px-6 flex items-center justify-center border border-white transition-all transform hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-white-glow"
                icon={<CgUserAdd className="mr-2 w-6 h-6" />} // Icône pour le bouton d'inscription
              >
                S'inscrire
              </Button>
            </Form.Item>

            {/* Divider avec sous-titre */}
            <DividersWithHeading text="Ou inscrivez-vous via" />

            {/* Boutons pour s'inscrire avec Google et X */}
            <div className="flex justify-center mt-4 lg:mt-8">
              <div className="social-btn-container mx-2 lg:mx-3">
                <div className="social-btn-content">
                  <FcGoogle className="w-8 h-8" />
                </div>
              </div>
              <div className="social-btn-container mx-2 lg:mx-3">
                <div className="social-btn-content">
                  <FaXTwitter className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>

            {/* Texte de connexion en bas */}
            <div className="mt-4 lg:mt-8 text-center">
              <span className="text-white font-kanit">
                Déjà inscrit?{' '}
                <Link href="/login" className="text-blue-500 hover:text-blue-300">
                  Connectez-vous ici
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>

      {/* Section de droite avec l'image et l'effet d'ombre */}
      <div className="relative w-full lg:w-2/3 h-64 lg:h-screen">
        <Image
          src="/images/backgrounds/BllodbathDiablos.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="lg:block"
        />
        {/* Ombre noire gradient intensifiée */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent w-1/3"></div>
      </div>
    </div>
  );
}

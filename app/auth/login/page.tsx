"use client";

import { Form, Input, Button, Checkbox } from 'antd'; // Garde les composants Ant Design sauf les notifications
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaXTwitter } from 'react-icons/fa6';
import { CgLogIn } from 'react-icons/cg';
import Link from 'next/link';
import DividersWithHeading from '@/components/DividersWhithHeading';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/queries/AuthQueries';
import { useState } from 'react';
import { useNotification } from '@/components/notifications/NotificationProvider'; // Importer le contexte de notification

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification(); // Utiliser le contexte pour les notifications

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values);

      if (response && response.token && response.token.access_token) {
        localStorage.setItem('access_token', response.token.access_token);

        // Utiliser notre propre notification flash pour le succès
        addNotification("success", "Connexion réussie !");
        
        router.push('/');
      } else {
        throw new Error('Token non fourni ou réponse incorrecte');
      }
    } catch (error) {
      console.error('Error during login:', error);
      
      // Utiliser notre propre notification flash pour les erreurs
      addNotification("critical", "Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <div className="relative w-full lg:w-3/5 h-64 lg:h-screen">
        <Image
          src="/images/backgrounds/THEDarkSlayer.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="lg:block"
        />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/90 to-transparent"></div>
      </div>

      <div className="flex w-full lg:w-2/5 h-auto lg:h-screen justify-center items-center bg-black">
        <div className="max-w-md w-full text-white p-8">
          <h1 className="text-3xl font-bold mb-8 text-center font-oxanium uppercase text-white text-shadow-neon-white">
            Connexion
          </h1>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
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

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox className="text-white font-kanit">Se souvenir de moi</Checkbox>
            </Form.Item>

            <Form.Item className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-black text-white font-kanit text-lg py-6 px-6 flex items-center justify-center border border-white transition-all transform hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-white-glow"
                icon={<CgLogIn className="mr-2 w-6 h-6" />}
                loading={loading}
              >
                Se connecter
              </Button>
            </Form.Item>

            <DividersWithHeading text="Ou connectez-vous via" />

            <div className="flex justify-center mt-8">
              <div className="social-btn-container mx-3">
                <div className="social-btn-content">
                  <FcGoogle className="w-8 h-8" />
                </div>
              </div>
              <div className="social-btn-container mx-3">
                <div className="social-btn-content">
                  <FaXTwitter className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <span className="text-white font-kanit">
                Pas encore inscrit?{' '}
                <Link href="/register" className="text-blue-500 hover:text-blue-300">
                  Inscrivez-vous ici
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

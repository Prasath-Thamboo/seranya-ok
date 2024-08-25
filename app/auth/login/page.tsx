"use client";

import { Form, Input, Button, Checkbox, message } from 'antd';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaXTwitter } from 'react-icons/fa6'; // Remplacement par l'icône X
import { CgLogIn } from 'react-icons/cg'; // Icône pour le bouton de connexion
import Link from 'next/link';
import DividersWithHeading from '@/components/DividersWhithHeading'; // Import du composant
import { useRouter } from 'next/navigation'; // Utiliser useRouter de Next.js
import { loginUser } from '@/lib/queries/AuthQueries'; // Import de la fonction loginUser
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter(); // Initialisation de useRouter pour la redirection
  const [loading, setLoading] = useState(false); // State pour gérer le chargement

  // Fonction qui se déclenche lors de la soumission réussie du formulaire
  const onFinish = async (values: any) => {
    setLoading(true); // Commence le chargement
    try {
      // Appel à la fonction loginUser pour se connecter
      const response = await loginUser(values);
  
      // Vérification de la présence du token dans la réponse
      if (response && response.token && response.token.access_token) {
        localStorage.setItem('access_token', response.token.access_token);
  
        // Affichage d'un message de succès
        message.success('Connexion réussie !');
  
        // Redirection vers la page d'accueil après la connexion
        router.push('/');
      } else {
        // Si le token n'est pas trouvé, déclenche une erreur
        throw new Error('Token non fourni ou réponse incorrecte');
      }
    } catch (error) {
      // Affiche un message d'erreur si la connexion échoue
      console.error('Error during login:', error);
      message.error('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false); // Arrête le chargement
    }
  };
  

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Section de gauche avec l'image et l'effet d'ombre */}
      <div className="relative w-full lg:w-3/5 h-64 lg:h-screen">
        <Image
          src="/images/backgrounds/THEDarkSlayer.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="lg:block"
        />
        {/* Ombre noire gradient inversée et plus intense */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/90 to-transparent"></div>
      </div>

      {/* Section de droite avec le formulaire */}
      <div className="flex w-full lg:w-2/5 h-auto lg:h-screen justify-center items-center bg-black">
        <div className="max-w-md w-full text-white p-8">
          {/* Titre principal avec la police Oxanium et l'effet d'ombre néon */}
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
                icon={<CgLogIn className="mr-2 w-6 h-6" />} // Agrandir l'icône
                loading={loading} // Affiche un spinner lors du chargement
              >
                Se connecter
              </Button>
            </Form.Item>

            {/* Divider avec sous-titre */}
            <DividersWithHeading text="Ou connectez-vous via" />

            {/* Boutons pour se connecter avec Google et X */}
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

            {/* Texte d'inscription en bas */}
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

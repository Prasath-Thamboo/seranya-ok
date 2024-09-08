"use client";

import { Form, Input, Button, Result } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { CgUserAdd } from 'react-icons/cg'; // Icon for the button
import { useState } from 'react';
import { registerUser } from '@/lib/queries/AuthQueries'; // Import your API function
import { getAccessToken } from '@/lib/queries/AuthQueries'; // Import token function if needed
import { RegisterUserModel } from '@/lib/models/AuthModels'; // Import the correct interface

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken(); // Fetch token if required

      if (!token) {
        setError('Token not found. Please login again.');
        return;
      }

      // Only sending necessary fields using RegisterUserModel
      await registerUser({
        pseudo: values.pseudo,
        email: values.email,
        password: values.password,
        phone: values.phone,
      } as RegisterUserModel, token); // Ensure token is provided

      // Show success modal
      setIsModalVisible(true);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Failed to register:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    window.location.href = '/auth/login'; // Redirect to login page after modal is closed
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row w-full font-kanit">
      {/* Modal for success message */}
      {isModalVisible && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-lg w-1/2 max-w-lg">
            <Result
              status="success"
              title={<span className="font-kanit text-2xl">Inscription réussie!</span>}
              subTitle={<span className="font-kanit">Votre inscription a été réussie. Cliquez sur OK pour être redirigé vers la page de connexion.</span>}
              extra={[
                <Button
                  key="ok"
                  onClick={handleOk}
                  className="bg-gray-900 text-white active:bg-gray-700 text-lg font-iceberg uppercase px-8 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                  style={{ transition: 'all .15s ease' }}
                >
                  OK
                </Button>,
              ]}
            />
          </div>
        </div>
      )}

      {/* Left section with form */}
      <div
        className="flex flex-col w-full lg:w-1/2 h-full justify-center items-center bg-white shadow-xl"
        style={{ boxShadow: 'inset -10px 0 30px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Enlarged logo at the top */}
        <div className="mb-6 lg:mb-10">
          <Image
            src="/logos/spectral-high-resolution-logo-black-transparent (1).png"
            alt="Spectral Logo"
            width={300} // Adjust logo size
            height={100}
            className="mx-auto"
          />
        </div>

        <div className="w-full max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-bold mb-10 text-center font-iceberg uppercase text-black">
            Inscription
          </h1>

          <Form
            name="register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pseudo */}
              <Form.Item
                label={<span className="text-black font-kanit">Pseudo</span>}
                name="pseudo"
                rules={[{ required: true, message: 'Veuillez entrer votre pseudo!' }]}
              >
                <Input
                  placeholder="Pseudo"
                  className="bg-white text-black h-14 border border-black shadow-md focus:border-black w-full"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label={<span className="text-black font-kanit">Mot de passe</span>}
                name="password"
                rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
              >
                <Input.Password
                  placeholder="Mot de passe"
                  className="bg-white text-black h-14 border border-black shadow-md focus:border-black w-full"
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label={<span className="text-black font-kanit">Email</span>}
                name="email"
                rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-white text-black h-14 border border-black shadow-md focus:border-black w-full"
                />
              </Form.Item>

              {/* Phone */}
              <Form.Item
                label={<span className="text-black font-kanit">Téléphone</span>}
                name="phone"
                rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone!' }]}
              >
                <Input
                  placeholder="Téléphone"
                  className="bg-white text-black h-14 border border-black shadow-md focus:border-black w-full"
                />
              </Form.Item>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Single Button Centered */}
            <Form.Item className="flex justify-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-black text-white w-full h-16 text-xl font-bold flex items-center justify-center border border-black transition-all hover:bg-gray-800 hover:scale-105 uppercase font-iceberg"
                icon={<CgUserAdd className="mr-2 w-8 h-8" />} // Icon added to the button
              >
                INSCRIPTION
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 text-center">
            <span className="text-black">
              Déjà inscrit?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-400">
                Connectez-vous ici
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right section with the background image */}
      <div className="hidden lg:block relative w-1/2 h-full">
        <Image
          src="/images/backgrounds/a.knight_httpss.mj.runoTkVu9yakdo_An_angelic_female_knight_wi_0a74cee9-5949-4fac-bf6c-5346ac9cda3f_2.png"
          alt="Background Image"
          fill
          style={{ objectFit: 'cover' }}
          className="lg:block"
        />
      </div>
    </div>
  );
}

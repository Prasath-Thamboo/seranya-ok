"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, Image, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchCurrentUser } from '@/lib/queries/AuthQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import Badge from '@/components/Badge';
import { useNotification } from '@/components/notifications/NotificationProvider';

const ProfilePage = () => {
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { addNotification } = useNotification();

  const backendUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PROD
      : process.env.NEXT_PUBLIC_API_URL_LOCAL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser({
          ...currentUser,
          profileImage: `${backendUrl}/uploads/users/${currentUser.id}/ProfileImage.png`,
        });
        form.setFieldsValue(currentUser); // Préremplit le formulaire avec les infos utilisateur
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [router, form]);

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token not found');
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('lastName', values.lastName);
      formData.append('phone', values.phone);
      formData.append('address', values.address);

      // Gestion correcte du fichier image (toujours via un tableau avec `normFile`)
      if (values.profileImage && values.profileImage.length > 0) {
        formData.append('profileImage', values.profileImage[0].originFileObj);
      }

      await axios.put(`${backendUrl}/users/${user?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = await fetchCurrentUser();
      setUser({
        ...updatedUser,
        profileImage: `${backendUrl}/uploads/users/${updatedUser.id}/ProfileImage.png`,
      });

      addNotification('success', 'Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('critical', 'Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  // Modification pour la méthode `normFile`
  const normFile = (e: any) => {
    // Retourner un tableau contenant l'objet file
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList ? e.fileList : [];
  };

  const profileImageSrc = typeof user?.profileImage === 'string' ? user.profileImage : undefined;

  if (!user) {
    return <div>Loading...</div>;
  }

  // Définir les items pour les tabs en utilisant la nouvelle méthode `items`
  const tabItems = [
    {
      key: '1',
      label: 'Informations du Profil',
      children: (
        <div>
          <div className="flex flex-col items-center mb-8">
            <Image
              src={profileImageSrc || '/images/backgrounds/placeholder.jpg'}
              alt="User Avatar"
              className="rounded-full object-cover mb-4 shadow-lg"
              width={120}
              height={120}
            />
            <div className="flex items-center mt-2">
              <h1 className="text-3xl font-iceberg font-semibold mr-2">{user.pseudo}</h1>
              <Badge role={user.role} />
            </div>
            <p className="text-gray-500 mt-2">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-lg font-iceberg font-semibold mb-2">Informations Personnelles</h2>
              <p className="text-gray-700">
                <strong>Nom :</strong> {user.name || 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Nom de famille :</strong> {user.lastName || 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Téléphone :</strong> {user.phone || 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Adresse :</strong> {user.address || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-lg font-iceberg font-semibold mb-2">Détails du Compte</h2>
              <p className="text-gray-700">
                <strong>Rôle :</strong> {user.role}
              </p>
              <p className="text-gray-700">
                <strong>Statut :</strong> {user.status}
              </p>
              <p className="text-gray-700">
    <strong>Abonnement :</strong> {user.isSubscribed ? "Abonné" : "Non abonné"}
  </p>
              <p className="text-gray-700">
                <strong>Date de création :</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Dernière mise à jour :</strong> {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Modifier le Profil',
      children: (
        <Form
          form={form}
          name="edit_profile"
          layout="vertical"
          onFinish={handleProfileUpdate}
          className="text-black font-kanit"
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
          >
            <Input placeholder="Nom" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Nom de famille"
          >
            <Input placeholder="Nom de famille" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Téléphone"
          >
            <Input placeholder="Téléphone" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Adresse"
          >
            <Input placeholder="Adresse" />
          </Form.Item>


          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black text-white py-2 px-6"
              loading={loading}
            >
              Mettre à jour
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 sm:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl font-kanit text-black">
        <Tabs items={tabItems} centered />
      </div>
    </div>
  );
};

export default ProfilePage;

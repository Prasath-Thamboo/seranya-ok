'use client';

import { Form, Input, Button, Switch } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTutorial } from '@/lib/queries/TutorialQueries';
import { useNotification } from '@/components/notifications/NotificationProvider';

const CreateTutoriel = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await createTutorial({
        title: values.title,
        description: values.description,
        videoUrl: values.videoUrl,
        isPublished: values.isPublished ?? false,
      });
      addNotification('success', 'Tutoriel créé avec succès!');
      router.push('/admin/tutoriels');
    } catch (error) {
      console.error(error);
      addNotification('critical', 'Erreur lors de la création du tutoriel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black">
          Créer un Tutoriel
        </h1>

        <Form
          name="create_tutoriel"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
          initialValues={{ isPublished: false }}
        >
          <Form.Item
            name="title"
            label={<span className="font-kanit text-black">Titre</span>}
            rules={[{ required: true, message: 'Veuillez entrer le titre du tutoriel!' }]}
          >
            <Input placeholder="Titre du tutoriel" style={{ height: '3rem' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-kanit text-black">Description</span>}
          >
            <Input.TextArea placeholder="Description du tutoriel" style={{ height: '6rem' }} />
          </Form.Item>

          <Form.Item
            name="videoUrl"
            label={<span className="font-kanit text-black">URL YouTube</span>}
            rules={[
              { required: true, message: "Veuillez entrer l'URL de la vidéo!" },
              { type: 'url', message: "L'URL n'est pas valide!" },
            ]}
          >
            <Input placeholder="https://www.youtube.com/watch?v=..." style={{ height: '3rem' }} />
          </Form.Item>

          <Form.Item
            name="isPublished"
            label={<span className="font-kanit text-black">Publier</span>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black text-white font-kanit text-lg py-3 px-10 flex items-center justify-center uppercase font-bold"
              icon={loading ? <LoadingOutlined className="mr-2" /> : <PlusOutlined className="mr-2" />}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateTutoriel;

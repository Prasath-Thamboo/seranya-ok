"use client";

import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importer Quill's CSS

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateClass = () => {
  const [loading, setLoading] = useState(false);
  const [storyValue, setStoryValue] = useState(''); // Story en HTML
  const [bioValue, setBioValue] = useState(''); // Bio en HTML
  const router = useRouter();
  const { addNotification } = useNotification();

  // Utiliser l'URL correcte en fonction de l'environnement
  const backendUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const formData = new FormData();

      // Ajout des champs texte au formulaire
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      formData.append('subtitle', values.subtitle || '');
      formData.append('story', storyValue || '');
      formData.append('bio', bioValue || '');

      // Ajout de l'image de profil si disponible
      if (values.profileImage && values.profileImage[0]?.originFileObj) {
        formData.append('profileImage', values.profileImage[0].originFileObj as Blob);
      }

      // Envoi du formulaire au backend avec Axios
      const response = await axios.post(`${backendUrl}/classes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      addNotification("success", "Classe créée avec succès!");
      router.push("/admin/classes");
    } catch (error) {
      console.error("Erreur lors de la création de la classe:", error);
      addNotification("critical", "Erreur lors de la création de la classe.");
    } finally {
      setLoading(false);
    }
  };

  // Convertir l'événement en fileList pour les Uploads
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black">
          Créer une Classe
        </h1>

        <Form
          name="create_class"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          {/* Champ Titre */}
          <Form.Item
            name="title"
            label={<span className="font-kanit text-black">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de la classe!" }]}
          >
            <Input
              placeholder="Titre de la classe"
              className="bg-white text-black font-kanit"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          {/* Champ Intro */}
          <Form.Item
            name="intro"
            label={<span className="font-kanit text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'intro de la classe!" }]}
          >
            <Input.TextArea placeholder="Introduction de la classe" />
          </Form.Item>

          {/* Champ Sous-titre */}
          <Form.Item
            name="subtitle"
            label={<span className="font-kanit text-black">Sous-titre</span>}
          >
            <Input.TextArea placeholder="Sous-titre de la classe" />
          </Form.Item>

          {/* Champ Histoire */}
          <Form.Item
            name="story"
            label={<span className="font-kanit text-black">Histoire</span>}
          >
            <ReactQuill value={storyValue} onChange={setStoryValue} />
          </Form.Item>

          {/* Champ Biographie */}
          <Form.Item
            name="bio"
            label={<span className="font-kanit text-black">Biographie</span>}
          >
            <ReactQuill value={bioValue} onChange={setBioValue} />
          </Form.Item>

          {/* Upload Image de profil */}
          <Form.Item
            name="profileImage"
            label={<span className="font-kanit text-black">Image de profil</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="profileImage"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-white text-black font-kanit text-lg py-3 px-10 flex items-center justify-center border border-white uppercase font-bold"
              icon={<PlusOutlined className="mr-2" />}
              loading={loading}
            >
              Créer
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateClass;
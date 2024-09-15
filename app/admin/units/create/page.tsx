"use client";

import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

// Définir le type pour une classe
interface ClassModel {
  id: number;
  title: string;
}

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateUnit = () => {
  const [loading, setLoading] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [storyValue, setStoryValue] = useState('');
  const [classes, setClasses] = useState<ClassModel[]>([]); // Utiliser un type explicite pour les classes
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Charger les classes disponibles
    const loadClasses = async () => {
      try {
        const response = await axios.get(`https://api.spectralunivers.com/classes`);
        setClasses(response.data); // Assurez-vous que response.data correspond bien à un tableau d'objets ClassModel
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    loadClasses();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }
  
      const formData = new FormData();
  
      // Ajout des champs texte au formulaire
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      if (values.subtitle) formData.append('subtitle', values.subtitle);
      formData.append('story', storyValue);
      formData.append('bio', bioValue);
      formData.append('type', values.type);
  
      // Ajout des classes associées
// Ajout des classes associées
if (values.classIds && Array.isArray(values.classIds)) {
  // Envoi du tableau sous forme de chaîne JSON
  formData.append('classIds', JSON.stringify(values.classIds));
}

  
      // Ajout des fichiers au formulaire avec vérification
      if (values.profileImage && values.profileImage.length > 0) {
        formData.append('profileImage', values.profileImage[0].originFileObj);
      }
      if (values.headerImage && values.headerImage.length > 0) {
        formData.append('headerImage', values.headerImage[0].originFileObj);
      }
      if (values.footerImage && values.footerImage.length > 0) {
        formData.append('footerImage', values.footerImage[0].originFileObj);
      }
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((file: any) => {
          formData.append('gallery', file.originFileObj);
        });
      }
  
      // Envoi du formulaire au backend avec Axios
      const response = await axios.post(`https://api.spectralunivers.com/units`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
     
  
      addNotification("success", "Unité créée avec succès!");
      router.push("/admin/units");
    } catch (error) {
      console.error("Error during unit creation:", error);
      addNotification("critical", "Erreur lors de la création de l'unité.");
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
          Créer une Unité
        </h1>

        <Form
          name="create_unit"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          <Form.Item
            name="title"
            label={<span className="font-kanit text-black">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de l'unité!" }]}
          >
            <Input
              placeholder="Titre de l'unité"
              className="bg-white text-black font-kanit"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="font-kanit text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de l'unité!" }]}
          >
            <Input.TextArea
              placeholder="Introduction"
              className="bg-white text-black font-kanit"
              style={{ height: "6rem" }}
            />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label={<span className="font-kanit text-black">Sous-titre</span>}
          >
            <Input
              placeholder="Sous-titre de l'unité"
              className="bg-white text-black font-kanit"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            name="story"
            label={<span className="font-kanit text-black">Histoire</span>}
          >
            <ReactQuill value={storyValue} onChange={setStoryValue} />
          </Form.Item>

          <Form.Item
            name="bio"
            label={<span className="font-kanit text-black">Biographie</span>}
          >
            <ReactQuill value={bioValue} onChange={setBioValue} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Veuillez choisir un type!" }]}
          >
            <Select
              placeholder="Sélectionnez le type"
              className="bg-white text-black font-kanit"
            >
              <Option value="UNIT">UNIT</Option>
              <Option value="CHAMPION">CHAMPION</Option>
            </Select>
          </Form.Item>

          {/* Sélection des classes associées */}
          <Form.Item
  name="classIds"
  label={<span className="font-kanit text-black">Classes associées</span>}
>
  <Select
    mode="multiple"
    placeholder="Sélectionnez des classes"
    showSearch
    optionFilterProp="children"
  >
    {classes.map((classItem: ClassModel) => (
      <Option key={classItem.id} value={classItem.id}>
        {classItem.title}
      </Option>
    ))}
  </Select>
</Form.Item>


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

          <Form.Item
            name="headerImage"
            label={<span className="font-kanit text-black">Image Header</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="headerImage"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="footerImage"
            label={<span className="font-kanit text-black">Image de pied de page</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="footerImage"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="gallery"
            label={<span className="font-kanit text-black">Galerie</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="gallery"
              listType="picture-card"
              multiple
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Télécharger</div>
              </div>
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

export default CreateUnit;

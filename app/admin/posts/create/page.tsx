"use client";

import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importation du CSS de Quill

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface ClassModel {
  id: string;
  title: string;
}

interface UnitModel {
  id: number;
  title: string;
}

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [contentValue, setContentValue] = useState('');
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [units, setUnits] = useState<UnitModel[]>([]);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Charger les classes disponibles
    const loadClasses = async () => {
      try {
        const response = await axios.get(`https://back.seranya.fr/classes`);
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes:", error);
      }
    };

    // Charger les unités disponibles
    const loadUnits = async () => {
      try {
        const response = await axios.get(`https://back.seranya.fr/units`);
        setUnits(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des unités:", error);
      }
    };

    loadClasses();
    loadUnits();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token introuvable");
      }

      const formData = new FormData();

      // Ajout des champs texte au formulaire
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      if (values.subtitle) formData.append('subtitle', values.subtitle);
      formData.append('content', contentValue);
      formData.append('type', values.type);

      if (values.classIds && values.classIds.length > 0) {
        values.classIds.forEach((classId: string) => {
          formData.append('classIds[]', classId);
        });
      }

      if (values.unitIds && values.unitIds.length > 0) {
        values.unitIds.forEach((unitId: number) => {
          formData.append('unitIds[]', unitId.toString());
        });
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
      await axios.post(`https://back.seranya.fr/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      addNotification("success", "Post créé avec succès!");
      router.push("/admin/posts");
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
      addNotification("critical", "Erreur lors de la création du post.");
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
          Créer un Post
        </h1>

        <Form
          name="create_post"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          <Form.Item
            name="title"
            label={<span className="font-kanit text-black">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre du post!" }]}
          >
            <Input
              placeholder="Titre du post"
              className="bg-white text-black font-kanit"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="font-kanit text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction du post!" }]}
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
              placeholder="Sous-titre du post"
              className="bg-white text-black font-kanit"
              style={{ height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={<span className="font-kanit text-black">Contenu</span>}
          >
            <ReactQuill value={contentValue} onChange={setContentValue} />
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
              <Option value="SCIENCE">SCIENCE</Option>
              <Option value="PHILO">PHILO</Option>
              <Option value="HISTOIRE">HISTOIRE</Option>
              {/* Ajoutez d'autres types si nécessaire */}
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

          {/* Sélection des unités associées */}
          <Form.Item
            name="unitIds"
            label={<span className="font-kanit text-black">Unités associées</span>}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionnez des unités"
              showSearch
              optionFilterProp="children"
            >
              {units.map((unitItem: UnitModel) => (
                <Option key={unitItem.id} value={unitItem.id}>
                  {unitItem.title}
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
              icon={!loading ? <PlusOutlined className="mr-2" /> : <LoadingOutlined className="mr-2" />}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Création en cours" : "Créer"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;

"use client";

import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { CreateUnitModel, UnitModel, UnitType } from "@/lib/models/UnitModels";

interface ClassModel {
  id: number;
  title: string;
}

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000'; // Assurez-vous que cette URL est correcte

const CreateUnit = () => {
  const [loading, setLoading] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [storyValue, setStoryValue] = useState('');
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Charger les classes disponibles
    const loadClasses = async () => {
      try {
        const response = await axios.get<ClassModel[]>(`${BASE_URL}/classes`);
        setClasses(response.data);
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

      const createUnitData: CreateUnitModel = {
        title: values.title,
        intro: values.intro,
        subtitle: values.subtitle,
        story: storyValue || "",
        bio: bioValue || "",
        type: values.type,
        quote: values.quote || "",
        color: values.color || "#FFFFFF",
        isPublished: values.isPublished || false,
        classIds: values.classIds,
        profileImage: values.profileImage ? values.profileImage[0].originFileObj : undefined,
        headerImage: values.headerImage ? values.headerImage[0].originFileObj : undefined,
        footerImage: values.footerImage ? values.footerImage[0].originFileObj : undefined,
        gallery: values.gallery ? values.gallery.map((file: any) => file.originFileObj) : [],
      };

      // Envoi du formulaire au backend avec Axios
      const formData = new FormData();

      formData.append('title', createUnitData.title);
      formData.append('intro', createUnitData.intro);
      if (createUnitData.subtitle) formData.append('subtitle', createUnitData.subtitle);
      formData.append('story', createUnitData.story);
      formData.append('bio', createUnitData.bio);
      formData.append('type', createUnitData.type);
      formData.append('quote', createUnitData.quote);
      formData.append('color', createUnitData.color);

      if (createUnitData.classIds && createUnitData.classIds.length > 0) {
        createUnitData.classIds.forEach((classId) => {
          formData.append('classIds[]', classId);
        });
      }

      if (createUnitData.profileImage) {
        formData.append('profileImage', createUnitData.profileImage);
      }
      if (createUnitData.headerImage) {
        formData.append('headerImage', createUnitData.headerImage);
      }
      if (createUnitData.footerImage) {
        formData.append('footerImage', createUnitData.footerImage);
      }
      if (createUnitData.gallery && createUnitData.gallery.length > 0) {
        createUnitData.gallery.forEach((image) => {
          formData.append('gallery', image);
        });
      }

      const response = await axios.post<UnitModel>(`${BASE_URL}/units`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      addNotification("success", "Unité créée avec succès!");
      router.push("/admin/units");
    } catch (error: any) {
      console.error("Error during unit creation:", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la création de l'unité.";
      addNotification("critical", errorMessage);
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

          {/* Champ : Quote */}
          <Form.Item
            name="quote"
            label={<span className="font-kanit text-black">Citation</span>}
            rules={[
              { required: true, message: "Veuillez entrer une citation pour l'unité!" },
              { max: 200, message: "La citation ne doit pas dépasser 200 caractères." },
            ]}
          >
            <Input.TextArea
              placeholder="Citation de l'unité"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          {/* Champ : Color Picker */}
          <Form.Item
            name="color"
            label={<span className="font-kanit text-black">Couleur</span>}
            rules={[
              { required: true, message: "Veuillez sélectionner une couleur!" },
              {
                pattern: /^#([0-9A-F]{3}){1,2}$/i,
                message: "Veuillez sélectionner une couleur valide.",
              },
            ]}
          >
            <Input type="color" className="w-12 h-12 p-0 border-none" />
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
              <Option value={UnitType.UNIT}>UNIT</Option>
              <Option value={UnitType.CHAMPION}>CHAMPION</Option>
            </Select>
          </Form.Item>

          {/* Sélection des classes associées */}
          <Form.Item
            name="classIds"
            label={<span className="font-kanit text-black">Classes associées</span>}
            rules={[{ required: true, message: "Veuillez sélectionner au moins une classe!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionnez des classes"
              showSearch
              optionFilterProp="children"
            >
              {classes.map((classItem: ClassModel) => (
                <Option key={classItem.id} value={classItem.id.toString()}>
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
            rules={[
              { required: true, message: "Veuillez télécharger une image de profil!" },
            ]}
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
            rules={[
              { required: true, message: "Veuillez télécharger une image header!" },
            ]}
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
            rules={[
              { required: true, message: "Veuillez télécharger une image de pied de page!" },
            ]}
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

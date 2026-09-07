"use client";

import { Form, Input, Button, Upload, Select, Image, Row, Col, Card, ColorPicker } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { ClassModel } from "@/lib/models/ClassModels";
import type { UploadFile } from 'antd/es/upload/interface';
import { fetchClassById } from "@/lib/queries/ClassQueries";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importer le style de l'éditeur Quill

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateClass = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState<ClassModel | null>(null);
  const [bioValue, setBioValue] = useState('');
  const [storyValue, setStoryValue] = useState('');
  const [units, setUnits] = useState<any[]>([]); // Remplacez `any` par `UnitModel` si vous avez le modèle
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const [visibleGallery, setVisibleGallery] = useState<{ id: string; url: string }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { addNotification } = useNotification();

  const backendUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

  // Chargement des données de la classe et des unités
  useEffect(() => {
    if (id) {
      const loadClass = async () => {
        try {
          const data = await fetchClassById(id);

          if (data) {
            setClassData(data);

            // Chargement des images de la galerie avec les vrais IDs
            const galleryUrls = data.gallery?.map((url: string, index: number) => ({
              id: data.galleryUploadIds ? data.galleryUploadIds[index].toString() : '',
              url: url.startsWith('http') ? url : `${backendUrl}/${url}`,
            })) || [];

            setVisibleGallery(galleryUrls);

            setSelectedUnitIds(data.units?.map((u: any) => u.id.toString()) || []);
            setBioValue(data.bio || '');
            setStoryValue(data.story || '');

            form.setFieldsValue({
              title: data.title || '',
              intro: data.intro || '',
              subtitle: data.subtitle || '',
              color: data.color || '#FFFFFF', // Utiliser 'color' ici
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la classe:", error);
          addNotification("critical", "Erreur lors du chargement de la classe.");
        }
      };

      const loadUnits = async () => {
        try {
          const response = await axios.get<any[]>(`${backendUrl}/units`);
          setUnits(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des unités:", error);
          addNotification("critical", "Erreur lors de la récupération des unités.");
        }
      };

      loadClass();
      loadUnits();
    }
  }, [id, form, addNotification, backendUrl]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      formData.append('subtitle', values.subtitle);
      formData.append('story', storyValue);
      formData.append('bio', bioValue);
      formData.append('color', values.color || '');
      

      if (selectedUnitIds.length > 0) {
        selectedUnitIds.forEach((unitId) => {
          formData.append('unitIds[]', unitId);
        });
      }

      if (values.profileImage && values.profileImage[0]?.originFileObj) {
        formData.append('profileImage', values.profileImage[0].originFileObj as Blob);
      }
      if (values.headerImage && values.headerImage[0]?.originFileObj) {
        formData.append('headerImage', values.headerImage[0].originFileObj as Blob);
      }
      if (values.footerImage && values.footerImage[0]?.originFileObj) {
        formData.append('footerImage', values.footerImage[0].originFileObj as Blob);
      }
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((file: UploadFile) => {
          if (file.originFileObj) {
            formData.append('gallery', file.originFileObj as Blob);
          }
        });
      }

      // Ajout des images de galerie à supprimer
      if (galleryImagesToDelete.length > 0) {
        galleryImagesToDelete.forEach((imageId, index) => {
          formData.append(`galleryImagesToDelete[${index}]`, imageId);
        });
      }

      const response = await axios.patch(`${backendUrl}/classes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        addNotification("success", "Classe mise à jour avec succès!");
        router.push("/admin/classes");
      } else {
        throw new Error("Mise à jour échouée");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la classe:", error);
      addNotification("critical", "Erreur lors de la mise à jour de la classe.");
    } finally {
      setLoading(false);
    }
  };

  // Norme pour le fichier uploadé
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Gestion de la suppression d'une image de galerie
  const handleDeleteImage = (imageId: string) => {
    setGalleryImagesToDelete((prev) => [...prev, imageId]);
    setVisibleGallery(visibleGallery.filter((image) => image.id !== imageId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-serif font-medium mb-8 text-center text-ink">
          Mettre à jour la Classe
        </h1>

        <Form
          form={form}
          name="update_class"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-ink-soft font-sans"
        >
          <Form.Item
            name="title"
            label={<span className="text-ink-soft font-sans">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de la classe!" }]}
          >
            <Input placeholder="Titre de la classe" className="bg-raised text-ink font-sans" />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de la classe!" }]}
            className="font-sans"
          >
            <Input.TextArea placeholder="Introduction" className="bg-raised text-ink font-sans" />
          </Form.Item>

          <Form.Item name="subtitle" label="Sous-titre" className="font-sans">
            <Input placeholder="Sous-titre de la classe" className="bg-raised text-ink font-sans" />
          </Form.Item>

        {/* Champ Couleur */}
        <Form.Item
        name="color"
        label={<span className="font-sans text-ink-soft">Couleur</span>}
      >
        <ColorPicker
          format="hex"
          value={form.getFieldValue('color')}
          onChange={(color, hexString) => {
            form.setFieldsValue({ color: hexString });
          }}
        />
      </Form.Item>


          <Form.Item label="Histoire" className="font-sans">
            <ReactQuill value={storyValue} onChange={setStoryValue} className="font-sans" />
          </Form.Item>

          <Form.Item label="Biographie" className="font-sans">
            <ReactQuill value={bioValue} onChange={setBioValue} className="font-sans" />
          </Form.Item>

          <Form.Item label="Unités associées">
            <Select
              mode="multiple"
              placeholder="Sélectionnez une ou plusieurs unités"
              value={selectedUnitIds}
              onChange={setSelectedUnitIds}
            >
              {units.map((unit) => (
                <Select.Option key={unit.id} value={unit.id}>
                  {unit.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Gestion des images de profil, header, footer et galerie */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="profileImage"
                label="Image de profil"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload name="profileImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Télécharger</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              {classData?.profileImage && (
                <Image src={classData.profileImage} alt="Profil actuel" />
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="headerImage"
                label="Image Header"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload name="headerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Télécharger</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              {classData?.headerImage && (
                <Image src={classData.headerImage} alt="Header actuel" />
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="footerImage"
                label="Image de pied de page"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload name="footerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Télécharger</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              {classData?.footerImage && (
                <Image src={classData.footerImage} alt="Pied de page actuel" />
              )}
            </Col>
          </Row>

          {/* Galerie */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="font-sans text-ink-soft">Galerie</h2>
            {visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visibleGallery.map((image, index) => (
                  <Card key={index} hoverable>
                    <div className="relative">
                      <Image src={image.url} alt={`Galerie Image ${index + 1}`} />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                        <DeleteOutlined
                          onClick={() => handleDeleteImage(image.id)}
                          style={{ color: "white", fontSize: "24px" }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <Form.Item
              name="gallery"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload name="gallery" listType="picture-card" multiple beforeUpload={() => false}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          {/* Bouton de soumission */}
          <Form.Item className="flex justify-center font-sans">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-accent text-ink-invert font-sans p-3 rounded-full"
              icon={loading ? <LoadingOutlined /> : <PlusOutlined />}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Mise à jour en cours" : "Mettre à jour"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateClass;

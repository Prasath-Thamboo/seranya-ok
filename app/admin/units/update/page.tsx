"use client";

import { Form, Input, Button, Upload, Select, Image, Row, Col, Card } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitModel, UnitType, ClassModel } from "@/lib/models/UnitModels";
import type { UploadFile } from 'antd/es/upload/interface';
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importer le style de l'éditeur Quill

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateUnit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [bioValue, setBioValue] = useState('');
  const [storyValue, setStoryValue] = useState('');
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const [visibleGallery, setVisibleGallery] = useState<{ id: string; url: string }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const numericId = id ? parseInt(id, 10) : null;

  const { addNotification } = useNotification();

  const backendUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

  // Chargement des unités et des classes
  useEffect(() => {
    if (numericId !== null) {
      const loadUnit = async () => {
        try {
          const data = await fetchUnitById(numericId);

          if (data) {
            setUnit(data);

            // Correction : Chargement des véritables objets Upload (galerie)
            const galleryUrls = data.gallery?.map((url: string, index: number) => ({
              id: data.galleryUploadIds ? data.galleryUploadIds[index].toString() : '', // ID réel de l'objet Upload
              url: url.startsWith('http') ? url : `${backendUrl}/${url}`, // Correction pour les URL complètes
            })) || [];

            // Log des URLs d'images de galerie avec les vrais IDs
            console.log("Gallery with real Upload IDs:", galleryUrls);

            setVisibleGallery(galleryUrls);

            setSelectedClassIds(data.classes?.map((c) => c.id.toString()) || []);
            setBioValue(data.bio || '');
            setStoryValue(data.story || '');

            form.setFieldsValue({
              title: data.title || '',
              intro: data.intro || '',
              subtitle: data.subtitle || '',
              type: data.type || UnitType.UNIT,
              classIds: data.classes?.map((c) => c.id.toString()) || [],
            });
          }
        } catch (error) {
          console.error("Error fetching unit:", error);
          addNotification("critical", "Erreur lors du chargement de l'unité.");
        }
      };

      const loadClasses = async () => {
        try {
          const response = await axios.get<ClassModel[]>(`${backendUrl}/classes`);
          setClasses(response.data);
        } catch (error) {
          console.error("Error fetching classes:", error);
          addNotification("critical", "Erreur lors de la récupération des classes.");
        }
      };

      loadUnit();
      loadClasses();
    }
  }, [numericId, form, addNotification, backendUrl]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      formData.append('subtitle', values.subtitle);
      formData.append('story', storyValue);
      formData.append('bio', bioValue);
      formData.append('type', values.type);

      if (selectedClassIds.length > 0) {
        selectedClassIds.forEach((classId) => {
          formData.append('classIds[]', classId);
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

      // Log des données du formulaire envoyées
      console.log("FormData sent:", formData);

      const response = await axios.patch(`${backendUrl}/units/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        addNotification("success", "Unité mise à jour avec succès!");
        router.push("/admin/units");
      } else {
        throw new Error("Mise à jour échouée");
      }
    } catch (error) {
      console.error("Error during unit update:", error);
      addNotification("critical", "Erreur lors de la mise à jour de l'unité.");
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
    setGalleryImagesToDelete((prev) => [...prev, imageId]); // Ajoute l'ID de l'objet upload
    setVisibleGallery(visibleGallery.filter((image) => image.id !== imageId));
    console.log("Images to delete (IDs):", galleryImagesToDelete); // Log des IDs des images à supprimer
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-kanit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase text-black">
          Mettre à jour l&apos;Unité
        </h1>

        <Form
          form={form}
          name="update_unit"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          <Form.Item
            name="title"
            label={<span className="text-black font-kanit">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de l'unité!" }]}
          >
            <Input placeholder="Titre de l'unité" className="bg-white text-black font-kanit" />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de l'unité!" }]}
            className="font-kanit"
          >
            <Input.TextArea placeholder="Introduction" className="bg-white text-black font-kanit" />
          </Form.Item>

          <Form.Item name="subtitle" label="Sous-titre" className="font-kanit">
            <Input placeholder="Sous-titre de l'unité" className="bg-white text-black font-kanit" />
          </Form.Item>

          <Form.Item label="Histoire" className="font-kanit">
            <ReactQuill value={storyValue} onChange={setStoryValue} className="font-kanit" />
          </Form.Item>

          <Form.Item label="Biographie" className="font-kanit">
            <ReactQuill value={bioValue} onChange={setBioValue} className="font-kanit" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Veuillez choisir un type!" }]}
            className="font-kanit"
          >
            <Select placeholder="Sélectionnez le type" className="bg-white text-black font-kanit">
              <Option className="font-kanit" value={UnitType.UNIT}>
                UNIT
              </Option>
              <Option className="font-kanit" value={UnitType.CHAMPION}>
                CHAMPION
              </Option>
            </Select>
          </Form.Item>

          <Form.Item label="Classe associée">
            <Select
              mode="multiple"
              placeholder="Sélectionnez une ou plusieurs classes"
              value={selectedClassIds}
              onChange={setSelectedClassIds}
            >
              {classes.map((classe) => (
                <Select.Option key={classe.id} value={classe.id}>
                  {classe.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
            <Col span={12}>{unit?.profileImage && <Image src={unit.profileImage} alt="Profil actuel" />}</Col>
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
            <Col span={12}>{unit?.headerImage && <Image src={unit.headerImage} alt="Header actuel" />}</Col>
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
            <Col span={12}>{unit?.footerImage && <Image src={unit.footerImage} alt="Pied de page actuel" />}</Col>
          </Row>

          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="font-kanit text-black">Galerie</h2>
            {visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visibleGallery.map((image, index) => (
                  <Card key={index} hoverable>
                    <div className="relative">
                      <Image src={image.url} alt={`Galerie Image ${index + 1}`} />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                        <DeleteOutlined onClick={() => handleDeleteImage(image.id)} style={{ color: "white", fontSize: "24px" }} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <Form.Item name="gallery" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload name="gallery" listType="picture-card" multiple beforeUpload={() => false}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-center font-kanit">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-white text-black font-kanit font-lg uppercase p-3"
              icon={<PlusOutlined />}
              loading={loading}
            >
              Mettre à jour
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateUnit;

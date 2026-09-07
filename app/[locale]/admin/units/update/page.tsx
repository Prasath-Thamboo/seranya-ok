// seranyanext/app/admin/units/update/page.tsx

"use client";

import { Form, Input, Button, Upload, Select, Image, Row, Col, Card } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitModel, UnitType, ClassModel, UpdateUnitModel } from "@/lib/models/UnitModels";
import type { UploadFile } from 'antd/es/upload/interface';
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importer le style de l'éditeur Quill
import { useWatch } from "antd/es/form/Form"; // Importer useWatch

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateUnit = () => {
  const [form] = Form.useForm<UpdateUnitModel>();
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

  // Définir l'URL de base en fonction de l'environnement
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
            // Extraction des images des uploads
            const profileImageUpload = data.uploads?.find((upload) => upload.type === "PROFILEIMAGE");
            const headerImageUpload = data.uploads?.find((upload) => upload.type === "HEADERIMAGE");
            const footerImageUpload = data.uploads?.find((upload) => upload.type === "FOOTERIMAGE");

            const adjustedUnit: UnitModel = {
              ...data,
              profileImage: profileImageUpload ? profileImageUpload.path : undefined,
              headerImage: headerImageUpload ? headerImageUpload.path : undefined,
              footerImage: footerImageUpload ? footerImageUpload.path : undefined,
            };

            setUnit(adjustedUnit);

            // Chargement des images de la galerie avec les URLs complètes
            const galleryUploads = data.uploads?.filter((upload) => upload.type === "GALERY") || [];

            const galleryUrls = galleryUploads.map((upload) => ({
              id: upload.id.toString(),
              url: upload.path,
            }));
            
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
              quote: data.quote || '', // Initialiser le champ quote
              color: data.color || '#FFFFFF', // Initialiser le colorPicker avec la couleur actuelle ou blanc
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
  const handleSubmit = async (values: UpdateUnitModel) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append('title', values.title || '');
      formData.append('intro', values.intro || '');
      formData.append('subtitle', values.subtitle || '');
      formData.append('story', storyValue);
      formData.append('bio', bioValue);
      formData.append('quote', values.quote || ''); // Ajouter la propriété quote
      formData.append('color', values.color || '#FFFFFF'); // Ajouter la propriété color
      formData.append('type', values.type || UnitType.UNIT);

      if (selectedClassIds.length > 0) {
        selectedClassIds.forEach((classId) => {
          formData.append('classIds[]', classId);
        });
      }

      if (values.profileImage && Array.isArray(values.profileImage) && values.profileImage[0]?.originFileObj) {
        formData.append('profileImage', values.profileImage[0].originFileObj as Blob);
      }
      if (values.headerImage && Array.isArray(values.headerImage) && values.headerImage[0]?.originFileObj) {
        formData.append('headerImage', values.headerImage[0].originFileObj as Blob);
      }
      if (values.footerImage && Array.isArray(values.footerImage) && values.footerImage[0]?.originFileObj) {
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

      // Log des données du formulaire envoyées (Optionnel, à retirer en production)
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
  const normFile = (e: any): UploadFile<any>[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  // Gestion de la suppression d'une image de galerie
  const handleDeleteImage = (imageId: string) => {
    setGalleryImagesToDelete((prev) => [...prev, imageId]);
    setVisibleGallery(visibleGallery.filter((image) => image.id !== imageId));
    console.log("Images to delete (IDs):", galleryImagesToDelete);
  };

  // Utiliser useWatch pour surveiller la valeur du champ 'color'
  const colorValue = useWatch('color', form);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-serif font-medium mb-8 text-center text-ink">
          Mettre à jour l&apos;Unité
        </h1>

        <Form
          form={form}
          name="update_unit"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-ink-soft font-sans"
        >
          <Form.Item
            name="title"
            label={<span className="text-ink-soft font-sans">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de l'unité!" }]}
          >
            <Input
              placeholder="Titre de l'unité"
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="text-ink-soft font-sans">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de l'unité!" }]}
            className="font-sans"
          >
            <Input.TextArea
              placeholder="Introduction"
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item name="subtitle" label={<span className="text-ink-soft font-sans">Sous-titre</span>} className="font-sans">
            <Input
              placeholder="Sous-titre de l'unité"
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item label={<span className="text-ink-soft font-sans">Histoire</span>} className="font-sans">
            <ReactQuill value={storyValue} onChange={setStoryValue} className="font-sans" />
          </Form.Item>

          <Form.Item label={<span className="text-ink-soft font-sans">Biographie</span>} className="font-sans">
            <ReactQuill value={bioValue} onChange={setBioValue} className="font-sans" />
          </Form.Item>

          {/* Nouveau Champ : Quote */}
          <Form.Item
            name="quote"
            label={<span className="text-ink-soft font-sans">Citation</span>}
            rules={[
              { required: true, message: "Veuillez entrer une citation pour l'unité!" },
              { max: 200, message: "La citation ne doit pas dépasser 200 caractères." }
            ]}
            className="font-sans"
          >
            <Input.TextArea
              placeholder="Citation de l'unité"
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          {/* Nouveau Champ : Color Picker avec Aperçu et Validation */}
          <Form.Item
            name="color"
            label={<span className="text-ink-soft font-sans">Couleur</span>}
            rules={[
              { required: true, message: "Veuillez sélectionner une couleur!" },
              {
                pattern: /^#([0-9A-F]{3}){1,2}$/i,
                message: "Veuillez sélectionner une couleur valide."
              }
            ]}
            className="font-sans"
          >
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id="color-picker"
                name="color"
                className="w-12 h-12 border-teal-500 rounded-lg cursor-pointer"
                onChange={(e) => form.setFieldsValue({ color: e.target.value })}
              />
              <div
                className="w-12 h-12 border border-gray-300 rounded"
                style={{ backgroundColor: colorValue || '#FFFFFF' }}
              />
            </div>
            <p className="text-sm text-teal-600 mt-2" id="color-picker-helper">Sélectionnez la couleur de l&apos;unité.</p>
          </Form.Item>

          <Form.Item
            name="type"
            label={<span className="text-ink-soft font-sans">Type</span>}
            rules={[{ required: true, message: "Veuillez choisir un type!" }]}
            className="font-sans"
          >
            <Select
              placeholder="Sélectionnez le type"
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            >
              <Option className="font-sans" value={UnitType.UNIT}>
                UNIT
              </Option>
              <Option className="font-sans" value={UnitType.CHAMPION}>
                CHAMPION
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="classIds"
            label={<span className="text-ink-soft font-sans">Classe associée</span>}
            className="font-sans"
          >
            <Select
              mode="multiple"
              placeholder="Sélectionnez une ou plusieurs classes"
              value={selectedClassIds}
              onChange={setSelectedClassIds}
              className="bg-raised text-ink font-sans focus:ring-teal-500 focus:border-teal-500"
            >
              {classes.map((classe) => (
                <Select.Option key={classe.id} value={classe.id}>
                  {classe.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Image de profil */}
          <Form.Item label={<span className="text-ink-soft font-sans">Image de profil</span>} className="font-sans">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {unit?.profileImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={unit.profileImage}
                      alt="Profil actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="profileImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload name="profileImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Télécharger</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* Image Header */}
          <Form.Item label={<span className="text-ink-soft font-sans">Image Header</span>} className="font-sans">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {unit?.headerImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={unit.headerImage}
                      alt="Header actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="headerImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload name="headerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Télécharger</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* Image Footer */}
          <Form.Item label={<span className="text-ink-soft font-sans">Image de pied de page</span>} className="font-sans">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {unit?.footerImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={unit.footerImage}
                      alt="Pied de page actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="footerImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload name="footerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Télécharger</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* Galerie */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4 font-sans">
            <h2 className="text-ink-soft font-sans mb-4">Galerie</h2>
            {visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {visibleGallery.map((image, index) => (
                  <Card key={index} hoverable className="overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image
                        src={image.url}
                        alt={`Galerie Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        preview={false}
                        style={{ objectFit: 'cover' }}
                      />
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

          <Form.Item className="flex justify-center font-sans">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-accent text-ink-invert font-sans text-sm p-3 rounded-full"
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

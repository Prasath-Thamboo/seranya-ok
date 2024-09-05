"use client";

import { Form, Input, Button, Upload, Select, Image, Row, Col, Card } from "antd"; 
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitModel, UnitType } from "@/lib/models/UnitModels";
import type { UploadFile } from 'antd/es/upload/interface';
import { fetchUnitById } from "@/lib/queries/UnitQueries";

const { Option } = Select;

const UpdateUnit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const [visibleGallery, setVisibleGallery] = useState<string[]>([]); // Gérer l'affichage de la galerie visible
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const id = searchParams?.get("id"); 

  const { addNotification } = useNotification();

  const backendUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL;

  useEffect(() => {
    if (id) {
      const loadUnit = async () => {
        try {
          const data = await fetchUnitById(Number(id));

          if (data) {
            // Utilisation des URLs réelles pour les images
            data.profileImage = `${backendUrl}/uploads/units/${id}/ProfileImage.png`;
            data.headerImage = `${backendUrl}/uploads/units/${id}/HeaderImage.png`;
            data.footerImage = `${backendUrl}/uploads/units/${id}/FooterImage.png`;

            setUnit(data);
            setVisibleGallery(data.gallery); // Initialiser la galerie visible

            form.setFieldsValue({
              title: data.title,
              intro: data.intro,
              subtitle: data.subtitle,
              story: data.story,
              bio: data.bio,
              type: data.type,
            });
          }
        } catch (error) {
          console.error("Error fetching unit:", error);
          addNotification("critical", "Erreur lors du chargement de l'unité.");
        }
      };
      loadUnit();
    }
  }, [id]);

  // Nouvelle fonction pour appeler directement le backend avec axios
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();

      // Ajout des champs du formulaire à formData
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      formData.append('subtitle', values.subtitle);
      formData.append('story', values.story);
      formData.append('bio', values.bio);
      formData.append('type', values.type);

      // Ajout des fichiers uploadés à formData
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

      // Ajout des images à supprimer
      if (galleryImagesToDelete.length > 0) {
        galleryImagesToDelete.forEach((imageId, index) => {
          formData.append(`galleryImagesToDelete[${index}]`, imageId);
        });
      }

      // Appel direct à l'API via axios
      const response = await axios.patch(`${backendUrl}/units/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Vérification de la réponse
      if (response.data) {
        console.log("Updated Unit Response: ", response.data);
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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleRemoveGalleryImage = (file: UploadFile) => {
    if (file.uid && typeof file.uid === 'string') {
      setGalleryImagesToDelete(prev => [...prev, file.uid]);
    }
  };

  // Suppression d'une image de la galerie
  const handleDeleteImage = (imageId: string) => {
    setGalleryImagesToDelete(prev => [...prev, imageId]);
    setVisibleGallery(visibleGallery.filter(url => url !== imageId)); // Supprime l'image visuellement
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black">
          Mettre à jour l&apos;Unité
        </h1>

        <Form
          form={form}
          name="update_unit"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          {/* Titre */}
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

          {/* Introduction */}
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

          {/* Sous-titre */}
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

          {/* Histoire */}
          <Form.Item
            name="story"
            label={<span className="font-kanit text-black">Histoire</span>}
          >
            <Input.TextArea
              placeholder="Histoire"
              className="bg-white text-black font-kanit"
              style={{ height: "6rem" }}
            />
          </Form.Item>

          {/* Biographie */}
          <Form.Item
            name="bio"
            label={<span className="font-kanit text-black">Biographie</span>}
          >
            <Input.TextArea
              placeholder="Biographie"
              className="bg-white text-black font-kanit"
              style={{ height: "6rem" }}
            />
          </Form.Item>

          {/* Type */}
          <Form.Item
            name="type"
            label={<span className="font-kanit text-black">Type</span>}
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

          {/* Profil Image */}
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Form.Item
                name="profileImage"
                label={<span className="font-kanit text-black">Télécharger une nouvelle image de profil</span>}
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
            </Col>
            <Col span={12} className="flex flex-col items-center">
              <span className="font-kanit text-black mb-2">Image de profil actuelle</span>
              {unit && unit.profileImage && (
                <Image
                  src={unit.profileImage}
                  alt="Image de profil actuelle"
                  className="rounded-lg w-full h-auto"
                  style={{ objectFit: 'cover', maxHeight: '240px' }}
                />
              )}
            </Col>
          </Row>

          {/* Header Image */}
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Form.Item
                name="headerImage"
                label={<span className="font-kanit text-black">Télécharger une nouvelle image Header</span>}
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
            </Col>
            <Col span={12} className="flex flex-col items-center">
              <span className="font-kanit text-black mb-2">Image Header actuelle</span>
              {unit && unit.headerImage && (
                <Image
                  src={unit.headerImage}
                  alt="Image Header actuelle"
                  className="rounded-lg w-full h-auto"
                  style={{ objectFit: 'cover', maxHeight: '240px' }}
                />
              )}
            </Col>
          </Row>

          {/* Footer Image */}
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Form.Item
                name="footerImage"
                label={<span className="font-kanit text-black">Télécharger une nouvelle image de pied de page</span>}
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
            </Col>
            <Col span={12} className="flex flex-col items-center">
              <span className="font-kanit text-black mb-2">Image de pied de page actuelle</span>
              {unit && unit.footerImage && (
                <Image
                  src={unit.footerImage}
                  alt="Image de pied de page actuelle"
                  className="rounded-lg w-full h-auto"
                  style={{ objectFit: 'cover', maxHeight: '240px' }}
                />
              )}
            </Col>
          </Row>

          {/* Galerie */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="font-kanit text-black mb-2">Galerie</h2>
            {unit && visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {visibleGallery.map((url, index) => (
                  <Card
                    key={index}
                    hoverable
                    cover={
                      <div className="relative">
                        <Image
                          src={url}
                          alt={`Galerie Image ${index + 1}`}
                          className="rounded-lg w-full h-auto"
                          style={{ objectFit: 'cover', maxHeight: '150px' }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                          <DeleteOutlined
                            key="delete"
                            onClick={() => handleDeleteImage(url)}
                            style={{ color: "white", fontSize: "24px" }}
                          />
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
            <Form.Item
              name="gallery"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="gallery"
                listType="picture-card"
                multiple
                beforeUpload={() => false}
                onRemove={handleRemoveGalleryImage}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          {/* Submit */}
          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-white text-black font-kanit text-lg py-3 px-10 flex items-center justify-center border border-white uppercase font-bold"
              icon={<PlusOutlined className="mr-2" />}
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

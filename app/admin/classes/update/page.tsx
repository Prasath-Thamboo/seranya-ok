"use client";

import { Form, Input, Button, Upload, Select, Image, Row, Col, Card } from "antd";
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
  const [profileImageFileList, setProfileImageFileList] = useState<UploadFile[]>([]);
  const [headerImageFileList, setHeaderImageFileList] = useState<UploadFile[]>([]);
  const [footerImageFileList, setFooterImageFileList] = useState<UploadFile[]>([]);
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

            // Initialiser les fileList
            if (data.profileImage) {
              setProfileImageFileList([
                {
                  uid: '-1',
                  name: 'Profil actuel',
                  status: 'done',
                  url: data.profileImage,
                },
              ]);
            }
            if (data.headerImage) {
              setHeaderImageFileList([
                {
                  uid: '-1',
                  name: 'Header actuel',
                  status: 'done',
                  url: data.headerImage,
                },
              ]);
            }
            if (data.footerImage) {
              setFooterImageFileList([
                {
                  uid: '-1',
                  name: 'Footer actuel',
                  status: 'done',
                  url: data.footerImage,
                },
              ]);
            }

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

      if (selectedUnitIds.length > 0) {
        selectedUnitIds.forEach((unitId) => {
          formData.append('unitIds[]', unitId);
        });
      }

      // Gestion de profileImage
      if (profileImageFileList.length > 0 && profileImageFileList[0].originFileObj) {
        formData.append('profileImage', profileImageFileList[0].originFileObj as Blob);
      } else if (profileImageFileList.length === 0 && classData?.profileImage) {
        // L'utilisateur a supprimé l'image
        formData.append('removeProfileImage', 'true');
      }

      // Gestion de headerImage
      if (headerImageFileList.length > 0 && headerImageFileList[0].originFileObj) {
        formData.append('headerImage', headerImageFileList[0].originFileObj as Blob);
      } else if (headerImageFileList.length === 0 && classData?.headerImage) {
        formData.append('removeHeaderImage', 'true');
      }

      // Gestion de footerImage
      if (footerImageFileList.length > 0 && footerImageFileList[0].originFileObj) {
        formData.append('footerImage', footerImageFileList[0].originFileObj as Blob);
      } else if (footerImageFileList.length === 0 && classData?.footerImage) {
        formData.append('removeFooterImage', 'true');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-kanit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase text-black">
          Mettre à jour la Classe
        </h1>

        <Form
          form={form}
          name="update_class"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          {/* ... autres champs du formulaire ... */}

          {/* Gestion des images de profil, header, footer */}
          <Form.Item label="Image de profil">
            <Upload
              name="profileImage"
              listType="picture-card"
              fileList={profileImageFileList}
              onChange={({ fileList }) => setProfileImageFileList(fileList)}
              beforeUpload={() => false}
              onRemove={() => {
                setProfileImageFileList([]);
                return true;
              }}
            >
              {profileImageFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Image Header">
            <Upload
              name="headerImage"
              listType="picture-card"
              fileList={headerImageFileList}
              onChange={({ fileList }) => setHeaderImageFileList(fileList)}
              beforeUpload={() => false}
              onRemove={() => {
                setHeaderImageFileList([]);
                return true;
              }}
            >
              {headerImageFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Image de pied de page">
            <Upload
              name="footerImage"
              listType="picture-card"
              fileList={footerImageFileList}
              onChange={({ fileList }) => setFooterImageFileList(fileList)}
              beforeUpload={() => false}
              onRemove={() => {
                setFooterImageFileList([]);
                return true;
              }}
            >
              {footerImageFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* ... le reste de votre code ... */}
        </Form>
      </div>
    </div>
  );
};

export default UpdateClass;

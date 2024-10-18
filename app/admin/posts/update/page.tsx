"use client";

import { Form, Input, Button, Select, Image, Row, Col, Card, Upload } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { PostModel, PostType, UpdatePostModel, ClassModel } from "@/lib/models/PostModels";
import { fetchPostById } from "@/lib/queries/PostQueries";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importer le style de l'éditeur Quill

const { Option } = Select;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdatePost = () => {
  const [form] = Form.useForm<UpdatePostModel>();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostModel | null>(null);
  const [contentValue, setContentValue] = useState('');
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const [visibleGallery, setVisibleGallery] = useState<{ id: string; url: string }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const numericId = id ? parseInt(id, 10) : null;

  const { addNotification } = useNotification();

  const backendUrl = process.env.NEXT_PUBLIC_API_URL_PROD || process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

  useEffect(() => {
    if (numericId !== null) {
      const loadPost = async () => {
        try {
          const data = await fetchPostById(numericId);

          if (data) {
            // Chargement des images de la galerie
            const galleryUploads = data.uploads?.filter((upload) => upload.type === "GALERY") || [];

            const galleryUrls = galleryUploads.map((upload) => ({
              id: upload.id.toString(),
              url: upload.path,
            }));
            
            setVisibleGallery(galleryUrls);
            setSelectedClassIds(data.postClasses?.map((c) => c.classId.toString()) || []);
            setContentValue(data.content || '');

            form.setFieldsValue({
              title: data.title || '',
              intro: data.intro || '',
              subtitle: data.subtitle || '',
              type: data.type || PostType.SCIENCE,
              classIds: data.postClasses?.map((c) => c.classId.toString()) || [],
              color: data.color || '#FFFFFF',
              // Note : Les fichiers ne peuvent pas être pré-remplis dans les inputs de type file pour des raisons de sécurité
            });
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          addNotification("critical", "Erreur lors du chargement du post.");
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

      loadPost();
      loadClasses();
    }
  }, [numericId, form, addNotification, backendUrl]);

  const handleSubmit = async (values: UpdatePostModel) => {
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
      formData.append('content', contentValue);
      formData.append('color', values.color || '#FFFFFF');
      formData.append('type', values.type || PostType.SCIENCE);

      if (selectedClassIds.length > 0) {
        selectedClassIds.forEach((classId) => {
          formData.append('classIds[]', classId);
        });
      }

      // Ajouter les images de profil, header, footer
      const appendFile = (fileField: File | null, fieldName: string) => {
        if (fileField) {
          formData.append(fieldName, fileField);
        }
      };

      appendFile(values.profileImage || null, 'profileImage');
      appendFile(values.headerImage || null, 'headerImage');
      appendFile(values.footerImage || null, 'footerImage');

      // Ajouter les nouvelles images de la galerie
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((file: File) => {
          formData.append('gallery', file);
        });
      }

      // Ajout des images de galerie à supprimer
      if (galleryImagesToDelete.length > 0) {
        galleryImagesToDelete.forEach((imageId, index) => {
          formData.append(`galleryImagesToDelete[${index}]`, imageId);
        });
      }

      // Log des données du formulaire envoyées (Optionnel, à retirer en production)
      console.log("FormData sent:", Array.from(formData.entries()));

      const response = await axios.patch<PostModel>(`${backendUrl}/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        addNotification("success", "Post mis à jour avec succès !");
        router.push("/admin/posts");
      } else {
        throw new Error("Mise à jour échouée");
      }
    } catch (error) {
      console.error("Error during post update:", error);
      addNotification("critical", "Erreur lors de la mise à jour du post.");
    } finally {
      setLoading(false);
    }
  };

  // Norme pour le fichier uploadé
  const normFile = (e: any): File[] | null => {
    if (Array.isArray(e)) {
      return e.map((file: any) => file.originFileObj).filter((file: any) => file !== undefined);
    }
    return e && e.fileList
      ? e.fileList.map((file: any) => file.originFileObj).filter((file: any) => file !== undefined)
      : null;
  };

  // Gestion de la suppression d'une image de galerie
  const handleDeleteImage = (imageId: string) => {
    setGalleryImagesToDelete((prev) => [...prev, imageId]);
    setVisibleGallery(visibleGallery.filter((image) => image.id !== imageId));
    console.log("Images to delete (IDs):", [...galleryImagesToDelete, imageId]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-kanit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase text-black">
          Mettre à jour le Post
        </h1>

        <Form
          form={form}
          name="update_post"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          <Form.Item
            name="title"
            label={<span className="text-black font-kanit">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre du post !" }]}
          >
            <Input
              placeholder="Titre du post"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="text-black font-kanit">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction du post !" }]}
          >
            <Input.TextArea
              placeholder="Introduction"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item name="subtitle" label={<span className="text-black font-kanit">Sous-titre</span>}>
            <Input
              placeholder="Sous-titre du post"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            />
          </Form.Item>

          <Form.Item label={<span className="text-black font-kanit">Contenu</span>}>
            <ReactQuill value={contentValue} onChange={setContentValue} />
          </Form.Item>

          <Form.Item
            name="color"
            label={<span className="text-black font-kanit">Couleur</span>}
            rules={[
              { required: true, message: "Veuillez sélectionner une couleur !" }, // Validation requise
              { pattern: /^#([0-9A-F]{3}){1,2}$/i, message: "Veuillez sélectionner une couleur valide." }, // Validation de format
            ]}
          >
            <Input type="color" className="w-12 h-12 p-0 border-none" />
          </Form.Item>

          <Form.Item
            name="type"
            label={<span className="text-black font-kanit">Type</span>}
            rules={[{ required: true, message: "Veuillez choisir un type !" }]}
          >
            <Select
              placeholder="Sélectionnez le type"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            >
              <Option value={PostType.SCIENCE}>Science</Option>
              <Option value={PostType.PHILO}>Philo</Option>
              <Option value={PostType.UNIVERS}>Univers</Option>
              <Option value={PostType.REGION}>Région</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="classIds"
            label={<span className="text-black font-kanit">Classe associée</span>}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionnez une ou plusieurs classes"
              value={selectedClassIds}
              onChange={setSelectedClassIds}
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
            >
              {classes.map((classe) => (
                <Option key={classe.id} value={classe.id}>
                  {classe.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Image de Profil */}
          <Form.Item label={<span className="text-black font-kanit">Image de profil</span>}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {post?.profileImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={post.profileImage}
                      alt="Profil actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      form.setFieldsValue({ profileImage: files[0] });
                    } else {
                      form.setFieldsValue({ profileImage: null });
                    }
                  }}
                />
              </Col>
            </Row>
          </Form.Item>

          {/* Image Header */}
          <Form.Item label={<span className="text-black font-kanit">Image Header</span>}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {post?.headerImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={post.headerImage}
                      alt="Header actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      form.setFieldsValue({ headerImage: files[0] });
                    } else {
                      form.setFieldsValue({ headerImage: null });
                    }
                  }}
                />
              </Col>
            </Row>
          </Form.Item>

          {/* Image Footer */}
          <Form.Item label={<span className="text-black font-kanit">Image de pied de page</span>}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                {post?.footerImage && (
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <Image
                      src={post.footerImage}
                      alt="Pied de page actuel"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      form.setFieldsValue({ footerImage: files[0] });
                    } else {
                      form.setFieldsValue({ footerImage: null });
                    }
                  }}
                />
              </Col>
            </Row>
          </Form.Item>

          {/* Galerie */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="text-black mb-4">Galerie</h2>
            {visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {visibleGallery.map((image) => (
                  <Card key={image.id} hoverable className="overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image
                        src={image.url}
                        alt={`Galerie Image ${image.id}`}
                        className="w-full h-full object-cover"
                        preview={false}
                      />
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
              label={<span className="text-black font-kanit">Galerie</span>}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="gallery"
                listType="picture-card"
                multiple
                beforeUpload={() => false} // Empêche l'upload automatique
                onRemove={() => {}} // Optionnel : Gérer la suppression si nécessaire
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Télécharger</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-teal-500 text-white font-kanit text-lg uppercase p-3 focus:ring-teal-500 focus:border-teal-500"
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

export default UpdatePost;

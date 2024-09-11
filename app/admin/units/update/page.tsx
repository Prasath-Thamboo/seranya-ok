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
  const [bioValue, setBioValue] = useState(''); // Valeur de bio en HTML
  const [storyValue, setStoryValue] = useState(''); // Valeur de story en HTML
  const [classes, setClasses] = useState<ClassModel[]>([]);  
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);  // Changement de number[] à string[]
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const [visibleGallery, setVisibleGallery] = useState<string[]>([]); 
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const id = searchParams?.get("id");
  const numericId = id ? parseInt(id, 10) : null;
  

  const { addNotification } = useNotification();

  const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';



  
  useEffect(() => {
    if (numericId !== null) { // Utilisation de l'ID numérique
      const loadUnit = async () => {
        try {
          const data = await fetchUnitById(numericId);  // ID traité comme number
  
          if (data) {
            setUnit(data);
            setVisibleGallery(data.gallery || []);
            setSelectedClassIds(data.classes?.map(c => c.id) || []);  // IDs des classes présélectionnées en string[]
            setBioValue(data.bio || '');
            setStoryValue(data.story || '');
  
            form.setFieldsValue({
              title: data.title || '',
              intro: data.intro || '',
              subtitle: data.subtitle || '',
              type: data.type || UnitType.UNIT,
              classIds: data.classes?.map(c => c.id) || [],  // IDs des classes présélectionnées
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
  }, [numericId, form, addNotification, backendUrl]); // Utilisation de numericId ici


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
  
      // Convertir les classIds en string[] avant de les ajouter à FormData
      if (selectedClassIds.length > 0) {
        selectedClassIds.forEach((classId) => {
          formData.append('classIds[]', classId);  // Changement : Utilisation des strings
        });
      }
  
      // Ajoutez d'autres champs comme les images...
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
  
      // Ajoutez les images à supprimer
      if (galleryImagesToDelete.length > 0) {
        galleryImagesToDelete.forEach((imageId, index) => {
          formData.append(`galleryImagesToDelete[${index}]`, imageId);
        });
      }
  
      const response = await axios.patch(`${backendUrl}/units/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const handleDeleteImage = (imageId: string) => {
    setGalleryImagesToDelete(prev => [...prev, imageId]);
    setVisibleGallery(visibleGallery.filter(url => url !== imageId));
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
          {/* Titre */}
          <Form.Item
            name="title"
            label={<span className="text-black font-kanit">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de l'unité!" }]}
          >
            <Input placeholder="Titre de l'unité" className="bg-white text-black font-kanit" />
          </Form.Item>

          {/* Introduction */}
          <Form.Item
            name="intro"
            label={<span className="text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de l'unité!" }]}
            className="font-kanit"
          >
            <Input.TextArea placeholder="Introduction" className="bg-white text-black font-kanit" />
          </Form.Item>

          {/* Sous-titre */}
          <Form.Item
            name="subtitle"
            label="Sous-titre"
            className="font-kanit"
          >
            <Input placeholder="Sous-titre de l'unité" className="bg-white text-black font-kanit" />
          </Form.Item>

          {/* Histoire */}
          <Form.Item
            label="Histoire"
            className="font-kanit"
          >
            <ReactQuill value={storyValue} onChange={setStoryValue} className="font-kanit" />
          </Form.Item>

          {/* Biographie */}
          <Form.Item
            label="Biographie"
            className="font-kanit"
          >
            <ReactQuill value={bioValue} onChange={setBioValue} className="font-kanit" />
          </Form.Item>

          {/* Type */}
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Veuillez choisir un type!" }]}
            className="font-kanit"
          >
            <Select placeholder="Sélectionnez le type" className="bg-white text-black font-kanit">
              <Option className="font-kanit" value={UnitType.UNIT}>UNIT</Option>
              <Option className="font-kanit" value={UnitType.CHAMPION}>CHAMPION</Option>
            </Select>
          </Form.Item>

          {/* Classe associée */}
          <Form.Item label="Classe associée">
            <Select
              mode="multiple"
              placeholder="Sélectionnez une ou plusieurs classes"
              value={selectedClassIds}
              onChange={setSelectedClassIds}  // Les IDs des classes sont gérées en tant que strings
            >
              {classes.map((classe) => (
                <Select.Option key={classe.id} value={classe.id}>
                  {classe.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Profil Image */}
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
              {unit?.profileImage && <Image src={unit.profileImage} alt="Profil actuel" />}
            </Col>
          </Row>

          {/* Header Image */}
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
              {unit?.headerImage && <Image src={unit.headerImage} alt="Header actuel" />}
            </Col>
          </Row>

          {/* Footer Image */}
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
              {unit?.footerImage && <Image src={unit.footerImage} alt="Pied de page actuel" />}
            </Col>
          </Row>

          {/* Galerie */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="font-kanit text-black">Galerie</h2>
            {visibleGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visibleGallery.map((url, index) => (
                  <Card key={index} hoverable>
                    <div className="relative">
                      <Image src={url} alt={`Galerie Image ${index + 1}`} />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                        <DeleteOutlined onClick={() => handleDeleteImage(url)} style={{ color: "white", fontSize: "24px" }} />
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

          {/* Bouton Submit */}
          <Form.Item className="flex justify-center font-kanit">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-white text-black font-kanit"
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

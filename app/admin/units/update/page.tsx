"use client";

import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUnitById, updateUnit } from "@/lib/queries/UnitQueries";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitModel, UnitType } from "@/lib/models/UnitModels";
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

const UpdateUnit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const id = searchParams?.get("id"); 

  const { addNotification } = useNotification();

  useEffect(() => {
    if (id) {
      const loadUnit = async () => {
        try {
          const data = await fetchUnitById(Number(id));

          if (data) {
            data.profileImage = data.profileImage ? `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/uploads/units/${data.id}/ProfileImage.png` : '';
            data.headerImage = data.headerImage ? `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/uploads/units/${data.id}/HeaderImage.png` : '';
            data.footerImage = data.footerImage ? `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/uploads/units/${data.id}/FooterImage.png` : '';
            data.gallery = data.gallery ? data.gallery.map((url, index) => `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/uploads/units/${data.id}/gallery/${index + 1}.png`) : [];

            setUnit(data);
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

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await updateUnit(Number(id), { ...values, galleryImagesToDelete }, token);
      addNotification("success", "Unité mise à jour avec succès!");
      router.push("/admin/units");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black font-bold">
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
            <Input.TextArea
              placeholder="Histoire"
              className="bg-white text-black font-kanit"
              style={{ height: "6rem" }}
            />
          </Form.Item>

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
              defaultFileList={
                unit && unit.profileImage
                  ? [
                      {
                        uid: '-1',
                        name: 'profileImage.png',
                        status: 'done',
                        url: unit.profileImage,
                      },
                    ]
                  : []
              }
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
              defaultFileList={
                unit && unit.headerImage
                  ? [
                      {
                        uid: '-2',
                        name: 'headerImage.png',
                        status: 'done',
                        url: unit.headerImage,
                      },
                    ]
                  : []
              }
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
              defaultFileList={
                unit && unit.footerImage
                  ? [
                      {
                        uid: '-3',
                        name: 'footerImage.png',
                        status: 'done',
                        url: unit.footerImage,
                      },
                    ]
                  : []
              }
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
              defaultFileList={
                unit && unit.gallery
                  ? unit.gallery.map((url, index) => ({
                      uid: `${index}`, // Utilisez l'index comme identifiant temporaire
                      name: `gallery_${index + 1}.png`,
                      status: 'done',
                      url: url,
                    }))
                  : []
              }
              onRemove={handleRemoveGalleryImage}
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
              Mettre à jour
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateUnit;

// spectralnext/app/admin/units/create/page.tsx

"use client";

import { Form, Input, Button, Upload, Switch, Select } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUnit } from "@/lib/queries/UnitQueries";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitType } from "@/lib/models/UnitModels";

const { Option } = Select;

const CreateUnit = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleSubmit = async (values: any) => {
    console.log("Form values:", values);  // Log pour voir les données envoyées
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await createUnit(values, token);
      addNotification("success", "Unité créée avec succès!");
      router.push("/admin/units");
    } catch (error) {
      console.error("Error during unit creation:", error);
      addNotification("critical", "Erreur lors de la création de l'unité.");
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
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black font-bold">Créer une Unité</h1>

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
            name="isPublished"
            label={<span className="font-kanit text-black">Publier</span>}
            valuePropName="checked"
          >
            <Switch />
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

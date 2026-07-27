"use client";

import { Form, Input, Button, Upload, Select, Image } from "antd";
import { UploadOutlined, LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { fetchUserById, updateUser } from "@/lib/queries/UserQueries";
import { getAccessToken } from "@/lib/queries/AuthQueries";
import { UserModel, UserRole } from "@/lib/models/UserModels";
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

const UpdateUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserModel | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { addNotification } = useNotification();

  useEffect(() => {
    if (id) {
      const loadUser = async () => {
        const token = getAccessToken();
        if (!token) return;
        try {
          const data = await fetchUserById(parseInt(id, 10), token);
          setUserData(data);

          form.setFieldsValue({
            name: data.name || '',
            lastName: data.lastName || '',
            pseudo: data.pseudo || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            status: data.status || '',
            role: data.role || UserRole.USER,
          });
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error);
          addNotification("critical", "Erreur lors du chargement de l'utilisateur.");
        }
      };

      loadUser();
    }
  }, [id, form, addNotification]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const profileImage = values.profileImage?.[0]?.originFileObj as File | undefined;

      await updateUser(
        parseInt(id, 10),
        {
          name: values.name,
          lastName: values.lastName,
          pseudo: values.pseudo,
          email: values.email,
          phone: values.phone,
          address: values.address,
          status: values.status,
          role: values.role,
          password: values.password || undefined,
          profileImage,
        },
        token,
      );

      addNotification("success", "Utilisateur mis à jour avec succès!");
      router.push("/admin/users");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      addNotification("critical", "Erreur lors de la mise à jour de l'utilisateur.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-kanit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase text-black">
          Mettre à jour l&apos;utilisateur
        </h1>

        <Form
          form={form}
          name="update_user"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="name"
              label={<span className="text-black font-kanit">Prénom</span>}
            >
              <Input placeholder="Prénom" className="bg-white text-black font-kanit" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<span className="text-black font-kanit">Nom de famille</span>}
            >
              <Input placeholder="Nom de famille" className="bg-white text-black font-kanit" />
            </Form.Item>
          </div>

          <Form.Item
            name="pseudo"
            label={<span className="text-black font-kanit">Pseudo</span>}
            rules={[{ required: true, message: "Veuillez entrer le pseudo!" }]}
          >
            <Input placeholder="Pseudo" className="bg-white text-black font-kanit" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-black font-kanit">Email</span>}
            rules={[{ required: true, type: 'email', message: "Veuillez entrer un email valide!" }]}
          >
            <Input placeholder="Email" className="bg-white text-black font-kanit" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="phone" label={<span className="text-black font-kanit">Téléphone</span>}>
              <Input placeholder="Téléphone" className="bg-white text-black font-kanit" />
            </Form.Item>

            <Form.Item name="address" label={<span className="text-black font-kanit">Adresse</span>}>
              <Input placeholder="Adresse" className="bg-white text-black font-kanit" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="role"
              label={<span className="text-black font-kanit">Rôle</span>}
              rules={[{ required: true, message: "Veuillez sélectionner un rôle!" }]}
            >
              <Select placeholder="Sélectionner un rôle">
                <Option value={UserRole.ADMIN}>ADMIN</Option>
                <Option value={UserRole.EDITOR}>EDITOR</Option>
                <Option value={UserRole.USER}>USER</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label={<span className="text-black font-kanit">Statut</span>}
              rules={[{ required: true, message: "Veuillez entrer le statut!" }]}
            >
              <Input placeholder="Statut" className="bg-white text-black font-kanit" />
            </Form.Item>
          </div>

          <Form.Item
            name="password"
            label={<span className="text-black font-kanit">Nouveau mot de passe</span>}
            extra={<span className="text-gray-400">Laisser vide pour ne pas changer le mot de passe.</span>}
          >
            <Input.Password placeholder="Nouveau mot de passe" className="bg-white text-black font-kanit" />
          </Form.Item>

          <div className="flex items-center gap-4 mb-4">
            <Form.Item
              name="profileImage"
              label={<span className="text-black font-kanit">Photo de profil</span>}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className="flex-1"
            >
              <Upload name="profileImage" listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Télécharger</Button>
              </Upload>
            </Form.Item>
            {userData?.profileImage && (
              <Image
                src={userData.profileImage}
                alt="Photo actuelle"
                width={64}
                height={64}
                style={{ borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
          </div>

          <Form.Item className="flex justify-center font-kanit">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black text-white font-kanit font-lg uppercase p-3"
              icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
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

export default UpdateUser;

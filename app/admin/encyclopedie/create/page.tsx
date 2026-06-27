'use client';

import { Form, Input, Button, Switch, Select } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDefinition } from '@/lib/queries/DefinitionQueries';
import { useNotification } from '@/components/notifications/NotificationProvider';

const { Option } = Select;

const CATEGORIES = ['Yoga', 'Bouddhisme', 'Méditation', 'Philosophie'];

const CreateDefinition = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await createDefinition({
        term: values.term,
        definition: values.definition,
        category: values.category,
        isPublished: values.isPublished ?? false,
      });
      addNotification('success', 'Définition créée avec succès!');
      router.push('/admin/encyclopedie');
    } catch (error) {
      console.error(error);
      addNotification('critical', 'Erreur lors de la création de la définition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center font-oxanium uppercase text-black">
          Ajouter une Définition
        </h1>

        <Form
          name="create_definition"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
          initialValues={{ isPublished: false }}
        >
          <Form.Item
            name="term"
            label={<span className="font-kanit text-black">Terme</span>}
            rules={[{ required: true, message: 'Veuillez entrer le terme!' }]}
          >
            <Input placeholder="Ex: Ahimsa, Nirvana, Pranayama..." style={{ height: '3rem' }} />
          </Form.Item>

          <Form.Item
            name="definition"
            label={<span className="font-kanit text-black">Définition</span>}
            rules={[{ required: true, message: 'Veuillez entrer la définition!' }]}
          >
            <Input.TextArea placeholder="Définition du terme..." style={{ minHeight: '8rem' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label={<span className="font-kanit text-black">Catégorie</span>}
          >
            <Select placeholder="Sélectionnez une catégorie" allowClear>
              {CATEGORIES.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="isPublished"
            label={<span className="font-kanit text-black">Publier</span>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black text-white font-kanit text-lg py-3 px-10 flex items-center justify-center uppercase font-bold"
              icon={loading ? <LoadingOutlined className="mr-2" /> : <PlusOutlined className="mr-2" />}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Ajouter'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateDefinition;

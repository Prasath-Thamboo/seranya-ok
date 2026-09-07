'use client';

import { Form, Input, Button, Switch, Select, DatePicker } from 'antd';
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
        termEn: values.termEn || undefined,
        definitionEn: values.definitionEn || undefined,
        categoryEn: values.categoryEn || undefined,
        isPublished: values.isPublished ?? false,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : undefined,
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
        <h1 className="text-2xl font-serif font-medium mb-8 text-center text-ink">
          Ajouter une Définition
        </h1>

        <Form
          name="create_definition"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-ink-soft font-sans"
          initialValues={{ isPublished: true }}
        >
          <Form.Item
            name="term"
            label={<span className="font-sans text-ink-soft">Terme</span>}
            rules={[{ required: true, message: 'Veuillez entrer le terme!' }]}
          >
            <Input placeholder="Ex: Ahimsa, Nirvana, Pranayama..." style={{ height: '3rem' }} />
          </Form.Item>

          <Form.Item
            name="definition"
            label={<span className="font-sans text-ink-soft">Définition</span>}
            rules={[{ required: true, message: 'Veuillez entrer la définition!' }]}
          >
            <Input.TextArea placeholder="Définition du terme..." style={{ minHeight: '8rem' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label={<span className="font-sans text-ink-soft">Catégorie</span>}
          >
            <Select placeholder="Sélectionnez une catégorie" allowClear>
              {CATEGORIES.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4 rounded-md border border-dashed border-gray-300 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Version anglaise (optionnelle — repli sur le français si vide)
            </p>

            <Form.Item
              name="termEn"
              label={<span className="font-sans text-ink-soft">Term (EN)</span>}
            >
              <Input placeholder="e.g. Ahimsa, Nirvana, Pranayama..." style={{ height: '3rem' }} />
            </Form.Item>

            <Form.Item
              name="definitionEn"
              label={<span className="font-sans text-ink-soft">Definition (EN)</span>}
            >
              <Input.TextArea placeholder="Definition of the term..." style={{ minHeight: '8rem' }} />
            </Form.Item>

            <Form.Item
              name="categoryEn"
              label={<span className="font-sans text-ink-soft">Category (EN)</span>}
              className="mb-0"
            >
              <Input placeholder="e.g. Yoga, Buddhism, Meditation, Philosophy" style={{ height: '3rem' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="isPublished"
            label={<span className="font-sans text-ink-soft">Publier</span>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="publishedAt"
            label={<span className="font-sans text-ink-soft">Date de publication (laisser vide pour publier immédiatement)</span>}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className="flex justify-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-accent text-ink-invert font-sans text-sm py-3 px-10 flex items-center justify-center rounded-full"
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

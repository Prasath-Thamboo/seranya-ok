// spectralnext/app/admin/units/create/page.tsx

"use client";

import { Form, Input, Button, Upload, Select, Steps, message } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { UnitType, ClassModel, CreateUnitModel } from "@/lib/models/UnitModels";
import type { UploadFile } from "antd/es/upload/interface";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

const { Option } = Select;
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const { Step } = Steps;

// Définir le type FileType localement
type FileType = UploadFile<any>[] | string | undefined;

const CreateUnit = () => {
  const [form] = Form.useForm<CreateUnitModel>();
  const [loading, setLoading] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [storyValue, setStoryValue] = useState("");
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const router = useRouter();
  const { addNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);

  // Définir l'URL de base en fonction de l'environnement
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL_PROD ||
    process.env.NEXT_PUBLIC_API_URL_LOCAL ||
    "http://localhost:5000";

  useEffect(() => {
    // Charger les classes disponibles
    const loadClasses = async () => {
      try {
        const response = await axios.get<ClassModel[]>(`${backendUrl}/classes`);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        addNotification("critical", "Erreur lors de la récupération des classes.");
      }
    };
    loadClasses();
  }, [backendUrl, addNotification]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found");
      }
  
      const formData = new FormData();
  
      // Ajout des champs texte au formulaire
      formData.append('title', values.title);
      formData.append('intro', values.intro);
      if (values.subtitle) formData.append('subtitle', values.subtitle);
      formData.append('story', storyValue);
      formData.append('bio', bioValue);
      formData.append('type', values.type);
  
      values.classIds.forEach((classId: string | number) => {
        formData.append('classIds[]', classId.toString()); // Convertir en string pour éviter l'erreur
      });
      
  
      // Ajout des fichiers au formulaire avec vérification
      if (values.profileImage && values.profileImage.length > 0) {
        formData.append('profileImage', values.profileImage[0].originFileObj);
      }
      if (values.headerImage && values.headerImage.length > 0) {
        formData.append('headerImage', values.headerImage[0].originFileObj);
      }
      if (values.footerImage && values.footerImage.length > 0) {
        formData.append('footerImage', values.footerImage[0].originFileObj);
      }
      if (values.gallery && values.gallery.length > 0) {
        values.gallery.forEach((file: any) => {
          formData.append('gallery', file.originFileObj);
        });
      }
      // Envoi du formulaire au backend avec Axios
      const response = await axios.post(`${backendUrl}/units`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        addNotification("success", "Unité créée avec succès!");
        router.push("/admin/units");
      } else {
        throw new Error("Création échouée");
      }
    } catch (error) {
      console.error("Error during unit creation:", error);
      addNotification("critical", "Erreur lors de la création de l'unité.");
    } finally {
      setLoading(false);
    }
  };

  // Convertir l'événement en fileList pour les Uploads
  const normFile = (e: any): UploadFile<any>[] | string | undefined => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Définir les étapes du formulaire
  const steps = [
    {
      title: "Informations de Base",
      content: (
        <>
          <Form.Item
            name="title"
            label={<span className="font-kanit text-black">Titre</span>}
            rules={[{ required: true, message: "Veuillez entrer le titre de l'unité!" }]}
          >
            <Input
              placeholder="Titre de l'unité"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
              style={{ height: "3rem" }}
              onChange={() => handleStepChange(0)}
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label={<span className="font-kanit text-black">Introduction</span>}
            rules={[{ required: true, message: "Veuillez entrer l'introduction de l'unité!" }]}
          >
            <Input.TextArea
              placeholder="Introduction"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
              style={{ height: "6rem" }}
              onChange={() => handleStepChange(0)}
            />
          </Form.Item>

          <Form.Item name="subtitle" label={<span className="font-kanit text-black">Sous-titre</span>}>
            <Input
              placeholder="Sous-titre de l'unité"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
              style={{ height: "3rem" }}
              onChange={() => handleStepChange(0)}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Contenu",
      content: (
        <>
          <Form.Item name="story" label={<span className="font-kanit text-black">Histoire</span>}>
            <ReactQuill value={storyValue} onChange={setStoryValue} className="font-kanit" />
          </Form.Item>

          <Form.Item name="bio" label={<span className="font-kanit text-black">Biographie</span>}>
            <ReactQuill value={bioValue} onChange={setBioValue} className="font-kanit" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Personnalisation",
      content: (
        <>
          {/* Nouveau Champ : Quote */}
          <Form.Item
            name="quote"
            label={<span className="font-kanit text-black">Citation</span>}
            rules={[
              { required: true, message: "Veuillez entrer une citation pour l'unité!" },
              { max: 200, message: "La citation ne doit pas dépasser 200 caractères." },
            ]}
          >
            <Input.TextArea
              placeholder="Citation de l'unité"
              className="bg-white text-black font-kanit focus:ring-teal-500 focus:border-teal-500"
              onChange={() => handleStepChange(2)}
            />
          </Form.Item>

          {/* Nouveau Champ : Color Picker avec Validation */}
          <Form.Item
            name="color"
            label={<span className="font-kanit text-black">Couleur</span>}
            rules={[
              { required: true, message: "Veuillez sélectionner une couleur!" },
              {
                pattern: /^#([0-9A-F]{3}){1,2}$/i,
                message: "Veuillez sélectionner une couleur valide.",
              },
            ]}
          >
            <div className="max-w-sm space-y-4">
              <div>
                <label htmlFor="color-picker" className="block text-sm font-medium mb-2">
                  Choisissez une couleur
                </label>
                <div className="relative">
                  <input
                    type="color"
                    id="color-picker"
                    name="color"
                    className="py-3 px-4 block w-full border-teal-500 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500"
                    defaultValue="#FFFFFF"
                    onChange={(e) => {
                      form.setFieldsValue({ color: e.target.value });
                      handleStepChange(2);
                    }}
                  />
                </div>
                <p className="text-sm text-teal-600 mt-2" id="color-picker-helper">
                  Sélectionnez la couleur de l&apos;unité.
                </p>
              </div>
            </div>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Images",
      content: (
        <>
          <Form.Item
            name="profileImage"
            label={<span className="font-kanit text-black">Image de profil</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="profileImage" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="headerImage"
            label={<span className="font-kanit text-black">Image Header</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="headerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="footerImage"
            label={<span className="font-kanit text-black">Image de pied de page</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="footerImage" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="gallery"
            label={<span className="font-kanit text-black">Galerie</span>}
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
        </>
      ),
    },
  ];

  // Fonction pour gérer le changement de step en fonction de la validation
  const handleStepChange = (step: number) => {
    // Vérifier si le step précédent est validé
    let valid: boolean = true;
    switch (step) {
      case 0:
        valid = Boolean(form.getFieldValue("title") && form.getFieldValue("intro"));
        break;
      case 1:
        valid = Boolean(bioValue && storyValue);
        break;
      case 2:
        valid = Boolean(form.getFieldValue("quote") && form.getFieldValue("color"));
        break;
      default:
        valid = true;
    }
    if (valid && step > currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 p-4 font-kanit">
      {/* Stepper Fixé à Gauche */}
      <div className="w-1/4 pr-4 fixed left-4 top-1/4">
        <Steps direction="vertical" current={currentStep}>
          {steps.map((item, index) => (
            <Step
              key={item.title}
              title={item.title}
              status={
                currentStep > index
                  ? "finish"
                  : currentStep === index
                  ? "process"
                  : "wait"
              }
            />
          ))}
        </Steps>
      </div>

      {/* Formulaire de Création */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl ml-1/4">
        <h1 className="text-2xl font-bold mb-8 text-center uppercase text-black">
          Créer une Unité
        </h1>

        <Form
          form={form}
          name="create_unit"
          onFinish={handleSubmit}
          layout="vertical"
          className="text-black font-kanit"
        >
          {steps[currentStep].content}

          <Form.Item className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                type="default"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="font-kanit"
              >
                Précédent
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  // Valider les champs actuels avant de passer au suivant
                  form
                    .validateFields()
                    .then(() => {
                      setCurrentStep(currentStep + 1);
                    })
                    .catch(() => {
                      message.error("Veuillez remplir les champs requis.");
                    });
                }}
                className="font-kanit"
              >
                Suivant
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-white text-black font-kanit font-lg uppercase p-3 flex items-center justify-center border border-white focus:ring-teal-500 focus:border-teal-500"
                icon={<PlusOutlined className="mr-2" />}
              >
                Créer
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateUnit;

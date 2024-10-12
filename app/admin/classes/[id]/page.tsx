"use client";

import { Tabs, Image } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchClassById } from '@/lib/queries/ClassQueries';
import { ClassModel, UploadType } from '@/lib/models/ClassModels';
import DividersWithHeading from '@/components/DividersWhithHeading';
import Reader from '@/components/Reader';
import { FaEdit } from 'react-icons/fa';

const { TabPane } = Tabs;

// Fonction d'aide pour obtenir une URL d'image valide
const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/images/backgrounds/placeholder.jpg'; // Path to your placeholder image

  // Vérifier si l'URL commence par 'http' ou 'https'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Sinon, utiliser un placeholder ou construire une URL locale si nécessaire
  return '/images/backgrounds/placeholder.jpg'; // Ajustez selon vos besoins
};

const ClassViewPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [cls, setCls] = useState<ClassModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClassData = async () => {
      if (id) {
        try {
          const fetchedClass = await fetchClassById(id);

          if (fetchedClass) {
            // Extraire les images en utilisant les types d'uploads
            const profileImageUpload = fetchedClass.uploads.find(
              (upload) => upload.type === UploadType.PROFILEIMAGE
            );
            const profileImage = profileImageUpload ? profileImageUpload.path : null;

            const headerImageUpload = fetchedClass.uploads.find(
              (upload) => upload.type === UploadType.HEADERIMAGE
            );
            const headerImage = headerImageUpload ? headerImageUpload.path : null;

            const footerImageUpload = fetchedClass.uploads.find(
              (upload) => upload.type === UploadType.FOOTERIMAGE
            );
            const footerImage = footerImageUpload ? footerImageUpload.path : null;

            const galleryUploads = fetchedClass.uploads.filter(
              (upload) => upload.type === UploadType.GALERY
            );
            const gallery =
              galleryUploads.length > 0
                ? galleryUploads.map((upload) => upload.path)
                : [];

            // Créer un objet de classe avec les images
            const classWithImages = {
              ...fetchedClass,
              profileImage,
              headerImage,
              footerImage,
              gallery,
            };

            setCls(classWithImages);
          }
        } catch (error) {
          console.error('Error fetching class:', error);
        }
      }
    };
    fetchClassData();
  }, [id]);

  if (!cls) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl font-kanit text-black relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
            onClick={() => router.push(`/admin/classes/update?id=${id}`)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>

        <Tabs defaultActiveKey="1" centered className="font-kanit text-black">
          <TabPane tab="Général" key="1">
            <div className="flex flex-col items-center mb-8">
              <Image
                src={getImageUrl(cls.profileImage)}
                alt={`${cls.title} Profile`}
                className="rounded-lg mb-4"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '240px',
                  objectFit: 'cover',
                }}
                preview={true}
              />
              <DividersWithHeading
                text={cls.title}
                customStyle="text-4xl text-black font-bold font-oxanium uppercase text-center"
              />
              {cls.subtitle && (
                <p className="text-lg italic text-center text-gray-600 mb-4">
                  {cls.subtitle}
                </p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black font-oxanium mb-4">
                Introduction
              </h2>
              <p className="text-lg mb-4">{cls.intro}</p>
            </div>

            <div className="flex justify-center mb-8">
              {cls.headerImage ? (
                <Image
                  src={getImageUrl(cls.headerImage)}
                  alt={`${cls.title} Header`}
                  className="rounded-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'cover',
                  }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Aucune image d&apos;en-tête disponible.
                </p>
              )}
            </div>

            <div className="flex justify-center mb-8">
              {cls.footerImage ? (
                <Image
                  src={getImageUrl(cls.footerImage)}
                  alt={`${cls.title} Footer`}
                  className="rounded-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '240px',
                    objectFit: 'cover',
                  }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Aucune image de pied de page disponible.
                </p>
              )}
            </div>

            <div className="text-sm text-gray-500 italic mt-8">
              <p className="mb-2">
                Créé le: {new Date(cls.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-2">
                Mis à jour le: {new Date(cls.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right mt-4">
              <p className="text-lg font-semibold">
                Statut: {cls.isPublished ? 'Publié' : 'Non publié'}
              </p>
            </div>
          </TabPane>

          <TabPane tab="Bio" key="2">
            <Reader text={cls.bio || 'Aucune biographie disponible.'} />
          </TabPane>

          <TabPane tab="Histoire" key="3">
            <Reader text={cls.story || 'Aucune histoire disponible.'} />
          </TabPane>

          <TabPane tab="Galerie" key="4">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Galerie</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cls.gallery && cls.gallery.length > 0 ? (
                  cls.gallery.map((imgUrl, index) => (
                    <Image
                      key={index}
                      src={getImageUrl(imgUrl)}
                      alt={`${cls.title} Gallery Image ${index + 1}`}
                      className="rounded-lg"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                      preview={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center italic">
                    Aucune image disponible dans la galerie.
                  </p>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassViewPage;

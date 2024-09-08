"use client";

import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchUnitById } from '@/lib/queries/UnitQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { Image } from 'antd';
import DividersWithHeading from '@/components/DividersWhithHeading';
import Reader from '@/components/Reader';
import { FaEdit } from 'react-icons/fa';

const { TabPane } = Tabs;

const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_LOCAL;

const UnitViewPage = () => {
  const params = useParams();
  const paramId = params?.id as string | undefined; // Assurez-vous que l'id est une chaîne de caractères
  const id = paramId ? parseInt(paramId, 10) : null;
  const [unit, setUnit] = useState<UnitModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUnitData = async () => {
      if (id) {
        try {
          const fetchedUnit = await fetchUnitById(id);

          if (fetchedUnit) {
            fetchedUnit.profileImage = `${backendUrl}/uploads/units/${id}/ProfileImage.png`;
            fetchedUnit.headerImage = `${backendUrl}/uploads/units/${id}/HeaderImage.png`;
            fetchedUnit.footerImage = `${backendUrl}/uploads/units/${id}/FooterImage.png`;

            // Les images de la galerie sont maintenant directement dans la propriété 'gallery'
            setUnit(fetchedUnit);
          }
        } catch (error) {
          console.error('Error fetching unit:', error);
        }
      }
    };
    fetchUnitData();
  }, [id, backendUrl]);

  if (!unit) {
    return <div>Loading...</div>;
  }

  const creatorPseudo = unit.users?.[0]?.user?.pseudo || 'Inconnu';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl font-kanit text-black relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
            onClick={() => router.push(`/admin/units/update?id=${id}`)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>

        <Tabs defaultActiveKey="1" centered className="font-kanit text-black">
          <TabPane tab="Général" key="1">
            <div className="flex flex-col items-center mb-8">
              <Image
                src={unit.profileImage || '/images/backgrounds/placeholder.jpg'}
                alt={`${unit.title} Profile`}
                className="rounded-lg mb-4"
                style={{ width: '100%', height: 'auto', maxHeight: '240px', objectFit: 'cover' }}
                preview={true}
              />
              <DividersWithHeading 
                text={unit.title} 
                badge={unit.type} 
                customStyle="text-4xl text-black font-bold font-oxanium uppercase text-center" 
              />
              {unit.subtitle && (
                <p className="text-lg italic text-center text-gray-600 mb-4">{unit.subtitle}</p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black font-oxanium mb-4">Introduction</h2>
              <p className="text-lg mb-4">{unit.intro}</p>
            </div>

            <div className="flex justify-center mb-8">
              {unit.headerImage ? (
                <Image
                  src={unit.headerImage}
                  alt={`${unit.title} Header`}
                  className="rounded-lg"
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">Aucune image d&apos;en-tête disponible.</p>
              )}
            </div>

            <div className="flex justify-center mb-8">
              {unit.footerImage ? (
                <Image
                  src={unit.footerImage}
                  alt={`${unit.title} Footer`}
                  className="rounded-lg"
                  style={{ width: '100%', height: 'auto', maxHeight: '240px', objectFit: 'cover' }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">Aucune image de pied de page disponible.</p>
              )}
            </div>

            <div className="text-sm text-gray-500 italic mt-8">
              <p className="mb-2">Créé le: {new Date(unit.createdAt).toLocaleDateString()}</p>
              <p className="mb-2">Mis à jour le: {new Date(unit.updatedAt).toLocaleDateString()}</p>
              <p className="mb-2">Créé/modifié par: {creatorPseudo}</p>
            </div>

            <div className="text-right mt-4">
              <p className="text-lg font-semibold">
                Statut: {unit.isPublished ? 'Publié' : 'Non publié'}
              </p>
            </div>
          </TabPane>

          <TabPane tab="Bio" key="2">
            <Reader text={unit.bio || 'Aucune biographie disponible.'} />
          </TabPane>

          <TabPane tab="Histoire" key="3">
            <Reader text={unit.story || 'Aucune histoire disponible.'} />
          </TabPane>

          <TabPane tab="Galerie" key="4">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Galerie</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {unit.gallery && unit.gallery.length > 0 ? (
                  unit.gallery.map((imgUrl, index) => (
                    <Image
                      key={index}
                      src={imgUrl}
                      alt={`${unit.title} Gallery Image ${index + 1}`}
                      className="rounded-lg"
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      preview={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center italic">Aucune image disponible dans la galerie.</p>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitViewPage;

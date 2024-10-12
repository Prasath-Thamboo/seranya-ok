"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import CardList from '@/components/CardList';
import { SidebarContent } from '@/components/dashboard/SidebarContent';
import { fetchUnits } from '@/lib/queries/UnitQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';
import { useNotification } from '@/components/notifications/NotificationProvider';

const UnitsPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { addNotification } = useNotification();

  // Définir l'URL de base en fonction de l'environnement
  const backendUrl = process.env.NEXT_PUBLIC_API_URL_PROD || process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mode mobile si l'écran <= 768px
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUnits = await fetchUnits();

        const unitsWithImages = fetchedUnits.map((unit: UnitModel) => {
          // Construction de l'URL de l'image de profil comme dans la page de vue détaillée
          const profileImage = `${backendUrl}/uploads/units/${unit.id}/ProfileImage.png`;

          return {
            ...unit,
            profileImage,
          };
        });

        setUnits(unitsWithImages);
      } catch (error) {
        console.error('Erreur lors de la récupération des unités:', error);
        addNotification('critical', 'Erreur lors de la récupération des unités.');
      }
    };
    fetchData();
  }, [addNotification, backendUrl]);

  const handleDelete = async (deletedUnit: UnitModel) => {
    try {
      // Re-fetch data from the server after a delete
      const fetchedUnits = await fetchUnits();
      const unitsWithImages = fetchedUnits.map((unit: UnitModel) => {
        const profileImage = `${backendUrl}/uploads/units/${unit.id}/ProfileImage.png`;
        return {
          ...unit,
          profileImage,
        };
      });
      setUnits(unitsWithImages);
      addNotification('success', 'Unité supprimée avec succès.');
    } catch (error) {
      console.error("Erreur lors de la mise à jour des unités après suppression :", error);
      addNotification('critical', 'Erreur lors de la mise à jour des unités après suppression.');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Titre',
        accessor: 'title',
        Cell: ({ row, value }: any) => (
          <div className="flex flex-col items-center gap-2 p-5">
            <Image
              src={row.original.profileImage || '/images/backgrounds/placeholder.jpg'}
              alt={`${value}'s Avatar`}
              width={150}
              height={150}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
              preview={true} // Permet le zoom au clic
            />
            <div>{value}</div>
          </div>
        ),
      },
      {
        Header: 'Introduction',
        accessor: 'intro',
        Cell: ({ value }: any) => <div className="whitespace-pre-wrap">{value}</div>,
      },
      {
        Header: 'Sous-titre',
        accessor: 'subtitle',
        Cell: ({ value }: any) => <div className="whitespace-pre-wrap">{value}</div>,
      },
      {
        Header: 'Histoire',
        accessor: 'story',
        Cell: ({ value }: any) => <div className="whitespace-pre-wrap">{value}</div>,
      },
      {
        Header: 'Biographie',
        accessor: 'bio',
        Cell: ({ value }: any) => <div className="whitespace-pre-wrap">{value}</div>,
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: any) => <Badge type={value} />,
      },
    ],
    []
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Units</h1>
      {isMobile ? (
        <>
          <CardList units={units} itemsPerPage={4} />
          <SidebarContent collapsed={false} toggleSidebar={() => {}} />
        </>
      ) : (
        <Table
          data={units}
          columns={columns}
          createButtonText="Créer une unité"
          createUrl="/admin/units/create"
          onDelete={handleDelete}
          baseRoute="admin/units"
          apiRoute="units"
          itemType="unité"
        />
      )}
    </div>
  );
};

export default UnitsPage;

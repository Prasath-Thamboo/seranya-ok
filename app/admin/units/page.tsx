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
          const profileImageUpload = unit.uploads?.find(upload => upload.type === 'PROFILEIMAGE');
          const profileImage = profileImageUpload ? profileImageUpload.path : '/images/backgrounds/placeholder.jpg';
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
  }, [addNotification]);

  const handleDelete = async (deletedUnit: UnitModel) => {
    try {
      // Re-fetch data from the server after a delete
      const fetchedUnits = await fetchUnits();
      const unitsWithImages = fetchedUnits.map((unit: UnitModel) => {
        const profileImageUpload = unit.uploads?.find(upload => upload.type === 'PROFILEIMAGE');
        const profileImage = profileImageUpload ? profileImageUpload.path : '/images/backgrounds/placeholder.jpg';
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
          <div className="flex gap-2 items-center">
            <Image
              src={row.original.profileImage || '/images/backgrounds/placeholder.jpg'}
              alt={`${value}'s Avatar`}
              width={80}
              height={80}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
              preview={true}
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

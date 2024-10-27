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
import Link from 'next/link';
import { FaEye, FaEdit } from 'react-icons/fa';

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

        // Pas besoin de reconstruire l'URL de l'image de profil, on utilise directement unit.profileImage
        setUnits(fetchedUnits);
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
      setUnits(fetchedUnits);
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
        Header: 'Sous-titre',
        accessor: 'subtitle',
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

  // Définir la fonction renderItem pour les unités
  const renderUnitItem = (unit: UnitModel) => (
    <div
      key={unit.id}
      className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4"
    >
      <div className="relative w-full h-48">
        <Image
          src={unit.profileImage || '/images/backgrounds/placeholder.jpg'}
          alt={`${unit.title}'s Avatar`}
          className="rounded-lg w-full h-full object-cover"
          style={{ objectFit: 'cover', borderRadius: '8px', maxHeight: '100%' }}
        />
      </div>
      <h3 className="text-xl font-bold text-center text-black font-iceberg uppercase">
        {unit.title}
      </h3>
      <p className="text-center text-gray-600">{unit.intro}</p>

      <div className="flex space-x-2">
        <Link href={`/admin/units/${unit.id}`}>
          <div className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition cursor-pointer">
            <FaEye />
          </div>
        </Link>
        <Link href={`/admin/units/update?id=${unit.id}`}>
          <div className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition cursor-pointer">
            <FaEdit />
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Units</h1>
      {isMobile ? (
        <>
          <CardList items={units} itemsPerPage={4} renderItem={renderUnitItem} />
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

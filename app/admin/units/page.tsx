"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchUnits } from '@/lib/queries/UnitQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { Image } from 'antd';

const UnitsPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUnits = await fetchUnits();
      setUnits(fetchedUnits);
    };
    fetchData();
  }, []);

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
              width={120}  // Largeur de l'image de profil en mode paysage
              height={80}  // Hauteur de l'image
              style={{ borderRadius: '8px', objectFit: 'cover' }}  // Arrondir les bords et ajuster le contenu
              preview={true}  // La prévisualisation s'active uniquement au clic
            />
            <div>{value}</div>
          </div>
        ),
      },
      {
        Header: 'Introduction',
        accessor: 'intro',
      },
      {
        Header: 'Sous-titre',
        accessor: 'subtitle',
      },
      {
        Header: 'Histoire',
        accessor: 'story',
      },
      {
        Header: 'Biographie',
        accessor: 'bio',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Units</h1>
      <Table data={units} columns={columns} createButtonText="Créer une unité" createUrl="/admin/units/create" />
    </div>
  );
};

export default UnitsPage;

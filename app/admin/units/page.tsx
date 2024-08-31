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
      const unitsWithImages = fetchedUnits.map(unit => ({
        ...unit,
        profileImage: `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/uploads/units/${unit.id}/ProfileImage.png`,
      }));
      setUnits(unitsWithImages);
    };
    fetchData();
  }, []);

  const handleDelete = (deletedUnit: UnitModel) => {
    setUnits(units.filter(unit => unit.id !== deletedUnit.id));
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
    <div className="p-6 font-kanit">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Units</h1>
      <Table 
        data={units} 
        columns={columns} 
        createButtonText="Créer une unité" 
        createUrl="/admin/units/create"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UnitsPage;

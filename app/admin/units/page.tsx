"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import CardList from '@/components/CardList';
import { SidebarContent } from '@/components/dashboard/SidebarContent'; // Importation du SidebarContent
import { fetchUnits } from '@/lib/queries/UnitQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const UnitsPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
      const fetchedUnits = await fetchUnits();
      const unitsWithImages = fetchedUnits.map((unit) => ({
        ...unit,
        profileImage: `${BASE_URL}/uploads/units/${unit.id}/ProfileImage.png`,
      }));
      setUnits(unitsWithImages);
    };
    fetchData();
  }, []);

  const handleDelete = (deletedUnit: UnitModel) => {
    setUnits(units.filter((unit) => unit.id !== deletedUnit.id));
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
          <SidebarContent collapsed={false} toggleSidebar={() => {}} /> {/* Sidebar en bas */}
        </>
      ) : (
        <Table
          data={units}
          columns={columns}
          createButtonText="Créer une unité"
          createUrl="/admin/units/create"
          onDelete={handleDelete}
          baseRoute="admin/units"
        />
      )}
    </div>
  );
};

export default UnitsPage;

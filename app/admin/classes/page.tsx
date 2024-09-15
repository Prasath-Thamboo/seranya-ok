"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchClasses } from '@/lib/queries/ClassQueries';
import { ClassModel } from '@/lib/models/ClassModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';

// Utiliser l'URL du backend en fonction de l'environnement
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const ClassesPage = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedClasses = await fetchClasses();
      
      const classesWithImages = fetchedClasses.map((cls: ClassModel) => {
        // Récupération du chemin de l'image du profil, en tenant compte du format renvoyé par le backend
        const profileImage = cls.uploads.find(upload => upload.type === 'PROFILEIMAGE');
        const imageUrl = profileImage
          ? `${BASE_URL}/uploads/class/${cls.id}/PROFILEIMAGE.png`
          : '/images/backgrounds/placeholder.jpg';

        return {
          ...cls,
          imageUrl, // Ajout de l'URL correcte de l'image
        };
      });

      setClasses(classesWithImages);
    };
    fetchData();
  }, []);

  const handleDelete = (deletedClass: ClassModel) => {
    setClasses(classes.filter(cls => cls.id !== deletedClass.id));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Titre',
        accessor: 'title',
        Cell: ({ row, value }: { row: any; value: string }) => (
          <div className="flex gap-2 items-center">
            <Image 
              src={row.original.imageUrl} 
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
        Cell: ({ value }: { value: string }) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Sous-titre',
        accessor: 'subtitle',
        Cell: ({ value }: { value: string }) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Histoire',
        accessor: 'story',
        Cell: ({ value }: { value: string }) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Biographie',
        accessor: 'bio',
        Cell: ({ value }: { value: string }) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: { value: string }) => (
          <Badge type={value} />
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 font-kanit">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Classes</h1>
      <Table 
  data={classes} 
  columns={columns} 
  createButtonText="Créer une classe" 
  createUrl="/admin/classes/create"
  onDelete={handleDelete}
  baseRoute="admin/classes" // Ajoute cette ligne pour définir le bon chemin de redirection
/>

    </div>
  );
};

export default ClassesPage;

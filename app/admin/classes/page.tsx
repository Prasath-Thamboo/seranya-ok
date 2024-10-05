"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import CardList from '@/components/CardList';
import { SidebarContent } from '@/components/dashboard/SidebarContent';
import { fetchClasses } from '@/lib/queries/ClassQueries';
import { ClassModel } from '@/lib/models/ClassModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const ClassesPage = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
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
      const fetchedClasses = await fetchClasses();

      const classesWithImages = fetchedClasses.map((cls: ClassModel) => {
        const profileImageUpload = cls.uploads.find(upload => upload.type === 'PROFILEIMAGE');
        const profileImage = profileImageUpload ? profileImageUpload.path : '/images/backgrounds/placeholder.jpg';
        return {
          ...cls,
          profileImage,
        };
      });

      setClasses(classesWithImages);
    };
    fetchData();
  }, []);


  const handleDelete = async (deletedClass: ClassModel) => {
    try {
      // Re-fetch data from the server after a delete
      const fetchedClasses = await fetchClasses();
      const classesWithImages = fetchedClasses.map((cls: ClassModel) => ({
        ...cls,
        profileImage: cls.uploads.find(upload => upload.type === 'PROFILEIMAGE')?.path || '/images/backgrounds/placeholder.jpg',
      }));
      setClasses(classesWithImages);
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour des classes après suppression :',
        error,
      );
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
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Sous-titre',
        accessor: 'subtitle',
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Histoire',
        accessor: 'story',
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Biographie',
        accessor: 'bio',
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap">{value}</div>
        ),
      },
      {
        Header: 'Publié',
        accessor: 'isPublished',
        Cell: ({ value }: { value: boolean }) => (
          <Badge type={value ? 'Published' : 'Draft'} />
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">
        Classes
      </h1>
    

        <Table
          data={classes}
          columns={columns}
          createButtonText="Créer une classe"
          createUrl="/admin/classes/create"
          onDelete={handleDelete}
          baseRoute="admin/classes"
        />

    </div>
  );
};

export default ClassesPage;

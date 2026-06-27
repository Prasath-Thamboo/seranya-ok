'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchTutorials, deleteTutorial } from '@/lib/queries/TutorialQueries';
import { TutorialModel } from '@/lib/models/TutorialModels';
import { useNotification } from '@/components/notifications/NotificationProvider';

const TutorielsAdminPage = () => {
  const [tutorials, setTutorials] = useState<TutorialModel[]>([]);
  const { addNotification } = useNotification();

  const loadTutorials = async () => {
    try {
      const data = await fetchTutorials();
      setTutorials(data);
    } catch {
      addNotification('critical', 'Erreur lors de la récupération des tutoriels.');
    }
  };

  useEffect(() => {
    loadTutorials();
  }, []);

  const handleDelete = async () => {
    await loadTutorials();
    addNotification('success', 'Tutoriel supprimé avec succès.');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Titre',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }: any) => <div className="max-w-xs truncate">{value || '—'}</div>,
      },
      {
        Header: 'URL Vidéo',
        accessor: 'videoUrl',
        Cell: ({ value }: any) => (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline truncate max-w-xs block">
            {value}
          </a>
        ),
      },
      {
        Header: 'Publié',
        accessor: 'isPublished',
        Cell: ({ value }: any) => (
          <span className={`px-2 py-1 rounded text-xs font-bold ${value ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {value ? 'Oui' : 'Non'}
          </span>
        ),
      },
      {
        Header: 'Créé le',
        accessor: 'createdAt',
        Cell: ({ value }: any) => <div>{new Date(value).toLocaleDateString('fr-FR')}</div>,
      },
    ],
    []
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Tutoriels</h1>
      <Table
        data={tutorials}
        columns={columns}
        createButtonText="Créer un tutoriel"
        createUrl="/admin/tutoriels/create"
        onDelete={handleDelete}
        baseRoute="admin/tutoriels"
        apiRoute="tutorials"
        itemType="tutoriel"
      />
    </div>
  );
};

export default TutorielsAdminPage;

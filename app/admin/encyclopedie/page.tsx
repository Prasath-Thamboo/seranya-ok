'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchDefinitions } from '@/lib/queries/DefinitionQueries';
import { DefinitionModel } from '@/lib/models/DefinitionModels';
import { useNotification } from '@/components/notifications/NotificationProvider';

const EncyclopedieAdminPage = () => {
  const [definitions, setDefinitions] = useState<DefinitionModel[]>([]);
  const { addNotification } = useNotification();

  const loadDefinitions = async () => {
    try {
      const data = await fetchDefinitions();
      setDefinitions(data);
    } catch {
      addNotification('critical', 'Erreur lors de la récupération des définitions.');
    }
  };

  useEffect(() => {
    loadDefinitions();
  }, []);

  const handleDelete = async () => {
    await loadDefinitions();
    addNotification('success', 'Définition supprimée avec succès.');
  };

  const columns = useMemo(
    () => [
      { Header: 'Terme', accessor: 'term' },
      {
        Header: 'Définition',
        accessor: 'definition',
        Cell: ({ value }: any) => (
          <div className="max-w-sm truncate">{value}</div>
        ),
      },
      {
        Header: 'Catégorie',
        accessor: 'category',
        Cell: ({ value }: any) => <div>{value || '—'}</div>,
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
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Encyclopédie</h1>
      <Table
        data={definitions}
        columns={columns}
        createButtonText="Ajouter une définition"
        createUrl="/admin/encyclopedie/create"
        onDelete={handleDelete}
        baseRoute="admin/encyclopedie"
        apiRoute="definitions"
        itemType="définition"
      />
    </div>
  );
};

export default EncyclopedieAdminPage;

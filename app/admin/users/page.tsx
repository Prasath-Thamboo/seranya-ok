"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchUsers } from '@/lib/queries/UserQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { Image } from 'antd';
import { getAccessToken } from '@/lib/queries/AuthQueries';
import { useNotification } from '@/components/notifications/NotificationProvider';

const UsersPage = () => {
  const [users, setUsers] = useState<RegisterUserModel[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const fetchedUsers = await fetchUsers(token);
          const usersWithImages = fetchedUsers.map(user => ({
            ...user,
            profileImage: typeof user.profileImage === 'string' ? user.profileImage : '/images/backgrounds/placeholder.jpg',
          }));
          setUsers(usersWithImages as RegisterUserModel[]);
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs:", error);
          addNotification("critical", "Erreur lors de la récupération des utilisateurs.");
        }
      } else {
        addNotification("critical", "Token d'accès non trouvé.");
      }
    };
    fetchData();
  }, [addNotification]);

  const handleDelete = async (deletedUser: RegisterUserModel) => {
    try {
      // Re-fetch data from the server after a delete
      const token = getAccessToken();
      if (token) {
        const fetchedUsers = await fetchUsers(token);
        const usersWithImages = fetchedUsers.map(user => ({
          ...user,
          profileImage: typeof user.profileImage === 'string' ? user.profileImage : '/images/backgrounds/placeholder.jpg',
        }));
        setUsers(usersWithImages as RegisterUserModel[]);
        addNotification("success", "Utilisateur supprimé avec succès.");
      } else {
        addNotification("critical", "Token d'accès non trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des utilisateurs après suppression :", error);
      addNotification("critical", "Erreur lors de la mise à jour des utilisateurs après suppression.");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Pseudo',
        accessor: 'pseudo',
        Cell: ({ row, value }: any) => (
          <div className="flex gap-2 items-center">
            <Image 
              src={row.original.profileImage || '/images/backgrounds/placeholder.jpg'} 
              alt={`${value}'s Avatar`}
              width={50}
              height={50}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
              preview={true}
            />
            <div>{value}</div>
          </div>
        ),
      },
      {
        Header: 'Nom',
        accessor: 'name',
      },
      {
        Header: 'Nom de famille',
        accessor: 'lastName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Téléphone',
        accessor: 'phone',
      },
      {
        Header: 'Rôle',
        accessor: 'role',
      },
      {
        Header: 'Statut',
        accessor: 'status',
      },
    ],
    []
  );

  return (
    <div className="p-6 font-kanit">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Utilisateurs</h1>
      <Table 
        data={users} 
        columns={columns} 
        createButtonText="Ajouter un utilisateur" 
        createUrl="/admin/users/create"
        baseRoute="admin/users"
        apiRoute="users"
        itemType="utilisateur"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UsersPage;

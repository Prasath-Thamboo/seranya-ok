"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchUsers } from '@/lib/queries/UserQueries'; // Importez la fonction pour récupérer les utilisateurs
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { Image } from 'antd';

const UsersPage = () => {
  const [users, setUsers] = useState<RegisterUserModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await fetchUsers(); // Appel de la fonction pour récupérer les utilisateurs
      const usersWithImages = fetchedUsers.map(user => ({
        ...user,
        profileImage: user.profileImage || '/images/backgrounds/placeholder.jpg',
      }));
      setUsers(usersWithImages);
    };
    fetchData();
  }, []);

  const handleDelete = (deletedUser: RegisterUserModel) => {
    setUsers(users.filter(user => user.email !== deletedUser.email));
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
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UsersPage;

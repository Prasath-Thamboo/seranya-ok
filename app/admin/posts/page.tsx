"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import { fetchPosts } from '@/lib/queries/PostQueries';
import { PostModel } from '@/lib/models/PostModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';
import { useNotification } from '@/components/notifications/NotificationProvider';

const PostsPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await fetchPosts();

        const postsWithImages = fetchedPosts.map((post: PostModel) => {
          // Trouver l'upload de type 'PROFILEIMAGE' pour chaque post
          const profileImageUpload = post.uploads?.find(
            (upload) => upload.type === 'PROFILEIMAGE'
          );
          const profileImage =
            profileImageUpload?.path || '/images/backgrounds/placeholder.jpg';

          return {
            ...post,
            profileImage,
          };
        });

        setPosts(postsWithImages);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        addNotification('critical', 'Erreur lors de la récupération des posts.');
      }
    };
    fetchData();
  }, [addNotification]);

  const handleDelete = async (deletedPost: PostModel) => {
    try {
      // Re-fetch data from the server after a delete
      const fetchedPosts = await fetchPosts();

      const postsWithImages = fetchedPosts.map((post: PostModel) => {
        const profileImageUpload = post.uploads?.find(
          (upload) => upload.type === 'PROFILEIMAGE'
        );
        const profileImage =
          profileImageUpload?.path || '/images/backgrounds/placeholder.jpg';

        return {
          ...post,
          profileImage,
        };
      });

      setPosts(postsWithImages);
      addNotification('success', 'Post supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des posts après suppression :', error);
      addNotification('critical', 'Erreur lors de la mise à jour des posts après suppression.');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Titre',
        accessor: 'title',
        Cell: ({ row, value }: any) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <Image
                src={row.original.profileImage || '/images/backgrounds/placeholder.jpg'}
                alt={`Image de ${value}`}
                width={60}
                height={60}
                style={{ borderRadius: '6px', objectFit: 'cover' }}
                preview={true}
              />
            </div>
            <span className="font-medium min-w-0 break-words">{value}</span>
          </div>
        ),
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: any) => <Badge type={value} />,
      },
      {
        Header: 'Publié',
        accessor: 'isPublished',
        Cell: ({ value }: any) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {value ? 'Oui' : 'Non'}
          </span>
        ),
      },
      {
        Header: 'Créé le',
        accessor: 'createdAt',
        Cell: ({ value }: any) => (
          <div className="text-sm">{new Date(value).toLocaleDateString('fr-FR')}</div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Posts</h1>
      <Table
        data={posts}
        columns={columns}
        createButtonText="Créer un post"
        createUrl="/admin/posts/create"
        onDelete={handleDelete}
        baseRoute="admin/posts"
        apiRoute="posts"
        itemType="post"
      />
    </div>
  );
};

export default PostsPage;

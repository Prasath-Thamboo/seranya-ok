"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/components/Table';
import CardList from '@/components/CardList';
import { SidebarContent } from '@/components/dashboard/SidebarContent';
import { fetchPosts } from '@/lib/queries/PostQueries';
import { PostModel } from '@/lib/models/PostModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';
import { useNotification } from '@/components/notifications/NotificationProvider';
import { FaEye, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const PostsPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const router = useRouter();

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
          <div className="flex flex-col items-center gap-2 p-5">
            <Image
              src={row.original.profileImage || '/images/backgrounds/placeholder.jpg'}
              alt={`Image de ${value}`}
              width={150}
              height={150}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
              preview={true} // Permet le zoom au clic
            />
            <div>{value}</div>
          </div>
        ),
      },
      {
        Header: 'Sous-titre',
        accessor: 'subtitle',
        Cell: ({ value }: any) => <div className="whitespace-pre-wrap">{value}</div>,
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: any) => <Badge type={value} />,
      },
      {
        Header: 'Créé le',
        accessor: 'createdAt',
        Cell: ({ value }: any) => (
          <div>{new Date(value).toLocaleDateString('fr-FR')}</div>
        ),
      },
      {
        Header: 'Mis à jour le',
        accessor: 'updatedAt',
        Cell: ({ value }: any) => (
          <div>{new Date(value).toLocaleDateString('fr-FR')}</div>
        ),
      },
      {
        Header: 'Classes liées',
        accessor: 'postClasses',
        Cell: ({ value }: any) => (
          <div>
            {value && value.length > 0 ? (
              value.map((postClass: any) => (
                <div key={postClass.classId}>{postClass.classId}</div>
              ))
            ) : (
              <div>Aucune classe liée</div>
            )}
          </div>
        ),
      },
      {
        Header: 'Units liées',
        accessor: 'postUnits',
        Cell: ({ value }: any) => (
          <div>
            {value && value.length > 0 ? (
              value.map((postUnit: any) => (
                <div key={postUnit.unitId}>{postUnit.unit?.title || postUnit.unitId}</div>
              ))
            ) : (
              <div>Aucune unité liée</div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // Votre fonction renderPostItem pour le mode mobile reste inchangée
  const renderPostItem = (post: PostModel) => (
    <div
      key={post.id}
      className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4"
    >
      <div className="relative w-full h-48">
        <Image
          src={post.profileImage || '/images/backgrounds/placeholder.jpg'}
          alt={`Image de ${post.title}`}
          className="rounded-lg w-full h-full object-cover"
          style={{ objectFit: 'cover', borderRadius: '8px', maxHeight: '100%' }}
        />
      </div>
      <h3 className="text-xl font-bold text-center text-black font-iceberg uppercase">
        {post.title}
      </h3>
      <p className="text-center text-gray-600">{post.intro}</p>

      <div className="flex space-x-2">
        <button
          className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition"
          onClick={() => router.push(`/admin/posts/${post.id}`)}
        >
          <FaEye />
        </button>
        <button
          className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition"
          onClick={() => router.push(`/admin/posts/update?id=${post.id}`)}
        >
          <FaEdit />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Posts</h1>
      {isMobile ? (
        <>
          <CardList items={posts} itemsPerPage={4} renderItem={renderPostItem} />
          <SidebarContent collapsed={false} toggleSidebar={() => {}} />
        </>
      ) : (
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
      )}
    </div>
  );
};

export default PostsPage;

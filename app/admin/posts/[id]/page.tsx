"use client";

import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostById } from '@/lib/queries/PostQueries';
import { PostModel } from '@/lib/models/PostModels';
import { Image } from 'antd';
import DividersWithHeading from '@/components/DividersWhithHeading';
import Reader from '@/components/Reader';
import { FaEdit } from 'react-icons/fa';

const { TabPane } = Tabs;

const PostViewPage = () => {
  const params = useParams();
  const paramId = params?.id as string | undefined;
  const id = paramId ? parseInt(paramId, 10) : null;
  const [post, setPost] = useState<PostModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const fetchedPost = await fetchPostById(id);

          if (fetchedPost) {
            // Récupérer les images depuis les uploads
            const profileImageUpload = fetchedPost.uploads?.find(
              (upload) => upload.type === 'PROFILEIMAGE'
            );
            const profileImage =
              profileImageUpload?.path || '/images/backgrounds/placeholder.jpg';

            const headerImageUpload = fetchedPost.uploads?.find(
              (upload) => upload.type === 'HEADERIMAGE'
            );
            const headerImage = headerImageUpload?.path || '';

            const footerImageUpload = fetchedPost.uploads?.find(
              (upload) => upload.type === 'FOOTERIMAGE'
            );
            const footerImage = footerImageUpload?.path || '';

            // Récupérer les images de la galerie
            const galleryImages =
              fetchedPost.uploads
                ?.filter((upload) => upload.type === 'GALERY')
                .map((upload) => upload.path) || [];

            // Ajouter les images au post
            fetchedPost.profileImage = profileImage;
            fetchedPost.headerImage = headerImage;
            fetchedPost.footerImage = footerImage;
            fetchedPost.gallery = galleryImages;

            setPost(fetchedPost);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du post:', error);
        }
      }
    };
    fetchPostData();
  }, [id]);

  if (!post) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl font-kanit text-black relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
            onClick={() => router.push(`/admin/posts/update?id=${id}`)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>

        <Tabs defaultActiveKey="1" centered className="font-kanit text-black">
          <TabPane tab="Général" key="1">
            <div className="flex flex-col items-center mb-8">
              <Image
                src={post.profileImage || '/images/backgrounds/placeholder.jpg'}
                alt={`${post.title} Profile`}
                className="rounded-lg mb-4"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '240px',
                  objectFit: 'cover',
                }}
                preview={true}
              />
              <DividersWithHeading
                text={post.title}
                badge={post.type}
                customStyle="text-4xl text-black font-bold font-oxanium uppercase text-center text-black"
              />
              {post.subtitle && (
                <p className="text-lg italic text-center text-gray-600 mb-4">
                  {post.subtitle}
                </p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black font-oxanium mb-4">
                Introduction
              </h2>
              <p className="text-lg mb-4">{post.intro}</p>
            </div>

            <div className="flex justify-center mb-8">
              {post.headerImage ? (
                <Image
                  src={post.headerImage}
                  alt={`${post.title} Header`}
                  className="rounded-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'cover',
                  }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Aucune image d&apos;en-tête disponible.
                </p>
              )}
            </div>

            <div className="flex justify-center mb-8">
              {post.footerImage ? (
                <Image
                  src={post.footerImage}
                  alt={`${post.title} Footer`}
                  className="rounded-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '240px',
                    objectFit: 'cover',
                  }}
                  preview={true}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Aucune image de pied de page disponible.
                </p>
              )}
            </div>

            <div className="text-sm text-gray-500 italic mt-8">
              <p className="mb-2">
                Créé le: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-2">
                Mis à jour le: {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right mt-4">
              <p className="text-lg font-semibold">
                Statut: {post.isPublished ? 'Publié' : 'Non publié'}
              </p>
            </div>
          </TabPane>

          <TabPane tab="Contenu" key="2">
            <Reader text={post.content || 'Aucun contenu disponible.'} />
          </TabPane>

          <TabPane tab="Galerie" key="3">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Galerie</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {post.gallery && post.gallery.length > 0 ? (
                  post.gallery.map((imgUrl, index) => (
                    <Image
                      key={index}
                      src={imgUrl}
                      alt={`${post.title} Gallery Image ${index + 1}`}
                      className="rounded-lg"
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      preview={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center italic">
                    Aucune image disponible dans la galerie.
                  </p>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PostViewPage;

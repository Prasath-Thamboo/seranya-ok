// spectralnext/app/posts/page.tsx

'use client';

import React from 'react';
import PostCard from '@/components/PostCard'; // Import du composant PostCard
import { fetchPosts } from '@/lib/queries/PostQueries'; // Import de la méthode fetchPosts
import { PostModel, PostType } from '@/lib/models/PostModels'; // Import du modèle de post et de PostType
import HeroSection from '@/components/HeroSection'; // Import du HeroSection

const PostsPage: React.FC = () => {
  const [posts, setPosts] = React.useState<PostModel[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        // Filtrer les posts de type "REGION"
        const filteredPosts = data.filter(post => post.type !== 'REGION'); // Utilisation de la chaîne 'REGION'
        setPosts(filteredPosts);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue.');
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Intégration du HeroSection */}
      <HeroSection
        backgroundImage="/images/backgrounds/GhostKnight.png"
        title="Bienvenue dans"
        titleColor="white"
        strongTitle="Extraits"
        strongTitleColor="teal"
        content="Explorez les mystères de l'univers à travers des articles philosophiques et scientifiques."
        contentColor="teal"
        button1Text="Voir les Posts"
        button1Url="/posts"
        button1BgColor="teal"
        button2Text="Découvrir"
        button2Url="/discover"
        button2BgColor="teal"
      />

      {/* Section des Posts */}
      <div className="py-10 px-5">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 font-iceberg">Exploration de l&apos;Univers</h1>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

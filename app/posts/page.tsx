// spectralnext/app/posts/page.tsx

'use client';

import React from 'react';
import PostCard from '@/components/PostCard';
import { fetchPosts } from '@/lib/queries/PostQueries';
import { PostModel, PostType } from '@/lib/models/PostModels';
import HeroSection from '@/components/HeroSection';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';
import TestRandomBackground from '@/components/TestRandomBackground';// Import du composant de test

const PostsPage: React.FC = () => {
  const [posts, setPosts] = React.useState<PostModel[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = React.useState<string>('');
  const [bgLoading, setBgLoading] = React.useState<boolean>(true);
  const [bgError, setBgError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        // Filtrer les posts de type "REGION"
        const filteredPosts = data.filter(post => post.type !== PostType.REGION);
        setPosts(filteredPosts);
        setLoading(false);
        console.log('Posts fetched successfully:', filteredPosts);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des posts:', err);
        setError(err.message || 'Erreur inconnue.');
        setLoading(false);
      }
    };

    const getRandomBackgroundImage = async () => {
      try {
        console.log('Fetching random background image...');
        const imageUrl = await fetchRandomBackground();
        console.log('Random background image fetched:', imageUrl);
        setBackgroundImage(imageUrl);
        setBgLoading(false);
      } catch (err: any) {
        console.error('Erreur lors de la récupération de l\'image de fond:', err);
        setBgError(err.message || 'Erreur inconnue.');
        // Optionnellement, définir une image de fond par défaut
        setBackgroundImage('/images/backgrounds/GhostKnight.png');
        setBgLoading(false);
      }
    };

    getPosts();
    getRandomBackgroundImage();
  }, []);

  if (loading || bgLoading) {
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
        backgroundImage={backgroundImage || "/images/backgrounds/GhostKnight.png"} // Utilisation de l'image dynamique
        title="Bienvenue dans"
        titleColor="#ffffff" // Blanc
        strongTitle="L'Univers Spectral"
        strongTitleColor="#ffffff" // Blanc
        content="Explorez les mystères de l'univers à travers des articles philosophiques et scientifiques."
        contentColor="#ffffff" // Blanc
        button1Text="Voir les Posts"
        button1Url="/posts"
        button1BgColor="#38b2ac" // Teal (Hex code)
        button2Text="Découvrir"
        button2Url="/discover"
        button2BgColor="#38b2ac" // Teal (Hex code)
      />

      {/* Composant de Test pour l'Image de Fond */}
      <TestRandomBackground />

      {/* Section des Posts */}
      <div className="py-10 px-5">
        <h1 className="text-4xl font-bold text-center text-white mb-10 font-iceberg text-shadow-lg">
          Exploration de l&apos;Univers
        </h1>
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

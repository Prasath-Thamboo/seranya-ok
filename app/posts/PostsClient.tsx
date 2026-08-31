// Seranyanext/app/posts/page.tsx

'use client';

import React from 'react';
import PostCard from '@/components/PostCard';
import { fetchPosts } from '@/lib/queries/PostQueries';
import { fetchCurrentUser, getAccessToken } from '@/lib/queries/AuthQueries';
import { PostModel, PostType } from '@/lib/models/PostModels';
import HeroSection from '@/components/HeroSection';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = React.useState<PostModel[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = React.useState<string>('');
  const [bgLoading, setBgLoading] = React.useState<boolean>(true);
  const [bgError, setBgError] = React.useState<string | null>(null);
  const [isPrivileged, setIsPrivileged] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!getAccessToken()) return;
    fetchCurrentUser()
      .then((user: any) => setIsPrivileged(user?.role === 'ADMIN' || user?.role === 'EDITOR'))
      .catch(() => {});
  }, []);

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
        setBackgroundImage('/images/backgrounds/bouddhisme.jpg');
        setBgLoading(false);
      }
    };

    getPosts();
    getRandomBackgroundImage();
  }, []);

  if (loading || bgLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <p className="text-lg text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page font-sans text-ink">
      <HeroSection
        backgroundImage={backgroundImage || '/images/backgrounds/bouddhisme.jpg'}
        title="Bienvenue dans"
        strongTitle="l'univers Seranya"
        content="Explorez les enseignements du yoga et du bouddhisme à travers des articles pensés pour ralentir."
        button1Text="Voir les articles"
        button1Url="#posts-section"
        button2Text="Découvrir l'univers"
        button2Url="/univers"
      />

      {/* Section des articles */}
      <div id="posts-section" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <p className="mb-3 text-center text-xs font-sans uppercase tracking-[0.22em] text-accent">
          Le blog
        </p>
        <h2 className="mb-12 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
          Exploration de l&apos;univers
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} isPrivileged={isPrivileged} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

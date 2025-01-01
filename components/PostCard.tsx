// seranyanext/components/PostCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiBookOpen, FiChevronRight } from 'react-icons/fi';
import { PostModel } from '@/lib/models/PostModels'; // Import du modèle de post

interface PostCardProps {
  post: PostModel; // Utilisation de PostModel directement
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 font-kanit">
      {post.headerImage ? (
        <Image
          src={post.headerImage}
          alt={post.title}
          width={400}
          height={200}
          className="object-cover w-full h-48"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <FiBookOpen className="text-6xl text-gray-500" />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-iceberg font-semibold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.intro}</p> {/* Utilisation de 'intro' */}
        <Link href={`/posts/${post.id}`}>
          <a className="inline-flex items-center text-teal-500 hover:text-teal-700 font-semibold">
            Lire Plus
            <FiChevronRight className="ml-2" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;

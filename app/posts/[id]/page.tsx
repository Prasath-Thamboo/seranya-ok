"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPostById, fetchPosts } from "@/lib/queries/PostQueries";
import { PostModel } from "@/lib/models/PostModels";
import { Skeleton, Image as AntImage } from "antd";
import Badge from "@/components/Badge";
import Masonry from "react-masonry-css";
import Footer from "@/components/Footer";
import { FaLock, FaNewspaper } from "react-icons/fa";
import Link from "next/link";
import Image from 'next/image'; // Importez Next.js Image si vous l'utilisez

const PostDetailPage = () => {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  const [post, setPost] = useState<PostModel | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostModel[]>([]);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingRelatedPosts, setLoadingRelatedPosts] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const fetchedPost = await fetchPostById(parseInt(id, 10));
          setPost(fetchedPost);
        } catch (error) {
          console.error("Error fetching post:", error);
        } finally {
          setLoadingPost(false);
        }
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (post) {
        try {
          const fetchedPosts = await fetchPosts();
          const filteredPosts = fetchedPosts.filter(
            (p) => p.type === post.type && p.id !== post.id
          );
          setRelatedPosts(filteredPosts);
        } catch (error) {
          console.error("Error fetching related posts:", error);
        } finally {
          setLoadingRelatedPosts(false);
        }
      }
    };

    fetchRelatedPosts();
  }, [post]);

  return (
    <div className="relative w-full min-h-screen text-white font-iceberg bg-gray-900">
      {/* Image Header Section */}
      <div className="w-full flex justify-center p-6">
        {loadingPost ? (
          <Skeleton.Image style={{ width: '100%', maxWidth: '768px', height: 400 }} active />
        ) : (
          post?.headerImage ? (
            <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-lg">
              {/* Utilisez Next.js Image pour une meilleure optimisation */}
              <Image
                src={post.headerImage}
                alt={`${post.title} Header Image`}
                width={1200} // Ajustez selon vos besoins
                height={400} // Ajustez selon vos besoins
                layout="responsive"
                className="object-cover"
              />
              {/* Si vous préférez utiliser AntImage, utilisez ce code à la place :
              <AntImage
                src={post.headerImage}
                alt={`${post.title} Header Image`}
                width={768}
                height={400}
                className="w-full max-w-3xl h-auto rounded-lg shadow-lg mx-auto object-cover"
              />
              */}
            </div>
          ) : (
            <p className="text-gray-400 italic">Aucune image d&apos;en-tête disponible.</p>
          )
        )}
      </div>

      <div className="relative z-10">
        {/* Main Content with Sidebar */}
        <div className="lg:flex lg:items-start lg:justify-center lg:mt-12 px-4 sm:px-6 lg:px-8">
          {/* Left Column: Sidebar */}
          <div className="lg:w-1/4 p-4 lg:sticky lg:top-24 lg:max-h-screen overflow-auto">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-iceberg text-white mb-4">Posts similaires</h2>

              {loadingRelatedPosts ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : relatedPosts.length > 0 ? (
                <ul className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <li key={relatedPost.id}>
                      <Link href={`/posts/${relatedPost.id}`}>
                        <a className="block text-lg text-white hover:text-blue-400 transition-colors duration-200">
                          {relatedPost.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-400">Aucune informations disponibles.</p>
              )}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:w-3/4 p-6">
            {loadingPost ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <div className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {/* Titre et Sous-titre */}
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-iceberg uppercase text-white drop-shadow-lg">
                    {post?.title || <Skeleton active title={false} paragraph={{ rows: 1 }} />}
                  </h1>
                  <Badge role={post?.type || "DEFAULT"} />
                  {post?.subtitle && (
                    <p className="mt-4 text-2xl sm:text-3xl md:text-4xl font-iceberg text-gray-300 drop-shadow-lg">
                      {post.subtitle}
                    </p>
                  )}
                </div>
                {/* Contenu du post */}
                <div
                  className="prose prose-lg sm:prose-xl md:prose-2xl text-gray-300"
                  dangerouslySetInnerHTML={{ __html: post?.content || "Contenu non disponible." }}
                />
              </div>
            )}

            {/* Gallery Section */}
            {post?.gallery && post.gallery.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold font-iceberg text-white mb-8">Galerie</h2>
                <Masonry
                  breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                  className="flex -ml-4 w-auto"
                  columnClassName="pl-4"
                >
                  {post.gallery.map((imgUrl, index) => (
                    <div key={index} className="relative mb-4">
                      <AntImage
                        src={imgUrl}
                        alt={`${post.title} Gallery Image ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        style={{ objectFit: "cover", aspectRatio: "16/9" }}
                      />
                    </div>
                  ))}
                </Masonry>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PostDetailPage;

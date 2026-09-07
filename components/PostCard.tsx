// seranyanext/components/PostCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { PostModel } from '@/lib/models/PostModels';
import Badge from '@/components/Badge';

interface PostCardProps {
  post: PostModel;
  isPrivileged?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isPrivileged }) => {
  const t = useTranslations('postCard');
  const locale = useLocale();
  const isScheduled =
    isPrivileged && post.publishedAt && new Date(post.publishedAt) > new Date();

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden bg-sunken">
        {post.headerImage ? (
          <Image
            src={post.headerImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-calm group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiBookOpen className="text-5xl text-ink-muted" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {isScheduled && (
          <div className="mb-3">
            <Badge
              type={t('scheduledFor', {
                date: new Date(post.publishedAt as string).toLocaleDateString(
                  locale === 'en' ? 'en-GB' : 'fr-FR',
                ),
              })}
            />
          </div>
        )}
        <h2 className="mb-2 font-serif text-xl font-medium text-ink">{post.title}</h2>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
          {post.intro}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-sans text-accent transition-colors group-hover:text-accent-hover">
          {t('readArticle')}
          <FiArrowRight className="transition-transform duration-300 ease-calm group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default PostCard;

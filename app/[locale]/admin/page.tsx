"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'antd';
import { FaUsers, FaNewspaper, FaPlay, FaBookOpen } from 'react-icons/fa';
import { fetchPosts } from '@/lib/queries/PostQueries';
import { fetchPublishedTutorials } from '@/lib/queries/TutorialQueries';
import { fetchPublishedDefinitions } from '@/lib/queries/DefinitionQueries';
import { fetchUsers } from '@/lib/queries/UserQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import DividersWithHeading from '@/components/DividersWhithHeading';
import MiniLoader from '@/components/MiniLoader';
import { getAccessToken } from '@/lib/queries/AuthQueries';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { UserRole } from '@/lib/models/UserModels';

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  seo: number;
}

// Palette dérivée de la charte : sauge, terracotta, bronze, ardoise, sable
const CONTENT_COLORS = ['#7A8B6F', '#B9744A', '#B08D57'];
const USER_COLORS = ['#9A8E7D', '#7A8B6F', '#5F7684']; // USER (taupe), EDITOR (sauge), ADMIN (ardoise) — cohérent avec Badge.tsx
const TRACK_COLOR = '#E4DACB';
const PERF_COLORS = ['#5F7684', TRACK_COLOR];
const ACCESS_COLORS = ['#7A8B6F', TRACK_COLOR];
const SEO_COLORS = ['#B08D57', TRACK_COLOR];

function DashboardHome() {
  const router = useRouter();
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [totalTutorials, setTotalTutorials] = useState<number | null>(null);
  const [totalDefinitions, setTotalDefinitions] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<LighthouseMetrics | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [contentDistribution, setContentDistribution] = useState<{ name: string; value: number }[] | null>(null);
  const [userDistribution, setUserDistribution] = useState<{ name: string; value: number }[] | null>(null);

  useEffect(() => {
    const token = getAccessToken() || '';

    const fetchStatistics = async () => {
      try {
        const [posts, tutorials, definitions, users] = await Promise.allSettled([
          fetchPosts(),
          fetchPublishedTutorials(),
          fetchPublishedDefinitions(),
          fetchUsers(token),
        ]);

        const postsCount = posts.status === 'fulfilled' ? posts.value.length : 0;
        const tutorialsCount = tutorials.status === 'fulfilled' ? tutorials.value.length : 0;
        const definitionsCount = definitions.status === 'fulfilled' ? definitions.value.length : 0;

        setTotalPosts(postsCount);
        setTotalTutorials(tutorialsCount);
        setTotalDefinitions(definitionsCount);

        setContentDistribution([
          { name: 'Articles', value: postsCount },
          { name: 'Tutoriels', value: tutorialsCount },
          { name: 'Définitions', value: definitionsCount },
        ]);

        if (users.status === 'fulfilled') {
          const fetchedUsers: RegisterUserModel[] = users.value;
          setTotalUsers(fetchedUsers.length);

          const userCounts = fetchedUsers.reduce(
            (acc, user) => {
              if (user.role === 'ADMIN') acc.admins += 1;
              else if (user.role === 'EDITOR') acc.editors += 1;
              else acc.users += 1;
              return acc;
            },
            { users: 0, editors: 0, admins: 0 }
          );

          setUserDistribution([
            { name: 'Utilisateur', value: userCounts.users },
            { name: 'Éditeur', value: userCounts.editors },
            { name: 'Admin', value: userCounts.admins },
          ]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    const fetchLighthouseMetrics = async () => {
      try {
        const response = await fetch('/api/lighthouse');

        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error(
            `Réponse inattendue du serveur (HTTP ${response.status}) au lieu de JSON — probablement un timeout de la fonction serverless.`
          );
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Failed to fetch Lighthouse metrics');
        setMetrics(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques Lighthouse', error);
        setMetricsError(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    };

    fetchStatistics();
    fetchLighthouseMetrics();
  }, []);

  const renderPieChart = (data: { name: string; value: number }[], colors: string[]) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="p-8">
      {/* Section Contenu */}
      <DividersWithHeading text="Contenu" styleVariant="admin" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center items-center mb-12">

        <Card
          className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 ease-calm h-48 cursor-pointer rounded-2xl"
          hoverable
          onClick={() => router.push('/admin/posts')}
        >
          <div className="flex justify-between items-center h-full">
            {totalPosts !== null ? (
              <div>
                <h3 className="text-sm font-sans text-ink-soft">Total des Articles</h3>
                <p className="text-4xl font-serif font-medium text-ink">{totalPosts}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaNewspaper className="w-10 h-10 text-accent" />
          </div>
        </Card>

        <Card
          className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 ease-calm h-48 cursor-pointer rounded-2xl"
          hoverable
          onClick={() => router.push('/admin/tutoriels')}
        >
          <div className="flex justify-between items-center h-full">
            {totalTutorials !== null ? (
              <div>
                <h3 className="text-sm font-sans text-ink-soft">Total des Tutoriels</h3>
                <p className="text-4xl font-serif font-medium text-ink">{totalTutorials}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaPlay className="w-10 h-10 text-accent" />
          </div>
        </Card>

        <Card
          className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 ease-calm h-48 cursor-pointer rounded-2xl"
          hoverable
          onClick={() => router.push('/admin/encyclopedie')}
        >
          <div className="flex justify-between items-center h-full">
            {totalDefinitions !== null ? (
              <div>
                <h3 className="text-sm font-sans text-ink-soft">Total des Définitions</h3>
                <p className="text-4xl font-serif font-medium text-ink">{totalDefinitions}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaBookOpen className="w-10 h-10 text-accent" />
          </div>
        </Card>

        <Card
          className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 ease-calm h-48 cursor-pointer rounded-2xl"
          hoverable
          onClick={() => router.push('/admin/users')}
        >
          <div className="flex justify-between items-center h-full">
            {totalUsers !== null ? (
              <div>
                <h3 className="text-sm font-sans text-ink-soft">Total des Utilisateurs</h3>
                <p className="text-4xl font-serif font-medium text-ink">{totalUsers}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaUsers className="w-10 h-10 text-accent" />
          </div>
        </Card>
      </div>

      {/* Section Répartition */}
      {contentDistribution && userDistribution && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center mb-12">
          <Card className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl" hoverable>
            <div className="h-full">
              <h3 className="text-sm font-sans text-ink-soft text-center">Répartition du contenu</h3>
              {renderPieChart(contentDistribution, CONTENT_COLORS)}
            </div>
          </Card>

          <Card className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl" hoverable>
            <div className="h-full">
              <h3 className="text-sm font-sans text-ink-soft text-center">Répartition des Utilisateurs</h3>
              {renderPieChart(userDistribution, USER_COLORS)}
            </div>
          </Card>
        </div>
      )}

      {/* Section Performances */}
      <DividersWithHeading text="Performances" styleVariant="admin" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center">
        <Card className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 h-full rounded-2xl" hoverable>
          <div className="h-full">
            <h3 className="text-sm font-sans text-ink-soft text-center">Performances</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Performance', value: metrics.performance }, { name: 'Rest', value: 100 - metrics.performance }],
                PERF_COLORS
              )
            ) : metricsError ? (
              <div className="flex justify-center items-center w-full h-full text-ink-muted font-sans text-sm text-center px-4">{metricsError}</div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>

        <Card className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl" hoverable>
          <div className="h-full">
            <h3 className="text-sm font-sans text-ink-soft text-center">Accessibilité</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Accessibilité', value: metrics.accessibility }, { name: 'Rest', value: 100 - metrics.accessibility }],
                ACCESS_COLORS
              )
            ) : metricsError ? (
              <div className="flex justify-center items-center w-full h-full text-ink-muted font-sans text-sm text-center px-4">{metricsError}</div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>

        <Card className="bg-raised text-ink border border-line shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl" hoverable>
          <div className="h-full">
            <h3 className="text-sm font-sans text-ink-soft text-center">SEO</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'SEO', value: metrics.seo }, { name: 'Rest', value: 100 - metrics.seo }],
                SEO_COLORS
              )
            ) : metricsError ? (
              <div className="flex justify-center items-center w-full h-full text-ink-muted font-sans text-sm text-center px-4">{metricsError}</div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} fallbackPath="/admin/posts">
      <DashboardHome />
    </ProtectedRoute>
  );
}

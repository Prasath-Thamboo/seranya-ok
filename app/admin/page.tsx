"use client";

import { useEffect, useState } from 'react';
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

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  seo: number;
}

const CONTENT_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6'];
const USER_COLORS = ['#87CEFA', '#FFD700'];
const PERF_COLORS = ['#3b82f6', '#e5e7eb'];
const ACCESS_COLORS = ['#22c55e', '#e5e7eb'];
const SEO_COLORS = ['#f59e0b', '#e5e7eb'];

export default function DashboardHome() {
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [totalTutorials, setTotalTutorials] = useState<number | null>(null);
  const [totalDefinitions, setTotalDefinitions] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<LighthouseMetrics | null>(null);
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
              else acc.users += 1;
              return acc;
            },
            { users: 0, admins: 0 }
          );

          setUserDistribution([
            { name: 'Utilisateur', value: userCounts.users },
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
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques Lighthouse', error);
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

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalPosts !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Articles</h3>
                <p className="text-4xl font-bold font-kanit">{totalPosts}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaNewspaper className="w-12 h-12 text-black" />
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalTutorials !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Tutoriels</h3>
                <p className="text-4xl font-bold font-kanit">{totalTutorials}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaPlay className="w-12 h-12 text-black" />
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalDefinitions !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Définitions</h3>
                <p className="text-4xl font-bold font-kanit">{totalDefinitions}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaBookOpen className="w-12 h-12 text-black" />
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalUsers !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Utilisateurs</h3>
                <p className="text-4xl font-bold font-kanit">{totalUsers}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
            <FaUsers className="w-12 h-12 text-black" />
          </div>
        </Card>
      </div>

      {/* Section Répartition */}
      {contentDistribution && userDistribution && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center mb-12">
          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div className="h-full">
              <h3 className="text-lg font-iceberg text-center">Répartition du contenu</h3>
              {renderPieChart(contentDistribution, CONTENT_COLORS)}
            </div>
          </Card>

          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div className="h-full">
              <h3 className="text-lg font-iceberg text-center">Répartition des Utilisateurs</h3>
              {renderPieChart(userDistribution, USER_COLORS)}
            </div>
          </Card>
        </div>
      )}

      {/* Section Performances */}
      <DividersWithHeading text="Performances" styleVariant="admin" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center">
        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-full" hoverable>
          <div className="h-full">
            <h3 className="text-lg font-iceberg text-center">Performances</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Performance', value: metrics.performance }, { name: 'Rest', value: 100 - metrics.performance }],
                PERF_COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
          <div className="h-full">
            <h3 className="text-lg font-iceberg text-center">Accessibilité</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Accessibilité', value: metrics.accessibility }, { name: 'Rest', value: 100 - metrics.accessibility }],
                ACCESS_COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
          <div className="h-full">
            <h3 className="text-lg font-iceberg text-center">SEO</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'SEO', value: metrics.seo }, { name: 'Rest', value: 100 - metrics.seo }],
                SEO_COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full"><MiniLoader /></div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { FaUsers, FaCubes } from 'react-icons/fa';
import { fetchUnits } from '@/lib/queries/UnitQueries';
import { fetchUsers } from '@/lib/queries/UserQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  seo: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardHome() {
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [metrics, setMetrics] = useState<LighthouseMetrics | null>(null);

  const isAdmin = true; // Assurez-vous que l'utilisateur est admin

  // Remplace cette partie avec la manière dont tu récupères le token.
  const token = "ton_token"; // Obtenu depuis un contexte, un localStorage, ou une requête d'authentification.

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const fetchedUnits: UnitModel[] = await fetchUnits();
        setTotalUnits(fetchedUnits.length);

        // Appel à fetchUsers en passant le token comme argument
        const fetchedUsers: RegisterUserModel[] = await fetchUsers(token);
        setTotalUsers(fetchedUsers.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    const fetchLighthouseMetrics = async () => {
      if (isAdmin) {
        try {
          const response = await fetch('/api/lighthouse');
          const data = await response.json();
          setMetrics(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des métriques Lighthouse', error);
        }
      }
    };

    fetchStatistics();
    fetchLighthouseMetrics();
  }, [isAdmin, token]);

  if (!isAdmin) {
    return <div>Accès refusé. Seuls les administrateurs peuvent voir ces métriques.</div>;
  }

  const renderPieChart = (data: { name: string; value: number }[], title: string) => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 p-8">
      {/* Carte Unités */}
      <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-iceberg">Total des Unités</h3>
            <p className="text-4xl font-bold">{totalUnits}</p>
          </div>
          <FaCubes className="w-12 h-12 text-black" />
        </div>
      </Card>

      {/* Carte Utilisateurs */}
      <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-iceberg">Total des Utilisateurs</h3>
            <p className="text-4xl font-bold">{totalUsers}</p>
          </div>
          <FaUsers className="w-12 h-12 text-black" />
        </div>
      </Card>

      {/* Cartes Lighthouse Metrics */}
      {metrics && (
        <>
          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div>
              <h3 className="text-lg font-iceberg text-center">Performances</h3>
              {renderPieChart([{ name: 'Performance', value: metrics.performance }, { name: 'Rest', value: 100 - metrics.performance }], 'Performances')}
            </div>
          </Card>

          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div>
              <h3 className="text-lg font-iceberg text-center">Accessibilité</h3>
              {renderPieChart([{ name: 'Accessibilité', value: metrics.accessibility }, { name: 'Rest', value: 100 - metrics.accessibility }], 'Accessibilité')}
            </div>
          </Card>

          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div>
              <h3 className="text-lg font-iceberg text-center">SEO</h3>
              {renderPieChart([{ name: 'SEO', value: metrics.seo }, { name: 'Rest', value: 100 - metrics.seo }], 'SEO')}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Card } from 'antd';
import { FaUsers, FaCubes } from 'react-icons/fa';
import { fetchUnits } from '@/lib/queries/UnitQueries';
import { fetchUsers } from '@/lib/queries/UserQueries';
import { UnitModel } from '@/lib/models/UnitModels';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import DividersWithHeading from '@/components/DividersWhithHeading';
import MiniLoader from '@/components/MiniLoader'; // Import du MiniLoader

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  seo: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const UNIT_COLORS = ['#C0C0C0', '#FFD700']; // Gris pour UNIT, Doré pour CHAMPION
const USER_COLORS = ['#87CEFA', '#FFD700']; // Bleu pour USER, Doré pour ADMIN

export default function DashboardHome() {
  const [totalUnits, setTotalUnits] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<LighthouseMetrics | null>(null);
  const [unitDistribution, setUnitDistribution] = useState<{ name: string, value: number }[] | null>(null);
  const [userDistribution, setUserDistribution] = useState<{ name: string, value: number }[] | null>(null);

  const isAdmin = true; // Assurez-vous que l'utilisateur est admin

  const token = "ton_token"; // Remplace par la méthode de récupération du token

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const fetchedUnits: UnitModel[] = await fetchUnits();
        setTotalUnits(fetchedUnits.length);

        const unitCounts = fetchedUnits.reduce(
          (acc, unit) => {
            if (unit.type === 'CHAMPION') {
              acc.champions += 1;
            } else {
              acc.units += 1;
            }
            return acc;
          },
          { units: 0, champions: 0 }
        );

        setUnitDistribution([
          { name: 'UNIT', value: unitCounts.units },
          { name: 'CHAMPION', value: unitCounts.champions },
        ]);

        const fetchedUsers: RegisterUserModel[] = await fetchUsers(token);
        setTotalUsers(fetchedUsers.length);

        const userCounts = fetchedUsers.reduce(
          (acc, user) => {
            if (user.role === 'ADMIN') {
              acc.admins += 1;
            } else {
              acc.users += 1;
            }
            return acc;
          },
          { users: 0, admins: 0 }
        );

        setUserDistribution([
          { name: 'USER', value: userCounts.users },
          { name: 'ADMIN', value: userCounts.admins },
        ]);
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
      {/* Section Entités */}
      <DividersWithHeading text="Entités" styleVariant="admin" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 justify-center items-center mb-12">
        {/* Carte Unités */}
        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalUnits !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Unités</h3>
                <p className="text-4xl font-bold font-kanit">{totalUnits}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <MiniLoader /> {/* Loader ici */}
              </div>
            )}
            <FaCubes className="w-12 h-12 text-black" />
          </div>
        </Card>

        {/* Carte Utilisateurs */}
        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-48" hoverable>
          <div className="flex justify-between items-center h-full">
            {totalUsers !== null ? (
              <div>
                <h3 className="text-lg font-iceberg">Total des Utilisateurs</h3>
                <p className="text-4xl font-bold font-kanit">{totalUsers}</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <MiniLoader /> {/* Loader ici */}
              </div>
            )}
            <FaUsers className="w-12 h-12 text-black" />
          </div>
        </Card>
      </div>

      {/* Section Répartition des Unités et Utilisateurs */}
      {unitDistribution && userDistribution && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 justify-center items-center mb-12">
          {/* Carte Répartition des Unités */}
          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div className='h-full'>
              <h3 className="text-lg font-iceberg text-center">Répartition des Unités</h3>
              {renderPieChart(unitDistribution, UNIT_COLORS)}
            </div>
          </Card>

          {/* Carte Répartition des Utilisateurs */}
          <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
            <div className='h-full'>
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
          <div className='h-full'>
            <h3 className="text-lg font-iceberg text-center">Performances</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Performance', value: metrics.performance }, { name: 'Rest', value: 100 - metrics.performance }],
                COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <MiniLoader /> {/* Loader ici */}
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
          <div className='h-full'>
            <h3 className="text-lg font-iceberg text-center">Accessibilité</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'Accessibilité', value: metrics.accessibility }, { name: 'Rest', value: 100 - metrics.accessibility }],
                COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <MiniLoader /> {/* Loader ici */}
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300" hoverable>
          <div className='h-full'>
            <h3 className="text-lg font-iceberg text-center">SEO</h3>
            {metrics ? (
              renderPieChart(
                [{ name: 'SEO', value: metrics.seo }, { name: 'Rest', value: 100 - metrics.seo }],
                COLORS
              )
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <MiniLoader /> {/* Loader ici */}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

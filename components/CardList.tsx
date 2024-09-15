// components/CardList.tsx
import React, { useState } from 'react';
import { UnitModel } from '@/lib/models/UnitModels';
import { FaEye, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Image } from 'antd';

interface CardListProps {
  units: UnitModel[];
  itemsPerPage?: number;
}

const CardList: React.FC<CardListProps> = ({ units, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(units.length / itemsPerPage);
  const router = useRouter();

  // Pagination logic
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const currentUnits = units.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {currentUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4"
          >
            <div className="relative w-full h-48">
              <Image
                src={unit.profileImage || '/images/backgrounds/placeholder.jpg'}
                alt={`${unit.title}'s Avatar`}
                className="rounded-lg w-full h-full object-cover"
                style={{ objectFit: 'cover', borderRadius: '8px', maxHeight: '100%' }}
              />
            </div>
            <h3 className="text-xl font-bold text-center text-black font-iceberg uppercase">{unit.title}</h3>
            <p className="text-center text-gray-600">{unit.intro}</p>

            <div className="flex space-x-2">
              <button
                className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition"
                onClick={() => router.push(`/admin/units/${unit.id}`)}
              >
                <FaEye />
              </button>
              <button
                className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition"
                onClick={() => router.push(`/admin/units/update?id=${unit.id}`)}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default CardList;

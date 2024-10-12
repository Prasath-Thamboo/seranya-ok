// components/CardList.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CardListProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T) => React.ReactNode;
}

function CardList<T>({ items, itemsPerPage = 4, renderItem }: CardListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const router = useRouter();

  // Pagination logic
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {currentItems.map((item) => (
          <div key={(item as any).id}>{renderItem(item)}</div>
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
}

export default CardList;

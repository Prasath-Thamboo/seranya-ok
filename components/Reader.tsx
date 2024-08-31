import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ReaderProps {
  text: string;
}

const Reader: React.FC<ReaderProps> = ({ text }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    const words = text.split(' ');
    const wordsPerPage = Math.max(Math.floor(window.innerHeight / 30), 150);
    const totalPages = Math.ceil(words.length / wordsPerPage);
    
    const generatedPages = [];
    for (let i = 0; i < totalPages; i++) {
      const pageText = words.slice(i * wordsPerPage, (i + 1) * wordsPerPage).join(' ');
      generatedPages.push(pageText);
    }
    
    setPages(generatedPages);
  }, [text]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative p-4 border rounded-lg shadow-lg bg-white">
      <div className="text-center text-lg font-kanit">
        {pages[currentPage]}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 0}
          className="p-2 text-gray-500 hover:text-black"
        >
          <FaChevronLeft size={24} />
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage + 1} of {pages.length}
        </span>
        <button 
          onClick={nextPage} 
          disabled={currentPage === pages.length - 1}
          className="p-2 text-gray-500 hover:text-black"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-8 h-8 rounded-full ${index === currentPage ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reader;

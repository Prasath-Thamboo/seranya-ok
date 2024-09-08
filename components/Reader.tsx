import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ReaderProps {
  text: string; // Contient le HTML à afficher
}

const Reader: React.FC<ReaderProps> = ({ text }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    // Diviser le texte HTML en pages
    const splitHTMLIntoPages = (html: string, wordsPerPage: number) => {
      const element = document.createElement('div');
      element.innerHTML = html;

      const words = element.innerText.split(' ');
      const totalPages = Math.ceil(words.length / wordsPerPage);
      const generatedPages: string[] = [];

      for (let i = 0; i < totalPages; i++) {
        const start = i * wordsPerPage;
        const end = (i + 1) * wordsPerPage;
        const pageWords = words.slice(start, end).join(' ');

        // Retrouver le HTML correspondant aux mots
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const pageHtml = tempDiv.innerHTML.replace(element.innerText, pageWords);

        generatedPages.push(pageHtml);
      }

      return generatedPages;
    };

    const wordsPerPage = Math.max(Math.floor(window.innerHeight / 30), 150);
    const generatedPages = splitHTMLIntoPages(text, wordsPerPage);

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
      <div
        className="text-lg font-kanit"
        dangerouslySetInnerHTML={{ __html: pages[currentPage] || '' }} // Rendu HTML sécurisé
      />
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

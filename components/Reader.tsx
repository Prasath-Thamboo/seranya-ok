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
    <div className="relative rounded-2xl border border-line bg-raised p-5 shadow-sm">
      <div
        className="font-sans text-lg leading-relaxed text-ink-soft [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: pages[currentPage] || '' }}
      />
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-2 text-ink-muted transition-colors hover:text-accent disabled:opacity-40"
        >
          <FaChevronLeft size={22} />
        </button>
        <span className="text-sm text-ink-muted">
          Page {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="p-2 text-ink-muted transition-colors hover:text-accent disabled:opacity-40"
        >
          <FaChevronRight size={22} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-8 w-8 rounded-full text-sm transition-colors ${
              index === currentPage ? 'bg-accent text-ink-invert' : 'bg-sunken text-ink-soft hover:bg-accent-soft'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reader;

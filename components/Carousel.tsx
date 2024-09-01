import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface CarouselItem {
  image: string;
  title?: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  height?: string;
  width?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  height = '100vh',
  width = '100vw',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative overflow-hidden fixed top-0 left-0 z-50" style={{ width, height }}>
      {/* Carousel Wrapper */}
      <div className="relative overflow-hidden w-full h-full z-40">
        {items.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={item.image}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="w-full h-full object-cover"
            />
            {/* Optional Title and Subtitle */}
            {(item.title || item.subtitle) && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center z-50">
                {item.title && (
                  <h2
                    className="font-oxanium text-2xl md:text-4xl text-white"
                    style={{
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {item.title}
                  </h2>
                )}
                {item.subtitle && (
                  <p
                    className="font-kanit text-lg md:text-xl mt-2 text-white"
                    style={{
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {item.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-neon focus:outline-none"
      >
        <AiOutlineLeft className="text-white hover:text-gray-800 transition-all duration-300 w-6 h-6" />
        <span className="sr-only">Previous</span>
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-neon focus:outline-none"
      >
        <AiOutlineRight className="text-white hover:text-gray-800 transition-all duration-300 w-6 h-6" />
        <span className="sr-only">Next</span>
      </button>

      {/* Slider Indicators */}
      <div className="absolute z-50 flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-6 h-2 rounded-sm transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white shadow-neon'
                : 'bg-gray-500 hover:bg-gray-300'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

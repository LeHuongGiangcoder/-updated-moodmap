'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Carousel image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className={`absolute transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default Carousel;

'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export const ImageGallery = ({ images, alt }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Image
        src="/placeholder.svg?height=80&width=80"
        alt={alt}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0 w-full h-full"
        style={{ height: 'auto' }}
      />
    );
  }

  if (images.length === 1) {
    return (
      <Image
        src={images[0] || '/placeholder.svg'}
        alt={alt}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0 w-full h-full"
        style={{ height: 'auto' }}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src={images[currentIndex] || '/placeholder.svg'}
        alt={`${alt} - ${currentIndex + 1}`}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0 w-full h-full"
        style={{ height: 'auto' }}
      />
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white text-3xl"
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white text-3xl"
            onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full border-1 ${
              index === currentIndex
                ? 'bg-white border-gray-100 '
                : 'bg-white/50 border-gray-300/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

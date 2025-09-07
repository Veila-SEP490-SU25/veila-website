import type React from 'react';
import { cn } from '@/lib/utils';
import { forwardRef, useState, useEffect } from 'react';
import NextImage from 'next/image';

interface ImageProps extends Omit<React.ComponentProps<typeof NextImage>, 'src' | 'alt'> {
  src: string;
  alt: string;
}

const PLACEHOLDER_SERVICES = [
  'https://placehold.co',
  'https://picsum.photos',
  'https://dummyimage.com',
];

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, onError, ...props }, ref) => {
    const [imageSrc, setImageSrc] = useState(src || '/placeholder.svg');
    const [hasError, setHasError] = useState(false);
    const [fallbackIndex, setFallbackIndex] = useState(0);

    const getProcessedSrc = (originalSrc: string) => {
      if (originalSrc.includes('loremflickr.com')) {
        const match = originalSrc.match(/loremflickr\.com\/(\d+)\/(\d+)/);
        if (match) {
          const [, width, height] = match;
          return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=Image`;
        }
        return `https://placehold.co/400x300/f3f4f6/9ca3af?text=Image`;
      }

      if (originalSrc.includes('picsum.photos')) {
        const match = originalSrc.match(/picsum\.photos\/(\d+)\/(\d+)/);
        if (match) {
          const [, width, height] = match;
          return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=Image`;
        }
        return `https://placehold.co/400x300/f3f4f6/9ca3af?text=Image`;
      }

      return originalSrc;
    };

    const getFallbackSrc = (width = 400, height = 300) => {
      const services = [
        `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=Image`,
        `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
        `https://dummyimage.com/${width}x${height}/f3f4f6/9ca3af&text=Image`,
      ];

      return services[fallbackIndex] || services[0];
    };

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        if (fallbackIndex < PLACEHOLDER_SERVICES.length - 1) {
          setFallbackIndex((prev) => prev + 1);
          setImageSrc(getFallbackSrc());
        } else {
          setImageSrc('/placeholder.svg');
        }
      }
    };

    useEffect(() => {
      if (src) {
        setImageSrc(getProcessedSrc(src));
        setHasError(false);
        setFallbackIndex(0);
      }
    }, [src]);

    const isExternalImage = Boolean(
      imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')),
    );

    return (
      <NextImage
        ref={ref}
        src={imageSrc}
        alt={alt}
        width={props.width || 800}
        height={props.height || 600}
        className={cn('max-w-full h-auto object-cover', className)}
        onError={handleError}
        unoptimized={isExternalImage}
        {...props}
      />
    );
  },
);

Image.displayName = 'Image';

import type React from "react";
import { cn } from "@/lib/utils";
import { forwardRef, useState, useEffect } from "react";
import NextImage from "next/image";

interface ImageProps
  extends Omit<React.ComponentProps<typeof NextImage>, "src" | "alt"> {
  src: string;
  alt: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, onError, ...props }, ref) => {
    const [imageSrc, setImageSrc] = useState(src || "/placeholder.svg");
    const [hasError, setHasError] = useState(false);

    const getProcessedSrc = (originalSrc: string) => {
      if (originalSrc.includes("loremflickr.com")) {
        const match = originalSrc.match(/loremflickr\.com\/(\d+)\/(\d+)/);
        if (match) {
          const [, width, height] = match;
          return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
        }
        return `https://picsum.photos/400/300?random=${Math.random()}`;
      }
      return originalSrc;
    };

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImageSrc(`https://picsum.photos/400/300?random=${Math.random()}`);
      }
    };

    useEffect(() => {
      if (src) {
        setImageSrc(getProcessedSrc(src));
        setHasError(false);
      }
    }, [src]);

    const isExternalImage = Boolean(
      imageSrc &&
        (imageSrc.startsWith("http://") || imageSrc.startsWith("https://"))
    );

    return (
      <NextImage
        ref={ref}
        src={imageSrc}
        alt={alt}
        width={props.width || 800}
        height={props.height || 600}
        className={cn("max-w-full h-auto object-cover", className)}
        onError={handleError}
        unoptimized={isExternalImage}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

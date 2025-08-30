import type React from "react";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
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

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImageSrc("/placeholder.svg");
      }
    };

    const isExternalImage = Boolean(
      src && (src.startsWith("http://") || src.startsWith("https://"))
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

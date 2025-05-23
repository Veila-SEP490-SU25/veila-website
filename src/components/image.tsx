import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Image = ({
  src,
  alt,
  className = "",
  width = 100,
  height = 100,
}: ImageProps) => {
  return (
    <div className={cn("block", className)}>
      <img
        src={src}
        alt={alt}
        className="object-cover size-full"
        width={width}
        height={height}
      />
    </div>
  );
};

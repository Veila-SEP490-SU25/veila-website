import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export const Image = ({
  src,
  alt,
  className = "",
  width = 100,
  height = 100,
  onClick = () => {},
}: ImageProps) => {
  return (
    <div className={cn("block", className)} onClick={onClick}>
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

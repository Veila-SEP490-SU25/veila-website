import { Image } from '@/components/image';

interface PlacegolderImageProps {
  width?: number;
  height?: number;
  className?: string;
}

export const PlaceholderImage = ({ width, height, className }: PlacegolderImageProps) => {
  return (
    <Image
      src={`/placeholder.svg?width=${width}&height=${height}`}
      alt="placeholder"
      className={className}
      width={width}
      height={height}
    />
  );
};

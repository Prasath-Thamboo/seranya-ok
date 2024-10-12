// components/CustomImage.tsx

import { Image } from 'antd';
import { getImageUrl } from '@/utils/image';

interface CustomImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  preview?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, className, style, preview = true }) => {
  return (
    <Image
      src={getImageUrl(src)}
      alt={alt}
      className={className}
      style={style}
      preview={preview}
    />
  );
};

export default CustomImage;

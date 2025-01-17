import { Picture, PictureProps } from '@/components/general/picture';
import { imageLoader } from 'next-sanity/image';

import type { CommonSchemaType } from '@/types/content';
import { imageUrl } from '@/lib/image';

export type SanityImage = CommonSchemaType<'image'>;
export type SanityPictureImage = CommonSchemaType<'responsiveImage'>;

export interface SanityPictureProps
  extends Omit<PictureProps, 'loader' | 'images' | 'alt'> {
  image: SanityPictureImage;
  alt?: string;
}

export function SanityPicture({ image, alt, ...rest }: SanityPictureProps) {
  const images = [
    (image.main && { source: image.main, breakpoint: undefined }) || undefined,
    ...(image?.alternative || []).map((altImage) => ({
      source: altImage.image,
      breakpoint: altImage.breakpoint,
    })),
  ]
    .filter((image) => !!image)
    .map((image) => {
      const { source, breakpoint } = image;

      const crop = {
        ...{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        ...source?.crop,
      };

      const url = source?.asset?.url;
      const width = source?.asset?.metadata?.dimensions?.width;
      const height = source?.asset?.metadata?.dimensions?.height;

      if (source && url && width && height) {
        return {
          src: imageUrl(source).url(),
          width: Math.round(width * (1 - (crop.left + crop.right))),
          height: Math.round(height * (1 - (crop.top + crop.bottom))),
          max:
            breakpoint === 'mobile'
              ? 600
              : breakpoint === 'tablet'
                ? 1000
                : undefined,
        };
      }

      return null;
    })
    .filter((image) => !!image);

  return (
    <Picture
      {...rest}
      images={images}
      alt={alt || image.main?.alt || ''}
      loader={imageLoader}
    />
  );
}

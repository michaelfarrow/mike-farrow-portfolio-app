import { Picture, PictureProps } from '@/components/general/picture';
import { imageLoader } from 'next-sanity/image';

import type { CommonSchemaType } from '@/types/content';
import { getSanityImageProps } from '@/components/sanity/image';

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

      if (source) {
        const props = getSanityImageProps(source);

        return (
          (props && {
            ...props,
            max:
              breakpoint === 'mobile'
                ? 600
                : breakpoint === 'tablet'
                  ? 1000
                  : undefined,
          }) ||
          null
        );
      }

      return null;
    })
    .filter((image) => !!image);

  if (!images.length) return null;

  return (
    <Picture
      {...rest}
      images={images}
      alt={alt || image.main?.alt || ''}
      loader={imageLoader}
    />
  );
}

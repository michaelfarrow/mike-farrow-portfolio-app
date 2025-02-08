import { imageLoader } from 'next-sanity/image';

import type { CommonSchemaType } from '@/types/content';

import { imageUrl } from '@/lib/image';

import { Image, ImageProps } from '@/components/general/image';

export type SanityImage = CommonSchemaType<'image'>;

export interface SanityImageProps
  extends Omit<ImageProps, 'src' | 'width' | 'height' | 'loader' | 'alt'> {
  image: SanityImage;
  alt?: string;
  ratio?: number;
}

export function getSanityImageProps(
  image: SanityImage,
  options?: { ratio?: number }
) {
  const crop = {
    ...{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    ...image.crop,
  };

  const url = image.asset?.url;
  const width = image.asset?.metadata?.dimensions?.width;
  const height = image.asset?.metadata?.dimensions?.height;

  const ratioSize = options?.ratio
    ? {
        width: 1000,
        height: Math.round(1000 * options.ratio),
      }
    : null;

  if (url && width && height) {
    return {
      src: ratioSize
        ? imageUrl(image).width(ratioSize.width).height(ratioSize.height).url()
        : imageUrl(image).url(),
      width: ratioSize
        ? ratioSize?.width
        : Math.round(width * (1 - (crop.left + crop.right))),
      height: ratioSize
        ? ratioSize.height
        : Math.round(height * (1 - (crop.top + crop.bottom))),
    };
  }

  return null;
}

export function SanityImage({ image, alt, ratio, ...rest }: SanityImageProps) {
  const props = getSanityImageProps(image, { ratio });
  if (!props) return null;
  return (
    <Image
      // placeholder='blur'
      // blurDataURL={image.asset?.metadata?.lqip}
      {...rest}
      {...props}
      alt={alt || image.alt || ''}
      loader={imageLoader}
    />
  );
}

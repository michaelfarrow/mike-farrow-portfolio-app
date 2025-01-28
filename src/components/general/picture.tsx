'use client';

import clsx from 'clsx';
import { orderBy } from 'lodash';

import { ImageProps, getImageProps } from 'next/image';

import { IMAGE_DEFAULT_QUALITY, Image } from '@/components/general/image';

import styles from './picture.module.css';

export type PictureImage = {
  src: string;
  width: number;
  height: number;
  max?: number;
};

export interface PictureProps
  extends React.ComponentPropsWithoutRef<'picture'>,
    Pick<ImageProps, 'alt' | 'loader' | 'quality'> {
  images: PictureImage[];
  sizes?: string;
  onImageLoaded?: () => void;
}

export function Picture({
  className,
  images,
  alt,
  quality,
  loader,
  sizes,
  onImageLoaded,
  ...rest
}: PictureProps) {
  if (!images.length) return null;

  const defaultImage =
    images.find(({ max }) => !max) || images[images.length - 1];

  const imageProps = (image: PictureImage) => {
    const { src, width, height } = image;

    return getImageProps({
      alt: '',
      quality: quality || IMAGE_DEFAULT_QUALITY,
      loader,
      sizes,
      src,
      width,
      height,
    });
  };

  return (
    <picture className={clsx(styles.picture, className)} {...rest}>
      {orderBy(images, 'max', 'asc').map(({ max, ...image }, i) => {
        const {
          props: { srcSet, sizes, width, height },
        } = imageProps(image);

        return (
          <source
            key={i}
            sizes={sizes}
            width={width}
            height={height}
            media={max ? `(max-width: ${max - 1}px)` : undefined}
            srcSet={srcSet}
          />
        );
      })}
      <Image
        {...defaultImage}
        alt={alt}
        quality={quality}
        loader={loader}
        sizes={sizes}
        onImageLoaded={onImageLoaded}
      />
    </picture>
  );
}

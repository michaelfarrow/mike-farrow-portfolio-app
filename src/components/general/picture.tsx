/* eslint-disable jsx-a11y/alt-text */

'use client';

import clsx from 'clsx';
import { orderBy } from 'lodash';
import { getImageProps, ImageProps } from 'next/image';

import { Image, IMAGE_DEFAULT_QUALITY } from '@/components/general/image';

import styles from './picture.module.css';

export type PictureImage = {
  src: string;
  width: number;
  height: number;
  max?: number;
};

const imagePropsBuilder =
  (common: Partial<ImageProps> & { alt: string }) => (image: PictureImage) => {
    const { src, width, height } = image;
    return getImageProps({
      ...common,
      src,
      width,
      height,
    });
  };

export interface PictureProps
  extends React.ComponentPropsWithoutRef<'picture'>,
    Pick<ImageProps, 'alt' | 'loader' | 'sizes' | 'quality'> {
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
  const defaultImageConfig =
    images.find(({ max }) => !max) ||
    (images.length && images[images.length - 1]) ||
    undefined;

  const imageProps = imagePropsBuilder({
    alt,
    loader,
    sizes,
    quality: quality || IMAGE_DEFAULT_QUALITY,
  });

  const defaultImage = defaultImageConfig && imageProps(defaultImageConfig);

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
      {(defaultImage && (
        <Image
          {...defaultImage.props}
          quality={quality}
          loader={loader}
          onImageLoaded={onImageLoaded}
        />
      )) ||
        null}
    </picture>
  );
}

'use client';

import clsx from 'clsx';

import { useCallback, useEffect, useRef, useState } from 'react';

import { default as NextImage, ImageProps as NextImageProps } from 'next/image';

import { useTimeout } from '@/hooks/timeout';

import styles from './image.module.css';

export const IMAGE_DEFAULT_QUALITY = 70;

export interface ImageProps extends NextImageProps {
  onImageLoaded?: () => void;
}

export function Image({
  className,
  onImageLoaded,
  quality,
  ...rest
}: ImageProps) {
  const image = useRef<HTMLImageElement>(null);

  const [loaded, setLoaded] = useState(false);

  const setImageLoaded = useTimeout(() => {
    setLoaded(true);
    if (onImageLoaded) onImageLoaded();
  }, 350);

  const _onLoad = useCallback(() => {
    setImageLoaded();
  }, [setImageLoaded]);

  useEffect(() => {
    if (image.current && image.current.complete) {
      _onLoad();
    }
  }, [image, _onLoad]);

  return (
    <NextImage
      {...rest}
      quality={quality || IMAGE_DEFAULT_QUALITY}
      className={clsx(styles.image, loaded && styles.loaded, className)}
      ref={image}
      onLoad={_onLoad}
    />
  );
}

'use client';

import clsx from 'clsx';

import { useCallback, useEffect, useRef, useState } from 'react';

import { default as NextImage, ImageProps as NextImageProps } from 'next/image';

import { useIsMaybePresentation } from '@/hooks/sanity';
import { useStegaValue } from '@/hooks/stega';
import { useTimeout } from '@/hooks/timeout';

import styles from './image.module.css';

export const IMAGE_DEFAULT_QUALITY = 70;

export interface ImageProps extends NextImageProps {
  onImageLoaded?: () => void;
}

export function Image({
  className,
  alt,
  onImageLoaded,
  quality,
  ...rest
}: ImageProps) {
  const image = useRef<HTMLImageElement>(null);
  const isPresentation = useIsMaybePresentation();

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
      loading={isPresentation ? 'eager' : 'lazy'}
      alt={useStegaValue(alt)}
      quality={quality || IMAGE_DEFAULT_QUALITY}
      className={clsx(
        styles.image,
        (isPresentation || loaded) && styles.loaded,
        isPresentation && styles.disableAnimation,
        className
      )}
      ref={image}
      onLoad={_onLoad}
    />
  );
}

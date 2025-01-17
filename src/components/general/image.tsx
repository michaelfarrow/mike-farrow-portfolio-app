'use client';

import {
  useState,
  useEffect,
  SyntheticEvent,
  useRef,
  useCallback,
} from 'react';
import clsx from 'clsx';

import { useTimeout } from '@/hooks/timeout';

import styles from './image.module.css';

export interface ImageProps extends React.ComponentPropsWithoutRef<'img'> {
  onImageLoaded?: () => void;
}

export function Image({ className, onImageLoaded, ...rest }: ImageProps) {
  const image = useRef<HTMLImageElement>(null);

  const [loaded, setLoaded] = useState(false);

  const setImageLoaded = useTimeout(() => {
    setLoaded(true);
    if (onImageLoaded) onImageLoaded();
  }, 350);

  const _onLoad = useCallback(
    (e?: SyntheticEvent<HTMLImageElement, Event>) => {
      setImageLoaded();
    },
    [setImageLoaded]
  );

  useEffect(() => {
    if (image.current && image.current.complete) {
      _onLoad();
    }
  }, [image, _onLoad]);

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      loading='lazy'
      {...rest}
      className={clsx(styles.image, loaded && styles.loaded, className)}
      ref={image}
      onLoad={_onLoad}
    />
  );
}

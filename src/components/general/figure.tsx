import clsx from 'clsx';

import { ReactNode } from 'react';

import styles from './figure.module.css';

export interface FigureProps extends React.ComponentPropsWithoutRef<'figure'> {
  caption: ReactNode;
  captionClassName?: string;
}

export function Figure({
  className,
  caption,
  captionClassName,
  children,
  ...rest
}: FigureProps) {
  return (
    <figure {...rest} className={clsx(styles.figure, className)}>
      {children}
      <figcaption className={captionClassName}>{caption}</figcaption>
    </figure>
  );
}

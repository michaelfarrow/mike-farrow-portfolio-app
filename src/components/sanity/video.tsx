import clsx from 'clsx';
import getYouTubeID from 'get-youtube-id';

import type { CommonSchemaType } from '@/types/content';

import styles from './video.module.css';

export type SanityVideoImage = CommonSchemaType<'video'>;

export interface SanityVideoProps
  extends React.ComponentPropsWithoutRef<'div'> {
  video: SanityVideoImage;
  alt?: string;
}

export function SanityVideo({
  video,
  className,
  alt,
  ...rest
}: SanityVideoProps) {
  const id = getYouTubeID(video.url || '');

  if (!id) return null;

  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <div {...rest} className={clsx(styles.video, className)}>
      <iframe
        className={styles.iframe}
        title={alt || video.alt || 'YouTube Video'}
        src={embedUrl}
        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
      />
    </div>
  );
}

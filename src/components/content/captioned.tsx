import { Figure, FigureProps } from '@/components/general/figure';

export interface CaptionedProps extends Omit<FigureProps, 'caption'> {
  caption?: string;
}

export function Captioned({ caption, children, ...rest }: CaptionedProps) {
  return caption ? (
    <Figure {...rest} caption={caption}>
      {children}
    </Figure>
  ) : (
    children
  );
}

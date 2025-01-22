import { Figure } from '@/components/general/figure';

export interface CaptionedProps extends React.ComponentPropsWithoutRef<'div'> {
  caption?: string;
}

export function Captioned({ caption, children, ...rest }: CaptionedProps) {
  return (
    <div {...rest}>
      {caption ? (
        <Figure {...rest} caption={caption}>
          {children}
        </Figure>
      ) : (
        children
      )}
    </div>
  );
}

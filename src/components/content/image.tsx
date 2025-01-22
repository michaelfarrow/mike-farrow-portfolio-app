import { Captioned } from '@/components/content/captioned';
import { SanityImage, SanityImageProps } from '@/components/sanity/image';

export interface ContentImageProps
  extends React.ComponentPropsWithoutRef<'div'>,
    Pick<SanityImageProps, 'image'> {}

export function ContentImage({ image, ...rest }: ContentImageProps) {
  return (
    <div {...rest}>
      <Captioned caption={image.caption}>
        <SanityImage image={image} />
      </Captioned>
    </div>
  );
}

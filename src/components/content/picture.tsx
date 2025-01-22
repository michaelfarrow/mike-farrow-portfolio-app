import { Captioned } from '@/components/content/captioned';
import { SanityPicture, SanityPictureProps } from '@/components/sanity/picture';

export interface ContentPictureProps
  extends React.ComponentPropsWithoutRef<'div'>,
    Pick<SanityPictureProps, 'image'> {}

export function ContentPicture({ image, ...rest }: ContentPictureProps) {
  return (
    <div {...rest}>
      <Captioned caption={image.main?.caption}>
        <SanityPicture image={image} sizes='100vw' />
      </Captioned>
    </div>
  );
}

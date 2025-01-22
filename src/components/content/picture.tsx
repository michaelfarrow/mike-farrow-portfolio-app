import { breakpointSizes } from '@/lib/responsive';

import { Captioned, CaptionedProps } from '@/components/content/captioned';
import { SanityPicture, SanityPictureProps } from '@/components/sanity/picture';

export interface ContentPictureProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityPictureProps, 'image'> {}

export function ContentPicture({ image, ...rest }: ContentPictureProps) {
  return (
    <Captioned {...rest} caption={image.main?.caption}>
      <SanityPicture image={image} sizes={breakpointSizes({ max: true })} />
    </Captioned>
  );
}

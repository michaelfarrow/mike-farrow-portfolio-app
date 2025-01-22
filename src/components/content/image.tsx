import { breakpointSizes } from '@/lib/responsive';

import { Captioned, CaptionedProps } from '@/components/content/captioned';
import { SanityImage, SanityImageProps } from '@/components/sanity/image';

export interface ContentImageProps
  extends Omit<CaptionedProps, 'caption'>,
    Pick<SanityImageProps, 'image'> {}

export function ContentImage({ image, ...rest }: ContentImageProps) {
  return (
    <Captioned {...rest} caption={image.caption}>
      <SanityImage image={image} sizes={breakpointSizes({ max: true })} />
    </Captioned>
  );
}

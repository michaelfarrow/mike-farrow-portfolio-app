// import { SanityImage, SanityImageProps } from '@/components/SanityImage';

// import { SanityImageObject } from '@/lib/image';

// export function CroppedSanityImage({
//   source,
//   style,
//   transform = (builder) => builder,
//   ...rest
// }: SanityImageProps) {
//   const imageSource =
//     typeof source === 'object' && 'asset' in source
//       ? (source as SanityImageObject)
//       : undefined;

//   const hotspot = imageSource?.hotspot || {
//     x: 0.5,
//     y: 0.5,
//   };

//   const crop = imageSource?.crop || {
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//   };

//   const offset = {
//     x: (hotspot.x - crop.left) / (1 - crop.left - crop.right),
//     y: (hotspot.y - crop.top) / (1 - crop.top - crop.bottom),
//   };

//   return (
//     <SanityImage
//       {...rest}
//       source={(imageSource && { ...imageSource }) || source}
//       transform={(builder) => transform(builder)}
//       style={{
//         objectFit: 'cover',
//         objectPosition: `${(offset.x || 0.5) * 100}% ${(offset.y || 0.5) * 100}%`,
//         ...style,
//       }}
//     />
//   );
// }

export function CroppedSanityImage() {
  return null;
}

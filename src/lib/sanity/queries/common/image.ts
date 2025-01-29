export const imageCommonQuery = `
  _key,
  alt,
  caption,
  crop,
  hotspot
`;

export const imageAssetCommonQuery = `
  url
`;

export const imageDimensionsQuery = `
  dimensions {
    width,
    height
  }
`;

export const imageQuery = `
  {
    ${imageCommonQuery},
    asset -> {
      ${imageAssetCommonQuery},
      metadata {
        ${imageDimensionsQuery}
      }
    }
  }
`;

export const imageWithMetadataQuery = `
  {
    ${imageCommonQuery},
    asset -> {
      ${imageAssetCommonQuery},
      metadata {
        ${imageDimensionsQuery},
        image,
        exif
      }
    }
  }
`;

export const responsiveImageQuery = `
  {
    main ${imageQuery},
    alternative[] {
      breakpoint,
      image ${imageQuery},
    }
  }
`;

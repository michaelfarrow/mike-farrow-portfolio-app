import { defineQuery } from 'next-sanity';

export const imageQuery = defineQuery(`
  {
    alt,
    asset -> {
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    }
  }
`);

export const responsiveImageQuery = defineQuery(`
  {
    main ${imageQuery},
    alternative[] {
      breakpoint,
      image ${imageQuery},
    }
  }
`);

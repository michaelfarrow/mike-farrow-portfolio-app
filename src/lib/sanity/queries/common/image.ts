import { defineQuery } from 'next-sanity';

export const imageQuery = defineQuery(`
  {
    ...,
    asset ->
  }
`);

export const responsiveImageQuery = defineQuery(`
  {
    main ${imageQuery},
    alternative[] {
      ...,
      image ${imageQuery},
    }
  }
`);

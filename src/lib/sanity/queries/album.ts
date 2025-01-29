import { defineQuery } from 'groq';

import { imageWithMetadataQuery } from '@/lib/sanity/queries/common/image';
import { createQuery } from '@/lib/sanity/query';

export const albumsQuery = defineQuery(`
  *[_type == "album"] {
    _id,
    slug,
    name
  }
`);

export const albumQuery = defineQuery(`
  *[
    _type == "album" &&
    slug.current == $slug
  ][0] {
    name,
    photos[] ${imageWithMetadataQuery}
  }
`);

export const getAlbums = createQuery(albumsQuery);
export const getAlbum = createQuery(albumQuery).withParams<{
  slug: string;
}>;

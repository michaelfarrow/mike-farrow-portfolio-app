import { defineQuery } from 'groq';

import {
  imageQuery,
  responsiveImageQuery,
} from '@/lib/sanity/queries/common/image';
import { videoQuery } from '@/lib/sanity/queries/common/video';
import { createQuery } from '@/lib/sanity/query';

export const projectsQuery = defineQuery(`
  *[_type == "project"] {
    _id,
    slug,
    name,
    description
  }
`);

export const projectQuery = defineQuery(`
  *[
    _type == "project" &&
    slug.current == $slug
  ][0] {
    name,
    description,
    thumbnail ${imageQuery},
    content[] {
      ...,
      _type == "image" => ${imageQuery},
      _type == "responsiveImage" => ${responsiveImageQuery},
      _type == "video" => ${videoQuery}
    },
    attributions[] {
      _key,
      name,
      contacts[] -> {
        _id,
        name
      }
    }
  }
`);

export const getProjects = createQuery(projectsQuery);
export const getProject = createQuery(projectQuery).withParams<{
  slug: string;
}>;

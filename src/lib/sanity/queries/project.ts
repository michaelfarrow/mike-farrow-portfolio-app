import { defineQuery } from 'groq';

import { arrayCommonQuery } from '@/lib/sanity/queries/array';
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
    _id,
    _type,
    name,
    description,
    thumbnail ${imageQuery},
    content[] {
      ${arrayCommonQuery},
      _type == "image" => ${imageQuery},
      _type == "responsiveImage" => ${responsiveImageQuery},
      _type == "video" => ${videoQuery},
      _type == "richText" => {
        ...
      },
      _type == "temp" => {
        names[] {
          ...
        }
      },
    },
    attributions[] {
      _key,
      name,
      contacts[]{
        _key,
        ...(@->{
          _id,
          name
        })
      }
    },
    private,
    hideFromSearchEngines
  }
`);

export const getProjects = createQuery(projectsQuery);
export const getProject = createQuery(projectQuery).withParams<{
  slug: string;
}>;

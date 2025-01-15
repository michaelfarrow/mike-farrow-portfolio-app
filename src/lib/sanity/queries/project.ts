import { createQuery } from '@/lib/sanity/query';
import { defineQuery } from 'groq';

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
    thumbnail {
      asset -> {
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    content[] {
      ...,
      _type == "block" => {
        ...,
        markDefs[] {
          ...,
          _type == "internalLink" => {
            reference->{
              name
            }
          }
        }
      },
      _type == "internalLinkBlock" => {
        reference -> {
          name,
          description
        }
      }
    },
    contentShort[],
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

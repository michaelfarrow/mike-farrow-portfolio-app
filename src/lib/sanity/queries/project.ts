import { createQuery } from '@/lib/sanity/query';
import { defineQuery } from 'groq';

const projectsQuery = defineQuery(`
  *[_type == "project"]
`);

const projectQuery = defineQuery(`
  *[
    _type == "project" &&
    slug.current == $slug
  ][0] {
    ...,
    attributions[] {
      ...,
      contacts[]->
    }
  }
`);

export const getProjects = createQuery(projectsQuery);
export const getProject = createQuery(projectQuery).withParams<{
  slug: string;
}>;

import Link from 'next/link';

import { hasSlug } from '@/lib/document';
import { createPage } from '@/lib/page';
import { getProjects } from '@/lib/sanity/queries/project';
import { resolve } from '@/lib/sanity/resolve';

const projects = createPage('projects', getProjects, {
  metadata: () => ({
    title: `Projects`,
  }),
  render: (projects) => {
    return (
      <div>
        <ul>
          {projects.map((project) => {
            if (!hasSlug(project)) return null;
            return (
              <li key={project._id}>
                <Link href={resolve.project(project)}>{project.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata } = projects;
export default projects.page;

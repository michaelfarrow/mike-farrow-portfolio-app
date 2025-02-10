import Link from 'next/link';

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
            if (!project.slug?.current) return null;
            return (
              <li key={project._id}>
                <Link href={resolve.project.href(project)}>{project.name}</Link>
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

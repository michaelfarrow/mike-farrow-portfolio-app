import Link from 'next/link';

import { createPage } from '@/lib/page';
import { getProjects } from '@/lib/sanity/queries/project';

export const { page, generateMetadata } = createPage(getProjects, {
  metadata: () => ({
    title: `Projects`,
  }),
  render: (projects) => {
    return (
      <div>
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link href={`/projects/${project?.slug?.current}`}>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

export default page;

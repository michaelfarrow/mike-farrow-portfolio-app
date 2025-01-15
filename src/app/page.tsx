import Link from 'next/link';

import { getProjects } from '@/lib/sanity/queries/project';

export default async function Home() {
  const { data: projects } = await getProjects();

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
}

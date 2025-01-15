import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProject } from '@/lib/sanity/queries/project';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: project } = await getProject({ slug: (await params).slug });

  if (!project) {
    notFound();
  }

  const { name, description, attributions } = project;

  return (
    <div>
      <div>
        <Link href='/'>← Back to projects</Link>
      </div>
      <div>{name ? <h1>{name}</h1> : null}</div>
      <div>{description ? <p>{description}</p> : null}</div>
      <div>
        <h2>Attributions</h2>
        {attributions?.map((attr) => (
          <div key={attr._key}>
            <h3>{attr.name}</h3>
            <ul>
              {attr.contacts?.map((contact) => (
                <li key={contact._id}>{contact.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

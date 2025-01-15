import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { getProject } from '@/lib/sanity/queries/project';

import { PortableText } from '@/components/PortableText';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: project } = await getProject({ slug: (await params).slug });

  if (!project) {
    notFound();
  }

  const { name, description, attributions, thumbnail, content, contentShort } =
    project;

  return (
    <div>
      <div>
        <Link href='/'>← Back to projects</Link>
      </div>
      <div>{name ? <h1>{name}</h1> : null}</div>
      <div>{description ? <p>{description}</p> : null}</div>
      {thumbnail?.asset?.url ? (
        <Image
          style={{ maxWidth: 700, height: 'auto' }}
          src={thumbnail.asset.url}
          alt=''
          width={thumbnail.asset.metadata?.dimensions?.width || 100}
          height={thumbnail.asset.metadata?.dimensions?.height || 100}
        />
      ) : null}
      <div>
        {content ? (
          <PortableText
            value={content}
            components={{
              types: {
                internalLinkBlock: (block) => (
                  <div>
                    <b>{block.value.reference?.name}</b>:
                    {block.value.reference?.description}
                  </div>
                ),
              },
              marks: {
                internalLink: (mark) => (
                  <span>
                    {mark.text} ({mark.value?.reference?.name})
                  </span>
                ),
              },
            }}
          />
        ) : null}
      </div>
      <div>{contentShort ? <PortableText value={contentShort} /> : null}</div>
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

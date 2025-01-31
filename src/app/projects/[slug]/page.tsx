import Link from 'next/link';

import { getExifData } from '@/lib/image';
import { createPage } from '@/lib/page';
import { getProject } from '@/lib/sanity/queries/project';

import { Figure } from '@/components/general/figure';
import { ProjectContent } from '@/components/project/content';
import { SanityImage } from '@/components/sanity/image';

const project = createPage('project', getProject, {
  metadata: ({ name, hideFromSearchEngines, private: isPrivate }) => ({
    title: name,
    robots: hideFromSearchEngines || isPrivate ? { index: false } : undefined,
  }),
  render: (project) => {
    const { name, description, attributions, thumbnail } = project;

    const exif = thumbnail ? getExifData(thumbnail) : null;
    const settings =
      exif?.settings && Object.values(exif.settings).filter((v) => !!v);

    return (
      <div style={{ maxWidth: 1500, margin: 'auto' }}>
        <div>
          <Link href='/'>← Back to projects</Link>
        </div>
        <div>{name ? <h1>{name}</h1> : null}</div>
        <div>{description ? <p>{description}</p> : null}</div>
        {thumbnail ? (
          <Figure
            caption={
              (exif && (
                <>
                  {exif.camera && <div>{exif.camera}</div>}
                  {exif.lens && <div>{exif.lens}</div>}
                  {(settings && <div>{settings.join(' ')}</div>) || null}
                </>
              )) ||
              null
            }
          >
            <SanityImage
              image={thumbnail}
              sizes='(max-width: 800px) 100vw, 800px'
              style={{ width: '100%', maxWidth: 800, height: 'auto' }}
            />
          </Figure>
        ) : null}
        <ProjectContent project={project} />
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
  },
});

export const { generateMetadata } = project;
export default project.page;

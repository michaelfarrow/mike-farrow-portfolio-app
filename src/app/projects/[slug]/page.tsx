import Link from 'next/link';

import { getExifData } from '@/lib/image';
import { createPage } from '@/lib/page';
import { getProject } from '@/lib/sanity/queries/project';

import { ContentImage } from '@/components/content/image';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Figure } from '@/components/general/figure';
import { Array } from '@/components/sanity/array';
import { SanityImage } from '@/components/sanity/image';
import { PortableText } from '@/components/sanity/portable-text';

const project = createPage('project', getProject, {
  metadata: ({ name, hideFromSearchEngines, private: isPrivate }) => ({
    title: name,
    robots: hideFromSearchEngines || isPrivate ? { index: false } : undefined,
  }),
  render: ({ name, description, attributions, thumbnail, content }) => {
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
        <div>
          {content ? (
            <Array
              value={content}
              components={{
                richText: (block) =>
                  block.value.content && (
                    <PortableText value={block.value.content || null} />
                  ),
                responsiveImage: (block) => (
                  <ContentPicture image={block.value} />
                ),
                image: (block) => <ContentImage image={block.value} />,
                video: (block) => <ContentVideo video={block.value} />,
              }}
            />
          ) : null}
        </div>
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
